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
        let newText = {...text}
        newText = updateTextAndSizeAndPosition(newText, newText.content.substring(0, splitMarker.textCharIndex).trim())
        newText.end = newText.start + splitMarker.time
        newTexts.push(newText)

        if (Number(splitMarkerIndex) === splitMarkers.length - 1) {
            let newText = {...text}
            newText = updateTextAndSizeAndPosition(newText, newText.content.substring(splitMarker.textCharIndex).trim())
            newText.start = newText.start + splitMarker.time
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
