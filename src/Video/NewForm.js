import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '@material-ui/core'
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

    // fetch(
    //     process.env.REACT_APP_SPINNER_API_URL + '/done/' + videoId,
    //     {
    //       method: 'post',
    //       headers: new Headers({
    //         'Authorization': 'Bearer ' + token, 
    //         'Content-Type': 'application/json'
    //       }), 
    //     }
    //   ).then(response => {
    //     if (response.status !== 204) {
    //       return
    //     }
  
    //     history.push({
    //       pathname: '/dashboard/'
    //     })
    //   }).catch(error => {
    //     // error
    //   });
  }

  const goBack = e => {
    e.preventDefault()

    props.history.push({
        pathname: '/content/' + videoId
    })
  }

  return (
    <div>
        {error ? (
            <Alert variant="filled" severity="error">{error}</Alert>
        ) : ''}
        <div>
            <label htmlFor="name">Name : </label>
            <input type="text" value={name} id="name" placeholder="Name" onChange={e => {setName(e.target.value)}}/>
        </div>
        <Button
            variant="contained"
            color="primary"
            onClick={(e) => submitForm(e)}
        >Create</Button>
        <br/><a href="" onClick={(e) => goBack(e)}>Return</a>
    </div>
  );
}
