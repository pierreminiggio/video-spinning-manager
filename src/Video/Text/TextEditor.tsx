import {Dispatch, SetStateAction, useState} from 'react'
import {Button} from '@material-ui/core'
import Text from '../../Entity/Text'
import TextTimeline from '../Timeline/Text/TextTimeline'
import flex from '../../Style/flex'
import gap from '../../Style/gap'
import EditButtonClickHandler from './EditButtonClickHandler'
import TextDetailModalForm, { TextDetailAction } from './TextDetailModalForm'
import TextModalForm from './TextModalForm'
import TextPreset from '../../Entity/TextPreset'
import findNextId from '../../Math/findNextId'

interface TextEditorProps {
    texts: Array<Text>
    setTexts: Dispatch<SetStateAction<Text[]>>
    textPresets: Array<TextPreset>
    totalClipTime: number
    videoWidth: number
}

export default function TextEditor({texts, setTexts, textPresets, totalClipTime, videoWidth}: TextEditorProps) {
    const [detailFormOpen, setDetailFormOpen] = useState(false)
    const [editFormOpen, setEditFormOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState<Text|null>(null)

    const handleDetailButtonClick: EditButtonClickHandler = (text: Text): void => {
        openDetailForm(text)
    }

    const handleDetailFormClose = (text: Text|null, action: TextDetailAction|null): void => {
        setDetailFormOpen(false)

        if (! text || ! action) {
            return
        }

        if (action === TextDetailAction.EDIT) {
            openEditForm(text)

            return
        }

        if (action === TextDetailAction.DELETE) {
            handleTextDelete(text)

            return
        }

        console.log('Action not handled')
    }

    const openDetailForm = (text: Text): void => {
        setDetailFormOpen(true)
        setSelectedValue(text)
    }

    const handleEditFormClickOpen = () => {
        openEditForm(null)
    }

    const openEditForm = (text: Text|null): void => {
        setEditFormOpen(true)
        setSelectedValue(text)
    }

    const handleEditFormClose = (text: Text|null): void => {
        setEditFormOpen(false)

        if (text === null) {
            return
        }

        const newTexts = [...texts]

        if (text.id === 0) {
            const newText = {...text}
            newText.id = findNextId(newTexts)
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

            if (text.subtitleId) {
                textToEdit.subtitleId = text.subtitleId
            }
        }

        setTexts(newTexts)
    }

    const handleTextDelete = (text: Text|null): void => {
        if (text === null) {
            return
        }

        const newTexts = [...texts]
        for (const newTextStringIndex in newTexts) {
            const newTextIndex = parseInt(newTextStringIndex)
            const newText = newTexts[newTextIndex]

            if (newText.id === text.id) {
                newTexts.splice(newTextIndex, 1)
                break
            }
        }

        setEditFormOpen(false)
        setTexts(newTexts)
    }

    return <>
        <TextDetailModalForm
            selectedValue={selectedValue}
            open={detailFormOpen}
            onClose={handleDetailFormClose}
        />
        <TextModalForm
            selectedValue={selectedValue}
            textPresets={textPresets}
            totalClipTime={totalClipTime}
            open={editFormOpen}
            onClose={handleEditFormClose}
            onDelete={handleTextDelete}
        />
        <div style={{...flex, justifyContent: 'center', marginTop: gap / 2, marginBottom: gap / 2, width: '100%'}}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleEditFormClickOpen}
                style={{zIndex: 1}}
            >
                Add a text
            </Button>
        </div>
        <TextTimeline
            texts={texts}
            totalTime={totalClipTime}
            width={videoWidth}
            onEditButtonClickHandler={handleDetailButtonClick}
        />
    </>
}
