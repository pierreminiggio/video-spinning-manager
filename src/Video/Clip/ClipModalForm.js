import { Button, Dialog, DialogTitle, Slider, Typography, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from 'prop-types';
import { useState } from "react";
import useFormInput from "../../Form/useFormInput";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";

const inputStep = 0.016

export default function ClipModalForm(props) {
    const { onClose, videoDuration, selectedValue, open } = props;
    const defaultRangeValues = [
        selectedValue?.start ? selectedValue.start : 0,
        selectedValue?.end ? selectedValue.end : 10
    ]
    const [value, setValue] = useState(defaultRangeValues);
    const selectedValueId = selectedValue?.id
    const [error, setError] = useState(null)
  
    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleChange = (e, newValue) => {
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

    const getValueText = value => value.toString()

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="clip-form-modal"
        open={open}
    >
        <DialogTitle id="clip-form-modal" style={{textAlign: 'center'}}>{commandVerb} clip</DialogTitle>
        <div style={{padding: gap / 2, ...flexColumn}}>
            { videoDuration === null ? <h2>Loading...</h2> : (<>
                { error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
                <Typography id="range-slider" gutterBottom>
                   Clip range
                </Typography>
                <Slider
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={getValueText}
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
