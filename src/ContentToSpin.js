import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

function ContentToSpin(props) {
  const history = props.history
  const location = history?.location
  const token = props.token || location?.token
  const {id: videoId} = useParams()
  const [video, setVideo] = useState({content: location?.videoContent})
  const videoContent = video.content ? video.content : {}
  const videoVideos = video.videos ? video.videos : []

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
        setVideo({});
        return
      }

      setVideo(response);
    }).catch(error => {
      setVideo({});
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

  const navigateToVideo = (e, id) => {
    e.preventDefault()
    history.push({
      pathname: '/content/' + videoId + '/video/' + id
    })
  }

  return (
    <div>
      {videoContent.title ? videoContent.title : 'Loading...'}
      <br/><a href="" onClick={(e) => createNewVideo(e)}>Create a new video</a>
      {videoVideos ? <div style={{display: 'flex', flexDirection: 'column'}}>
        {videoVideos.map(videoVideo => <Button
          variant="contained"
          color="primary"
          onClick={(e) => navigateToVideo(e, videoVideo.id)}
        >
          {videoVideo.name}
        </Button>)}
      </div> : ''}
      <br/><a href="" onClick={(e) => finishEditingContent(e)}>Done</a>
    </div>
  );
}

export default ContentToSpin;
