import Draggable, {DraggableEvent} from 'react-draggable';
import {CSSProperties, useEffect, useState} from "react";

interface DraggableSelectionProps {
    backgroundUrl: string
    draggableWidth: number
    finishedVideoHeight: number
    finishedVideoWidth: number
    onSelectionChange: (newSelection: number) => void
}

const coveredThumbnailStyle: CSSProperties ={
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)'
}

function DraggableSelection(props: DraggableSelectionProps) {
    const { backgroundUrl, draggableWidth, finishedVideoHeight, finishedVideoWidth, onSelectionChange } = props
    const [offset, setOffset] = useState<number>(0)
    const draggableHeight = draggableWidth * 9 / 16
    const selectionWidth = draggableHeight / (finishedVideoHeight / finishedVideoWidth)
    console.log(offset)

    useEffect(() => {
        const img = new Image();
        img.src = backgroundUrl;
        img.onload = function(e: any) {
            console.log(e.target.naturalWidth, e.target.naturalHeight);
        }
    }, [backgroundUrl])

    const handleDrag = (e: DraggableEvent) => {
        const target = e.target as HTMLDivElement

        if (target === null) {
            return
        }

        const container = target.parentNode as HTMLDivElement
        const containerWidth = container.offsetWidth
        const style = target.getAttribute('style')

        if (style === null) {
            return
        }

        const offset = parseFloat(
            style.split('transform: translate(', 2)[1].split('px', 2)[0]
        )
        const newOffset = 100 * offset / containerWidth
        setOffset(newOffset)
    }

    useEffect(() => onSelectionChange(offset), [offset])

    const offsetLength = offset / 100 * draggableWidth

    return (
        <div
            style={{
                width: '100%',
                height: draggableHeight,
                position: 'relative',
                background: 'url(' + backgroundUrl + ')',
                backgroundSize: 'cover'
            }}
        >
            <div
                style={{
                    ...coveredThumbnailStyle,
                    width: offsetLength,
                }}
            />
            <div
                style={{
                    ...coveredThumbnailStyle,
                    width: draggableWidth - (offsetLength + selectionWidth),
                    right: 0
                }}
            />
            <Draggable
                axis="x"
                defaultPosition={{x: 0, y: 0}}
                bounds="parent"
                scale={1}
                onDrag={handleDrag}
            >
                <div
                    style={{
                        border: '3px dashed grey',
                        width: selectionWidth,
                        height: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'none'
                    }}
                />
            </Draggable>
        </div>
    );
}

export default DraggableSelection