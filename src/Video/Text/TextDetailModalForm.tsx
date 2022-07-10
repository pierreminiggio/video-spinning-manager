import {Button, Dialog, DialogTitle} from '@material-ui/core'
import {SyntheticEvent} from 'react'
import flexColumn from '../../Style/flexColumn'
import gap from '../../Style/gap'
import Text from '../../Entity/Text'

export enum TextDetailAction {
    EDIT = 'edit',
    DELETE = 'delete'
}

interface TextDetailModalFormProps {
    onClose: (text: Text|null, action: TextDetailAction|null) => void
    selectedValue: Text|null
    open: boolean
}

export default function TextDetailModalForm({onClose, selectedValue, open}: TextDetailModalFormProps) {
    const handleClose = () => {
        onClose(selectedValue, null);
    }
  
    const handleActionClick = (e: SyntheticEvent<EventTarget>, action: TextDetailAction) => {
        e.preventDefault()
        onClose(selectedValue, action);
    }

    if (! selectedValue) {
        return <></>
    }
    
    const commandVerb = 'Alter'

    const dialogLabel = 'detail-text-form-modal'

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
        <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>{commandVerb} text</DialogTitle>
            <div style={{padding: gap / 2, gap: gap / 2, ...flexColumn}}>
                <p style={{textAlign: 'center'}}><b>Content :</b> {selectedValue.content}</p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={e => handleActionClick(e, TextDetailAction.EDIT)}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={e => handleActionClick(e, TextDetailAction.DELETE)}
                >
                    Delete
                </Button>
            </div>
        </Dialog>
    );
}
