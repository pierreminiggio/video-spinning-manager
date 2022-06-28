import IdentifiableEntity from '../Entity/IdentifiableEntity';
import findMaxId from './findMaxId';

export default function findNextId(entities: Array<IdentifiableEntity>): number {
    return findMaxId(entities) + 1
}
