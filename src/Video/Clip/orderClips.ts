import Clip from '../../Entity/Clip'

export default function orderClips(clips: Array<Clip>): Array<Clip> {
    const orderedClips = [...clips]
    orderedClips.sort((firstClip, secondClip) => {
        const firstClipOrder = firstClip.order
        const secondClipOrder = secondClip.order

        if (firstClipOrder === secondClipOrder) {
            return 0
        }

        return (secondClipOrder - firstClipOrder) > 0 ? -1 : 1
    })

    return orderedClips
}
