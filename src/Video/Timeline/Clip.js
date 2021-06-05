import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px lightgrey solid;
    border-radius: 2px;
    padding: 8px 0;
    background-color: #EEE;
    width: ${props => props.width}%;
    height: 100px;
    overflow: hidden;
    display: flex;
`

export default function Clip(props) {
    const {contentId, clip, index, width} = props
    
    const clipStart = clip.start
    const clipEnd = clip.end

    const times = [
        Math.round(clipStart).toString(),
        Math.round(clipStart + ((clipEnd - clipStart) / 3)).toString(),
        Math.round(clipStart + ((clipEnd - clipStart) * 2 / 3)).toString(),
        Math.round(clipEnd).toString(),
    ]

    return <Draggable draggableId={clip.id.toString()} index={index}>
        {provided => (
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                width={width}
            >
                {times.map((time, timeKey) => (
                    <img
                        key={timeKey}
                        style={{
                            height: '100%',
                        }}
                        src={process.env.REACT_APP_SPINNER_API_URL + '/thumbnail/' + contentId + '?s=' + time}
                    />
                ))}
            </Container>
        )}
    </Draggable>
}