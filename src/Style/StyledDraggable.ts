import styled from 'styled-components'

export interface StyledDraggableProps {
    isDragging: boolean
}

const StyledDraggable = styled.div`
    border: 1px lightgrey solid;
    border-radius: 2px;
    padding: 8px 0;
    background-color: #EEE;
    box-sizing: border-box;
    ${(props: StyledDraggableProps) => props.isDragging ? `
        box-shadow: 0px 0px 0px 6px rgba(255, 255, 0, .7);
    ` : ``}
`

export default StyledDraggable
