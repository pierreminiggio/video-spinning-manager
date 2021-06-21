import {Dispatch, SetStateAction, useState} from "react";
import {Button} from "@material-ui/core";
import Text from "../../Entity/Text";
import TextTimeline from "../Timeline/Text/TextTimeline";
import flex from "../../Style/flex";
import gap from "../../Style/gap";
import EditButtonClickHandler from "./EditButtonClickHandler";
import TextModalForm from "./TextModalForm";
import VideoDuration from "../../Struct/VideoDuration";
import findMaxId from "../../Math/findMaxId";

interface TextEditorProps {
    texts: Array<Text>
    setTexts: Dispatch<SetStateAction<Text[]>>
    totalClipTime: number
    videoWidth: number
}

export default function TextEditor({texts, setTexts, totalClipTime, videoWidth}: TextEditorProps) {

    const [editFormOpen, setEditFormOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState<Text|null>(null)

    const handleFormClickOpen = () => {
        openEditForm(null)
    }

    const handleEditButtonClick: EditButtonClickHandler = (text: Text): void => {
        openEditForm(text)
    }

    const openEditForm = (text: Text|null): void => {
        setEditFormOpen(true)
        setSelectedValue(text)
    }

    const handleFormClose = (text: Text|null): void => {
        setEditFormOpen(false)

        if (text === null) {
            return
        }

        const newTexts = [...texts]

        if (text.id === 0) {
            const newText = {...text}
            const maxId = findMaxId(newTexts)
            newText.id = maxId + 1
            newTexts.push(newText)
        } else {
            const textToEdit = newTexts.filter((newText: Text) => newText.id === text.id)[0]
            textToEdit.content = text.content
            textToEdit.start = text.start
            textToEdit.end = text.end
            textToEdit.height = text.height
            textToEdit.color = text.color
            textToEdit.backgroundColor = text.backgroundColor
            textToEdit.backgroundColorOpacity = text.backgroundColorOpacity
            textToEdit.leftOffset = text.leftOffset
            textToEdit.rightOffset = text.rightOffset
            textToEdit.topOffset = text.topOffset
        }

        setTexts(newTexts)
    }

    return <>
        <TextModalForm
            selectedValue={selectedValue}
            totalClipTime={totalClipTime}
            open={editFormOpen}
            onClose={handleFormClose}
        />
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