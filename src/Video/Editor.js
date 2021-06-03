import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import flex from "../Style/flex";
import gap from "../Style/gap";
import ClipModalForm from "./Clip/ClipModalForm";
import Junk from "./Timeline/Junk";
import Timeline from "./Timeline/Timeline";

export default function Editor(props) {
    const { videoUrl } = props
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
            let maxId = 0
            newClipList.forEach(newClip => {
                if (newClip.id > maxId) {
                    maxId = newClip.id
                }
            })
            newClipValues.id = maxId + 1
            newClipValues.order = clips.length + 1
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
    const junkId = 'junk'
    
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
            return // I don't pull anything from edit or trash
        }

        let newClipList = Array.from(clips)
        const draggedClipId = parseInt(draggableId)

        if (destinationDroppableId === timelineId) {
            const movedForward = destinationIndex - sourceIndex > 0
            newClipList.forEach(newClip => {
                if (newClip.id === draggedClipId) {
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
        } else if (destinationDroppableId === junkId) {
            newClipList = newClipList.filter(newClip => newClip.id !== draggedClipId)
            newClipList.forEach(newClip => {
                if (newClip.order > sourceIndex) {
                    newClip.order -= 1
                }
            })
        }
        
        setClips(newClipList)
    }

    const fps = 60
    const remotionProps = {clips: []}
    orderedClips.forEach(orderedClip => {
        const startFrame = parseInt(orderedClip.start * fps)
        const endFrame = parseInt(orderedClip.end * fps)
        remotionProps.clips.push({
            video: videoUrl,
            from: startFrame,
            durationInFrames: endFrame - startFrame
        })
    })

    return (
        <div>
            {JSON.stringify(remotionProps)}
            <ClipModalForm selectedValue={{}} open={open} onClose={handleClose} />    
            <DragDropContext
                onDragStart={() => null}
                onDragUpdate={() => null}
                onDragEnd={onClipDragEnd}
            >
                <div style={{...flex, justifyContent: 'center', marginTop: gap / 2}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                    >
                        Add a clip
                    </Button>
                    <Junk junkId={junkId} />
                </div>
                <Timeline clips={orderedClips} timelineId={timelineId} />
            </DragDropContext>
        </div>
    );
}
