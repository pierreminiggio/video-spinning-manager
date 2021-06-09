import {Dialog, DialogTitle} from "@material-ui/core";
import flexColumn from "../../../Style/flexColumn";
import gap from "../../../Style/gap";
import CropWithIndex from "../../../Entity/Video/Clip/Crop/CropWithIndex";

interface EditFormProps {
    crop: CropWithIndex
    onClose: (value: CropWithIndex) => void
    open: boolean
}

export default function EditForm(props: EditFormProps) {
    const { crop, onClose, open } = props;

    const handleClose = () => {
        onClose(crop)
    }

    const dialogLabel = 'edit-crop-clip-form-modal'

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby={dialogLabel}
        open={open}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>Edit Crop</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                test {JSON.stringify(crop)}
            </div>
        </Dialog>
    );
}
