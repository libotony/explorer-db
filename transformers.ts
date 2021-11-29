import { sanitizeHex } from './utils'
import { FindOperator } from 'typeorm'
import { MoveIndex, MoveSeq, TXSeq } from './types'

interface ValueTransformer<DBType, EntityType> {
    from: (val: DBType) => EntityType,
    to: (val: EntityType) => DBType
}

// transformers not work in FindOperators(issue of typeorm)
const makeTransformer = <DBType, EntityType>(transformer: ValueTransformer<DBType, EntityType>) => {
    return {
        from: transformer.from,
        to: (val: EntityType | FindOperator<EntityType>) => {
            if (val instanceof FindOperator) {
                if (!val.useParameter) {
                    return val
                }

                if (val.multipleParameters) {
                    for (const [index, v] of (val as any)._value.entries()) {
                        // hack here: overwrite the value
                        (val as any)._value[index] = transformer.to(v)
                    }
                } else {
                    // hack here: overwrite the value
                    (val as any)._value = transformer.to(val.value)
                }

                return val
            } else {
                return transformer.to(val)
            }
        }
    }
}

export const fixedBytes = (len = 32, context: string, nullable = false) => {
    return makeTransformer({
        from: (val: Buffer | null) => {
            if (nullable && val === null) {
                return null
            }
            return '0x' + val!.toString('hex')
        },
        to: (val: string | null) => {
            if (nullable && val === null) {
                return null
            }
            if (!/^0x[0-9a-fA-f]+/i.test(val!)) {
                throw new Error(context + ': bytes' + len + ' hex string required: ' + val)
            }

            const str = sanitizeHex(val!).padStart(len * 2, '0')
            return Buffer.from(str, 'hex')
        }
    })
}

// 21 for bytes storing address,using the first byte as a indicator 0x1 means null address
// used in the case of nullable address as primary key, but primary key can not be null
const nullPrefix = 0x1
export const nullableAddress = (context: string) => {
    return makeTransformer({
        from: (val: Buffer) => {
            const prefix = val[0]
            if (prefix === nullPrefix) {
                return null
            }

            return '0x' + val.slice(1).toString('hex')
        },
        to: (val: string | null) => {
            if (val === null) {
                const buf = Buffer.alloc(21)
                buf[0] = nullPrefix

                return buf
            }
            if (!/^0x[0-9a-fA-f]+/i.test(val!)) {
                throw new Error(context + ': bytes 20 hex string required: ' + val)
            }

            const str = '00' + sanitizeHex(val!).padStart(20 * 2, '0')
            return Buffer.from(str, 'hex')
        }
    })
}

export const compactFixedBytes = (len = 32, context: string, nullable = false) => {
    return makeTransformer({
        from: (val: Buffer | null) => {
            if (nullable && val === null) {
                return null
            }
            const index = val!.findIndex(x => x !== 0)
            if (index > 0) {
                val = val!.slice(index)
            }
            return '0x' + val!.toString('hex')
        },
        to: (val: string | null) => {
            if (nullable && val === null) {
                return null
            }
            if (!/^0x[0-9a-fA-f]+/i.test(val!)) {
                throw new Error(context + ': bytes' + len + ' hex string required: ' + val)
            }

            const str = sanitizeHex(val!).padStart(len * 2, '0')
            return Buffer.from(str, 'hex')
        }
    })
}

export const amount = makeTransformer({
    // 24bytes
    from: (val: Buffer) => {
        return BigInt('0x' + val.toString('hex'))
    },
    to: (val: BigInt) => {
        const str = val.toString(16).padStart(48, '0')
        return Buffer.from(str, 'hex')
    }
})

export const bytes = (context: string, nullable = false) => {
    return makeTransformer({
        from: (val: Buffer | null) => {
            if (nullable && val === null) {
                return null
            }
            return '0x' + val!.toString('hex')
        },
        to: (val: string | null) => {
            if (nullable && val === null) {
                return null
            }

            if (!/^0x[0-9a-fA-f]*/i.test(val!)) {
                throw new Error(context + ': bytes hex string required: ' + val)
            }

            const str = sanitizeHex(val!)
            if (str.length === 0 && nullable) {
                return null
            }

            return Buffer.from(str, 'hex')
        }
    })
}

export const simpleJSON = <T>(context: string, nullable = false) => {
    return makeTransformer({
        from: (val: string | null) => {
            if (nullable && val === null) {
                return null
            }
            return JSON.parse(val!) as T
        },
        to: (val: T | null) => {
            if (nullable && val === null) {
                return null
            }
            return JSON.stringify(val)
        }
    })
}

export const moveIndex = makeTransformer({
    from: (val: Buffer): MoveIndex => {
        return {
            txIndex: val.readUInt16BE(0),
            clauseIndex: val.readUInt16BE(2),
            logIndex: val.readUInt16BE(4)
        }
    },
    to: (val: MoveIndex) => {
        const buf = Buffer.alloc(6)
        buf.writeUInt16BE(val.txIndex, 0)
        buf.writeUInt16BE(val.clauseIndex, 2)
        buf.writeUInt16BE(val.logIndex, 4)

        return buf
    }
})

export const chainTag = makeTransformer({
    from: (val: Buffer): number => {
        return val.readUInt8(0)
    },
    to: (val: number) => {
        const buf = Buffer.alloc(1)
        buf.writeUInt8(val, 0)

        return buf
    }
})

export const moveSeq = makeTransformer({
    from: (val: Buffer): MoveSeq => {
        return {
            blockNumber: val.readInt32BE(0),
            moveIndex: {
                txIndex: val.readUInt16BE(4),
                clauseIndex: val.readUInt16BE(6),
                logIndex: val.readUInt16BE(8)
            }
        }
    },
    to: (val: MoveSeq) => {
        const buf = Buffer.alloc(10)

        buf.writeUInt32BE(val.blockNumber, 0)
        buf.writeUInt16BE(val.moveIndex.txIndex, 4)
        buf.writeUInt16BE(val.moveIndex.clauseIndex, 6)
        buf.writeUInt16BE(val.moveIndex.logIndex, 8)
        return buf
    }
})

export const txSeq = makeTransformer({
    from: (val: Buffer): TXSeq => {
        return {
            blockNumber: val.readInt32BE(0),
            txIndex: val.readUInt16BE(4),
        }
    },
    to: (val: TXSeq) => {
        const buf = Buffer.alloc(6)

        buf.writeUInt32BE(val.blockNumber, 0)
        buf.writeUInt16BE(val.txIndex, 4)
        return buf
    }
})
