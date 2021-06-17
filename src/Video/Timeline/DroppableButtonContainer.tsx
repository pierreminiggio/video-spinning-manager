import styled from "styled-components";
import {Droppable} from "react-beautiful-dnd";
import DroppableButton from "./DroppableButton";

interface ContainerProps {
    backgroundColor: string
}

const Container = styled.div`
    border: 1px solid ${(props: ContainerProps) => props.backgroundColor};
    border-radius: 2px;
    background-color: ${(props: ContainerProps) => props.backgroundColor};
`

interface DroppableButtonContainerProps {
    backgroundColor: string
    backgroundImageUrl: string
    droppableId: string
}

export default function DroppableButtonContainer({
    backgroundColor,
    backgroundImageUrl,
    droppableId
}: DroppableButtonContainerProps) {
    return <Container backgroundColor={backgroundColor}>
        <Droppable droppableId={droppableId} direction="horizontal">
            {provided => <DroppableButton
                ref={provided.innerRef}
                {...provided.droppableProps}
                backgroundImageUrl={backgroundImageUrl}
            >
                {provided.placeholder}
            </DroppableButton>}
        </Droppable>
    </Container>
}