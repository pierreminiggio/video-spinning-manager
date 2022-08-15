import Text from '../../Entity/Text'

export interface SplitMarker {
    textCharIndex: number
    time: number
}

export default function splitText(text: Text, splitMarkers: SplitMarker[]): Text[] {
    return []
}
