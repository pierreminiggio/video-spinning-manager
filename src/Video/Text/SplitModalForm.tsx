import {Button, Dialog, DialogTitle} from '@material-ui/core'
import {SyntheticEvent, useEffect, useState} from 'react'
import flexColumn from '../../Style/flexColumn'
import gap from '../../Style/gap'
import Text from '../../Entity/Text'

interface SplitModalFormProps {
    onClose: (oldText: Text|null, texts: Text[]|null) => void
    selectedValue: Text|null
    open: boolean
}

export default function SplitModalForm({onClose, selectedValue, open}: SplitModalFormProps) {
    const [editedText, setEditedText] = useState<Text|null>(null)

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
        },
        [selectedValue, open]
    )

    const handleClose = () => {
        onClose(selectedValue, null);
    }

  
    const handleFormSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        onClose(editedText, null /* TODO BUILD NEW TEXTS */);
    }

    if (! selectedValue || ! selectedValue.id) {
        return <></>
    }
    
    const commandVerb = 'Split'

    const dialogLabel = 'split-form-modal'

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
