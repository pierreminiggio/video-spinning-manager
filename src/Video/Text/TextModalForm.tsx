import {Button, Dialog, DialogTitle} from "@material-ui/core";
import {SyntheticEvent, useEffect, useState} from "react";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import VideoDuration from "../../Struct/VideoDuration";
import Text from "../../Entity/Text";

interface TextModalFormProps {
    onClose: (text: Text|null) => void
    videoDuration: VideoDuration
    selectedValue: Text|null
    open: boolean
}

export default function TextModalForm({onClose, videoDuration, selectedValue, open}: TextModalFormProps) {
  
    useEffect(
        () => {
            // TODO Set values based on text
        },
        [selectedValue]
    )

    const handleClose = () => {
        onClose(selectedValue);
    };
  
    const handleFormSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        // TODO return new values
        onClose(selectedValue);
    };
    
    const commandVerb = selectedValue && selectedValue.id ? 'Edit' : 'Add'

    const dialogLabel = 'text-form-modal'

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
            {videoDuration === null ? <h2>Loading...</h2> : (<>
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
