import {Dialog, DialogTitle} from "@material-ui/core";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import Clip from "../../Entity/Clip";

interface CropModalFormProps {
    clip: Clip
    onClose: (clip: Clip) => void
    open: boolean
}

export default function CropModalForm(props: CropModalFormProps) {
    const { clip, onClose, open } = props;

    const handleClose = () => {
        onClose(clip);
    };

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="crop-clip-form-modal"
        open={open}
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="crop-clip-form-modal" style={{textAlign: 'center'}}>Crop clip</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                test
            </div>
        </Dialog>
    );
}
