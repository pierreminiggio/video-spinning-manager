import { History } from "history";
import {MouseEvent, useState} from 'react';
import { useParams } from 'react-router';
import { Button, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import flexColumn from '../Style/flexColumn';
import Token from "../Struct/Token";
import NullableString from "../Struct/NullableString";

interface NewFormProps {
    history: History
    token: Token
}

interface NewFormParams {
    id: string|undefined
}

export default function NewForm(props: NewFormProps) {
    const history = props.history
    const location = history?.location
    // @ts-ignore
    const token = props.token || location?.token
    const {id} = useParams<NewFormParams>()
    const videoId = id ? parseInt(id) : 0
    const [name, setName] = useState('')
    const [width, setWidth] = useState(1080)
    const [height, setHeight] = useState(1920)
    const [error, setError] = useState<NullableString>(null)
  
    const submitForm = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (! name) {
            setError('Please pick a name')

            return
        }

        setError(null)

        fetch(
            process.env.REACT_APP_SPINNER_API_URL + '/content/' + videoId,
            {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({name, width, height})
            }
        ).then(response => {
            if (response.status !== 200) {
                return
            }

            response.json().then(jsonResponse => {

                if (! jsonResponse['id']) {
                    return
                }

                // @ts-ignore
                history.push({
                    pathname: '/content/' + videoId + '/video/' + jsonResponse.id,
                    token
                })
            })
        }).catch(error => {
            // error
        });
    }

    const goBack = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        // @ts-ignore
        history.push({
            pathname: '/content/' + videoId,
            token
        })
    }

    return (
        <div style={flexColumn}>
            {error ? (
                <Alert variant="filled" severity="error">{error}</Alert>
            ) : ''}
            <TextField
                label="Name"
                value={name}
                onChange={e => {setName(e.target.value)}}
            />
            <TextField
                label="Width"
                type="number"
                value={width}
                onChange={e => {setWidth(parseInt(e.target.value))}}
            />
            <TextField
                label="Height"
                type="number"
                value={height}
                onChange={e => {setHeight(parseInt(e.target.value))}}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={(e) => submitForm(e)}
            >Create</Button>
            <br/><a href={'/content/' + videoId} onClick={(e) => goBack(e)}>Return</a>
        </div>
    );
}
