import {default as TextEntity} from '../../../Entity/Text'
import {CSSProperties} from "react";
import Edit from '../../../Resources/Svg/Edit.svg'

interface TextProps {
    text: TextEntity
    textGap: number
    textHeight: number
    layer: number
    left: number
    width: number
}

const textContentStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer'
}

const textPadding = 5
const editButtonSize = 34

export default function Text({text, textGap, textHeight, layer, left, width}: TextProps) {
    const color = text.color
    const backgroundColor = text.backgroundColor
    const opacity = text.backgroundColorOpacity

    return <div
        style={{
            position: 'absolute',
            height: textHeight,
            left: left + '%',
            top: textHeight * (layer - 1),
            width: width + '%',
            padding: textGap,
            boxSizing: 'border-box'
        }}
    >
        <div style={{
            position: 'relative',
            width: 'calc(100% - ' + editButtonSize + 'px)',
            height: '100%',
            boxSizing: 'border-box',
            display: 'inline-block'
        }}>
            <div style={{
                ...textContentStyle,
                backgroundColor,
                opacity
            }}/>
            <div style={{
                ...textContentStyle,
                color,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: (textHeight - textGap * 2) - textPadding * 2 + 'px',
                padding: textPadding,
                lineHeight: 1
            }}>{text.content}</div>
        </div>
        <div style={{
            position: 'relative',
            width: editButtonSize,
            height: '100%',
            boxSizing: 'border-box',
            display: 'inline-block'
        }}>
            <div style={{
                ...textContentStyle,
                backgroundColor,
                opacity,
            }}>
                <img src={Edit} alt="edit text " />
            </div>
        </div>
    </div>
}