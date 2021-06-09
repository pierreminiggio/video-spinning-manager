import {capitalize, Dialog, DialogTitle, InputLabel, MenuItem, Select} from "@material-ui/core";
import flexColumn from "../../../Style/flexColumn";
import gap from "../../../Style/gap";
import CropWithIndex from "../../../Entity/Video/Clip/Crop/CropWithIndex";
import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import Transition from "../../../Entity/Video/Clip/Crop/Transition";

interface EditFormProps {
    crop: CropWithIndex
    onClose: (value: CropWithIndex) => void
    open: boolean
}

export default function EditForm(props: EditFormProps) {
    const { crop, onClose, open } = props;
    const [editedCrop, setEditedCrop] = useState<CropWithIndex>({...crop})

    useEffect(() => {
        if (! open) {
            return
        }

        setEditedCrop({
            index: crop.index,
            crop: {...crop.crop}
        })
    }, [open, crop])

    const handleTransitionChange = (
        e: ChangeEvent<{name?: string|undefined; value: unknown}>,
        child: ReactNode
    ) => {
        const newEditedCrop = {...editedCrop}
        const value = e.target.value as Transition
        newEditedCrop.crop.transition = value
        setEditedCrop(newEditedCrop)
    }

    const handleClose = () => {
        onClose(crop)
    }

    const dialogLabel = 'edit-crop-clip-form-modal'
    const selectLabel = 'transition-select-label'

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
                <InputLabel id={selectLabel}>Age</InputLabel>
                <Select
                  labelId={selectLabel}
                  value={editedCrop.crop.transition}
                  onChange={handleTransitionChange}
                >
                    {Object.values(Transition).map((transition, transitionIndex) => <MenuItem
                        key={transitionIndex}
                        value={transition}
                    >
                        {capitalize(transition)}
                    </MenuItem>)}
                </Select>
                crop: {JSON.stringify(crop)}
                <br/>edited: {JSON.stringify(editedCrop)}
            </div>
        </Dialog>
    );
}
