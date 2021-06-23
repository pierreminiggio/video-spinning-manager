import {useEffect, useState} from "react";
import RemotionPreview from "./Preview/RemotionPreview";
import VideoDuration from "../Struct/VideoDuration";
import VideoUrl from "../Struct/VideoUrl";
import NullableNumber from "../Struct/NullableNumber";
import Clip from "../Entity/Clip";
import Text from "../Entity/Text";
import {default as RemotionClip} from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Clip.js';
import {default as CropEntity} from '../Entity/Video/Clip/Crop/Crop'
import ClipEditor from './Clip/ClipEditor'
import ClipMakerProps from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/ClipMakerProps.js'
import {default as RemotionText} from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Text.js'
import TextEditor from "./Text/TextEditor";

interface EditorProps {
    contentId: number
    finishedVideoHeight: NullableNumber
    finishedVideoWidth: NullableNumber
    videoDuration: VideoDuration
    videoUrl: VideoUrl
    videoWidth: number
    onEditorUpdate: (output: EditorOutput) => void
}

export interface EditorOutput {
    clips: Array<Clip>
    texts: Array<Text>
    clipMakerProps: ClipMakerProps
}

const areEditorOutputsTheSame = (newOutput: EditorOutput, lastOutput: EditorOutput|null): boolean => {
    if (lastOutput === null) {
        return false
    }

    return JSON.stringify(newOutput) === JSON.stringify(lastOutput)
}

export function Editor({
    contentId,
    finishedVideoHeight,
    finishedVideoWidth,
    videoDuration,
    videoUrl,
    videoWidth,
    onEditorUpdate
}: EditorProps) {
    const [clips, setClips] = useState<Array<Clip>>([])
    const [texts, setTexts] = useState<Array<Text>>([])
    const [lastEditorOutput, setLastEditorOutput] = useState<EditorOutput|null>(null)
    
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

        const remotionClip: RemotionClip = {
            video: videoUrl ?? '',
            from: startFrame,
            durationInFrames: endFrame - startFrame,
            moves: remotionClipMoves
        }
        remotionClips.push(remotionClip)
        totalClipTime += orderedClip.end - orderedClip.start
    })

    const remotionTexts: Array<RemotionText> = []
    texts.forEach((text: Text): void => {
        const startFrame = Math.ceil(text.start * fps)
        const endFrame = Math.ceil(text.end * fps)
        remotionTexts.push({
            content: text.content,
            from: startFrame,
            durationInFrames: endFrame - startFrame,
            height: text.height,
            color: text.color,
            backgroundColor: text.backgroundColor,
            backgroundColorOpacity: text.backgroundColorOpacity,
            leftOffset: text.leftOffset,
            rightOffset: text.rightOffset,
            topOffset: text.topOffset
        })
    })

    const clipMakerProps: ClipMakerProps = {clips: remotionClips, texts: remotionTexts}
    const remotionProps = {props: JSON.stringify(clipMakerProps)}

    const remotionProjectDurationInFrames = Math.ceil(totalClipTime * fps);

    useEffect(() => {
        const newEditorOutput: EditorOutput = {clips, texts, clipMakerProps}

        if (! areEditorOutputsTheSame(newEditorOutput, lastEditorOutput)) {
            onEditorUpdate(newEditorOutput)
            setLastEditorOutput(newEditorOutput)
        }
    }, [clips, texts, remotionProps, clipMakerProps, lastEditorOutput, onEditorUpdate])

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
            {clips.length > 0 ? <TextEditor
                texts={texts}
                setTexts={setTexts}
                totalClipTime={totalClipTime}
                videoWidth={videoWidth}
            /> : ''}
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
