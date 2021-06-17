import { Droppable } from 'react-beautiful-dnd'
import Clip from './Clip'
import {default as ClipEntity} from '../../../Entity/Clip'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from "../TimelineContainer";
import TimelineClipList from "../TimelineClipList";

interface TimelineProps {
    contentId: number
    clips: Array<ClipEntity>
    timelineId: string
    totalTime: number
    width: number
}

export default function ClipTimeline(props: TimelineProps) {
    const {contentId, clips, timelineId, totalTime, width} = props
    const hasClips = clips.length > 0

    return <TimelineContainer displayTimeline={hasClips} width={width}>
        {hasClips ? <TimecodesLine totalTime={totalTime} /> : ''}
        <Droppable droppableId={timelineId} direction="horizontal">
            {provided => <TimelineClipList
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
            </TimelineClipList>}
        </Droppable>
    </TimelineContainer>
}