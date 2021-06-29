import {Button, Dialog, DialogTitle, TextField} from "@material-ui/core";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";

interface TikTokModalFormProps {
    onClose: () => void
    open: boolean
}

export default function TikTokModalForm({onClose, open}: TikTokModalFormProps) {

    const handleClose = () => {
        onClose();
    }

    const dialogLabel = 'tiktok-form-modal'

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
        <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>Post to TikTok</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                Hey
            </div>
        </Dialog>
    );
}
