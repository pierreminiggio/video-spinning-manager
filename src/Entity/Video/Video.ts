import VideoGeneralInfos from "./VideoGeneralInfos";
import EditorState from "./EditorState";
import SocialMediaAccounts from "../Account/SocialMediaAccounts";

export default interface Video {
    video: VideoGeneralInfos
    downloaded: boolean
    hasRenderedPreview: boolean
    editorState: EditorState
    spinnedAccountSocialMediasAccounts: SocialMediaAccounts
    planifiedToBePostedOnAccounts: number[]
}
