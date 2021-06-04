import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Clip from './Clip'
import flex from '../../Style/flex'

const Container = styled.div`${props => props.hasClips ? `
margin: 8px;
border: 1px #303F9F solid;
border-radius: 2px;
background-color: #303F9F
` : ``}  
`

const ClipList = styled.div`
    padding: 8px;
    display: flex;
    gap: 10px;
`

const TimeCode = styled.div`
    padding: 3px 6px;
`

export default function Timeline(props) {
    const {clips, timelineId} = props
    const hasClips = clips.length > 0
    let totalTime = 0
    clips.forEach(clip => {
        totalTime += clip.end - clip.start
    })

    return <Container hasClips={hasClips}>
        {hasClips ? <div style={{
            ...flex,
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: '#101F7F',
            color: 'white'
        }}>
            <TimeCode>0s</TimeCode>
            <TimeCode>{Math.round(totalTime / 2)}s</TimeCode>
            <TimeCode>{Math.round(totalTime)}s</TimeCode>
        </div> : ''}
        <Droppable droppableId={timelineId} direction="horizontal">
            {provided => <ClipList
                ref={provided.innerRef}
                {...provided.droppableProps}
                
            >
                {clips.map(clip => <Clip
                    key={clip.id}
                    clip={clip}
                    index={clip.order}
                    width={Math.floor(100 * (clip.end - clip.start) / totalTime)}
                />)}
                {provided.placeholder}
            </ClipList>}
        </Droppable>
    </Container>
}