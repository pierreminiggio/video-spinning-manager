import styled from 'styled-components'
import {Draggable} from 'react-beautiful-dnd'
import getThumbnailUrlByContentIdAndTime from '../../../API/Spinner/Thumbnail/getThumbnailUrlByContentIdAndTime'
import StyledDraggable, { StyledDraggableProps } from '../../../Style/StyledDraggable'

interface ContainerProps extends StyledDraggableProps {
    width: number
}

const Container = styled(StyledDraggable)`
    width: ${(props: ContainerProps) => props.width}%;
    height: 100px;
    overflow: hidden;
    display: flex;
    ${(props: ContainerProps) => props.isDragging ? `
        box-shadow: 0px 0px 0px 6px rgba(255, 255, 0, .7);
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
                            height: '100%'
                        }}
                        src={getThumbnailUrlByContentIdAndTime(contentId, parseInt(time))}
                        alt={'Clip thumbnail for clip ' + clipId}
                    />
                ))}
            </Container>
        )}
    </Draggable>
}