import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export default function NewForm(props) {
  const token = props.token
  const {id: videoId} = useParams()
  
  const submitForm = e => {
    e.preventDefault()

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
      <br/><a href="" onClick={(e) => submitForm(e)}>Create</a>
      <br/><a href="" onClick={(e) => goBack(e)}>Return</a>
    </div>
  );
}
