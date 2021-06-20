import {Dispatch, SetStateAction, useState} from "react";
import EditButton from "../Timeline/Action/EditButton";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import DraggingActionsContainer from "../Timeline/Action/DraggingActionsContainer";
import {Button} from "@material-ui/core";
import JunkButton from "../Timeline/Action/JunkButton";
import Text from "../../Entity/Text";
import TextTimeline from "../Timeline/Text/TextTimeline";

interface TextEditorProps {
    texts: Array<Text>
    setTexts: Dispatch<SetStateAction<Text[]>>
    totalClipTime: number
    videoWidth: number
}

export default function TextEditor({texts, setTexts, totalClipTime, videoWidth}: TextEditorProps) {

    const [dragging, setDragging] = useState(false)

    const handleFormClickOpen = () => {
        // TODO open form
    }

    const timelineId = 'timeline'
    const junkId = 'junk'
    const editId = 'edit'
    const cropId = 'crop'

    const onTextDragStart = (result: DropResult) => {
        setDragging(true)
    }

    const onTextDragEnd = (result: DropResult) => {
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

    }

    return <DragDropContext
        onDragStart={onTextDragStart}
        onDragEnd={onTextDragEnd}
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
                    Add a text
                </Button>
            }
            draggingActions={
                <>
                    <EditButton droppableId={editId} />
                    <JunkButton droppableId={junkId} />
                </>
            }
        />
        <TextTimeline
            texts={texts}
            timelineId={timelineId}
            totalTime={totalClipTime}
            width={videoWidth}
        />
    </DragDropContext>
}