import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import flexColumn from './Style/flexColumn';
import gap from './Style/gap';

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
      pathname: '/content/' + videoId + '/new',
      token
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
      pathname: '/content/' + videoId + '/video/' + id,
      token
    })
  }

  return (
    <div style={flexColumn}>
      {videoContent.title ? videoContent.title : 'Loading...'}
      <Button
        variant="contained"
        onClick={createNewVideo}
      >
        Create a new video
      </Button>
      {videoVideos ? <>
        {videoVideos.map((videoVideo, videoIndex) => <Button
          variant="contained"
          color="primary"
          style={videoIndex === 0 ? {marginTop: gap} : null}
          onClick={(e) => navigateToVideo(e, videoVideo.id)}
        >
          {videoVideo.name}
        </Button>)}
      </> : ''}
      <Button
        variant="contained"
        color="secondary"
        style={{marginTop: gap}}
        onClick={finishEditingContent}
      >
        Done
      </Button>
    </div>
  );
}

export default ContentToSpin;
