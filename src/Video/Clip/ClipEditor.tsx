import Edit from "../Timeline/Edit";
import Junk from "../Timeline/Junk";
import Crop from "../Timeline/Crop";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {Button} from "@material-ui/core";
import Timeline from "../Timeline/Timeline";
import {CSSProperties, useState} from "react";
import Clip from "../../Entity/Clip";
import ClipModalForm from "./ClipModalForm";
import CropModalForm from "./CropModalForm";
import flex from "../../Style/flex";
import gap from "../../Style/gap";
import VideoDuration from "../../Struct/VideoDuration";

interface ClipEditorProps {
    clips: Array<Clip>
    setClips: any
    contentId: number
    orderedClips: Array<Clip>
    finishedVideoHeight: number
    finishedVideoWidth: number
    totalClipTime: number
    videoDuration: VideoDuration
    videoWidth: number
}

export default function ClipEditor(props: ClipEditorProps) {
    const {
        clips,
        setClips,
        contentId,
        orderedClips,
        finishedVideoHeight,
        finishedVideoWidth,
        totalClipTime,
        videoDuration,
        videoWidth
    } = props
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

    const appearingTransition = '.3s linear .3s'
    const disappearingTransition = '.3s'
    const appearingStyle: CSSProperties = {
        opacity: dragging ? 1 : 0,
        transition: dragging ? appearingTransition : disappearingTransition
    }
    const disappearingStyle: CSSProperties = {
        opacity: dragging ? 0 : 1,
        transition: dragging ? disappearingTransition : appearingTransition
    }

    // @ts-ignore
    const clipToCrop: Clip = selectedValue

    const buttonLineStyle: CSSProperties = {
        ...flex,
        justifyContent: 'center',
        marginTop: gap / 2,
        gap,
        position: 'absolute',
        width: '100%'
    }

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
        /><DragDropContext
            onDragStart={onClipDragStart}
            onDragUpdate={() => null}
            onDragEnd={onClipDragEnd}
        >
            <div style={{position: 'relative', height: 80}}>
                <div style={{...buttonLineStyle, ...disappearingStyle}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFormClickOpen}
                        style={{zIndex: 1}}
                    >
                        Add a clip
                    </Button>
                </div>
                <div style={{...buttonLineStyle, ...appearingStyle}}>
                    <div><Edit editId={editId} /></div>
                    <div><Crop cropId={cropId} /></div>
                    <div><Junk junkId={junkId} /></div>
                </div>
            </div>
            <Timeline
                contentId={contentId ?? 0}
                clips={orderedClips}
                timelineId={timelineId}
                totalTime={totalClipTime}
                width={videoWidth}
            />
        </DragDropContext>
    </>
}