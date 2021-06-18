import EditButton from "../Timeline/Clip/EditButton";
import JunkButton from "../Timeline/Clip/JunkButton";
import CropButton from "../Timeline/Clip/CropButton";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {Button} from "@material-ui/core";
import ClipTimeline from "../Timeline/Clip/ClipTimeline";
import {Dispatch, SetStateAction, useState} from "react";
import Clip from "../../Entity/Clip";
import ClipModalForm from "./ClipModalForm";
import CropModalForm from "./CropModalForm";
import VideoDuration from "../../Struct/VideoDuration";
import DraggingActionsContainer from "../Timeline/DraggingActionsContainer";

interface ClipEditorProps {
    clips: Array<Clip>
    setClips: Dispatch<SetStateAction<Clip[]>>
    contentId: number
    orderedClips: Array<Clip>
    finishedVideoHeight: number
    finishedVideoWidth: number
    totalClipTime: number
    videoDuration: VideoDuration
    videoWidth: number
}

export default function ClipEditor({
    clips,
    setClips,
    contentId,
    orderedClips,
    finishedVideoHeight,
    finishedVideoWidth,
    totalClipTime,
    videoDuration,
    videoWidth
}: ClipEditorProps) {
    const [dragging, setDragging] = useState(false)
    const [selectedValue, setSelectedValue] = useState<Clip|Object>({})
    const [formOpen, setFormOpen] = useState(false)
    const [cropOpen, setCropOpen] = useState(false)

    const handleFormClickOpen = () => {
        openFormModal({})
    };

    const openFormModal = (value: Clip|Object) => {
        setSelectedValue(value)
        setFormOpen(true);
    }

    const openCropModal = (value: Clip) => {
        setSelectedValue(value)
        setCropOpen(true);
    }

    const handleFormClose = (clip: Object|Clip) => {
        setFormOpen(false);

        if (Object.keys(clip).length === 0) {
            return
        }

        const newClipList: Array<Clip> = Array.from(clips)

        // @ts-ignore
        if (! clip.id) {
            const newClipValues: Clip|Object = {...clip}
            let maxId = 0
            newClipList.forEach((newClip: Clip) => {
                if (newClip.id > maxId) {
                    maxId = newClip.id
                }
            })

            // @ts-ignore
            newClipValues.id = maxId + 1
            // @ts-ignore
            newClipValues.order = clips.length + 1
            // @ts-ignore
            newClipValues.moves = {}

            // @ts-ignore
            newClipList.push(newClipValues)
        } else {
            // @ts-ignore
            const clipToEdit = newClipList.filter((newClip: Clip) => newClip.id === clip.id)[0]
            // @ts-ignore
            clipToEdit.start = clip.start
            // @ts-ignore
            clipToEdit.end = clip.end
        }

        setClips(newClipList);
    };

    const handleCropClose = (clip: Clip) => {
        setCropOpen(false);
        const newClipList: Array<Clip> = Array.from(clips)
        const clipToEdit = newClipList.filter((newClip: Clip) => newClip.id === clip.id)[0]
        clipToEdit.moves = clip.moves
        setClips(newClipList);
    };

    const timelineId = 'timeline'
    const junkId = 'junk'
    const editId = 'edit'
    const cropId = 'crop'

    const onClipDragStart = (result: DropResult) => {
        setDragging(true)
    }

    const onClipDragEnd = (result: DropResult) => {
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
            openFormModal(clipToEdit)
            return
        } else if (destinationDroppableId === cropId) {
            const clipToCrop = newClipList.filter(newClip => newClip.id === draggedClipId)[0]
            openCropModal(clipToCrop)
            return
        }

        setClips(newClipList)
    }

    // @ts-ignore
    const clipToCrop: Clip = selectedValue

    return <>
        <ClipModalForm
            selectedValue={selectedValue}
            videoDuration={videoDuration}
            open={formOpen}
            onClose={handleFormClose}
        />
        <CropModalForm
            clip={clipToCrop}
            contentId={contentId}
            finishedVideoHeight={finishedVideoHeight}
            finishedVideoWidth={finishedVideoWidth}
            open={cropOpen}
            onClose={handleCropClose}
        />
        <DragDropContext
            onDragStart={onClipDragStart}
            onDragEnd={onClipDragEnd}
        >
            <DraggingActionsContainer
                dragging={dragging}
                actions={
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFormClickOpen}
                        style={{zIndex: 1}}
                    >
                        Add a clip
                    </Button>
                }
                draggingActions={
                    <>
                        <EditButton droppableId={editId} />
                        <CropButton droppableId={cropId} />
                        <JunkButton droppableId={junkId} />
                    </>
                }
            />
            <ClipTimeline
                contentId={contentId ?? 0}
                clips={orderedClips}
                timelineId={timelineId}
                totalTime={totalClipTime}
                width={videoWidth}
            />
        </DragDropContext>
    </>
}