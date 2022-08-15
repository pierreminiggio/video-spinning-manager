import Text from '../../Entity/Text'
import defineSubtitlesSizeAndPosition from '../Subtitles/defineSubtitlesSizeAndPosition'

export interface SplitMarker {
    textCharIndex: number
    time: number
}

export default function splitText(text: Text, splitMarkers: SplitMarker[]): Text[] {
    const newTexts: Text[] = []
    for (const splitMarkerIndex in splitMarkers) {
        const splitMarker = splitMarkers[splitMarkerIndex]
        const newText = {...text}
        newText.end = splitMarker.time
        updateTextAndSizeAndPosition(newText, newText.content.substring(0, splitMarker.textCharIndex).trim())
        newTexts.push(newText)

        if (Number(splitMarkerIndex) === splitMarkers.length - 1) {
            const newText = {...text}
            newText.start = splitMarker.time
            updateTextAndSizeAndPosition(newText, newText.content.substring(splitMarker.textCharIndex).trim())
            newTexts.push(newText)
        }
    }

    return newTexts
}

function updateTextAndSizeAndPosition(text: Text, newContent: string): Text
{
    text.content = newContent
    const {height, leftOffset, rightOffset} = defineSubtitlesSizeAndPosition(newContent)
    text.height = height
    text.leftOffset = leftOffset
    text.rightOffset = rightOffset

    return text
}
