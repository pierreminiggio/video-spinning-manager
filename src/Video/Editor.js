import { Button, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import gap from "../Style/gap";
import ClipModalForm from "./Clip/ClipModalForm";
import Timeline from "./Timeline/Timeline";

export default function Editor(props) {

    const [clips, setClips] = useState([])
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = clip => {
        setOpen(false);

        if (Object.keys(clip).length === 0) {
            return
        }

        if (! clip.id) {
            const newClipList = [...clips]
            const newClipValues = {...clip}
            newClipValues.id = clips.length + 1
            newClipValues.order = newClipValues.id
            newClipList.push(newClipValues)
            setClips(newClipList);
        }
    };
    
    const orderedClips = [...clips]
    orderedClips.sort((firstClip, secondClip) => {
        const firstClipOrder = firstClip.order
        const secondClipOrder = secondClip.order
        
        if (firstClipOrder === secondClipOrder) {
            return 0
        }
        
        return (secondClipOrder - firstClipOrder) > 0 ? -1 : 1
    })
    
    const onClipDragEnd = result => {
        // TODO UPDATE STATE ORDER
    }

    return (
        <div>
            <Typography variant="subtitle1">Selected: {JSON.stringify(clips)}</Typography>
            <br />
            <Button
                style={{marginTop: gap / 2}}
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                Add a clip
            </Button>
            <ClipModalForm selectedValue={{}} open={open} onClose={handleClose} />    
            {orderedClips ? <DragDropContext
                onDragStart={() => null}
                onDragUpdate={() => null}
                onDragEnd={onClipDragEnd}
            >
                <Timeline clips={orderedClips} timelineId={'timeline-1'} />
            </DragDropContext> : ''}
        </div>
    );
}
