import Identifiable from './Identifiable';
import Positionable from './Positionable';
import Timeable from './Timeable';

export default interface Text extends Identifiable, Timeable, Positionable {
    content: string;
    color: string;
    backgroundColor: string;
    backgroundColorOpacity: number;
    subtitleId?: string
}
