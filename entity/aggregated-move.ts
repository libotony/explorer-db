import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm'
import { fixedBytes, moveSeq } from '../transformers'
import { AssetType, MoveSeq } from '../types'
import { AssetMovement } from './movement'

@Entity()
@Index(['participant', 'seq'])
@Index(['participant', 'type', 'seq'])
export class AggregatedMovement {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'movementLog.participant') })
    public participant!: string

    @Column()
    public type!: AssetType

    @Column()
    public movementID!: number

    @ManyToOne(type => AssetMovement, move => move.aggregated, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'movementID' })
    public movement !: AssetMovement

    @Column({ type: 'binary', length: 10, transformer: moveSeq })
    public seq!: MoveSeq
}
