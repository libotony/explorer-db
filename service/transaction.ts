import { EntityManager, getConnection } from 'typeorm'
import { Transaction } from '../entity/transaction'
import { Receipt } from '../entity/receipt'

export const getTransaction = (txID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .createQueryBuilder('tx')
        .where({ txID })
        .leftJoin('tx.block', 'block')
        .andWhere('block.isTrunk = :isTrunk', { isTrunk: true })
        .limit(1)
        .getOne()
}

export const getTransactionWithBlock = (txID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Transaction)
        .createQueryBuilder('tx')
        .where({ txID })
        .leftJoinAndSelect('tx.block', 'block')
        .andWhere('block.isTrunk = :isTrunk', { isTrunk: true })
        .limit(1)
        .getOne()

}

export const getReceipt = (txID: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Receipt)
        .createQueryBuilder('receipt')
        .where({ txID })
        .leftJoin('receipt.block', 'block')
        .andWhere('block.isTrunk = :isTrunk', { isTrunk: true })
        .limit(1)
        .getOne()
}
