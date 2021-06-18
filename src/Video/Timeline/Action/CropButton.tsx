import crop from '../../../Resources/Svg/Crop.svg'
import DroppableButtonContainer from "./DroppableButtonContainer";

export default function CropButton({droppableId}: {droppableId: string}) {
    return <DroppableButtonContainer
        backgroundColor={'#3F51B5'}
        backgroundImageUrl={crop}
        droppableId={droppableId}
    />
}
