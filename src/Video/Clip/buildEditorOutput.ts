import Clip from '../../Entity/Clip';
import Text from '../../Entity/Text';
import VideoUrl from '../../Struct/VideoUrl';
import { EditorOutput } from '../Editor';
import getClipMakerProps from './getClipMakerProps';
import getEditorOutput from './getEditorOutput';
import getRemotionClipsAndTotalClipTime from './getRemotionClipsAndTotalClipTime';
import getRemotionTexts from './getRemotionTexts';
import orderClips from './orderClips';

export default function buildEditorOutput (
    clips: Array<Clip>,
    texts: Array<Text>,
    fps: number,
    videoUrl: VideoUrl
): EditorOutput {
    const orderedClips = orderClips(clips)

    const {remotionClips} = getRemotionClipsAndTotalClipTime(orderedClips, fps, videoUrl)

    const remotionTexts = getRemotionTexts(texts, fps)

    const clipMakerProps = getClipMakerProps(remotionClips, remotionTexts)

    return getEditorOutput(clips, texts, clipMakerProps)
}
