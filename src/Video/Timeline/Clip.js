import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
`

export default function Clip(props) {
    const {clip, index} = props
    return <Draggable draggableId={'clip-' + clip.id.toString()} index={index}>
        {provided => (
            <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
            >
                {clip.id.toString()} {clip.start.toString()} {clip.end.toString()} {clip.order.toString()}
            </Container>
        )}
    </Draggable>
}