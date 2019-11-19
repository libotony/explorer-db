import { getConnection, EntityManager, } from 'typeorm'
import { Authority } from '../entity/authority'
import { Block } from '../entity/block'

export const getAuthority = (addr: string, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Authority)
        .findOne({ address: addr })
}

export const getSignedBlocks = (addr: string, offset: number, limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(Block)
        .find({
            where: { signer: addr, isTrunk: true },
            order: { id: 'DESC' },
            skip: offset,
            take: limit
        })
}
