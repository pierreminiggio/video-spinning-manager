import Clip from '../../Entity/Clip.js';
import {default as CropEntity} from '../../Entity/Video/Clip/Crop/Crop'
import VideoUrl from '../../Struct/VideoUrl.js';
import {default as RemotionClip} from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Clip.js';

export default function getRemotionClipsAndTotalClipTime(
    orderedClips: Array<Clip>,
    fps: number,
    videoUrl: VideoUrl
): {
    remotionClips: Array<RemotionClip>
    totalClipTime: number
} {
    let totalClipTime = 0
    const remotionClips: Array<RemotionClip> = []
    orderedClips.forEach(orderedClip => {
        const startFrame = Math.ceil(orderedClip.start * fps)
        const endFrame = Math.ceil(orderedClip.end * fps)
        const remotionClipMoves: {[key: string]: CropEntity} = {}
        const orderedClipMoves = orderedClip.moves

        if (orderedClipMoves) {
            const timeStrings = Object.keys(orderedClipMoves)
            for (const timeStringKey in timeStrings) {
                const timeString = timeStrings[timeStringKey]
                const frame = (parseFloat(timeString) * fps).toFixed(0)
                const move: CropEntity = orderedClipMoves[timeString]
                remotionClipMoves[frame] = move
            }
        }

        const remotionClip: RemotionClip = {
            video: videoUrl ?? '',
            from: startFrame,
            durationInFrames: endFrame - startFrame,
            moves: remotionClipMoves
        }
        remotionClips.push(remotionClip)
        totalClipTime += orderedClip.end - orderedClip.start
    })

    return {remotionClips, totalClipTime}
}
