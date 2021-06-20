import { Droppable } from 'react-beautiful-dnd'
import {default as TextEntity} from '../../../Entity/Text'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from "../TimelineContainer";
import TimelineClipList from "../TimelineClipList";

interface TimelineProps {
    texts: Array<TextEntity>
    timelineId: string
    totalTime: number
    width: number
}

export default function TextTimeline(props: TimelineProps) {
    const {texts, timelineId, totalTime, width} = props
    const hasTexts = texts.length > 0

    return <TimelineContainer displayTimeline={hasTexts} width={width}>
        {hasTexts ? <TimecodesLine totalTime={totalTime} /> : ''}
        <Droppable droppableId={timelineId} direction="horizontal">
            {provided => <TimelineClipList
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {texts.map((text, textIndex) => <div
                    key={textIndex}
                >
                    {text.content}
                </div>)}
                {provided.placeholder}
            </TimelineClipList>}
        </Droppable>
    </TimelineContainer>
}