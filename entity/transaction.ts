import { Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, simpleJSON, compactFixedBytes, chainTag } from '../transformers'
import { Clause } from '../types'
import { Block } from './block'

@Entity()
@Index('txUnique', ['blockID', 'txID'], { unique: true })
 @Index(['blockID', 'txIndex'])
@Index(['origin', 'blockID'])
export class Transaction {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.txID') })
    @Index()
    public txID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'tx.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column()
    public txIndex!: number

    @Column({ type: 'binary', length: 1, transformer: chainTag })
    public chainTag!: number

    @Column({ type: 'binary', length: 8, transformer: fixedBytes(8 , 'tx.blockRef') })
    public blockRef!: string

    @Column({ unsigned: true })
    public expiration!: number

    @Column({ unsigned: true })
    public gasPriceCoef!: number

    @Column({ unsigned: true })
    public gas!: number

    @Column({ type: 'binary', length: 8, transformer: compactFixedBytes(8, 'tx.nonce') })
    public nonce!: string

    @Column({ type: 'binary', length: 32, nullable: true, transformer: fixedBytes(32, 'tx.dependsOn', true) })
    public dependsOn!: string|null

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'tx.origin') })
    @Index()
    public origin!: string

    @Column({ type: 'binary', length: 20, nullable: true, transformer: fixedBytes(20, 'tx.delegator', true) })
    public delegator!: string|null

    @Column({ type: 'longtext', transformer: simpleJSON<Clause[]>('tx.clauses')})
    public clauses!: Clause[]

    @Column()
    public size!: number
}
