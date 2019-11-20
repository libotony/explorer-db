import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm'
import { SnapType } from '../types'
import { simpleJSON, fixedBytes } from '../transformers'
import { Block } from './block'

@Entity()
export class Snapshot {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column()
    public type!: SnapType

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'snapshot.blockID') })
    public blockID!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'longtext', nullable: true, transformer: simpleJSON<object>('snapshot.data', true)})
    public data!: object|null
}
