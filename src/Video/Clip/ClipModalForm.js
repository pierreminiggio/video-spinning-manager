import { Button, Dialog, DialogTitle, Slider, Tooltip } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from "react";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";

const inputStep = 0.016

export default function ClipModalForm(props) {
    const { onClose, videoDuration, selectedValue, open } = props;
    const [value, setValue] = useState([0, 10]);
    const [lastChangedValue, setLastChangedValue] = useState(0)
    const selectedValueId = selectedValue?.id
    const [error, setError] = useState(null)
  
    useEffect(
        () => {
            setValue([
                selectedValue?.start ? selectedValue.start : 0,
                selectedValue?.end ? selectedValue.end : 10
            ])
        },
        [selectedValue]
    )

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleChange = (e, newValue) => {
        [0, 1].forEach(tooltipIndex => {
            if (value[tooltipIndex] !== newValue[tooltipIndex]) {
                setLastChangedValue(tooltipIndex)
            }
        })
        setValue(newValue);
    };
  
    const handleFormSubmit = e => {
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
            updatedClip.id = selectedValueId
        }

        onClose(updatedClip);
    };
    
    const commandVerb = selectedValueId ? 'Edit' : 'Add'

    const getValueText = value => {
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
       
       const millisecondsString = (belowSeconds.toFixed(3) * 1000).toString()
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
                    valueLabelFormat={value => <div><span style={{display: 'none'}}>{lastChangedValue}</span>{getValueText(value)}</div>}
                    ValueLabelComponent={ValueLabelComponent}
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

function ValueLabelComponent(props) {
  const { children, index, open, value } = props;

  const popperRef = useRef(null);
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  const popperProps = {
    popperRef
  }

  if (index === props.value.props.children[0].props.children) {
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
