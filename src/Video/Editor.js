import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import flex from "../Style/flex";
import gap from "../Style/gap";
import ClipModalForm from "./Clip/ClipModalForm";
import Edit from "./Timeline/Edit";
import Junk from "./Timeline/Junk";
import Timeline from "./Timeline/Timeline";

export default function Editor(props) {
    const { contentId, videoDuration, videoUrl, width } = props
    const [clips, setClips] = useState([])
    const [selectedValue, setSelectedValue] = useState({})
    const [open, setOpen] = useState(false)
    const [dragging, setDragging] = useState(false)

    const handleClickOpen = () => {
        openModal({})
    };

    const openModal = (value) => {
        setSelectedValue(value)
        setOpen(true);
    }

    const handleClose = clip => {
        setOpen(false);

        if (Object.keys(clip).length === 0) {
            return
        }

        const newClipList = Array.from(clips)

        if (! clip.id) {
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
        } else {
            const clipToEdit = newClipList.filter(newClip => newClip.id === clip.id)[0]
            clipToEdit.start = clip.start
            clipToEdit.end = clip.end
        }

        setClips(newClipList);
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

    const onClipDragStart = result => {
        setDragging(true)
    }

    const timelineId = 'timeline'
    const junkId = 'junk'
    const editId = 'edit'
    
    const onClipDragEnd = result => {
        setDragging(false)

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
        } else if (destinationDroppableId === editId) {
            const clipToEdit = newClipList.filter(newClip => newClip.id === draggedClipId)[0]
            openModal(clipToEdit)
            return;
        }
        
        setClips(newClipList)
    }

    const fps = 60
    const remotionClips = []
    orderedClips.forEach(orderedClip => {
        const startFrame = parseInt(orderedClip.start * fps)
        const endFrame = parseInt(orderedClip.end * fps)
        remotionClips.push({
            video: videoUrl,
            from: startFrame,
            durationInFrames: endFrame - startFrame
        })
    })

    const remotionProps = {props: JSON.stringify({clips: remotionClips})}
    console.log(remotionProps)

    const transition = '.5s'
    const appearingStyle = {opacity: dragging ? 1 : 0, transition}
    const disappearingStyle = {opacity: dragging ? 0 : 1, transition}

    return (
        <div>
            <ClipModalForm
                selectedValue={selectedValue}
                videoDuration={videoDuration}
                open={open}
                onClose={handleClose}
            />
            <DragDropContext
                onDragStart={onClipDragStart}
                onDragUpdate={() => null}
                onDragEnd={onClipDragEnd}
            >
                <div style={{...flex, justifyContent: 'center', marginTop: gap / 2}}>
                <div style={appearingStyle}><Edit editId={editId} /></div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        style={disappearingStyle}
                    >
                        Add a clip
                    </Button>
                    <div style={appearingStyle}><Junk junkId={junkId} /></div>
                </div>
                <Timeline contentId={contentId} clips={orderedClips} timelineId={timelineId} width={width} />
            </DragDropContext>
        </div>
    );
}
