import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, txSeq } from '../transformers'
import { TXSeq, MoveType } from '../types'
import { Block } from './block'
import { TransactionMeta } from './tx-meta'
import { Transaction } from './transaction'

@Entity()
@Index(['participant', 'seq'])
@Index(['participant', 'type', 'seq'])
export class AggregatedTransaction {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'aggregatedTX.participant', true), nullable: true })
    public participant!: string|null

    @Column()
    public type!: MoveType

    @Column({ type: 'binary', length: 10, transformer: txSeq })
    public seq!: TXSeq

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'aggregatedTX.blockID') })
    public blockID!: string

    @ManyToOne(type => Transaction, { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({name: 'txID'})
    public transaction!: Transaction

    // No foreign key on, use modified migration to initiate database
    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'aggregatedTX.txID')})
    public txID!: string
}
