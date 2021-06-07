import {ElementType} from "react";
import {ValueLabelProps} from "@material-ui/core";
import ValueLabelComponent from "./ValueLabelComponent";

export default class ValueLabelComponentGetter
{

    public get: {[key: number]: ElementType<ValueLabelProps> | undefined} = {};

    constructor(indexes: Array<number>) {
        indexes.forEach(lastChangedIndex => {
            // @ts-ignore
            this.get[lastChangedIndex] = (props: ValueLabelComponentsProps) => <ValueLabelComponent
                {... props}
                lastChangedIndex={lastChangedIndex}
            />
        })
    }
}
