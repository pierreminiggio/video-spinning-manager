import {default as TextEntity} from '../../../Entity/Text'
import {CSSProperties} from "react";

interface TextProps {
    text: TextEntity
    textHeight: number
    left: number
    top: number
    width: number
}

const textContentStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%'
}

export default function Text({text, textHeight, left, top, width}: TextProps) {
    const color = text.color
    const backgroundColor = text.backgroundColor
    const opacity = text.backgroundColorOpacity

    return <div style={{
        position: 'absolute',
        height: textHeight,
        left,
        top,
        width
    }}>
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%'
        }}>
            <div style={{...textContentStyle, backgroundColor, opacity}}/>
            <div style={{...textContentStyle, color, textAlign: 'center'}}>{text.content}</div>
        </div>

    </div>
}