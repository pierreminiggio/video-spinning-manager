import {default as RemotionClip} from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Clip.js';
import {default as RemotionText} from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Text.js'
import ClipMakerProps from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/ClipMakerProps.js'

export default function getClipMakerProps(remotionClips: Array<RemotionClip>, remotionTexts: Array<RemotionText>): ClipMakerProps {
    return {clips: remotionClips, texts: remotionTexts}
}
