import { Button, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import flex from "../Style/flex";
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
            const newClipList = Array.from(clips)
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

    const timelineId = 'timeline'
    
    const onClipDragEnd = result => {
        const { destination, source, draggableId } = result

        if (! destination) {
            return
        }

        const sourceDroppableId = source.droppableId
        const destinationDroppableId = destination.droppableId

        const sourceIndex = source.index
        const destinationIndex = destination.index

        if (
            sourceDroppableId === destinationDroppableId
            && sourceIndex === destinationIndex
        ) {
            return
        }

        if (sourceDroppableId !== timelineId) {
            return // I've only 1 timeline right now
        }

        const newClipList = Array.from(clips)
        const movedForward = destinationIndex - sourceIndex > 0
        newClipList.forEach(newClip => {
            if (newClip.id === parseInt(draggableId)) {
                newClip.order = destinationIndex
                return
            }

            if (
                movedForward
            ) {
                if (newClip.order > sourceIndex && newClip.order <= destinationIndex) {
                    newClip.order -= 1

                    return
                }
            }

            if (newClip.order < sourceIndex && newClip.order >= destinationIndex) {
                newClip.order += 1

                return
            }
        })
        
        setClips(newClipList)
    }

    return (
        <div>
            <Typography variant="subtitle1">Selected: {JSON.stringify(clips)}</Typography>
            <div style={{...flex, justifyContent: 'center', marginTop: gap / 2}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Add a clip
                </Button>
            </div>
            <ClipModalForm selectedValue={{}} open={open} onClose={handleClose} />    
            <DragDropContext
                onDragStart={() => null}
                onDragUpdate={() => null}
                onDragEnd={onClipDragEnd}
            >
                <Timeline clips={orderedClips} timelineId={timelineId} />
            </DragDropContext>
        </div>
    );
}
