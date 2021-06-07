import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import Clip from './Clip'
import flex from '../../Style/flex'
import {default as ClipEntity} from '../../Entity/Clip'

interface ContainerProps {
    hasClips: boolean
    width: number
}

const Container = styled.div`${(props: ContainerProps) => props.hasClips ? `
    margin: 8px;
    border: 1px #303F9F solid;
    border-radius: 2px;
    background-color: #303F9F;
` : ``}
    width: ${props => props.width}px;
`

const ClipList = styled.div`
    padding: 8px;
    display: flex;
    gap: 10px;
`

const TimeCode = styled.div`
    padding: 3px 6px;
`

interface TimelineProps {
    contentId: number
    clips: Array<ClipEntity>
    timelineId: string
    totalTime: number
    width: number
}

export default function Timeline(props: TimelineProps) {
    const {contentId, clips, timelineId, totalTime, width} = props
    const hasClips = clips.length > 0

    return <Container hasClips={hasClips} width={width}>
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
                    contentId={contentId}
                    clip={clip}
                    index={clip.order}
                    timelineWidth={width}
                    width={Math.floor(100 * (clip.end - clip.start) / totalTime)}
                />)}
                {provided.placeholder}
            </ClipList>}
        </Droppable>
    </Container>
}