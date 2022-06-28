import Identifiable from '../Entity/Identifiable';
import findMaxId from './findMaxId';

export default function findNextId(entities: Array<Identifiable>): number {
    return findMaxId(entities) + 1
}
