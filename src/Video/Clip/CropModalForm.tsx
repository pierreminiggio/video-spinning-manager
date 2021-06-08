import {Button, Dialog, DialogTitle, Slider, Tooltip, ValueLabelProps} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import Clip from "../../Entity/Clip";
import {ChangeEvent, CSSProperties, MouseEvent, ReactElement, useState} from "react";
import ReactDOM from 'react-dom';
import inputStep from "../../Domain/inputStep";
import formatTime from "../../Formatter/formatTime";
import {ReactComponent as Crop} from '../../Resources/Svg/Crop.svg'
import {ReactComponent as Trash} from '../../Resources/Svg/Trash.svg'
import NullableString from "../../Struct/NullableString";

const belowSliderContainerId = 'below-slider-container'
const movementActionContainerPrefix = 'movement-actions-'

interface CropModalFormProps {
    clip: Clip
    onClose: (clip: Clip) => void
    open: boolean
}

let deleteCrop: (index: number) => void

export default function CropModalForm(props: CropModalFormProps) {
    const { clip, onClose, open } = props;
    const [value, setValue] = useState<number[]>([])
    const [error, setError] = useState<NullableString>(null)
    const [lastChangedIndex, setLastChangedIndex] = useState<number|null>(null)
    const clipLength = parseFloat((clip.end - clip.start).toFixed(3))
    const valueIndexes = Array.from(Array(value.length).keys())

    deleteCrop = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        setValue(newValue)
    }

    const createPointIfItCan = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (value.includes(clipLength)) {
            setError('Please move your last point slightly to the right')
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

    const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
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
                    onClick={createPointIfItCan}
                >
                    Add
                </Button>
                <Slider
                    value={value}
                    onChange={handleChange}
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
                <div id={belowSliderContainerId} style={{marginBottom: 1.5 * gap}}>
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

    const actionContainer = document.getElementById(movementActionContainerPrefix + index)

    if (actionContainer !== null) {
        ReactDOM.render(<ActionContainer
            children={children}
            index={index}
        />, actionContainer)
    }

    return <Tooltip
        open={open}
        enterTouchDelay={0}
        placement="top"
        title={value}
    >
        {children}
    </Tooltip>
}

function ActionContainer(props: {children: ReactElement, index: number}) {
    const {children, index} = props

    const childrenLeft = children.props.style.left

    const svgSize = 20
    const padding = 10
    const left = 'calc(' + childrenLeft + ' - ' + (svgSize / 2 + padding).toString() + 'px)'

    const handleCropClick = (e: MouseEvent<HTMLButtonElement>) => {
        preventDefault(e)
        alert('test crop')
    }

    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        preventDefault(e)
        deleteCrop(index)
    }

    const preventDefault = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const buttonStyle: CSSProperties = {
        padding: padding,
        minWidth: 'auto',
        display: 'block'
    }

    return <div
        style={{position: 'absolute', left}}
    >
        <Button
            style={buttonStyle}
            onClick={handleCropClick}
            onMouseDown={preventDefault}
        >
            <Crop fill="#3F51B5" width={svgSize} height={svgSize}/>
        </Button>
        <Button
            style={buttonStyle}
            onClick={handleDeleteClick}
            onMouseDown={preventDefault}
        >
            <Trash fill="#FF0000" width={svgSize} height={svgSize}/>
        </Button>
    </div>
}