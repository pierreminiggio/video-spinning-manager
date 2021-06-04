import { Button, Dialog, DialogTitle, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from 'prop-types';
import { useState } from "react";
import useFormInput from "../../Form/useFormInput";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";

const inputStep = "0.016"

export default function ClipModalForm(props) {
    const { onClose, selectedValue, open } = props;
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

        setError(null)

        const updatedClip = { start, end }
        if (selectedValueId) {
            updatedClip.id = selectedValueId
        }

        onClose(updatedClip);
    };
  
    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="clip-form-modal"
        open={open}
    >
        <DialogTitle id="clip-form-modal" style={{textAlign: 'center'}}>Add clip</DialogTitle>
        <div style={{padding: gap / 2, ...flexColumn}}>
            { error ? <Alert variant="filled" severity="error">{error}</Alert> : ''}
            <TextField
                label="Start"
                type="number"
                inputProps={{ min: 0, step: inputStep }}
                {...startInputState}
            />
            <TextField
                label="End"
                type="number"
                inputProps={{ min: 0, step: inputStep }}
                {...endInputState}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
            >
                {selectedValueId ? 'Edit' : 'Add'}
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
