import { Entity, Column, JoinColumn, PrimaryColumn, Index, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { fixedBytes, simpleJSON, compactFixedBytes, amount, txSeq, uint8 } from '../transformers'
import { Clause, Output, TXSeq, VMError } from '../types'
import { Block } from './block'

@Entity()
@Index('TXUnique', ['blockID', 'txID'], { unique: true })
export class BranchTransaction {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @PrimaryColumn({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.txID') })
    public txID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-tx.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 10, transformer: txSeq })
    public seq!: TXSeq

    @Column({ type: 'binary', length: 1, transformer: uint8() })
    public type!: number

    @Column({ type: 'binary', length: 1, transformer: uint8() })
    public chainTag!: number

    @Column({ type: 'binary', length: 8, transformer: fixedBytes(8 , 'tx.blockRef') })
    public blockRef!: string

    @Column({ unsigned: true })
    public expiration!: number

    @Column({ type:'int', unsigned: true, nullable: true })
    public gasPriceCoef!: number|null
    
    @Column({ type: 'binary', nullable: true, length: 24, transformer: amount(true) })
    public maxPriorityFeePerGas!: bigint | null
    
    @Column({ type: 'binary', nullable: true, length: 24, transformer: amount(true) })
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
