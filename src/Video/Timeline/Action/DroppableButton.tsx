import styled from "styled-components";

interface DroppableButtonProps {
    backgroundImageUrl: string
}

const DroppableButton = styled.div`
    padding: 8px;
    display: flex;
    background-image: url(${(props: DroppableButtonProps) => props.backgroundImageUrl});
    background-position: center;
    background-repeat: no-repeat;
    min-width: 34px;
    min-height: 34px;
`

export default DroppableButton
