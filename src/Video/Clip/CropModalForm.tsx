import {Button, Dialog, DialogTitle, Slider, Tooltip, ValueLabelProps} from "@material-ui/core";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import Clip from "../../Entity/Clip";
import {ChangeEvent, CSSProperties, useState} from "react";
import inputStep from "../../Domain/inputStep";
import formatTime from "../../Formatter/formatTime";

interface CropModalFormProps {
    clip: Clip
    onClose: (clip: Clip) => void
    open: boolean
}

export default function CropModalForm(props: CropModalFormProps) {
    const { clip, onClose, open } = props;
    const [value, setValue] = useState([2, 3, 5])
    const [lastChangedIndex, setLastChangedIndex] = useState<number|null>(null)
    const clipLength = parseFloat((clip.end - clip.start).toFixed(3))
    const valueIndexes = Array.from(Array(value.length).keys())

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
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="on"
                    getAriaValueText={getValueText}
                    valueLabelFormat={value => getValueText(value)}
                    ValueLabelComponent={ValueLabelComponent}
                    min={0}
                    max={clipLength}
                    step={inputStep}
                />
            </div>
        </Dialog>
    );
}

function ValueLabelComponent(props: ValueLabelProps) {
    const { children, open, value } = props;

    const left = children.props.style.left
    return (
        <>
            <div
                style={{position: 'absolute', left}}
            >
                <Button>
                    Edit
                </Button>
            </div>
            <Tooltip
                open={open}
                enterTouchDelay={0}
                placement="top"
                title={value}
            >
                {children}
            </Tooltip>
        </>

    )

    /*return (

    );*/
}