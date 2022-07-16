import {CSSProperties, MouseEvent, ReactElement} from 'react'
import {Button} from '@material-ui/core'
import CropFunction from '../../../Struct/CropFunction'
import {ReactComponent as Crop} from '../../../Resources/Svg/Crop.svg'
import {ReactComponent as Trash} from '../../../Resources/Svg/Trash.svg'

export default function ActionContainer(props: {
    children: ReactElement,
    index: number
    indexes: number[]
    onCrop: CropFunction
    onDelete: CropFunction
}) {
    const {children, index, indexes, onCrop, onDelete} = props

    const childrenLeft = children.props.style.left

    const svgSize = 20
    const padding = 10
    const left = 'calc(' + childrenLeft + ' - ' + (svgSize / 2 + padding).toString() + 'px)'

    const handleCropClick = (e: MouseEvent<HTMLButtonElement>) => {
        preventDefault(e)
        onCrop(index)
    }

    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        preventDefault(e)
        onDelete(index)
    }

    const preventDefault = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const buttonStyle: CSSProperties = {
        padding: padding,
        minWidth: 'auto',
        display: 'block'
    }

    return <div
        style={{position: 'absolute', left}}
    >
        <Button
            style={buttonStyle}
            onClick={handleCropClick}
            onMouseDown={preventDefault}
        >
            <Crop fill="#3F51B5" width={svgSize} height={svgSize}/>
        </Button>
        {indexes.length > 1 ? <Button
            style={buttonStyle}
            onClick={handleDeleteClick}
            onMouseDown={preventDefault}
        >
            <Trash fill="#FF0000" width={svgSize} height={svgSize}/>
        </Button> : ''}
    </div>
}