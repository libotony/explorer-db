import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, txSeq } from '../transformers'
import { TXSeq, MoveType } from '../types'
import { Block } from './block'

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

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'aggregatedTX.txID')})
    public txID!: string
}
