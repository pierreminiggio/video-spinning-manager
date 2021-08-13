import {Button, Dialog, DialogTitle, TextField} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {ChangeEvent, FormEvent, SyntheticEvent, useEffect, useMemo, useState} from "react";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import VideoDuration from "../../Struct/VideoDuration";
import Clip from "../../Entity/Clip";
import NullableString from "../../Struct/NullableString";
import {TimelineRangeSlider, timelineRangeSliderIndexes} from '../../Form/Slider/TimelineRangeSlider'
import flex from "../../Style/flex";
import inputStep from "../../Style/inputStep";

interface ClipModalFormProps {
    onClose: (clip: Object|Clip) => void
    videoDuration: VideoDuration
    selectedValue: Clip|Object
    open: boolean
}

export default function ClipModalForm(props: ClipModalFormProps) {
    const { onClose, videoDuration, selectedValue, open } = props;
    const [value, setValue] = useState([0, 10]);
    const [lastChangedIndex, setLastChangedIndex] = useState(0)
    // @ts-ignore
    const selectedValueId = selectedValue?.id
    const [error, setError] = useState<NullableString>(null)
  
    useEffect(
        () => {
            setValue([
                // @ts-ignore
                selectedValue?.start ? selectedValue.start : 0,
                // @ts-ignore
                selectedValue?.end ? selectedValue.end : 10
            ])
        },
        [selectedValue]
    )

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {

        if (! Array.isArray(newValue)) {
            return
        }

        timelineRangeSliderIndexes.forEach(tooltipIndex => {
            if (value[tooltipIndex] !== newValue[tooltipIndex]) {
                setLastChangedIndex(tooltipIndex)
            }
        })

        setValue(newValue);
    }

    const handleBoundaryChange = (newBoundaryValue: string, boundaryIndex: number): void => {
        const newValue = [...value]
        newValue[boundaryIndex] = parseFloat(newBoundaryValue.replace(',', '.'))
        setValue(newValue)
    }
  
    const handleFormSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()

        const start = value[0]
        const end = value[1]

        if ((! start && start !== 0) || ! end) {
            setError('Please fill Start and End !')

            return
        }

        if (start.toString().includes('-')) {
            setError('Start must be 0 or greater !')

            return
        }

        if ((end - start).toString().includes('-') || start === end) {
            setError('End must be greater than start !')

            return
        }

        if (videoDuration && end > videoDuration) {
            setError('The clip\'s end go further than the video\'s end !')

            return
        }

        setError(null)

        const updatedClip = { start, end }
        if (selectedValueId) {
            // @ts-ignore
            updatedClip.id = selectedValueId
        }

        onClose(updatedClip);
    };
    
    const commandVerb = selectedValueId ? 'Edit' : 'Add'

    const dialogLabel = 'clip-form-modal'

    const leftPointerValue = useMemo<number>((): number => {
        return value[0]
    }, [value])

    const rightPointerValue = useMemo<number>((): number => {
        return value[1]
    }, [value])

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>{commandVerb} clip</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                {videoDuration === null ? <h2>Loading...</h2> : (<>
                    {error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
                    <TimelineRangeSlider
                        value={value}
                        onChange={handleChange}
                        maxDuration={videoDuration}
                        lastChangedIndex={lastChangedIndex}
                    />
                    <div style={{...flex}}>
                        <TextField
                            value={leftPointerValue}
                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                const target = e.target as HTMLInputElement
                                handleBoundaryChange(target.value, 0)
                            }}
                            label="Start"
                            placeholder="Start"
                            type="number"
                            style={{flexGrow: 1}}
                            inputProps={
                                {
                                    min: 0,
                                    max: rightPointerValue - inputStep,
                                    step: inputStep
                                }
                            }
                        />
                        <TextField
                            value={rightPointerValue}
                            onInput={(e: FormEvent<HTMLInputElement>) => {
                                const target = e.target as HTMLInputElement
                                handleBoundaryChange(target.value, 1)
                            }}
                            label="End"
                            placeholder="End"
                            type="number"
                            style={{flexGrow: 1, textAlign: 'right'}}
                            inputProps={{
                                min: leftPointerValue + inputStep,
                                max: videoDuration,
                                step: inputStep,
                                style: {textAlign: 'right'}
                            }}
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFormSubmit}
                    >
                        {commandVerb}
                    </Button>
                </>)}
            </div>
        </Dialog>
    );
}
