import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { fixedBytes, amount } from '../transformers'

@Entity()
export class Block {
    @PrimaryColumn({ type: 'binary', length: 32, transformer: fixedBytes(32, 'block.id') })
    public id!: string

    @Index()
    @Column()
    public number!: number

    @Index()
    @Column({ unsigned: true })
    public timestamp!: number

    @Column({ type: 'bigint', unsigned: true })
    public gasLimit!: number

    @Column({ type: 'bigint', unsigned: true })
    public gasUsed!: number

    @Column({ unsigned: true })
    public totalScore!: number

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'block.parentID') })
    public parentID!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'block.txsRoot') })
    public txsRoot!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'block.stateRoot') })
    public stateRoot!: string

    @Column({ type: 'binary', length: 32, transformer: fixedBytes(32, 'block.receiptsRoot') })
    public receiptsRoot!: string

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'block.signer') })
    @Index()
    public signer!: string

    @Column({ type: 'binary', length: 20, transformer: fixedBytes(20, 'block.beneficiary') })
    public beneficiary!: string

    @Column({ type: 'boolean' })
    public isTrunk!: boolean

    @Column()
    public txCount!: number

    @Column()
    public revertCount!: number

    @Column()
    public txsFeatures!: number

    @Column()
    public score!: number

    @Column({ type: 'binary', length: 24, transformer: amount() })
    public reward!: bigint

    @Column({ type: 'binary', length: 24, transformer: amount(true) })
    public baseFeePerGas!: bigint|null

    @Column()
    public gasChanged!: number

    @Column()
    public size!: number
}
