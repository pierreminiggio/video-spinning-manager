import flex from "../../../Style/flex";
import gap from "../../../Style/gap";
import {CSSProperties} from "react";

const buttonLineStyle: CSSProperties = {
    ...flex,
    justifyContent: 'center',
    marginTop: gap / 2,
    gap,
    position: 'absolute',
    width: '100%'
}

const appearingTransition = '.3s linear .3s'
const disappearingTransition = '.3s'

export default function DraggingActionsContainer({
    dragging,
    actions,
    draggingActions
}: {
    dragging: boolean
    actions: JSX.Element
    draggingActions: JSX.Element
}) {
    const appearingStyle: CSSProperties = {
        opacity: dragging ? 1 : 0,
        transition: dragging ? appearingTransition : disappearingTransition
    }
    const disappearingStyle: CSSProperties = {
        opacity: dragging ? 0 : 1,
        transition: dragging ? disappearingTransition : appearingTransition
    }

    return <div style={{position: 'relative', height: 80}}>
        <div style={{...buttonLineStyle, ...disappearingStyle}}>
            {actions}
        </div>
        <div style={{...buttonLineStyle, ...appearingStyle}}>
            {draggingActions}
        </div>
    </div>
}