import {default as TextEntity} from '../../../Entity/Text'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from "../TimelineContainer";
import TimelineClipList from "../TimelineClipList";
import Text from "./Text";
import getWidthForTimeline from "../getWidthForTimeline";

interface TimelineProps {
    texts: Array<TextEntity>
    totalTime: number
    width: number
}

export default function TextTimeline(props: TimelineProps) {
    const {texts, totalTime, width} = props
    const hasTexts = texts.length > 0

    return <TimelineContainer displayTimeline={hasTexts} width={width}>
        {hasTexts ? <TimecodesLine totalTime={totalTime} /> : ''}
        <TimelineClipList
        >
            {texts.map((text: TextEntity, textIndex: number) => <Text
                key={textIndex}
                text={text}
                width={getWidthForTimeline(text, totalTime)}
            />)}
        </TimelineClipList>
    </TimelineContainer>
}