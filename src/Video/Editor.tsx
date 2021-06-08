import { Button } from "@material-ui/core";
import {CSSProperties, useEffect, useState} from "react";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import flex from "../Style/flex";
import gap from "../Style/gap";
import ClipModalForm from "./Clip/ClipModalForm";
import RemotionPreview from "./Preview/RemotionPreview";
import Edit from "./Timeline/Edit";
import Junk from "./Timeline/Junk";
import Timeline from "./Timeline/Timeline";
import VideoDuration from "../Struct/VideoDuration";
import VideoUrl from "../Struct/VideoUrl";
import NullableNumber from "../Struct/NullableNumber";
import Clip from "../Entity/Clip";
import RemotionClip from "../Entity/Remotion/RemotionClip";
import Crop from "./Timeline/Crop";
import CropModalForm from "./Clip/CropModalForm";

interface EditorProps {
    contentId: NullableNumber
    finishedVideoWidth: NullableNumber
    finishedVideoHeight: NullableNumber
    videoDuration: VideoDuration
    videoUrl: VideoUrl
    videoWidth: number
}

export default function Editor(props: EditorProps) {
    const {
        contentId,
        finishedVideoWidth,
        finishedVideoHeight,
        videoDuration,
        videoUrl,
        videoWidth
    } = props
    const [clips, setClips] = useState<Array<Clip>>([])
    const [selectedValue, setSelectedValue] = useState<Clip|Object>({})
    const [formOpen, setFormOpen] = useState(false)
    const [cropOpen, setCropOpen] = useState(false)
    const [dragging, setDragging] = useState(false)

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
        //setClips(newClipList);
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

    const onClipDragStart = (result: DropResult) => {
        setDragging(true)
    }

    const timelineId = 'timeline'
    const junkId = 'junk'
    const editId = 'edit'
    const cropId = 'crop'
    
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

    let totalClipTime = 0

    const fps = 60
    const remotionClips: Array<RemotionClip> = []
    orderedClips.forEach(orderedClip => {
        const startFrame = Math.ceil(orderedClip.start * fps)
        const endFrame = Math.ceil(orderedClip.end * fps)
        remotionClips.push({
            video: videoUrl,
            from: startFrame,
            durationInFrames: endFrame - startFrame
        })
        totalClipTime += orderedClip.end - orderedClip.start
    })

    const remotionProjectDurationInFrames = Math.ceil(totalClipTime * 60)

    const remotionProps = {props: JSON.stringify({clips: remotionClips})}


    const appearingStyle: CSSProperties = {
        opacity: dragging ? 1 : 0
    }
    const disappearingStyle: CSSProperties = {
        opacity: dragging ? 0 : 1
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

    return (
        <div>
            <ClipModalForm
                selectedValue={selectedValue}
                videoDuration={videoDuration}
                open={formOpen}
                onClose={handleFormClose}
            />
            <CropModalForm
                clip={clipToCrop}
                open={cropOpen}
                onClose={handleCropClose}
            />
            <DragDropContext
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
                <Timeline contentId={contentId ?? 0} clips={orderedClips} timelineId={timelineId} totalTime={totalClipTime} width={videoWidth} />
            </DragDropContext>
            {totalClipTime > 0 ? <RemotionPreview
                compositionHeight={finishedVideoHeight ?? 0}
                compositionWidth={finishedVideoWidth ?? 0}
                durationInFrames={remotionProjectDurationInFrames}
                fps={fps}
                remotionProps={remotionProps}
                width={videoWidth}
            /> : ''}
        </div>
    );
}
