import { History } from "history";
import {MouseEvent, SyntheticEvent, useEffect, useMemo, useState} from "react";
import { useParams } from "react-router"
import flexColumn from '../Style/flexColumn';
import {Editor, EditorOutput} from "./Editor";
import Token from "../Struct/Token";
import Video from "../Entity/Video/Video";
import VideoDuration from "../Struct/VideoDuration";
import VideoUrl from "../Struct/VideoUrl";
import debounce from 'lodash.debounce'
import baseUrl from '../API/Spinner/baseUrl'
import {Button} from "@material-ui/core";
import gap from "../Style/gap";

interface DetailProps {
    history: History
    token: Token
}

interface DetailParams {
    contentId: string|undefined
    id: string|undefined
}

export default function Detail(props: DetailProps) {
    const history = props.history
    const location = history?.location
    // @ts-ignore
    const token = props.token || location?.token
    const {contentId: contentIdParam, id: idParam} = useParams<DetailParams>()
    const contentId = parseInt(contentIdParam ?? '')
    const id = parseInt(idParam ?? '')
    const [video, setVideo] = useState<Video|null>(null)
    const [downloading, setDownloading] = useState(false)
    const videoUrl: VideoUrl = video && video.downloaded ? process.env.REACT_APP_SPINNER_API_URL + '/cache/' + contentId + '.mp4' : null
    const [videoDuration, setVideoDuration] = useState<VideoDuration>(null)
    const { innerWidth: width } = window
    const videoWidthDividedBy16 = Math.min(Math.trunc((width - 20) / 16), 45 /* 1280/720 (16*45) */)
    const videoWidth = videoWidthDividedBy16 * 16
    const videoHeight = videoWidthDividedBy16 * 9
    const videoVideo = video && video.video ? video.video : null
    const finishedVideoWidth = videoVideo && videoVideo.width ? videoVideo.width : null
    const finishedVideoHeight = videoVideo && videoVideo.height ? videoVideo.height : null

    const getVideoDetails = (token: Token, id: number): void => {
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
                return
            }
        
            setVideo(response);
        }).catch(error => {
        });
    }

    useEffect(
        () => getVideoDetails(token, id),
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
                getVideoDetails(token, id)
            }).catch(error => {
                setDownloading(false)
            });
        },
        [video, contentId, id, token]
    );

    const navigateToContent = (e: MouseEvent<HTMLAnchorElement>, contentId: number) => {
        e.preventDefault()
        // @ts-ignore
        history.push({
            pathname: '/content/' + contentId,
            token
        })
    }

    const saveEditorOutput = useMemo<(output: EditorOutput) => void>(() => (output: EditorOutput): void => {
        fetch(
	    baseUrl + '/editor-state/' + id,
            {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token, 
                    'Content-Type': 'application/json'
                }),
		        body: JSON.stringify(output)
            }
        ).then(response => {
            if (response.status !== 204) {
                return
            }
        }).catch(error => {
            // error
        });
    }, [id, token])

    const debouncedSaveEditorOutput = useMemo<(output: EditorOutput) => void>(
        () => debounce(saveEditorOutput, 500),
        [saveEditorOutput]
    )
	
    const handleEditorUpdate = (output: EditorOutput): void => debouncedSaveEditorOutput(output)

    return <div style={{...flexColumn, alignItems: 'center'}}>
        <div>
            <a href={'/content/' + contentId} onClick={e => navigateToContent(e, contentId)}>‹ Retour</a>
            {video === null ? <h1>Loading...</h1> : (
                <>
                    <h1 style={{textAlign: 'center'}}>{video.video.name}</h1>
                    {video.downloaded === false ? <div>
                        Youtube video : {downloading ? 'downloading...' : 'not downloaded'}
                    </div> : ''}
                    {videoUrl ? <video
                        width={videoWidth}
                        height={videoHeight}
                        controls
                        onLoadedMetadata={(e: SyntheticEvent<EventTarget>) => {
                            const target = e.target as HTMLVideoElement
                            setVideoDuration(target.duration)
                        }}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video> : ''}
                </>
            )}
        </div>
        {video === null ? <h1>Loading...</h1> : <>
            <Editor
                contentId={contentId}
                defaultClips={video.editorState.clips}
                defaultTexts={video.editorState.texts}
                finishedVideoWidth={finishedVideoWidth}
                finishedVideoHeight={finishedVideoHeight}
                videoDuration={videoDuration}
                videoUrl={videoUrl}
                videoWidth={videoWidth}
                onEditorUpdate={handleEditorUpdate}
            />
            {video.finishedAt === null ? <div style={{...flexColumn, width: '100%', marginTop: gap}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => null}
                >
                    I'm done editing
                </Button>
            </div> : ''}
        </>}
    </div>
}
