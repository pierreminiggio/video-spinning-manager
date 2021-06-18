import edit from '../../../Resources/Svg/Edit.svg'
import DroppableButtonContainer from "../DroppableButtonContainer";

export default function EditButton({droppableId}: {droppableId: string}) {
    return <DroppableButtonContainer
        backgroundColor={'#3F51B5'}
        backgroundImageUrl={edit}
        droppableId={droppableId}
    />
}