import Moves from "./Moves";

export default interface Clip {
    id: number
    start: number
    end: number
    order: number
    moves: Moves
}