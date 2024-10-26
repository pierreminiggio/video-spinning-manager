import { useEffect, useState } from 'react';
import { getToken } from '../../Utils/Common';
import VideoToUpload from '../../Entity/Video/VideoToUpload';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

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

    const handleStartUploading = (id: number): void => {
      alert('Uploading ' + id)
    }
    
    return <div>
        <h1 style={{textAlign: 'center'}}>Videos to upload</h1>
        <TableContainer>   
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post date</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Legend</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videosToUpload ? videosToUpload.map((videoToUpload: VideoToUpload, i) => {
                  return <TableRow>
                    <TableCell>
                      {videoToUpload.publishAt.toLocaleDateString() + ' à ' + videoToUpload.publishAt.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={'https://tiktok.com/@' + videoToUpload.tiktokName}
                        target='_blank'
                        rel='noreferrer'
                      >{videoToUpload.tiktokName}</a>
                    </TableCell>
                    <TableCell>
                      {videoToUpload.legend}
                    </TableCell>
                    <TableCell>
                      <a
                        href={videoToUpload.fileUrl}
                        target='_blank'
                        rel='noreferrer'
                      >{videoToUpload.fileUrl}</a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {handleStartUploading(videoToUpload.id)}}
                      >
                        Start upload
                      </Button>
                    </TableCell>
                  </TableRow>;
              }) : <p>Loading...</p>}
            </TableBody>
          </Table>
        </TableContainer>
    </div>;
}
