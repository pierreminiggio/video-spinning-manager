import Identifiable from '../Entity/Identifiable';

export default function findMaxId(entities: Array<Identifiable>): number {
    let maxId = 0
    entities.forEach((entity: Identifiable) => {
        if (entity.id > maxId) {
            maxId = entity.id
        }
    })

    return maxId
}
