import Text from '../../Entity/Text';
import {default as RemotionText} from '../../../node_modules/@pierreminiggio/spinning-manager-clip-maker/dist/Entity/Text.js'

export default function getRemotionTexts(texts: Text[], fps: number): Array<RemotionText> {
    const remotionTexts: Array<RemotionText> = []
    texts.forEach((text: Text): void => {
        const startFrame = Math.ceil(text.start * fps)
        const endFrame = Math.ceil(text.end * fps)
        remotionTexts.push({
            content: text.content,
            from: startFrame,
            durationInFrames: endFrame - startFrame,
            height: text.height,
            color: text.color,
            backgroundColor: text.backgroundColor,
            backgroundColorOpacity: text.backgroundColorOpacity,
            leftOffset: text.leftOffset,
            rightOffset: text.rightOffset,
            topOffset: text.topOffset
        })
    })

    return remotionTexts
}
