import VideoUrl from "../../Struct/VideoUrl";

export default interface RemotionClip {
    video: VideoUrl,
    from: number,
    durationInFrames: number
}