import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

function ContentToSpin(props) {
  const token = props.token
  const history = props.history
  const {id: videoId} = useParams()
  const historyVideo = history?.location?.state?.video
  const [video, setVideo] = useState({content: historyVideo ? historyVideo : {}})
  const videoContent = video.content ? video.content : {}

  useEffect(() => {

    if (token === null) {
        return
    }

    fetch(
      process.env.REACT_APP_SPINNER_API_URL + '/content/' + videoId,
      {
        headers: new Headers({
          'Authorization': 'Bearer ' + token, 
          'Content-Type': 'application/json'
        }), 
      }
    ).then(response => response.json()).then(response => {
      if ([400, 401, 403, 404].includes(response.status)) {
        setVideo(historyVideo);
        return
      }

      setVideo(response);
    }).catch(error => {
      setVideo(historyVideo);
    });
  }, [token, videoId]);

  const createNewVideo = e => {
    e.preventDefault()
    history.push({
      pathname: '/content/' + videoId + '/new'
    })
  }
  
  const finishEditingContent = e => {
    e.preventDefault()

    fetch(
        process.env.REACT_APP_SPINNER_API_URL + '/done/' + videoId,
        {
          method: 'post',
          headers: new Headers({
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
          }), 
        }
      ).then(response => {
        if (response.status !== 204) {
          return
        }
  
        history.push({
          pathname: '/dashboard/'
        })
      }).catch(error => {
        // error
      });
  }

  return (
    <div>
      {videoContent.title ? videoContent.title : 'Loading...'}
      <br/><a href="" onClick={(e) => createNewVideo(e)}>Create a new video</a>
      <br/><a href="" onClick={(e) => finishEditingContent(e)}>Done</a>
    </div>
  );
}

export default ContentToSpin;
