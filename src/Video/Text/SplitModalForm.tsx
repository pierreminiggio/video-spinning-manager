import {Button, Dialog, DialogTitle} from '@material-ui/core'
import {SyntheticEvent, useEffect, useState} from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import flexColumn from '../../Style/flexColumn'
import gap from '../../Style/gap'
import Text from '../../Entity/Text'
import flex from '../../Style/flex'
import StyledDraggable from '../../Style/StyledDraggable'

interface SplitModalFormProps {
    onClose: (oldText: Text|null, texts: Text[]|null) => void
    selectedValue: Text|null
    open: boolean
}

interface SplitMarker {
    textCharIndex: number
    time: number
}

const defaultSplitMarkers: (text: Text) => SplitMarker[] = (text: Text) => [
    {
        textCharIndex: Math.floor(text.content.length / 2),
        time: Math.floor((text.end - text.start) / 2)
    }
]

const Marker = styled(StyledDraggable)`
    min-width: 20px;
    text-align: center;
`

export default function SplitModalForm({onClose, selectedValue, open}: SplitModalFormProps) {
    const [splitMarkers, setSplitMarkers] = useState<SplitMarker[]>([])
    const [dragging, setDragging] = useState(false)

    useEffect(
        () => {
            if (! open) {
                return
            }

            if (selectedValue !== null) {
                setSplitMarkers(defaultSplitMarkers(selectedValue))

                return
            }
        },
        [selectedValue, open]
    )

    const handleClose = () => {
        onClose(selectedValue, null);
    }
  
    const handleFormSubmit = (e: SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        onClose(selectedValue, null /* TODO BUILD NEW TEXTS */);
    }

    const charMarkersId = 'char-markers-id'

    const onClipDragStart = (result: DropResult) => {
        setDragging(true)
    }

    const onClipDragEnd = (result: DropResult) => {
        setDragging(false)

        const { destination, source } = result

        if (! destination) {
            return
        }

        if (! selectedValue) {
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

        if (sourceDroppableId !== charMarkersId) {
            throw new Error('Where did you drop that shit ?')
        }

        if (destinationDroppableId === charMarkersId) {
            const newMarkers: SplitMarker[] = []

            for (const splitMarker of splitMarkers) {
                const newMarker = {...splitMarker}
                if (newMarker.textCharIndex === sourceIndex) {
                    let newTextCharIndex = destinationIndex

                    if (newTextCharIndex === 0) {
                        newTextCharIndex++
                    } else if (newTextCharIndex === selectedValue.content.length) {
                        newTextCharIndex--
                    }

                    newMarker.textCharIndex = newTextCharIndex
                }

                newMarkers.push(newMarker)
            }

            setSplitMarkers(newMarkers)
        }
    }

    if (! selectedValue) {
        return <></>
    }

    const textContent = selectedValue.content
    
    const commandVerb = 'Split'

    const dialogLabel = 'split-form-modal'

    let charIndexOffset = 0

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby={dialogLabel}
            open={open}
            fullWidth
            maxWidth="md"
        >
        <DialogTitle id={dialogLabel} style={{textAlign: 'center'}}>{commandVerb} text</DialogTitle>
            <div style={{padding: gap / 2, ...flexColumn}}>
                <DragDropContext
                    onDragStart={onClipDragStart}
                    onDragEnd={onClipDragEnd}
                >
                    <Droppable droppableId={charMarkersId} direction="horizontal">
                        {provided => <div
                            style={{
                                ...flex
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {Array.from(textContent).map((char, charIndex) => {

                                let cursor = <></>

                                for (const splitMarkerId in splitMarkers) {
                                    const splitMarker = splitMarkers[splitMarkerId]
                                    if (splitMarker.textCharIndex === charIndex) {
                                        cursor = <Draggable draggableId={'cursor-' + charIndex.toString()} index={charIndex + charIndexOffset}>
                                            {(provided, snapshot) => (
                                                <Marker
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    isDragging={snapshot.isDragging}
                                                >
                                                    {Number(splitMarkerId) + 1}
                                                </Marker>
                                            )}
                                        </Draggable>
                                        charIndexOffset++
                                    }
                                }

                                return <>
                                    {cursor}
                                    <Draggable draggableId={charIndex.toString()} index={charIndex + charIndexOffset} isDragDisabled={true}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    minWidth: 3
                                                }}
                                            >
                                                {char}
                                            </div>
                                        )}
                                    </Draggable>
                                </>
                            })}
                            {provided.placeholder}
                        </div>}
                    </Droppable>
                </DragDropContext>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFormSubmit}
                >
                    {commandVerb}
                </Button>
            </div>
        </Dialog>
    );
}
