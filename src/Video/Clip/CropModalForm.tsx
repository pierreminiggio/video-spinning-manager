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
import Transition from "../../Entity/Video/Clip/Crop/Transition";
import EditForm from "./Crop/EditForm";
import Crop from "../../Entity/Video/Clip/Crop/Crop";
import CropWithIndex from "../../Entity/Video/Clip/Crop/CropWithIndex";
import Crops from "../../Entity/Video/Clip/Crop/Crops";
import getThumbnailUrlByContentIdAndTime from "../../API/Spinner/Thumbnail/getThumbnailUrlByContentIdAndTime";

const belowSliderContainerId = 'below-slider-container'
const movementActionContainerPrefix = 'movement-actions-'

interface CropModalFormProps {
    clip: Clip
    contentId: number
    onClose: (clip: Clip) => void
    open: boolean
}

let editCrop: CropFunction
let deleteCrop: CropFunction

export default function CropModalForm(props: CropModalFormProps) {
    const { clip, contentId, onClose, open } = props;
    const defaultValue: number[] = [0]
    const [value, setValue] = useState<number[]>(defaultValue)
    const defaultCrop: Crop = {offset: 0, transition: Transition.Raw}
    const defaultCrops: Crops = {0: defaultCrop}
    const [crops, setCrops] = useState<Crops>(defaultCrops)
    const [error, setError] = useState<NullableString>(null)

    const [cropEditOpen, setCropEditOpen] = useState(false)
    const [cropEditValue, setCropEditValue] = useState<CropWithIndex>({index: 0, crop: defaultCrop})

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

        const newCrops = {...crops}
        delete newCrops[index]

        const newCropsKeys = Object.keys(newCrops)

        for (const newCropKeyString of newCropsKeys) {
            const newCropKey = parseInt(newCropKeyString)
            if (newCropKey >= index) {
                newCrops[newCropKey - 1] = newCrops[newCropKey]
                delete newCrops[newCropKey]
            }
        }

        setCrops(newCrops)
    }

    editCrop = (index: number) => {
        openEditModal({index, crop: crops[index]})
    }

    useEffect(() => {
        if (! open) {
            return
        }

        setError(null)

        // TODO CHECK CLIP DEFAULT VALUE

        setValue(defaultValue)
        setCrops(defaultCrops)

    }, [clip, open])

    const handleCreationButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (value.includes(clipLength)) {
            setError('Please move your last crop point slightly to the right')
            return
        }

        setError(null)

        const newValue = [...value]
        newValue.push(value.length === 0 ? 0 : clipLength)
        setValue(newValue)

        const newCropId = newValue.length - 1
        const newCrops = {...crops}
        newCrops[newCropId] = defaultCrop
        setCrops(newCrops)
    }

    const handleClose = () => {
        onClose(clip);
    };

    const handleSliderChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
        setError(null)
        setValue(typeof newValue === 'number' ? [newValue] : newValue);
    };

    const getValueText = (value: number) => {
        return formatTime(value)
    }

    const openEditModal = (value: CropWithIndex) => {
        setCropEditValue(value)
        setCropEditOpen(true);
    }

    const handleCropEditFormClose = (value: CropWithIndex) => {
        setCropEditOpen(false)
        const newCrops = {...crops}
        newCrops[value.index] = value.crop
        setCrops(newCrops)
    }

    const dialogLabel = 'crop-clip-form-modal'

    return <>
        <EditForm
            backgroundUrl={getThumbnailUrlByContentIdAndTime(
                contentId,
                clip.start + Math.floor(value[cropEditValue.index])
            )}
            crop={cropEditValue}
            open={cropEditOpen}
            onClose={handleCropEditFormClose}
        />
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>Crop clip</DialogTitle>
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
                    valueLabelDisplay={cropEditOpen ? 'off' : 'on'}
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
    </>;
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
