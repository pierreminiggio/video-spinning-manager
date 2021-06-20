import {default as TextEntity} from '../../../Entity/Text'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from "../TimelineContainer";
import Text from "./Text";
import getWidthForTimeline from "../getWidthForTimeline";

interface TimelineProps {
    texts: Array<TextEntity>
    totalTime: number
    width: number
}

const textHeight = 20
const textGap = 10

export default function TextTimeline(props: TimelineProps) {
    const {texts, totalTime, width} = props
    const hasTexts = texts.length > 0

    let layers = 0
    const checkedTexts: Array<TextEntity> = []
    const textLayers: Array<number> = []

    texts.forEach((text: TextEntity) => {
        layers = 1
        const layer = 1
        textLayers.push(layer)
        checkedTexts.push(text)
    })

    return <TimelineContainer displayTimeline={hasTexts} width={width}>
        {hasTexts ? <TimecodesLine totalTime={totalTime} /> : ''}
        <div
            style={{
                position: 'relative',
                height: 'calc(' + textHeight + 'px + (' + textGap + 'px * ' + (layers + 1) + '))'
            }}
        >
            {texts.map((text: TextEntity, textIndex: number) => <Text
                key={textIndex}
                text={text}
                textHeight={textHeight}
                left={Math.floor(100 * (text.start) / totalTime) + textGap}
                top={(textHeight * (textLayers[textIndex] - 1)) + textGap}
                width={getWidthForTimeline(text, totalTime)}
            />)}
        </div>
    </TimelineContainer>
}
