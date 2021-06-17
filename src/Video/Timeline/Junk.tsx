import trash from '../../Resources/Svg/Trash.svg'
import DroppableButtonContainer from "./DroppableButtonContainer";

export default function Junk({junkId}: {junkId: string}) {
    return <DroppableButtonContainer
        backgroundColor={'red'}
        backgroundImageUrl={trash}
        droppableId={junkId}
    />
}