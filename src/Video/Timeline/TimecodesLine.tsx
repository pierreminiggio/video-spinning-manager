import flex from "../../Style/flex";
import formatTime from "../../Formatter/formatTime";
import styled from "styled-components";

const TimeCode = styled.div`
    padding: 3px 6px;
`

export default function TimecodesLine({totalTime}: {totalTime: number}) {
    return <div style={{
        ...flex,
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#101F7F',
        color: 'white'
    }}>
        <TimeCode>0s</TimeCode>
        <TimeCode>{formatTime(Math.round(totalTime / 2), false)}</TimeCode>
        <TimeCode>{formatTime(Math.round(totalTime), false)}</TimeCode>
    </div>
}