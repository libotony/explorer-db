import { Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, simpleJSON, compactFixedBytes, chainTag, txSeq } from '../transformers'
import { Clause, TXSeq } from '../types'
import { Block } from './block'

@Entity()
@Index('BranchTXUnique', ['blockID', 'txID'], { unique: true })
export class BranchTransaction {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-tx.txID') })
    @Index()
    public txID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-tx.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 10, transformer: txSeq })
    public seq!: TXSeq

    @Column({ type: 'binary', length: 1, transformer: chainTag })
    public chainTag!: number

    @Column({ type: 'binary', length: 8, transformer: fixedBytes(8 , 'branch-tx.blockRef') })
    public blockRef!: string

    @Column({ unsigned: true })
    public expiration!: number

    @Column({ unsigned: true })
    public gasPriceCoef!: number

    @Column({ unsigned: true })
    public gas!: number

    @Column({ type: 'binary', length: 8, transformer: compactFixedBytes(8, 'branch-tx.nonce') })
    public nonce!: string

    @Column({ type: 'binary', length: 32, nullable: true, transformer: fixedBytes(32, 'branch-tx.dependsOn', true) })
    public dependsOn!: string|null

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'branch-tx.origin') })
    public origin!: string

    @Column({ type: 'binary', length: 20, nullable: true, transformer: fixedBytes(20, 'branch-tx.delegator', true) })
    public delegator!: string|null

    @Column({ type: 'longtext', transformer: simpleJSON<Clause[]>('branch-tx.clauses')})
    public clauses!: Clause[]

    @Column()
    public size!: number
}
