import { useState } from 'react';
import { useParams } from 'react-router';
import { Button, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import flexColumn from '../Style/flexColumn';

export default function NewForm(props) {
  const history = props.history
  const location = history?.location
  const token = props.token || location?.token
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

            history.push({
                pathname: '/content/' + videoId + '/video/' + jsonResponse.id,
                token
            })
        })
        
      }).catch(error => {
        // error
      });
  }

  const goBack = e => {
    e.preventDefault()

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
        <TextField label="Name" value={name} onChange={e => {setName(e.target.value)}} />
        <Button
            variant="contained"
            color="primary"
            onClick={(e) => submitForm(e)}
        >Create</Button>
        <br/><a href={"/content/" + videoId } onClick={(e) => goBack(e)}>Return</a>
    </div>
  );
}
