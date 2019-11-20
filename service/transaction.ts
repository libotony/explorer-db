import { EntityManager, getConnection } from 'typeorm'
import { Transaction } from '../entity/transaction'
import { Receipt } from '../entity/receipt'

export const getTransaction = (txID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .findOne({
            where: { txID, block: { isTrunk: true } },
            relations: ['block']
        })
}

export const getReceipt = (txID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Receipt)
        .findOne({
            where: { txID, block: {isTrunk: true}}
        })
}
