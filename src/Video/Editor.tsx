import {useEffect, useMemo, useState} from 'react';
import RemotionPreview from './Preview/RemotionPreview';
import VideoDuration from '../Struct/VideoDuration';
import VideoUrl from '../Struct/VideoUrl';
import NullableNumber from '../Struct/NullableNumber';
import Clip from '../Entity/Clip';
import Text from '../Entity/Text';
import {default as RemotionClip} from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Clip.js';
import ClipEditor from './Clip/ClipEditor'
import ClipMakerProps from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/ClipMakerProps.js'
import {default as RemotionText} from '../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Text.js'
import TextEditor from './Text/TextEditor';
import TextPreset from '../Entity/TextPreset';
import orderClips from './Clip/orderClips';
import getRemotionClipsAndTotalClipTime from './Clip/getRemotionClipsAndTotalClipTime';
import getRemotionTexts from './Clip/getRemotionTexts';
import getClipMakerProps from './Clip/getClipMakerProps';
import getEditorOutput from './Clip/getEditorOutput';

interface EditorProps {
    contentId: number
    defaultClips?: Array<Clip>
    defaultTexts?: Array<Text>
    finishedVideoHeight: NullableNumber
    finishedVideoWidth: NullableNumber
    fps: number
    textPresets: Array<TextPreset>
    videoDuration: VideoDuration
    videoUrl: VideoUrl
    videoWidth: number
    onEditorUpdate: (output: EditorOutput) => void
    previewOnly: boolean
}

export interface EditorOutput {
    clips: Array<Clip>
    texts: Array<Text>
    clipMakerProps: ClipMakerProps
}

const areObjectsTheSame = (output1: Object, output2: Object): boolean => JSON.stringify(output1) === JSON.stringify(output2)

export function Editor({
    contentId,
    defaultClips = [],
    defaultTexts = [],
    finishedVideoHeight,
    finishedVideoWidth,
    fps,
    textPresets,
    videoDuration,
    videoUrl,
    videoWidth,
    onEditorUpdate,
    previewOnly
}: EditorProps) {
    const [clips, setClips] = useState<Array<Clip>>([])
    const [texts, setTexts] = useState<Array<Text>>([])
    const [lastEditorOutput, setLastEditorOutput] = useState<EditorOutput|null>(null)
    
    useEffect(() => {
        setClips(defaultClips)
        setLastEditorOutput(null)
    }, [defaultClips, defaultTexts])
    
    useEffect(() => {
        setTexts(defaultTexts)
        setLastEditorOutput(null)
    }, [defaultTexts])

    const orderedClips = useMemo<Array<Clip>>(
        (): Array<Clip> => orderClips(clips),
        [clips]
    )

    const {remotionClips, totalClipTime} = useMemo<{
        remotionClips: Array<RemotionClip>
        totalClipTime: number
    }>(
        () => getRemotionClipsAndTotalClipTime(orderedClips, fps, videoUrl),
        [orderedClips, fps, videoUrl]
    )

    const remotionTexts = useMemo<Array<RemotionText>>(
        (): Array<RemotionText> => getRemotionTexts(texts, fps),
        [texts, fps]
    )

    const clipMakerProps = useMemo<ClipMakerProps>(
        (): ClipMakerProps => getClipMakerProps(remotionClips, remotionTexts),
        [remotionClips, remotionTexts]
    )

    const remotionProps = useMemo<{props: string}>(
        (): {props: string} => ({props: JSON.stringify(clipMakerProps)}),
        [clipMakerProps]
    )

    const remotionProjectDurationInFrames = Math.ceil(totalClipTime * fps);

    const newEditorOutput = useMemo<EditorOutput>((): EditorOutput => getEditorOutput(clips, texts, clipMakerProps) , [clips, texts, clipMakerProps])

    useEffect(() => {
        if (lastEditorOutput === null) {

            if (
                ! areObjectsTheSame(newEditorOutput.clips, defaultClips)
                || ! areObjectsTheSame(newEditorOutput.texts, defaultTexts)
            ) {
                return
            }

            setLastEditorOutput(newEditorOutput)
            
            return
        }

        if (! areObjectsTheSame(newEditorOutput, lastEditorOutput)) {
            onEditorUpdate(newEditorOutput)
            setLastEditorOutput(newEditorOutput)
        }
    }, [newEditorOutput, remotionProps, lastEditorOutput, onEditorUpdate, defaultClips, defaultTexts])

    return (
        <div>
            {previewOnly === false ? <>
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
                    textPresets={textPresets}
                    totalClipTime={totalClipTime}
                    videoWidth={videoWidth}
                /> : ''}
            </> : '' }
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
