import { Entity, Column, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm'
import { fixedBytes, simpleJSON, compactFixedBytes, uint8, amount } from '../transformers'
import { Clause, Output, VMError } from '../types'
import { TransactionMeta } from './tx-meta'

@Entity()
export class Transaction {
    @PrimaryColumn({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.txID') })
    public txID!: string

    @OneToOne(type => TransactionMeta, meta => meta.transaction, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'txID'})
    public meta!: TransactionMeta

    @Column({ type: 'binary', length: 1, transformer: uint8(true) })
    public type!: number|null

    @Column({ type: 'binary', length: 1, transformer: uint8() })
    public chainTag!: number

    @Column({ type: 'binary', length: 8, transformer: fixedBytes(8 , 'tx.blockRef') })
    public blockRef!: string

    @Column({ unsigned: true })
    public expiration!: number

    @Column({ unsigned: true })
    public gasPriceCoef!: number | null

    @Column({ type: 'binary', length: 24, transformer: amount(true) })
    public maxPriorityFeePerGas!: bigint | null
    
    @Column({ type: 'binary', length: 24, transformer: amount(true) })
    public maxFeePerGas!: bigint|null

    @Column({ unsigned: true })
    public gas!: number

    @Column({ type: 'binary', length: 8, transformer: compactFixedBytes(8, 'tx.nonce') })
    public nonce!: string

    @Column({ type: 'binary', length: 32, nullable: true, transformer: fixedBytes(32, 'tx.dependsOn', true) })
    public dependsOn!: string|null

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'tx.origin') })
    public origin!: string

    @Column({ type: 'binary', length: 20, nullable: true, transformer: fixedBytes(20, 'tx.delegator', true) })
    public delegator!: string|null

    @Column({ type: 'longtext', transformer: simpleJSON<Clause[]>('tx.clauses')})
    public clauses!: Clause[]

    @Column()
    public clauseCount!: number

    @Column()
    public size!: number

    // receipt
    @Column({unsigned: true})
    public gasUsed!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'receipt.gasPayer') })
    public gasPayer!: string

    @Column({ type: 'binary', length: 24, transformer: amount() })
    public paid!: bigint

    @Column({ type: 'binary', length: 24, transformer: amount() })
    public reward!: bigint

    @Column({ type: 'boolean' })
    public reverted!: boolean

    @Column({ type: 'longtext', transformer: simpleJSON<Output[]>('receipt.outputs')})
    public outputs!: Output[]

    // abstract
    @Column({ type: 'text', nullable: true, transformer: simpleJSON<VMError>('tx-abstract.vmError', true) })
    public vmError!: VMError|null
}
