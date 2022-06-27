import Clip from '../../Entity/Clip.js';
import Text from '../../Entity/Text.js';
import ClipMakerProps from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/ClipMakerProps.js'
import { EditorOutput } from '../Editor.js';

export default function getEditorOutput(clips: Clip[], texts: Text[], clipMakerProps: ClipMakerProps): EditorOutput {
    return {clips, texts, clipMakerProps}
}
