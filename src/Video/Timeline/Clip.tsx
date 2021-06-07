import styled, {StyledFunction} from 'styled-components';
import {Draggable} from 'react-beautiful-dnd'
import {HTMLProps} from "react";

interface ContainerProps {
    width: number
    isDragging: boolean
}

const Container = styled.div`
    border: 1px lightgrey solid;
    border-radius: 2px;
    padding: 8px 0;
    background-color: #EEE;
    width: ${(props: ContainerProps) => props.width}%;
    height: 100px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    ${(props: ContainerProps) => props.isDragging ? `
        max-width: 100px;
    ` : ``}
`

interface ClipProps {
    contentId: number
    clip: any
    index: number
    timelineWidth: number
    width: number
}

export default function Clip(props: ClipProps) {
    const {contentId, clip, index, timelineWidth, width} = props
    
    const clipId = clip.id
    const clipStart = clip.start
    const clipEnd = clip.end

    const times = [Math.round(clipStart).toString()]

    if (timelineWidth > 400) {
        times.push(Math.round(clipStart + ((clipEnd - clipStart) / 3)).toString())
        times.push(Math.round(clipStart + ((clipEnd - clipStart) * 2 / 3)).toString())
    }

    times.push(Math.round(clipEnd).toString())

    return <Draggable draggableId={clipId.toString()} index={index}>
        {(provided, snapshot) => (
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                width={width}
                isDragging={snapshot.isDragging}
            >
                {times.map((time, timeKey) => (
                    <img
                        key={timeKey}
                        style={{
                            height: '100%',
                        }}
                        src={process.env.REACT_APP_SPINNER_API_URL + '/thumbnail/' + contentId + '?s=' + time}
                        alt={'Clip thumbnail for clip ' + clipId}
                    />
                ))}
            </Container>
        )}
    </Draggable>
}