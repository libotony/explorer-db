import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Output } from '../types'
import { fixedBytes, simpleJSON, amount } from '../transformers'
import { Block } from './block'

@Entity()
@Index('branchReceiptUnique', ['blockID', 'txID'], { unique: true })
export class BranchReceipt {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-receipt.txID') })
    @Index()
    public txID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'branch-receipt.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({unsigned: true})
    public gasUsed!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'branch-receipt.gasPayer') })
    public gasPayer!: string

    @Column({ type: 'binary', length: 24, transformer: amount })
    public paid!: bigint

    @Column({ type: 'binary', length: 24, transformer: amount })
    public reward!: bigint

    @Column({ type: 'boolean' })
    public reverted!: boolean

    @Column({ type: 'longtext', transformer: simpleJSON<Output[]>('branch-receipt.outputs')})
    public outputs!: Output[]
}
