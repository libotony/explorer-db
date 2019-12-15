import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm'
import { fixedBytes } from '../transformers'
import { Account } from './account'

@Entity()
export class BuybackTheft {
    @PrimaryColumn({ type: 'binary', length: 20, transformer: fixedBytes(20, 'buyback.address') })
    public address!: string

    @OneToOne(type => Account)
    @JoinColumn({name: 'address'})
    public transaction!: Account
}
