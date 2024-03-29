import {Button, Dialog, DialogTitle, Slider, Typography} from '@material-ui/core'
import {Fragment, SyntheticEvent, useEffect, useState} from 'react'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import flexColumn from '../../Style/flexColumn'
import gap from '../../Style/gap'
import Text from '../../Entity/Text'
import flex from '../../Style/flex'
import StyledDraggable from '../../Style/StyledDraggable'
import {ReactComponent as Trash} from '../../Resources/Svg/Trash.svg'
import inputStep from '../../Style/inputStep'
import splitText, { SplitMarker } from './splitText'

interface SplitModalFormProps {
    onClose: (oldText: Text|null, texts: Text[]|null) => void
    selectedValue: Text|null
    open: boolean
}

const enableMultipleMarkersFeature = false // Not supported everywhere in the program yet

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

        if (! selectedValue) {
            return
        }

        onClose(selectedValue, splitText(selectedValue, splitMarkers));
    }

    const charMarkersId = 'char-markers-id'

    const onClipDragEnd = (result: DropResult) => {

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

    const handleAddMarkerClick = (): void => {
        if (! selectedValue) {
            return
        }

        let newMarkerCharIndex = 0
        let newMarkerTime = 0

        for (const splitMarker of splitMarkers) {
            const textCharIndex = splitMarker.textCharIndex

            if (textCharIndex > newMarkerCharIndex) {
                newMarkerCharIndex = textCharIndex
            }

            const time = splitMarker.time

            if (time > newMarkerTime) {
                newMarkerTime = time
            }
        }

        const contentLength = selectedValue.content.length

        if (newMarkerCharIndex >= contentLength) {
            alert('A marker has its position after the text ended')

            return
        }

        newMarkerCharIndex = newMarkerCharIndex + Math.floor((contentLength - newMarkerCharIndex) / 2)

        if (newMarkerCharIndex >= contentLength - 1) {
            alert('No more space to add a cursor, please move your furthest cursor slightly to the right')

            return
        }

        const textDuration = selectedValue.end - selectedValue.start

        if (newMarkerTime >= textDuration) {
            alert('A marker has its time bigger than the text\'s duration')

            return
        }

        newMarkerTime = newMarkerTime + Math.floor((textDuration - newMarkerTime) / 2)

        if (newMarkerTime >= textDuration - 1) {
            alert('No more space to add a cursor, please move your furthest cursor\'s time slightly to the right')

            return
        }

        const newSplitMarkers: SplitMarker[] = Object.assign([], splitMarkers)
        const newSplitMarker: SplitMarker = {
            textCharIndex: newMarkerCharIndex,
            time: newMarkerTime
        }

        newSplitMarkers.push(newSplitMarker)

        setSplitMarkers(newSplitMarkers)
    }

    const handleMarkerTimeChange = (splitMarkerIndex: number, newValue: number | number[]): void => {

        if (! selectedValue) {
            return
        }

        if (Array.isArray(newValue)) {
            return
        }

        const newSplitMarkers: SplitMarker[] = Object.assign([], splitMarkers)
        newSplitMarkers[splitMarkerIndex].time = newValue

        setSplitMarkers(newSplitMarkers)
    }

    const handleMarkerDelete = (splitMarkerIndex: number): void => {
        const newSplitMarkers: SplitMarker[] = Object.assign([], splitMarkers)
        newSplitMarkers.splice(splitMarkerIndex, 1)

        setSplitMarkers(newSplitMarkers)
    }

    if (! selectedValue) {
        return <></>
    }

    const textContent = selectedValue.content
    
    const commandVerb = 'Split'

    const dialogLabel = 'split-form-modal'

    const markerTimeLabelPrefix = 'marker-time'

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
            <div style={{padding: gap / 2, ...flexColumn, gap: gap / 2}}>
                {(enableMultipleMarkersFeature || (! enableMultipleMarkersFeature && splitMarkers.length < 1)) && <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddMarkerClick()}
                >
                    Add a marker
                </Button>}
                <DragDropContext
                    onDragEnd={onClipDragEnd}
                >
                    <Droppable droppableId={charMarkersId} direction="horizontal">
                        {provided => <div
                            style={{
                                ...flex,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {Array.from(textContent).map((char, charIndex) => {

                                let cursor = <></>

                                for (const splitMarkerId in splitMarkers) {
                                    const splitMarker = splitMarkers[splitMarkerId]
                                    if (splitMarker.textCharIndex === charIndex) {
                                        cursor = <Draggable
                                            draggableId={'cursor-' + charIndex.toString()}
                                            index={charIndex + charIndexOffset}
                                        >
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

                                return <Fragment key={charIndex}>
                                    {cursor}
                                    <Draggable
                                        draggableId={charIndex.toString()}
                                        index={charIndex + charIndexOffset}
                                        isDragDisabled={true}
                                    >
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
                                </Fragment>
                            })}
                            {provided.placeholder}
                        </div>}
                    </Droppable>
                </DragDropContext>
                {splitMarkers.map((splitMarker, splitMarkerIndex) => {
                    const label = markerTimeLabelPrefix + '-' + splitMarkerIndex.toString()
                    return <div
                        key={splitMarkerIndex}
                    >
                        <Typography id={label} style={{marginTop: gap / 2}}>
                            Marker {splitMarkerIndex + 1} time <Button
                                onClick={() => handleMarkerDelete(splitMarkerIndex)}
                            >
                                <Trash fill="#FF0000" width={20} height={20}/>
                            </Button>
                        </Typography>
                        <Slider
                            value={splitMarker.time}
                            onChange={(event, newValue) => handleMarkerTimeChange(splitMarkerIndex, newValue)}
                            valueLabelDisplay="on"
                            aria-labelledby={label}
                            min={0}
                            max={selectedValue.end - selectedValue.start}
                            step={inputStep}
                        />
                        {splitMarker.textCharIndex}
                    </div>
                })}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFormSubmit}
                    disabled={splitMarkers.length === 0}
                >
                    {commandVerb}
                </Button>
            </div>
        </Dialog>
    );
}
