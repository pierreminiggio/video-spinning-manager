import IdentifiableEntity from '../Entity/IdentifiableEntity';

export default function findMaxId(entities: Array<IdentifiableEntity>): number {
    let maxId = 0
    entities.forEach((entity: IdentifiableEntity) => {
        if (entity.id > maxId) {
            maxId = entity.id
        }
    })

    return maxId
}
