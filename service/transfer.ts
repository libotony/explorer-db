import { EntityManager, getConnection } from 'typeorm'
import { AssetMovement } from '../entity/movement'

export const getRecentTransfers = (limit: number, manager?: EntityManager) => {
    if (!manager) {
        manager = getConnection().manager
    }

    return manager
        .getRepository(AssetMovement)
        .find({
            order: { blockID: 'DESC', moveIndex: 'DESC', type: 'ASC' },
            take: limit
        })
}
