import Moves from "./Moves";
import TimeableEntity from "./TimeableEntity";

export default interface Clip extends TimeableEntity {
    id: number
    order: number
    moves: Moves
}