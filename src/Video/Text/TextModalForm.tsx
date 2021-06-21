import {Button, Dialog, DialogTitle, TextField} from "@material-ui/core";
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
    const [editedText, setEditedText] = useState<Text|null>(null)
    const defaultEditedText: Text = {
        id: 0,
        content: 'Your text',
        start: 0,
        end: videoDuration ?? 1,
        height: 7,
        color: '#ffffff',
        backgroundColor: '#ffa500',
        backgroundColorOpacity: .7,
        leftOffset: 20,
        rightOffset: 20,
        topOffset: 40,
    }

    console.log('--- edited text ---')
    console.log(editedText)
    console.log('---')

    useEffect(
        () => {
            if (! open) {
                return
            }

            if (selectedValue !== null) {
                const newEditedText = {...selectedValue}
                setEditedText(newEditedText)

                return
            }

            setEditedText(defaultEditedText)
        },
        [selectedValue, open]
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
            {videoDuration === null || editedText === null ? <h2>Loading...</h2> : (<>
                <TextField
                    label="Couleur Texte"
                    type="text"
                    value={editedText.color}
                />
                <TextField
                    type="color"
                    value={editedText.color}
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
