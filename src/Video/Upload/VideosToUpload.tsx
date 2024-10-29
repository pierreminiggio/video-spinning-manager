import { useEffect, useState } from 'react';
import { getToken } from '../../Utils/Common';
import VideoToUpload from '../../Entity/Video/VideoToUpload';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import flex from '../../Style/flex';
import gap from '../../Style/gap';

interface VideosToUploadProps {
    token: string|null
}

export default function VideosToUpload(props: VideosToUploadProps) {
    const [videosToUpload, setVideosToUpload] = useState<VideoToUpload[]|null>(null);
    const [uploadingVideos, setUploadingVideos] = useState<number[]>([]);
    const [loadingVideos, setLoadingVideos] = useState<number[]>([]);
    const [tikTokLinkInputs, setTikTokLinkInputs] = useState<{[key: number]: string;}>({});
    const [uploadedVideos, setUploadedVideos] = useState<number[]>([]);

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

    const removeIdFromLoadingListIfPresent = (id: number): void => {
      const newLoadingVideos = [... loadingVideos]
      const index = newLoadingVideos.indexOf(id);
      if (index > -1) newLoadingVideos.splice(index, 1)
      setLoadingVideos(newLoadingVideos)
    }

    const removeIdFromUploadingListIfPresent = (id: number): void => {
      const newUploadingVideos = [... uploadingVideos]
      const index = newUploadingVideos.indexOf(id);
      if (index > -1) newUploadingVideos.splice(index, 1)
      setUploadingVideos(newUploadingVideos)
    }

    const updateTikTokLinkInput = (id: number, tikTokLink: string): void => {
      const newTikTokLinkInputs = {...tikTokLinkInputs}
      newTikTokLinkInputs[id] = tikTokLink
      setTikTokLinkInputs(newTikTokLinkInputs)
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
          removeIdFromLoadingListIfPresent(id)
          addNewIdToUploadingListIfNotPresent(id)
          
          return new Promise(resolve => resolve(null))
        }

        return response.json()
      }).then(response => {

        if (! response) {
          removeIdFromLoadingListIfPresent(id)
          return
        }

        if (response.status === 409) {
          alert('Video ' + id + ' already is set as uploading')
          removeIdFromLoadingListIfPresent(id)
          addNewIdToUploadingListIfNotPresent(id)

          return
        }

        if ([400, 401, 403, 404].includes(response.status)) {
          alert('Error');
          removeIdFromLoadingListIfPresent(id)

          return
        }

        removeIdFromLoadingListIfPresent(id)
        addNewIdToUploadingListIfNotPresent(id)
      }).catch(error => {
          alert('Error : ' + error)
          removeIdFromLoadingListIfPresent(id)
      });
    }

    const handleMarkAsUploaded = (id: number): void => {
      const tikTokLink = tikTokLinkInputs[id]

      if (! tikTokLink) {
        alert('TikTok link missing')
        return
      }

      const addNewIdToUploadedListIfNotPresent = (id: number): void => {
        if (! uploadedVideos.includes(id)) {
          const newUploadedVideos = [... uploadedVideos]
          newUploadedVideos.push(id)

          setUploadedVideos(newUploadedVideos)
        }
      }

      addNewIdToLoadingListIfNotPresent(id)

      fetch(
        process.env.REACT_APP_SPINNER_API_URL + '/uploading/' + id + '/to-uploaded',
        {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({remoteUrl: tikTokLink})
        }
      ).then(response => {
        if (response.status === 201) {
          removeIdFromLoadingListIfPresent(id)
          addNewIdToUploadedListIfNotPresent(id)
          
          return new Promise(resolve => resolve(null))
        }

        return response.json()
      }).then(response => {

        if (! response) {
          removeIdFromLoadingListIfPresent(id)
          return
        }

        if (response.status === 409) {
          alert('Video ' + id + ' is not uploading')
          removeIdFromLoadingListIfPresent(id)
          removeIdFromUploadingListIfPresent(id)

          return
        }

        if ([400, 401, 403, 404].includes(response.status)) {
          alert('Error');
          removeIdFromLoadingListIfPresent(id)

          return
        }

        removeIdFromLoadingListIfPresent(id)
        addNewIdToUploadedListIfNotPresent(id)
      }).catch(error => {
          alert('Error : ' + error)
          removeIdFromLoadingListIfPresent(id)
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
                      { loadingVideos.includes(videoId) ? <p>Loading...</p> : (uploadedVideos.includes(videoId) ? <>
                        {tikTokLinkInputs[videoId] ? (
                          <a
                            href={tikTokLinkInputs[videoId]}
                            target="_blank"
                            rel="noreferrer"
                          >{tikTokLinkInputs[videoId]}</a>
                        ) : 'Uploaded'}
                      </> : (
                          uploadingVideos.includes(videoId) ? <div style={{...flex, gap: gap / 2}}>
                          <TextField
                              label="TikTok Link"
                              value={tikTokLinkInputs[videoId] ?? ''}
                              onChange={e => {updateTikTokLinkInput(videoId, e.target.value)}}
                          />
                          <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleMarkAsUploaded(videoId)}
                          >Mark as uploaded</Button>
                        </div> : <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {handleStartUploading(videoId)}}
                        >
                          Start upload
                        </Button>
                      )) }
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
