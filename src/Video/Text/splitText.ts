import Text from '../../Entity/Text'

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
        newText.content = newText.content.substring(0, splitMarker.textCharIndex).trim()
        newTexts.push(newText)

        if (Number(splitMarkerIndex) === splitMarkers.length - 1) {
            const newText = {...text}
            newText.start = splitMarker.time
            newText.content = newText.content.substring(splitMarker.textCharIndex).trim()
            newTexts.push(newText)
        }
    }

    return newTexts
}
