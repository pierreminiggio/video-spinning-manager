import { useEffect, useState } from 'react';
import { getToken } from '../../Utils/Common';
import VideoToUpload from '../../Entity/Video/VideoToUpload';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

interface VideosToUploadProps {
    token: string|null
}

export default function VideosToUpload(props: VideosToUploadProps) {
    const [videosToUpload, setVideosToUpload] = useState<VideoToUpload[]|null>(null);
    const [uploadingVideos, setUploadingVideos] = useState<number[]>([]);
    const [loadingVideos, setLoadingVideos] = useState<number[]>([]);
    let token = props.token
  
    if (token === null) {
        token = getToken()
    }

    const addNewIdToLoadingListIfNotPresent = (id: number): void => {
      if (! loadingVideos.includes(id)) {
        const newLoadingVideos = [... loadingVideos]
        newLoadingVideos.push(id)

        setLoadingVideos(newLoadingVideos)
      }
    }

    const removeIdToLoadingListIfPresent = (id: number): void => {
      const newLoadingVideos = [... loadingVideos]
      const index = newLoadingVideos.indexOf(id);
      if (index > -1) newLoadingVideos.splice(index, 1)
      setLoadingVideos(newLoadingVideos)
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
      const addNewIdToUploadingListIfNotPresent = (id: number): void => {
        if (! uploadingVideos.includes(id)) {
          const newUploadingVideos = [... uploadingVideos]
          newUploadingVideos.push(id)

          setUploadingVideos(newUploadingVideos)
        }
      }

      addNewIdToLoadingListIfNotPresent(id)

      fetch(
        process.env.REACT_APP_SPINNER_API_URL + '/to-upload/' + id + '/to-uploading',
        {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
          }), 
        }
      ).then(response => {
        if (response.status === 201) {
          removeIdToLoadingListIfPresent(id)
          addNewIdToUploadingListIfNotPresent(id)
          
          return new Promise(resolve => resolve(null))
        }

        return response.json()
      }).then(response => {

        if (! response) {
          removeIdToLoadingListIfPresent(id)
          return
        }

        if (response.status === 409) {
          alert('Video ' + id + ' already is set as uploading')
          removeIdToLoadingListIfPresent(id)
          addNewIdToUploadingListIfNotPresent(id)

          return
        }

        if ([400, 401, 403, 404].includes(response.status)) {
          alert('Error');
          removeIdToLoadingListIfPresent(id)

          return
        }

        removeIdToLoadingListIfPresent(id)
        addNewIdToUploadingListIfNotPresent(id)
      }).catch(error => {
          alert('Error : ' + error)
          removeIdToLoadingListIfPresent(id)
      });
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
                  const {id: videoId, publishAt, tiktokName, legend, fileUrl} = videoToUpload

                  return <TableRow key={i}>
                    <TableCell>
                      {publishAt.toLocaleDateString() + ' à ' + publishAt.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <a
                        href={'https://tiktok.com/@' + tiktokName}
                        target='_blank'
                        rel='noreferrer'
                      >{tiktokName}</a>
                    </TableCell>
                    <TableCell>
                      {legend}
                    </TableCell>
                    <TableCell>
                      <a
                        href={fileUrl}
                        target='_blank'
                        rel='noreferrer'
                      >{fileUrl}</a>
                    </TableCell>
                    <TableCell>
                      { loadingVideos.includes(videoId) ? <p>Loading...</p> : (
                          uploadingVideos.includes(videoId) ? <>
                          <p>Form for uploading</p>
                        </> : <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {handleStartUploading(videoId)}}
                        >
                          Start upload
                        </Button>
                      ) }
                    </TableCell>
                  </TableRow>;
              }) : <TableRow>
                  <TableCell colSpan={5} style={{textAlign: 'center'}}>
                    Loading...
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
    </div>;
}
