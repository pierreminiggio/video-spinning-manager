import Positionable from '../../Entity/Positionable'

export default function defineSubtitlesSizeAndPosition(content: string): Positionable
{
    const contentLength = content.length

    const minSizeMarker = 60
    const contentLengthMinRatio = Math.min(contentLength / minSizeMarker, 1)

    const height = 5 - 2 * contentLengthMinRatio

    return {
        height: height,
        leftOffset: 3,
        rightOffset: 3,
        topOffset: 0
    }
}
