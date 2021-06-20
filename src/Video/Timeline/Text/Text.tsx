import {default as TextEntity} from '../../../Entity/Text'

interface TextProps {
    text: TextEntity
    width: number
}

export default function Text({text, width}: TextProps) {
    const color = text.color
    const backgroundColor = text.backgroundColor
    const backgroundColorOpacity = text.backgroundColorOpacity
    console.log(backgroundColor)

    return <div style={{
        width,
        color,
        backgroundColor
    }}>
        {text.content}
    </div>
}