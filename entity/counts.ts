import { Entity, Column, PrimaryColumn } from 'typeorm'
import { nullableAddress } from '../transformers'
import { CountType } from '../types'

@Entity()
export class Counts {
    @PrimaryColumn({ type: 'binary', length: 21, transformer: nullableAddress('counts.address') })
    public address!: string|null

    @PrimaryColumn()
    public type!: CountType

    @Column({ unsigned: true })
    public in!: number

    @Column({ unsigned: true })
    public out!: number

    @Column({ unsigned: true })
    public self!: number
}
