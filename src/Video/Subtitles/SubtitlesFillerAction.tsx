import { Button, Dialog, DialogTitle } from '@material-ui/core';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { useState } from 'react';
import flexColumn from '../../Style/flexColumn';
import gap from '../../Style/gap';

interface SubtitlesFillerActionProps {
    languageAndSubtitlesId: number
    onSelected: (languageAndSubtitlesId: number) => void
}

export default function SubtitlesFillerAction({languageAndSubtitlesId, onSelected}: SubtitlesFillerActionProps): JSX.Element {
    const [confirmBoxOpen, setConfirmBoxOpen] = useState(false)

    const dialogLabel = 'language-confirming-selection-modal'

    return <>
        <Button onClick={() => setConfirmBoxOpen(true)}><FormatColorFillIcon /></Button>
        <Dialog
            onClose={() => setConfirmBoxOpen(false)}
            aria-labelledby={dialogLabel}
            open={confirmBoxOpen}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>Are you sure ?</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                <p>You're about to generate the texts based on the subtitles of the selected language, are you sure you want to do that ?</p>
                <p>It will also delete previous subtitles generated using this same feature.</p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setConfirmBoxOpen(false)
                        onSelected(languageAndSubtitlesId)
                    }}
                >
                    Confirm
                </Button>
            </div>
        </Dialog>
    </>
}
