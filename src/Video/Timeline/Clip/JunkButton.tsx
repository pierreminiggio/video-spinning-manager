import trash from '../../../Resources/Svg/Trash.svg'
import DroppableButtonContainer from "../DroppableButtonContainer";

export default function JunkButton({droppableId}: {droppableId: string}) {
    return <DroppableButtonContainer
        backgroundColor={'red'}
        backgroundImageUrl={trash}
        droppableId={droppableId}
    />
}