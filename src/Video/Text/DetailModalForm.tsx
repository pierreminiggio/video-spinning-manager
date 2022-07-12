import {Button, Dialog, DialogTitle} from '@material-ui/core'
import {SyntheticEvent} from 'react'
import flexColumn from '../../Style/flexColumn'
import gap from '../../Style/gap'
import Text from '../../Entity/Text'

export enum DetailAction {
    EDIT = 'edit',
    SPLIT = 'split',
    DELETE = 'delete'
}

interface DetailModalFormProps {
    onClose: (text: Text|null, action: DetailAction|null) => void
    selectedValue: Text|null
    open: boolean
}

export default function DetailModalForm({onClose, selectedValue, open}: DetailModalFormProps) {
    const handleClose = () => {
        onClose(selectedValue, null);
    }
  
    const handleActionClick = (e: SyntheticEvent<EventTarget>, action: DetailAction) => {
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
                    onClick={e => handleActionClick(e, DetailAction.EDIT)}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={e => handleActionClick(e, DetailAction.SPLIT)}
                >
                    Split
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={e => handleActionClick(e, DetailAction.DELETE)}
                >
                    Delete
                </Button>
            </div>
        </Dialog>
    );
}
