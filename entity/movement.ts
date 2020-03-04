import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { fixedBytes, amount, moveIndex } from '../transformers'
import { AssetType, MoveIndex } from '../types'
import { Block } from './block'
import { AggregatedMovement } from './aggregated-move'

@Entity()
@Index(['blockID', 'moveIndex'])
export class AssetMovement {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'move.sender') })
    public sender!: string

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'move.recipient') })
    public recipient!: string

    @Column({ type: 'binary', length: 24, transformer: amount })
    public amount!: bigint

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'move.blockID') })
    public blockID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'move.txID') })
    @Index()
    public txID!: string

    @Column()
    public asset!: AssetType

    @Column({ type: 'binary', length: 6, transformer: moveIndex })
    public moveIndex!: MoveIndex

    @OneToMany(type => AggregatedMovement, aggregated => aggregated.movement, {cascade: ['insert']})
    public aggregated!: AggregatedMovement[]
}
