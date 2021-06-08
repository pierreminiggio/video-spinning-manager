import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import edit from '../../Resources/Svg/Edit.svg'

const Container = styled.div`
    border: 1px solid #3F51B5;
    border-radius: 2px;
    background-color: #3F51B5;
`

interface EditListProps {
    edit: string
}

const EditList = styled.div`
    padding: 8px;
    display: flex;
    background-image: url(${(props: EditListProps) => props.edit});
    background-position: center;
    background-repeat: no-repeat;
    min-width: 34px;
    min-height: 34px;
`

interface EditProps {
    editId: string
}

export default function Edit(props: EditProps) {
    const {editId} = props
    return <Container>
        <Droppable droppableId={editId} direction="horizontal">
            {provided => <EditList
                ref={provided.innerRef}
                {...provided.droppableProps}
                edit={edit}  
            >
                {provided.placeholder}
            </EditList>}
        </Droppable>
    </Container>
}