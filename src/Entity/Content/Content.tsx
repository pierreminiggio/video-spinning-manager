import VideoGeneralInfos from "../Video/VideoGeneralInfos";
import ContentGeneralInfos from "./ContentGeneralInfos";

export default interface Content {
    content: ContentGeneralInfos
    videos: Array<VideoGeneralInfos>
}
