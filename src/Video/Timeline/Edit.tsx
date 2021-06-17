import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import edit from '../../Resources/Svg/Edit.svg'
import DroppableButton from "./DroppableButton";

const Container = styled.div`
    border: 1px solid #3F51B5;
    border-radius: 2px;
    background-color: #3F51B5;
`

interface EditProps {
    editId: string
}

export default function Edit(props: EditProps) {
    const {editId} = props
    return <Container>
        <Droppable droppableId={editId} direction="horizontal">
            {provided => <DroppableButton
                ref={provided.innerRef}
                {...provided.droppableProps}
                backgroundImageUrl={edit}
            >
                {provided.placeholder}
            </DroppableButton>}
        </Droppable>
    </Container>
}