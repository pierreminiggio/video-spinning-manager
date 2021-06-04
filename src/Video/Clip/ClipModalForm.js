import { Button, Dialog, DialogTitle, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from 'prop-types';
import { useState } from "react";
import useFormInput from "../../Form/useFormInput";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";

const inputStep = "0.016"

export default function ClipModalForm(props) {
    const { onClose, videoDuration, selectedValue, open } = props;
    const startInputValue = selectedValue?.start ? selectedValue.start.toString() : ''
    const startInputState = useFormInput(startInputValue);
    const endInputValue = selectedValue?.end ? selectedValue.end.toString() : ''
    const endInputState = useFormInput(endInputValue);
    const selectedValueId = selectedValue?.id
    const [error, setError] = useState(null)
  
    const handleClose = () => {
        onClose(selectedValue);
    };
  
    const handleFormSubmit = e => {
        e.preventDefault()

        const start = parseFloat(startInputState?.value)
        const end = parseFloat(endInputState?.value)

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
    const numberInputProps = { min: 0, step: inputStep }

    if (videoDuration !== null) {
        numberInputProps.max = videoDuration
    }

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="clip-form-modal"
        open={open}
    >
        <DialogTitle id="clip-form-modal" style={{textAlign: 'center'}}>{commandVerb} clip</DialogTitle>
        <div style={{padding: gap / 2, ...flexColumn}}>
            { error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
            <TextField
                label="Start"
                type="number"
                inputProps={numberInputProps}
                {...startInputState}
            />
            <TextField
                label="End"
                type="number"
                inputProps={numberInputProps}
                {...endInputState}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
            >
                {commandVerb}
            </Button>
        </div>
      </Dialog>
    );
}

ClipModalForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object.isRequired,
};
