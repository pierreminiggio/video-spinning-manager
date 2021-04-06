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

      setProcessList([{id: 1, title: 'test', url: 'https://google.fr'}]);
    }).catch(error => {
      setProcessList([]);
    });
  }, [token]);

  if (processList === null) {
    return <div className="content">Loading...</div>
  }

  return (
    <div>
      Ici on aura la liste
    </div>
  );
}

export default ToProcessList;
