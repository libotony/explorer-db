import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { fixedBytes } from '../transformers'
import { CountType } from '../types'

@Entity()
@Index(['address', 'type'])
export class Counts {
    @PrimaryColumn({ type: 'binary', length: 20, transformer: fixedBytes(20, 'counts.address') })
    public address!: string

    @PrimaryColumn()
    public type!: CountType

    @Column({ unsigned: true })
    public in!: number

    @Column({ unsigned: true })
    public out!: number


    @Column({ unsigned: true })
    public self!: number
}
