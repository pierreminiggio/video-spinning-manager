import {default as TextEntity} from '../../../Entity/Text'
import {CSSProperties} from "react";

interface TextProps {
    text: TextEntity
    width: number
}

const textContentStyle: CSSProperties = {
    position: "absolute",
    width: '100%',
    height: '100%'
}

export default function Text({text, width}: TextProps) {
    const color = text.color
    const backgroundColor = text.backgroundColor
    const opacity = text.backgroundColorOpacity
    console.log(backgroundColor)

    return <div style={{
        height: '1.3rem',
        width,
        position: 'relative'
    }}>
        <div style={{...textContentStyle, backgroundColor, opacity}}/>
        <div style={{...textContentStyle, color, textAlign: 'center'}}>{text.content}</div>
    </div>
}