import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import crop from '../../Resources/Svg/Crop.svg'

const Container = styled.div`
    border: 1px solid #3F51B5;
    border-radius: 2px;
    background-color: #3F51B5;
`

interface CropListProps {
    crop: string
}

const CropList = styled.div`
    padding: 8px;
    display: flex;
    background-image: url(${(props: CropListProps) => props.crop});
    background-position: center;
    background-repeat: no-repeat;
    min-width: 34px;
    min-height: 34px;
`

interface CropProps {
    cropId: string
}

export default function Crop(props: CropProps) {
    const {cropId} = props
    return <Container>
        <Droppable droppableId={cropId} direction="horizontal">
            {provided => <CropList
                ref={provided.innerRef}
                {...provided.droppableProps}
                crop={crop}
            >
                {provided.placeholder}
            </CropList>}
        </Droppable>
    </Container>
}