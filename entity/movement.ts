import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm'
import {fixedBytes, amount, movementIndex} from '../transformers'
import { AssetType, MovementIndex } from '../types'
import { Block } from './block'

@Entity()
@Index(['blockID', 'moveIndex'])
@Index(['sender', 'blockID', 'moveIndex'])
@Index(['recipient', 'blockID', 'moveIndex'])
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
    public type!: AssetType

    @Column({ type: 'binary', length: 6, transformer: movementIndex })
    public moveIndex!: MovementIndex
}
