import {Button, Dialog, DialogTitle, Slider, Tooltip, ValueLabelProps} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import Clip from "../../Entity/Clip";
import {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import ReactDOM from 'react-dom';
import inputStep from "../../Domain/inputStep";
import formatTime from "../../Formatter/formatTime";
import NullableString from "../../Struct/NullableString";
import CropFunction from "../../Struct/CropFunction";
import ActionContainer from "./Crop/ActionContainer";

const belowSliderContainerId = 'below-slider-container'
const movementActionContainerPrefix = 'movement-actions-'

interface CropModalFormProps {
    clip: Clip
    onClose: (clip: Clip) => void
    open: boolean
}

let editCrop: CropFunction
let deleteCrop: CropFunction

export default function CropModalForm(props: CropModalFormProps) {
    const { clip, onClose, open } = props;
    const defaultValue: number[] = [0]
    const [value, setValue] = useState<number[]>(defaultValue)
    const [error, setError] = useState<NullableString>(null)
    const [lastChangedIndex, setLastChangedIndex] = useState<number|null>(null)
    const clipLength = parseFloat((clip.end - clip.start).toFixed(3))
    const valueIndexes = Array.from(Array(value.length).keys())

    deleteCrop = (index: number) => {
        const newValue = [...value]
        if (newValue.length === 1) {
            setError('You have to have at least 1 crop point')
            return
        }

        setError(null)
        newValue.splice(index, 1)
        setValue(newValue)
    }

    editCrop = (index: number) => {
        alert('edit ' + index)
    }

    useEffect(() => {
        if (! open) {
            return
        }

        setError(null)

        setValue(defaultValue)

    }, [clip, open])

    const handleCreationButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (value.includes(clipLength)) {
            setError('Please move your last crop point slightly to the right')
            return
        }

        setError(null)

        const newValue = [... value]
        newValue.push(value.length === 0 ? 0 : clipLength)
        setValue(newValue)
    }

    const handleClose = () => {
        onClose(clip);
    };

    const handleSliderChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
        setError(null)
        valueIndexes.forEach(valueIndex => {
            // @ts-ignore
            if (value[valueIndex] !== newValue[valueIndex]) {
                setLastChangedIndex(valueIndex)
            }
        })

        setValue(typeof newValue === 'number' ? [newValue] : newValue);
    };

    const getValueText = (value: number) => {
        return formatTime(value)
    }

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="crop-clip-form-modal"
        open={open}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="crop-clip-form-modal" style={{textAlign: 'center'}}>Crop clip</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                {error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreationButtonClick}
                >
                    Add
                </Button>
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    valueLabelDisplay="on"
                    getAriaValueText={getValueText}
                    valueLabelFormat={value => getValueText(value)}
                    ValueLabelComponent={ValueLabelComponent}
                    track={false}
                    min={0}
                    max={clipLength}
                    step={inputStep}
                    style={{marginTop: gap}}
                />
                <div
                    id={belowSliderContainerId}
                    style={{marginBottom: 1.5 * gap}}
                    data-indexes={JSON.stringify(valueIndexes)}
                >
                    {valueIndexes.map(valueIndex => <div
                        id={movementActionContainerPrefix + valueIndex}
                        key={valueIndex}
                        style={{position: 'relative'}}
                    />)}
                </div>
            </div>
        </Dialog>
    );
}

interface ValueLabelComponentProps extends ValueLabelProps {
    index: number
}

function ValueLabelComponent(props: ValueLabelProps) {
    const valueLabelProps = props as ValueLabelComponentProps
    const { children, index, open, value } = valueLabelProps;

    useEffect(() => {
        const belowSliderContainer = document.getElementById(belowSliderContainerId)
        if (belowSliderContainer !== null) {
            const actionContainer = document.getElementById(movementActionContainerPrefix + index)

            if (actionContainer !== null) {
                ReactDOM.render(<ActionContainer
                    children={children}
                    index={index}
                    indexes={JSON.parse(belowSliderContainer.dataset.indexes ?? '[]')}
                    onCrop={editCrop}
                    onDelete={deleteCrop}
                />, actionContainer)
            }
        }
    }, [children, index])

    return <Tooltip
        open={open}
        enterTouchDelay={0}
        placement="top"
        title={value}
    >
        {children}
    </Tooltip>
}
