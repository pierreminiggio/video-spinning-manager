import Moves from './Moves';
import Identifiable from './Identifiable';
import Timeable from './Timeable';

export default interface Clip extends Identifiable, Timeable {
    order: number
    moves: Moves
}