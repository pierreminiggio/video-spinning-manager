import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    width: ${props => props.width}%;
`

export default function Clip(props) {
    const {clip, index, width} = props

    return <Draggable draggableId={clip.id.toString()} index={index}>
        {provided => (
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                width={width}
            >
                {clip.id.toString()} {clip.start.toString()} {clip.end.toString()} {clip.order.toString()}
            </Container>
        )}
    </Draggable>
}