import { Entity, Column, Index, ManyToOne, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm'
import { fixedBytes, txSeq } from '../transformers'
import { TXSeq } from '../types'
import { Block } from './block'
import { Transaction } from './transaction'

@Entity()
export class TransactionMeta {
    @PrimaryColumn({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.txID') })
    public txID!: string

    @OneToOne(type => Transaction, tx => tx.meta, {cascade: ['insert']})
    public transaction!: Transaction

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Index()
    @Column({ type: 'binary', length: 10, transformer: txSeq })
    public seq!: TXSeq
}
