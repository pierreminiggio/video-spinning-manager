import {Button, Dialog, DialogTitle, TextField} from "@material-ui/core";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import {useEffect, useState} from "react";
import NullableString from "../../Struct/NullableString";

interface TikTokModalFormProps {
    onClose: (legend: NullableString) => void
    open: boolean
}

const tikTokLegendMaxLength = 150

export default function TikTokModalForm({onClose, open}: TikTokModalFormProps) {

    const [legend, setLegend] = useState<NullableString>(null)

    useEffect(() => {
        if (! open) {
            return
        }

        setLegend(null)
    }, [open])

    const handleClose = () => {
        onClose(null);
    }

    const handleFormSubmit = () => {
        onClose(legend)
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
                <TextField
                    value={legend ?? ''}
                    onChange={e => setLegend(e.target.value.replace('\n', ' '))}
                    label="Legend"
                    placeholder="Legend"
                    inputProps={{maxLength: tikTokLegendMaxLength}}
                    multiline={true}
                />
                {legend !== null ? <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFormSubmit}
                >
                    Post
                </Button> : ''}
            </div>
        </Dialog>
    );
}
