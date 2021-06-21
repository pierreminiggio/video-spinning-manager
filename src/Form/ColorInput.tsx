import {TextField} from '@material-ui/core'

interface ColorInputProps {
    label: string
    value: string
    onChange: (newValue: string) => void
}

export default function ColorInput({label, value, onChange}: ColorInputProps) {
    return <div>
        <TextField
            label={label}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{width: '50%'}}
        />
        <TextField
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            inputProps={{style: {height: 45, width: '100%'}}}
            style={{width: '50%'}}
        />
    </div>
}