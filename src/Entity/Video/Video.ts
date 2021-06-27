import VideoGeneralInfos from "./VideoGeneralInfos";
import EditorState from "./EditorState";

export default interface Video {
    video: VideoGeneralInfos
    downloaded: boolean
    hasRenderedPreview: boolean
    editorState: EditorState
}
