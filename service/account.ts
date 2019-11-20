import { getConnection, EntityManager } from 'typeorm'
import { Account } from '../entity/account'
import { AssetMovement } from '../entity/movement'
import { AssetType } from '../types'
import { Transaction } from '../entity/transaction'
import { Block } from '../entity/block'
import { TokenBalance } from '../entity/token-balance'
import { hexToBuffer } from '../utils'

export const getAccount = (addr: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Account)
        .findOne({ address: addr })
}

export const getTokenBalance = (addr: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(TokenBalance)
        .find({where: {address: addr}, order: {type: 'ASC'}})
}

export const countAccountTransaction = (addr: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .count({
            where: {block: { isTrunk: true }, origin: addr}
        })
}

export const getAccountTransaction = (addr: string, offset: number, limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .find({
            where: {block: { isTrunk: true }, origin: addr},
            order: {
                blockID: 'DESC',
                txIndex: 'DESC'
            },
            skip: offset,
            take: limit
        })
}

export const countAccountTransfer = (addr: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }
    return manager
        .getRepository(AssetMovement)
        .count({
            where: [{ sender: addr }, { recipient: addr }]
        })
}

export const getAccountTransfer = (addr: string, offset: number, limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(AssetMovement)
        .find({
            where: [{ sender: addr }, { recipient: addr }],
            order: { blockID: 'DESC', moveIndex: 'DESC' },
            skip: offset,
            take: limit
        })
}

export const countAccountTransferByType = (addr: string, type: AssetType, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(AssetMovement)
        .count({
            where: [{ sender: addr, type }, { recipient: addr, type }]
        })
}

export const getAccountTransferByType = (
    addr: string,
    type: AssetType,
    offset: number,
    limit: number,
    manager?: EntityManager
) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(AssetMovement)
        .find({
            where: [{ sender: addr, type }, { recipient: addr, type }],
            order: { blockID: 'DESC', moveIndex: 'DESC' },
            skip: offset,
            take: limit
        })
}
