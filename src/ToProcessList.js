import React, { useState, useEffect } from 'react';
import fetch, { Headers } from 'node-fetch';

function ToProcessList(props) {
  const token = props.token
  const [processList, setProcessList] = useState(null);

  useEffect(() => {

    setProcessList(null);

    if (token === null) {
        return
    }

    fetch(
      process.env.REACT_APP_SPINNER_API_URL,
      {
        headers: new Headers({
          'Authorization': 'Bearer ' + token, 
          'Content-Type': 'application/json'
        }), 
      }
    ).then(response => response.json()).then(response => {
      if ([400, 401, 403, 404].includes(response.status)) {
        setProcessList([]);
        return
      }

      setProcessList(response);
    }).catch(error => {
      setProcessList([]);
    });
  }, [token]);

  const navigateToContent = (e, video) => {
    e.preventDefault()
    props.history.push({
      pathname: '/content/' + video.id,
      state: { video, token }
    })
  }

  if (processList === null) {
    return <div className="content">Loading...</div>
  }

  let i = 0

  return (
    <div>
      {processList ? processList.map(video => {
          i++
          return <div key={i}>
              <a href="" onClick={(e) => navigateToContent(e, video)}>{video.title}</a>
            </div>
      }) : ''}
    </div>
  );
}

export default ToProcessList;
