import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn, OneToOne, Index } from 'typeorm'
import { Output } from '../types'
import { fixedBytes, simpleJSON, amount } from '../transformers'
import { Transaction } from './transaction'
import { Block } from './block'

@Entity()
export class Receipt {
    @PrimaryColumn({ type: 'binary', length: 32, transformer: fixedBytes(32, 'receipt.txID') })
    public txID!: string

    @OneToOne(type => Transaction, tx => tx.receipt)
    @JoinColumn({name: 'txID'})
    public transaction!: Transaction

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'receipt.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({unsigned: true})
    public gasUsed!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'receipt.gasPayer') })
    public gasPayer!: string

    @Column({ type: 'binary', length: 24, transformer: amount })
    public paid!: bigint

    @Column({ type: 'binary', length: 24, transformer: amount })
    public reward!: bigint

    @Column({ type: 'boolean' })
    public reverted!: boolean

    @Column({ type: 'longtext', transformer: simpleJSON<Output[]>('receipt.outputs')})
    public outputs!: Output[]
}
