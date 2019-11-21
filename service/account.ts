import { getConnection, EntityManager } from 'typeorm'
import { Account } from '../entity/account'
import { AssetMovement } from '../entity/movement'
import { AssetType } from '../types'
import { Transaction } from '../entity/transaction'
import { TokenBalance } from '../entity/token-balance'

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
        .createQueryBuilder('tx')
        .where({ origin: addr })
        .leftJoin('tx.block', 'block')
        .andWhere('block.isTrunk = :isTrunk', { isTrunk: true })
        .getCount()
}

export const getAccountTransaction = (addr: string, offset: number, limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .createQueryBuilder('tx')
        .where({ origin: addr })
        .leftJoinAndSelect('tx.block', 'block')
        .andWhere('block.isTrunk = :isTrunk', { isTrunk: true })
        .orderBy('tx.blockID', 'DESC')
        .addOrderBy('tx.txIndex', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany()
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
            take: limit,
            relations: ['block']
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
            take: limit,
            relations: ['block']
        })
}
