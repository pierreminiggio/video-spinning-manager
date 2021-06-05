import { Player } from '@remotion/player'
import { ClipMaker } from '@pierreminiggio/spinning-manager-clip-maker/dist/ClipMaker.js';

export default function RemotionPreview(props) {
    const { compositionWidth, compositionHeight, durationInFrames, fps, remotionProps } = props

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
        style={{border: '1px #EEE solid'}}
    />
}