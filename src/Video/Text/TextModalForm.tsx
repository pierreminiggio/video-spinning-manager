import {Button, Dialog, DialogTitle, Slider, TextField, Typography} from "@material-ui/core";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import VideoDuration from "../../Struct/VideoDuration";
import Text from "../../Entity/Text";
import ColorInput from "../../Form/ColorInput";
import {TimelineRangeSlider, timelineRangeSliderIndexes} from '../../Form/Slider/TimelineRangeSlider'

interface TextModalFormProps {
    onClose: (text: Text|null) => void
    totalClipTime: VideoDuration
    selectedValue: Text|null
    open: boolean
}

enum ColorKey {
    COLOR = 'color',
    BACKGROUND_COLOR = 'backgroundColor',
}

enum TimeKey {
    START = 'start',
    END = 'end'
}

const timeIndexes: {[tooltipIndex: number]: TimeKey} = {
    0: TimeKey.START,
    1: TimeKey.END
}

export default function TextModalForm({onClose, totalClipTime, selectedValue, open}: TextModalFormProps) {
    const [editedText, setEditedText] = useState<Text|null>(null)
    const defaultEditedText: Text = {
        id: 0,
        content: 'Your text',
        start: 0,
        end: totalClipTime ?? 1,
        height: 7,
        color: '#ffffff',
        backgroundColor: '#ffa500',
        backgroundColorOpacity: .7,
        leftOffset: 20,
        rightOffset: 20,
        topOffset: 40,
    }

    const [lastChangedIndex, setLastChangedIndex] = useState(0)

    useEffect(
        () => {
            if (! open) {
                return
            }

            if (selectedValue !== null) {
                const newEditedText = {...selectedValue}
                setEditedText(newEditedText)

                return
            }

            setEditedText(defaultEditedText)
        },
        [selectedValue, open]
    )

    const handleClose = () => {
        onClose(selectedValue);
    }

    const handleTextTimeChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {

        if (editedText === null) {
            return
        }

        if (! Array.isArray(newValue)) {
            return
        }

        const newEditedText = {...editedText}


        timelineRangeSliderIndexes.forEach(tooltipIndex => {
            if (editedText[timeIndexes[tooltipIndex]] !== newValue[tooltipIndex]) {
                setLastChangedIndex(tooltipIndex)
            }

            newEditedText[timeIndexes[tooltipIndex]] = newValue[tooltipIndex]
        })

        setEditedText(newEditedText)
    }
  
    const handleFormSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        onClose(editedText);
    }

    const handleTextColorChange = (newValue: string): void => {
        setNewColorInText(newValue, ColorKey.COLOR)
    }

    const handleBackgroundColorChange = (newValue: string): void => {
        setNewColorInText(newValue, ColorKey.BACKGROUND_COLOR)
    }

    const setNewColorInText = (newColor: string, field: ColorKey): void => {
        if (editedText === null) {
            return
        }

        if (! /^#[0-9A-F]{6}$/i.test(newColor)) {
            return
        }

        const newEditedText: Text = {...editedText}
        newEditedText[field] = newColor
        setEditedText(newEditedText)
    }

    const handleBackgroundColorOpacityChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        if (editedText === null) {
            return
        }

        if (Array.isArray(newValue)) {
            return
        }

        const newEditedText: Text = {...editedText}
        newEditedText.backgroundColorOpacity = newValue
        setEditedText(newEditedText)
    }
    
    const commandVerb = selectedValue && selectedValue.id ? 'Edit' : 'Add'

    const dialogLabel = 'text-form-modal'
    const backgroundOpacityLabel = 'background-opacity'
    const timesLabel = 'text-times'

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
        <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>{commandVerb} text</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                {totalClipTime === null || editedText === null ? <h2>Loading...</h2> : (<>
                    <ColorInput
                        label={'Text color'}
                        value={editedText.color}
                        onChange={handleTextColorChange}
                    />
                    <ColorInput
                        label={'Background color'}
                        value={editedText.backgroundColor}
                        onChange={handleBackgroundColorChange}
                    />
                    <Typography id={backgroundOpacityLabel} style={{marginTop: gap / 2}}>
                        Background opacity
                    </Typography>
                    <Slider
                        value={editedText.backgroundColorOpacity}
                        onChange={handleBackgroundColorOpacityChange}
                        valueLabelDisplay="on"
                        aria-labelledby={backgroundOpacityLabel}
                        min={0}
                        max={1}
                        step={.1}
                    />
                    <Typography id={timesLabel} style={{marginTop: gap / 2}}>
                        Times
                    </Typography>
                    <TimelineRangeSlider
                        value={[editedText.start, editedText.end]}
                        onChange={handleTextTimeChange}
                        maxDuration={totalClipTime}
                        lastChangedIndex={lastChangedIndex}
                        ariaLabelledby={timesLabel}
                    />
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
