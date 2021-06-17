import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import trash from '../../Resources/Svg/Trash.svg'
import DroppableButton from "./DroppableButton";

const Container = styled.div`
    border: 1px solid red;
    border-radius: 2px;
    background-color: red;
`

interface JunkProps {
    junkId: string
}

export default function Junk(props: JunkProps) {
    const {junkId} = props
    return <Container>
        <Droppable droppableId={junkId} direction="horizontal">
            {provided => <DroppableButton
                ref={provided.innerRef}
                {...provided.droppableProps}
                backgroundImageUrl={trash}
            >
                {provided.placeholder}
            </DroppableButton>}
        </Droppable>
    </Container>
}