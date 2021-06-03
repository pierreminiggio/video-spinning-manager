import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import trash from './trash.svg'

const Container = styled.div`
    border: 1px solid red;
    border-radius: 2px;
    background-color: red;
`

const JunkList = styled.div`
    padding: 8px;
    display: flex;
    background-image: url(${props => props.trash});
    background-position: center;
    background-repeat: no-repeat;
    min-width: 34px;
    min-height: 34px;
`

export default function Junk(props) {
    const {junkId} = props
    return <Container>
        <Droppable droppableId={junkId} direction="horizontal">
            {provided => <JunkList
                ref={provided.innerRef}
                {...provided.droppableProps}
                trash={trash}  
            >
                {provided.placeholder}
            </JunkList>}
        </Droppable>
    </Container>
}