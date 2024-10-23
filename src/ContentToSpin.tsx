import { Button } from '@material-ui/core';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import flexColumn from './Style/flexColumn';
import gap from './Style/gap';
import { History } from 'history';
import Content from './Entity/Content/Content';

interface ContentToSpinProps {
  history: History
}

interface ContentToSpinParams {
    id: string|undefined
}

function ContentToSpin(props: ContentToSpinProps) {
  const history = props.history
  const location = history?.location
  // @ts-ignore
  const token = props.token || location?.token
  const {id} = useParams<ContentToSpinParams>()
  const videoId = parseInt(id ?? '')

  const defaultContent = useMemo<Content>(() => ({
      // @ts-ignore
      content: location?.videoContent,
      videos: []
  }), [location])

  const [video, setVideo] = useState<Content>(defaultContent)
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
        setVideo(defaultContent);
        return
      }

      setVideo(response);
    }).catch(error => {
      setVideo(defaultContent);
    });
  }, [token, videoId, defaultContent]);

  const createNewVideo = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // @ts-ignore
    history.push({
      pathname: '/content/' + videoId + '/new',
      token
    })
  }
  
  const finishEditingContent = (e: MouseEvent<HTMLButtonElement>) => {
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

  const navigateToVideo = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault()
    // @ts-ignore
    history.push({
      pathname: '/content/' + videoId + '/video/' + id,
      token
    })
  }

  // @ts-ignore
  const videoContentTitle: string = videoContent.title ? videoContent.title : 'Loading...'
  return (
    <div style={flexColumn}>
      {videoContentTitle}
      <Button
        variant="contained"
        onClick={createNewVideo}
      >
        Create a new video
      </Button>
      {videoVideos ? <>
        {videoVideos.map((videoVideo, videoIndex) => <Button
          key={videoIndex + 1}
          variant="contained"
          color="primary"
          style={videoIndex === 0 ? {marginTop: gap} : {}}
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
