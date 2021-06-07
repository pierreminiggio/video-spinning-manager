import { Player } from '@remotion/player'
import { ClipMaker } from '@pierreminiggio/spinning-manager-clip-maker/dist/ClipMaker.js';
import RemotionProps from "../../Entity/Remotion/RemotionProps";

interface RemotionPreviewProps {
    compositionWidth: number
    compositionHeight: number
    durationInFrames: number
    fps: number
    remotionProps: RemotionProps
    width: number
}

export default function RemotionPreview(props: RemotionPreviewProps) {
    const { compositionWidth, compositionHeight, durationInFrames, fps, remotionProps, width } = props

    return <Player
        component={ClipMaker}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        loop={false}
        autoPlay={false}
        controls={true}
        inputProps={remotionProps}
        style={{border: '1px #EEE solid', width}}
    />
}