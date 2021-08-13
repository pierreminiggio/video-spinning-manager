import {Button, Dialog, DialogTitle, TextField} from "@material-ui/core";
import flexColumn from "../../Style/flexColumn";
import gap from "../../Style/gap";
import {useEffect, useMemo, useState} from "react";
import NullableString from "../../Struct/NullableString";

interface TikTokModalFormProps {
    onClose: (legend: NullableString, publishAt: NullableString) => void
    open: boolean
    predictedNextPostTime: NullableString
}

const tikTokLegendMaxLength = 150

const numberToTwoDigitString = (number: number): string => {
    return number.toString().padStart(2, '0')
}

const formatDateForInput = (datetime: Date): string => {
    return datetime.getUTCFullYear() +
        '-' +
        numberToTwoDigitString(datetime.getUTCMonth() + 1) +
        '-' + numberToTwoDigitString(datetime.getUTCDate()) +
        'T' +
        numberToTwoDigitString(datetime.getUTCHours()) +
        ':' +
        numberToTwoDigitString(datetime.getUTCMinutes())
}

export default function TikTokModalForm({onClose, open, predictedNextPostTime}: TikTokModalFormProps) {

    const [legend, setLegend] = useState<NullableString>(null)
    const [publishAt, setPublishAt] = useState<Date|undefined>()

    useEffect(() => {
        if (! open) {
            return
        }

        setLegend(null)
    }, [open])

    useEffect(() => {
        if (! open) {
            return
        }

        const defaultPublishAt = predictedNextPostTime ? new Date(predictedNextPostTime) : new Date()
        
        setPublishAt(defaultPublishAt)
    }, [open, setPublishAt, predictedNextPostTime])

    const formattedDate = useMemo<string|undefined>((): string|undefined => {
        if (! publishAt) {
            return
        }

        return formatDateForInput(publishAt)
    }, [publishAt])

    const handleClose = () => {
        onClose(null, null);
    }

    const handleFormSubmit = () => {
        onClose(legend, formattedDate ? formattedDate : null)
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
                <div>{(legend ?? '').length}/150</div>
                <TextField
                    id="datetime-local"
                    label="Post date (UTC)"
                    type="datetime-local"
                    value={formattedDate}
                    onChange={e => {
                        const value = e.target.value

                        if (! value) {
                            return
                        }

                        setPublishAt(new Date(value))
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
