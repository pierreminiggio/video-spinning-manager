import { useState } from 'react';
import { useParams } from 'react-router';
import { Button, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function NewForm(props) {
  const token = props.token
  const {id: videoId} = useParams()
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  
  const submitForm = e => {
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
          body: JSON.stringify({name})
        }
      ).then(response => {
        if (response.status !== 200) {
          return
        }

        response.json().then(jsonResponse => {

            if (! jsonResponse['id']) {
                return
            }

            props.history.push({
                pathname: '/content/' + videoId + '/video/' + jsonResponse.id,
            })
        })
        
      }).catch(error => {
        // error
      });
  }

  const goBack = e => {
    e.preventDefault()

    props.history.push({
        pathname: '/content/' + videoId
    })
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
        {error ? (
            <Alert variant="filled" severity="error">{error}</Alert>
        ) : ''}
        <TextField id="standard-basic" label="Name" value={name} onChange={e => {setName(e.target.value)}} />
        <Button
            variant="contained"
            color="primary"
            onClick={(e) => submitForm(e)}
        >Create</Button>
        <br/><a href="" onClick={(e) => goBack(e)}>Return</a>
    </div>
  );
}
