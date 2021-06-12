import {useEffect, useState} from "react";
import RemotionPreview from "./Preview/RemotionPreview";
import VideoDuration from "../Struct/VideoDuration";
import VideoUrl from "../Struct/VideoUrl";
import NullableNumber from "../Struct/NullableNumber";
import Clip from "../Entity/Clip";
import RemotionClip from "../Entity/Remotion/RemotionClip";
import {default as CropEntity} from '../Entity/Video/Clip/Crop/Crop'
import ClipEditor from './Clip/ClipEditor'

interface EditorProps {
    contentId: number
    finishedVideoHeight: NullableNumber
    finishedVideoWidth: NullableNumber
    videoDuration: VideoDuration
    videoUrl: VideoUrl
    videoWidth: number
}

export default function Editor(props: EditorProps) {
    const {
        contentId,
        finishedVideoHeight,
        finishedVideoWidth,
        videoDuration,
        videoUrl,
        videoWidth
    } = props
    const [clips, setClips] = useState<Array<Clip>>([])
    
    const orderedClips = [...clips]
    orderedClips.sort((firstClip, secondClip) => {
        const firstClipOrder = firstClip.order
        const secondClipOrder = secondClip.order
        
        if (firstClipOrder === secondClipOrder) {
            return 0
        }
        
        return (secondClipOrder - firstClipOrder) > 0 ? -1 : 1
    })

    let totalClipTime = 0

    const fps = 60
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

        const remotionClip = {
            video: videoUrl,
            from: startFrame,
            durationInFrames: endFrame - startFrame,
            moves: remotionClipMoves
        }
        remotionClips.push(remotionClip)
        totalClipTime += orderedClip.end - orderedClip.start
    })

    const remotionProjectDurationInFrames = Math.ceil(totalClipTime * fps)
    const remotionProps = {props: JSON.stringify({clips: remotionClips})}

    return (
        <div>
            <ClipEditor
                clips={clips}
                setClips={setClips}
                contentId={contentId}
                orderedClips={orderedClips}
                finishedVideoHeight={finishedVideoHeight ?? 0}
                finishedVideoWidth={finishedVideoWidth ?? 0}
                totalClipTime={totalClipTime}
                videoDuration={videoDuration}
                videoWidth={videoWidth}
            />
            {totalClipTime > 0 ? <RemotionPreview
                compositionHeight={finishedVideoHeight ?? 0}
                compositionWidth={finishedVideoWidth ?? 0}
                durationInFrames={remotionProjectDurationInFrames}
                fps={fps}
                remotionProps={remotionProps}
                width={videoWidth}
            /> : ''}
        </div>
    );
}
