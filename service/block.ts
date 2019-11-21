import { getConnection, EntityManager, In, } from 'typeorm'
import { Block } from '../entity/block'
import { Transaction } from '../entity/transaction'
import { Receipt } from '../entity/receipt'

export const getBest = (manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Block)
        .findOne({
            where: { isTrunk: true },
            order: {id: 'DESC'}
        }) as Promise<Block>
}

export const getRecentBlocks = (limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Block)
        .find({
            where: { isTrunk: true },
            order: { id: 'DESC' },
            take: limit
        })
}

export const getBlockByID = (blockID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Block)
        .findOne({id: blockID})
}

export const getBlockByNumber = (num: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Block)
        .findOne({number: num, isTrunk: true})
}

export const getBlockNeighbour = async (num: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    if (num === 0) {
        const block = await manager
            .getRepository(Block)
            .findOne({
                where: { number: 1, isTrunk: true },
                select: ['id']
            })
        return {
            prev: null,
            next: block!.id
        }
    } else {
        const blocks = await manager
            .getRepository(Block)
            .find({
                where: { number: In([num-1, num+1]), isTrunk: true },
                select: ['id']
            })
        const ret:{prev:string|null, next: string|null} = {
            prev: blocks[0].id,
            next: null
        }
        if (blocks.length === 2) {
            ret.next = blocks[1]!.id
        }
        return ret
    }
}

export const getBlockTransactions = async (blockID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .find({
            where: { blockID },
            order: {txIndex: 'ASC'}
        })
}

export const getBlockReceipts = async (blockID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Receipt)
        .find({
            where: { blockID },
            order: {txIndex: 'ASC'}
        })
}
