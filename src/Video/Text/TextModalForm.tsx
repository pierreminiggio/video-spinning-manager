import {Button, Dialog, DialogTitle, Slider, TextareaAutosize, TextField, Typography} from "@material-ui/core";
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

enum StringKey {
    CONTENT = 'content'
}

enum NumberKey {
    HEIGHT = 'height',
    TOP_OFFSET = 'topOffset',
    RIGHT_OFFSET = 'rightOffset',
    LEFT_OFFSET = 'leftOffset',
    BACKGROUND_COLOR_OPACITY = 'backgroundColorOpacity',
}

enum TimeKey {
    START = 'start',
    END = 'end'
}

const timeIndexes: {[tooltipIndex: number]: TimeKey} = {
    0: TimeKey.START,
    1: TimeKey.END
}

const defaultText = 'Your text'

export default function TextModalForm({onClose, totalClipTime, selectedValue, open}: TextModalFormProps) {
    const [editedText, setEditedText] = useState<Text|null>(null)
    const defaultEditedText: Text = {
        id: 0,
        content: defaultText,
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

    const handleTextContentChange = (newValue: string): void => {
        setNewStringInText(newValue, StringKey.CONTENT)
    }

    const handleTextHeightChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        setNewNumberInText(newValue, NumberKey.HEIGHT)
    }

    const handleTopOffsetChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        setNewNumberInText(newValue, NumberKey.TOP_OFFSET)
    }

    const handleLeftOffsetChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        setNewNumberInText(newValue, NumberKey.LEFT_OFFSET)
    }

    const handleRightOffsetChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        setNewNumberInText(newValue, NumberKey.RIGHT_OFFSET)
    }

    const handleTextColorChange = (newValue: string): void => {
        setNewColorInText(newValue, ColorKey.COLOR)
    }

    const handleBackgroundColorChange = (newValue: string): void => {
        setNewColorInText(newValue, ColorKey.BACKGROUND_COLOR)
    }

    const setNewNumberInText = (newValue: number | number[], field: NumberKey): void => {
        if (editedText === null) {
            return
        }

        if (Array.isArray(newValue)) {
            return
        }

        const newEditedText: Text = {...editedText}
        newEditedText[field] = newValue
        setEditedText(newEditedText)
    }

    const setNewColorInText = (newColor: string, field: ColorKey): void => {

        if (! /^#[0-9A-F]{6}$/i.test(newColor)) {
            return
        }

        setNewStringInText(newColor, field)
    }

    const setNewStringInText = (newValue: string, field: ColorKey|StringKey): void => {
        if (editedText === null) {
            return
        }

        const newEditedText: Text = {...editedText}
        newEditedText[field] = newValue
        setEditedText(newEditedText)
    }

    const handleBackgroundColorOpacityChange = (event: ChangeEvent<{}>, newValue: number | number[]): void => {
        setNewNumberInText(newValue, NumberKey.BACKGROUND_COLOR_OPACITY)
    }
    
    const commandVerb = selectedValue && selectedValue.id ? 'Edit' : 'Add'

    const dialogLabel = 'text-form-modal'
    const fontHeightLabel = 'font-height'
    const topOffsetLabel = 'top-offset'
    const leftOffsetLabel = 'left-offset'
    const rightOffsetLabel = 'right-offset'
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
                    <Typography id={timesLabel}>
                        Times
                    </Typography>
                    <TimelineRangeSlider
                        value={[editedText.start, editedText.end]}
                        onChange={handleTextTimeChange}
                        maxDuration={totalClipTime}
                        lastChangedIndex={lastChangedIndex}
                        ariaLabelledby={timesLabel}
                    />
                    <TextField
                        value={editedText.content}
                        onChange={e => handleTextContentChange(e.target.value)}
                        label="Text Content"
                    />
                    <Typography id={fontHeightLabel} style={{marginTop: gap / 2}}>
                        Text height
                    </Typography>
                    <Slider
                        value={editedText.height}
                        onChange={handleTextHeightChange}
                        valueLabelDisplay="on"
                        aria-labelledby={fontHeightLabel}
                        min={0}
                        max={100}
                        step={1}
                    />step={1}
                    <Typography id={topOffsetLabel} style={{marginTop: gap / 2}}>
                        Top offset
                    </Typography>
                    <Slider
                        value={editedText.topOffset}
                        onChange={handleTopOffsetChange}
                        valueLabelDisplay="on"
                        aria-labelledby={topOffsetLabel}
                        min={0}
                        max={100}
                        step={1}
                    />
                    <Typography id={leftOffsetLabel} style={{marginTop: gap / 2}}>
                        Left offset
                    </Typography>
                    <Slider
                        value={editedText.leftOffset}
                        onChange={handleLeftOffsetChange}
                        valueLabelDisplay="on"
                        aria-labelledby={leftOffsetLabel}
                        min={0}
                        max={100}
                        step={1}
                    />
                    <Typography id={rightOffsetLabel} style={{marginTop: gap / 2}}>
                        Right offset
                    </Typography>
                    <Slider
                        value={editedText.rightOffset}
                        onChange={handleRightOffsetChange}
                        valueLabelDisplay="on"
                        aria-labelledby={rightOffsetLabel}
                        min={0}
                        max={100}
                        step={1}
                    />
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
