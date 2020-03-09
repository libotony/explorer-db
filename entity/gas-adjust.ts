import { Entity, Column, PrimaryColumn } from 'typeorm'
import { fixedBytes } from '../transformers'

@Entity()
export class GasAdjustment {

    @PrimaryColumn({type: 'binary', length: 32, transformer: fixedBytes(32, 'gas-adjust.blockID')})
    public blockID!: string

    @Column()
    public gasChanged!: number

}
