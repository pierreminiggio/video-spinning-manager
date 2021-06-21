import {ChangeEvent} from "react";
import {Slider} from "@material-ui/core";
import inputStep from "../../Style/inputStep";
import formatTime from "../../Formatter/formatTime";
import ValueLabelComponentGetter from "./ValueLabelComponentGetter";

interface TimelineRangeSliderProps {
    value: number[]
    onChange: (event: ChangeEvent<{}>, newValue: number | number[]) => void
    maxDuration: number
    lastChangedIndex: number
}

export const timelineRangeSliderIndexes = [0, 1]
const valueLabelComponentGetter = new ValueLabelComponentGetter(timelineRangeSliderIndexes)

const getValueText = (value: number) => {
    return formatTime(value)
}

export function TimelineRangeSlider({value, onChange, maxDuration, lastChangedIndex}: TimelineRangeSliderProps) {

    return <Slider
        value={value}
        onChange={onChange}
        valueLabelDisplay="on"
        getAriaValueText={getValueText}
        valueLabelFormat={value => getValueText(value)}
        ValueLabelComponent={valueLabelComponentGetter.get[lastChangedIndex]}
        min={0}
        max={maxDuration}
        step={inputStep}
    />
}