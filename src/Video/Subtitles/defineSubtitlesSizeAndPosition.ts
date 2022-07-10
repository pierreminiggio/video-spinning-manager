import Positionable from '../../Entity/Positionable'

export default function defineSubtitlesSizeAndPosition(content: string): Positionable
{
    return {
        height: 3,
        leftOffset: 3,
        rightOffset: 3,
        topOffset: 0
    }
}
