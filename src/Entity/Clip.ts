import Moves from './Moves';
import IdentifiableEntity from './IdentifiableEntity';
import TimeableEntity from './TimeableEntity';

export default interface Clip extends IdentifiableEntity, TimeableEntity {
    order: number
    moves: Moves
}