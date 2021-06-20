import TimeableEntity from "./TimeableEntity";

export default interface Text extends TimeableEntity {
    content: string;
    height: number;
    color: string;
    backgroundColor: string;
    backgroundColorOpacity: number;
    leftOffset: number;
    rightOffset: number;
    topOffset: number;
}