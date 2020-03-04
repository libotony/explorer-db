import { Entity, Column, PrimaryColumn } from 'typeorm'
import { fixedBytes, amount, bytes } from '../transformers'

@Entity()
export class Account {
    @PrimaryColumn({ type: 'binary', length: 20, transformer: fixedBytes(20, 'account.address') })
    public address!: string

    @Column({ type: 'binary', length: 24, transformer: amount })
    public balance!: bigint

    @Column({ type: 'binary', length: 24, transformer: amount })
    public energy!: bigint

    @Column({ unsigned: true })
    public blockTime!: number

    @Column({ unsigned: true })
    public firstSeen!: number

    @Column({ type: 'blob', nullable: true, transformer: bytes('account.code', true) })
    public code!: string|null

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'account.master', true), nullable: true })
    public master!: string | null

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'account.sponsor', true), nullable: true })
    public sponsor!: string | null

    @Column({ type: 'varchar', nullable: true })
    public alias!: string | null
}
