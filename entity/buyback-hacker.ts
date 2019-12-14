import { Entity, PrimaryColumn } from 'typeorm'
import { fixedBytes } from '../transformers'

@Entity()
export class BuybackHacker {
    @PrimaryColumn({ type: 'binary', length: 20, transformer: fixedBytes(20, 'buyback.address') })
    public address!: string
}
