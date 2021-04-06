import React, { useState, useEffect } from 'react';
import fetch, { Headers } from 'node-fetch';

function ToProcessList({token}) {
  const [processList, setProcessList] = useState(null);

  useEffect(() => {

    setProcessList(null);

    fetch(
      process.env.REACT_APP_SPINNER_API_URL,
      {
        headers: new Headers({
          'Authorization': 'Bearer ' + token, 
          'Content-Type': 'application/json'
        }), 
      }
    ).then(response => response.json()).then(response => {
      if ([400, 403, 404].includes(response.status)) {
        setProcessList([]);
        return
      }

      setProcessList(response);
    }).catch(error => {
      setProcessList([]);
    });
  }, [token]);

  if (processList === null) {
    return <div className="content">Loading...</div>
  }

  return (
    <div>
      {processList.map(video => {
          return <div><a href={video.url} target="_blank">{video.title}</a></div>
      })}
    </div>
  );
}

export default ToProcessList;
