import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Clip from './Clip'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`

const ClipList = styled.div`
    padding: 8px;
    display: flex;
`

export default function Timeline(props) {
    const {clips, timelineId} = props
    return <Container>
        <Droppable droppableId={timelineId} direction="horizontal">
            {provided => <ClipList
                ref={provided.innerRef}
                {...provided.droppableProps}
                
            >
                {clips.map(clip => <Clip key={clip.id} clip={clip} index={clip.order} />)}
                {provided.placeholder}
            </ClipList>}
        </Droppable>
    </Container>
}