import {default as TextEntity} from '../../../Entity/Text'
import {CSSProperties} from "react";
import Edit from '../../../Resources/Svg/Edit.svg'
import EditButtonClickHandler from "../../Text/EditButtonClickHandler";

interface TextProps {
    text: TextEntity
    textGap: number
    textHeight: number
    layer: number
    left: number
    width: number
    onEditButtonClickHandler: EditButtonClickHandler
}

const textContentStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer'
}

const textPadding = 5
const editButtonPadding = 3

export default function Text({text, textGap, textHeight, layer, left, width, onEditButtonClickHandler}: TextProps) {
    const color = text.color
    const backgroundColor = text.backgroundColor
    const opacity = text.backgroundColorOpacity
    const editButtonWidth = textHeight - textPadding * 2
    const editButtonHeight = editButtonWidth

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
        onClick={event => onEditButtonClickHandler(text)}
    >
        <div style={{
            position: 'relative',
            width: 'calc(100% - ' + editButtonWidth + 'px)',
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
            width: editButtonWidth,
            height: '100%',
            boxSizing: 'border-box',
            display: 'inline-block'
        }}>
            <div style={{
                ...textContentStyle,
                backgroundColor,
                opacity,
            }} />
            <div style={{
                ...textContentStyle,
                backgroundImage: 'url(' + Edit + ')',
                backgroundSize: (
                    editButtonWidth - editButtonPadding * 2
                ) + 'px ' + (
                    editButtonHeight - editButtonPadding * 2
                ) + 'px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }} />
        </div>
    </div>
}