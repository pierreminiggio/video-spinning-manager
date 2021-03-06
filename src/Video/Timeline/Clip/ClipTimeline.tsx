import { Droppable } from 'react-beautiful-dnd'
import Clip from './Clip'
import {default as ClipEntity} from '../../../Entity/Clip'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from '../TimelineContainer'
import TimelineClipList from '../TimelineClipList'
import getWidthForTimeline from '../getWidthForTimeline'

interface TimelineProps {
    contentId: number
    clips: Array<ClipEntity>
    timelineId: string
    totalTime: number
    width: number
}

export default function ClipTimeline({contentId, clips, timelineId, totalTime, width}: TimelineProps) {
    const hasClips = clips.length > 0

    return <TimelineContainer displayTimeline={hasClips} width={width}>
        {hasClips ? <TimecodesLine totalTime={totalTime} /> : ''}
        <Droppable droppableId={timelineId} direction="horizontal">
            {provided => <TimelineClipList
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {clips.map((clip: ClipEntity) => <Clip
                    key={clip.id}
                    contentId={contentId}
                    clip={clip}
                    index={clip.order}
                    timelineWidth={width}
                    width={getWidthForTimeline(clip, totalTime)}
                />)}
                {provided.placeholder}
            </TimelineClipList>}
        </Droppable>
    </TimelineContainer>
}
