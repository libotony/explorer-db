export interface Event {
    address: string
    topics: string[]
    data: string
}

export interface Transfer {
    sender: string
    recipient: string
    amount: string
}

export interface Output {
    contractAddress: string | null,
    events: Event[],
    transfers: Transfer[]
}

export interface VMError {
    error: string,
    reason: string|null,
    clauseIndex: number,
}

export interface Clause {
    to: string | null
    value: string | number
    data: string
}

export enum SnapType {
    DualToken = 0,
    Authority,
    GasAdjustment,
    ExpandTX,
    VIP180Token = 100
}

export enum AssetType {
    VET = 0,
    VTHO,
    PLA,
    SHA,
    EHrT,
    DBET,
    TIC,
    OCE,
    SNK,
    JUR,
    AQD,
    YEET,
    HAI
}

export interface MoveIndex {
    txIndex: number
    clauseIndex: number
    logIndex: number
}

export interface MoveSeq {
    blockNumber: number,
    moveIndex: MoveIndex
}

export interface TXSeq {
    blockNumber: number,
    txIndex: number
}

export enum MoveType {
    In,
    Out,
    Self
}

export enum AuthEvent {
    Added,
    Revoked,
    Endorsed,
    Unendorsed,
    Activate,
    Deactivate
}
