import Draggable, {DraggableEvent} from 'react-draggable';
import {useEffect} from "react";

interface DraggableSelectionProps {
    draggableWidth: number
    onSelectionChange: (newSelection: number) => void
}

function DraggableSelection(props: DraggableSelectionProps) {
    const { draggableWidth, onSelectionChange } = props
    const backgroundUrl = 'https://api.spinner.ggio.fr/thumbnail/115?s=10'

    useEffect(() => {
        const img = new Image();
        img.src = backgroundUrl;
        img.onload = function(e: any) {
            console.log(e.target.naturalWidth, e.target.naturalHeight);
        }
    }, [backgroundUrl])

    const handleStop = (e: DraggableEvent) => {
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
        onSelectionChange(100 * offset / containerWidth)
    }

    return (
        <div
            style={{
                width: '100%',
                height: draggableWidth * 9 / 16,
                position: 'relative',
                background: 'url(' + backgroundUrl + ')',
                backgroundSize: 'cover'
            }}
        >
            <Draggable
                axis="x"
                defaultPosition={{x: 0, y: 0}}
                bounds="parent"
                scale={1}
                onStop={handleStop}
            >
                <div style={{backgroundColor: 'red', width: 50, height: '100%'}}>Yeay it works !!!</div>
            </Draggable>
        </div>
    );
}

export default DraggableSelection