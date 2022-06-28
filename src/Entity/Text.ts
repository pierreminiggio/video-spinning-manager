import Identifiable from "./Identifiable";
import Timeable from "./Timeable";

export default interface Text extends Identifiable, Timeable {
    content: string;
    height: number;
    color: string;
    backgroundColor: string;
    backgroundColorOpacity: number;
    leftOffset: number;
    rightOffset: number;
    topOffset: number;
    subtitleId?: string
}
