import {Dispatch, SetStateAction, useState} from "react";
import {Button} from "@material-ui/core";
import Text from "../../Entity/Text";
import TextTimeline from "../Timeline/Text/TextTimeline";
import flex from "../../Style/flex";
import gap from "../../Style/gap";
import EditButtonClickHandler from "./EditButtonClickHandler";

interface TextEditorProps {
    texts: Array<Text>
    setTexts: Dispatch<SetStateAction<Text[]>>
    totalClipTime: number
    videoWidth: number
}

export default function TextEditor({texts, setTexts, totalClipTime, videoWidth}: TextEditorProps) {

    const [dragging, setDragging] = useState(false)

    const handleFormClickOpen = () => {
        // TODO open form
    }

    const handleEditButtonClick: EditButtonClickHandler = (text: Text): void => {
        console.log(text)
    }

    return <>
        <div style={{...flex, justifyContent: 'center', marginTop: gap / 2, marginBottom: gap / 2, width: '100%'}}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleFormClickOpen}
                style={{zIndex: 1}}
            >
                Add a text
            </Button>
        </div>
        <TextTimeline
            texts={texts}
            totalTime={totalClipTime}
            width={videoWidth}
            onEditButtonClickHandler={handleEditButtonClick}
        />
    </>
}