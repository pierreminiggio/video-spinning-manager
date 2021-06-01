import { useEffect, useState } from "react";
import { useParams } from "react-router"

export default function Detail(props) {
    const token = props.token
    const {contentId, id} = useParams()
    const [video, setVideo] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const videoUrl = video && video.downloaded ? process.env.REACT_APP_SPINNER_API_URL + '/cache/' + contentId + '.mp4' : null

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
        props.history.push({
            pathname: '/content/' + contentId,
        })
    }

    return <div>
        <a href="#" onClick={e => navigateToContent(e, contentId)}>‹ Retour</a>
        {video === null ? (<h1>Loading...</h1>) : (
            <>
                <h1>{video.video.name}</h1>
                {video.downloaded === false ? <div>
                    Youtube video : {downloading ? 'downloading...' : 'not downloaded'}
                </div> : ''}
                {videoUrl ? <video width="480" height="270" controls>
                    <source src={videoUrl} type="video/mp4"/>
                </video> : ''}
            </>
        )}
    </div>
}