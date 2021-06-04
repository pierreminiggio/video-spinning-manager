import { useEffect, useState } from "react";
import { useParams } from "react-router"
import flexColumn from '../Style/flexColumn';
import Editor from "./Editor";

export default function Detail(props) {
    const history = props.history
    const location = history?.location
    const token = props.token || location?.token
    const {contentId, id} = useParams()
    const [video, setVideo] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const videoUrl = video && video.downloaded ? process.env.REACT_APP_SPINNER_API_URL + '/cache/' + contentId + '.mp4' : null
    const [videoDuration, setVideoDuration] = useState(null)
    const { innerWidth: width } = window
    const videoWidthDividedBy16 = Math.min(Math.trunc((width - 20) / 16), 45 /* 1280/720 (16*45) */)
    const videoWidth = videoWidthDividedBy16 * 16
    const videoHeight = videoWidthDividedBy16 * 9

    const updateDetails = (token, id) => {
        if (token === null) {
            return
        }
    
        fetch(
            process.env.REACT_APP_SPINNER_API_URL + '/video/' + id,
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + token, 
                    'Content-Type': 'application/json'
                }), 
            }
        ).then(response => response.json()).then(response => {
            if ([400, 401, 403, 404].includes(response.status)) {
                setVideo(video);
                return
            }
        
            setVideo(response);
        }).catch(error => {
            setVideo(null);
        });
    }

    useEffect(
        () => updateDetails(token, id),
        [token, id]
    );

    useEffect(
        () => {
            if (token === null) {
                return
            }

            if (video === null) {
                return
            }

            if (video.downloaded) {
                return
            }

            setDownloading(true)
        
            fetch(
                process.env.REACT_APP_SPINNER_API_URL + '/download-video/' + contentId,
                {
                    method: 'post',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + token, 
                        'Content-Type': 'application/json'
                    }), 
                }
            ).then(response => response.json()).then(response => {
                if ([400, 401, 403, 404].includes(response.status)) {
                    setDownloading(false)
                    return
                }
            
                setDownloading(false)
                updateDetails(token, id)
            }).catch(error => {
                setDownloading(false)
            });
        },
        [video, contentId]
    );

    const navigateToContent = (e, contentId) => {
        e.preventDefault()
        history.push({
            pathname: '/content/' + contentId,
            token
        })
    }

    return <div style={{...flexColumn, alignItems: 'center'}}>
        <div>
            <a href="#" onClick={e => navigateToContent(e, contentId)}>‹ Retour</a>
            {video === null ? (<h1>Loading...</h1>) : (
                <>
                    <h1 style={{textAlign: 'center'}}>{video.video.name}</h1>
                    {video.downloaded === false ? <div>
                        Youtube video : {downloading ? 'downloading...' : 'not downloaded'}
                    </div> : ''}
                    {videoUrl ? <video
                        width={videoWidth}
                        height={videoHeight}
                        controls
                        onLoadedMetadata={e => setVideoDuration(e.target.duration)}
                    >
                        <source src={videoUrl} type="video/mp4"/>
                    </video> : ''}
                </>
            )}
        </div>
        <Editor videoDuration={videoDuration} videoUrl={videoUrl} />
    </div>
}
