import styled from "styled-components";

interface TimelineContainerProps {
    displayTimeline: boolean
    width: number
}

const TimelineContainer = styled.div`${(props: TimelineContainerProps) => props.displayTimeline ? `
    margin: 8px;
    border: 1px #303F9F solid;
    border-radius: 2px;
    background-color: #303F9F;
` : ``}
    width: ${props => props.width}px;
`

export default TimelineContainer
