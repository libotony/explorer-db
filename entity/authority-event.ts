
import { Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne } from 'typeorm'
import { fixedBytes } from '../transformers'
import { Block } from './block'
import { AuthEvent } from '../types'

@Entity()
export class AuthorityEvent {
    @PrimaryGeneratedColumn('increment')
    public id!: number

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'auth-events.address') })
    @Index()
    public address!: string

    @ManyToOne(type => Block)
    @JoinColumn({name: 'blockID'})
    public block!: Block

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'aggregatedTX.blockID') })
    public blockID!: string

    @Column()
    public event!: AuthEvent
}
