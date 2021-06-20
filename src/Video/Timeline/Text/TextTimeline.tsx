import {default as TextEntity} from '../../../Entity/Text'
import TimecodesLine from '../TimecodesLine'
import TimelineContainer from "../TimelineContainer";
import Text from "./Text";
import getWidthForTimeline from "../getWidthForTimeline";
import findColliders from "./findColliders";

interface TimelineProps {
    texts: Array<TextEntity>
    totalTime: number
    width: number
}

const textHeight = 30
const textGap = 5

export default function TextTimeline(props: TimelineProps) {
    const {texts, totalTime, width} = props
    const hasTexts = texts.length > 0

    let layers = 1
    const checkedTexts: Array<TextEntity> = []
    const textLayers: Array<number> = []

    texts.forEach((text: TextEntity) => {
        let layer = 1

        const colliderIndexes = findColliders(text, checkedTexts)

        if (colliderIndexes.length > 0) {
            const unavailableLayers = textLayers.filter(
                (layerValue: number, layerIndex: number): boolean => colliderIndexes.includes(layerIndex)
            )

            if (unavailableLayers[unavailableLayers.length - 1] === layers) {
                layers += 1
                layer = layers
            }
        }

        textLayers.push(layer)
        checkedTexts.push(text)
    })

    return <TimelineContainer displayTimeline={hasTexts} width={width}>
        {hasTexts ? <TimecodesLine totalTime={totalTime} /> : ''}
        <div
            style={{
                position: 'relative',
                height: textHeight * layers + textGap
            }}
        >
            {texts.map((text: TextEntity, textIndex: number) => <Text
                key={textIndex}
                text={text}
                textGap={textGap}
                textHeight={textHeight}
                layer={textLayers[textIndex]}
                left={Math.floor(100 * (text.start) / totalTime)}
                width={getWidthForTimeline(text, totalTime)}
            />)}
        </div>
    </TimelineContainer>
}
