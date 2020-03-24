import { Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, txSeq } from '../transformers'
import { TXSeq } from '../types'
import { Block } from './block'

@Entity()
@Index('TXUnique', ['blockID', 'txID'], { unique: true })
export class BranchTransactionMeta {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-tx.txID') })
    public txID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-tx.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 10, transformer: txSeq })
    public seq!: TXSeq
}
