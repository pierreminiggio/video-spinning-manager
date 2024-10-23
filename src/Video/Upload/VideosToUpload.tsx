import { useEffect, useState } from 'react';
import { getToken } from '../../Utils/Common';
import VideoToUpload from '../../Entity/Video/VideoToUpload';

interface VideosToUploadProps {
    token: string|null
}

export default function VideosToUpload(props: VideosToUploadProps) {
    const [videosToUpload, setVideosToUpload] = useState<VideoToUpload[]|null>(null);
    let token = props.token
  
    if (token === null) {
        token = getToken()
    }

    useEffect(() => {
    
        if (token === null) {
          return
        }
    
        fetch(
          process.env.REACT_APP_SPINNER_API_URL + '/to-upload/',
          {
            headers: new Headers({
              'Authorization': 'Bearer ' + token, 
              'Content-Type': 'application/json'
            }), 
          }
        ).then(response => response.json()).then(response => {
          if ([400, 401, 403, 404].includes(response.status)) {
            setVideosToUpload(null);
            return
          }

          const newVideosToUpload: VideoToUpload[] = []
          
          for (const responseEntry of response) {
            newVideosToUpload.push({
                id: responseEntry.id,
                tiktokName: responseEntry.tiktokName,
                legend: responseEntry.legend,
                fileUrl: responseEntry.fileUrl,
                publishAt: new Date(responseEntry.publishAt)
            })
          }
    
          setVideosToUpload(newVideosToUpload);
        }).catch(error => {
            setVideosToUpload(null);
        });
      }, [token]);

    return <div>
        <h1 style={{textAlign: 'center'}}>Videos to upload</h1>
        {videosToUpload ? videosToUpload.map((videosToUpload: VideoToUpload, i) => {
            return <div>
                {JSON.stringify(videosToUpload)}
            </div>;
        }) : <p>Loading...</p>}
    </div>;
}
