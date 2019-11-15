import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import {fixedBytes, amount} from '../transformers'
import { AssetType } from '../types'

@Entity()
export class TokenBalance {
    @PrimaryColumn({ type: 'binary', length: 20, transformer: fixedBytes(20, 'account.address') })
    public address: string

    @Column({ type: 'binary', length: 24, transformer: amount })
    public balance: bigint

    @PrimaryColumn()
    public type: AssetType
}
