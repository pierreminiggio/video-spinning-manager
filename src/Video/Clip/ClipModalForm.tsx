import {Button, Dialog, DialogTitle, Slider, Tooltip, ValueLabelProps} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from 'prop-types';
import {ChangeEvent, ElementType, SyntheticEvent, useEffect, useState} from "react";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import VideoDuration from "../../Struct/VideoDuration";
import Clip from "../../Entity/Clip";
import NullableString from "../../Struct/NullableString";

const inputStep = 0.016

const tooltipIndexes = [0, 1]

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
    };

    const handleChange = (event: ChangeEvent<{}>, newValue: number | number[]) => {
        tooltipIndexes.forEach(tooltipIndex => {
            // @ts-ignore
            if (value[tooltipIndex] !== newValue[tooltipIndex]) {
                setLastChangedIndex(tooltipIndex)
            }
        })

        // @ts-ignore
        setValue(newValue);
    };
  
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

    const getValueText = (value: number) => {
        const minutesFromSeconds = Math.floor(value / 60)
        const secondsAndMillisecondsFromValue = value % 60
        const seconds = Math.floor(secondsAndMillisecondsFromValue)
        const belowSeconds = secondsAndMillisecondsFromValue - seconds
        const hoursFromMinutes = Math.floor(minutesFromSeconds / 60)
        const minutes = minutesFromSeconds % 60

        let display = ''

        const displayHours = hoursFromMinutes > 0
        if (displayHours) {
            display += hoursFromMinutes.toString() + 'h '
        }

       const displayMinutes = minutes > 0 || displayHours
       if (displayMinutes) {
           const minutesString = minutes.toString()
           display += (displayHours ? minutesString.padStart(2, '0') : minutesString) + 'm '
       }

       const secondsString = seconds.toString()
       display += (displayMinutes ? secondsString.padStart(2, '0') : secondsString)
       
       const millisecondsString = (parseFloat(belowSeconds.toFixed(3)) * 1000).toString()
       display += '.' + millisecondsString.padStart(3, '0')

       display += ' s'

       return display
    }

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="clip-form-modal"
        open={open}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="clip-form-modal" style={{textAlign: 'center'}}>{commandVerb} clip</DialogTitle>
        <div style={{padding: gap / 2, ...flexColumn}}>
            { videoDuration === null ? <h2>Loading...</h2> : (<>
                { error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="on"
                    getAriaValueText={getValueText}
                    valueLabelFormat={value => getValueText(value)}
                    ValueLabelComponent={getValueLabelComponent[lastChangedIndex]}
                    min={0}
                    max={videoDuration}
                    step={inputStep}
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

ClipModalForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object.isRequired,
};

const getValueLabelComponent: {[key: number]: ElementType<ValueLabelProps> | undefined} = {};
tooltipIndexes.forEach(lastChangedIndex => {
    // @ts-ignore
    getValueLabelComponent[lastChangedIndex] = (props: ValueLabelComponentsProps) => <ValueLabelComponent {... props} lastChangedIndex={lastChangedIndex} />
})

interface ValueLabelComponentsProps extends ValueLabelProps {
    index: number
    lastChangedIndex: number
}

function ValueLabelComponent(props: ValueLabelComponentsProps) {
  const { children, index, lastChangedIndex, open, value } = props;

  const popperProps: {style?: Object} = {
  }

  if (index === lastChangedIndex) {
    popperProps.style = {zIndex: 1501}
  }

  return (
    <Tooltip
      PopperProps={popperProps}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
}
