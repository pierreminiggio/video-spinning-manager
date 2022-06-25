import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles'
import Token from '../../Struct/Token';
import flex from '../../Style/flex';
import gap from '../../Style/gap';

interface LanguagesProps {
    languagesAndSubtitles: LanguageAndSubtitles[]|null;
    setLanguagesAndSubtitles: Dispatch<SetStateAction<LanguageAndSubtitles[]|null>>
    token: Token
    contentId: number
}

export default function Languages({languagesAndSubtitles, setLanguagesAndSubtitles, token, contentId}: LanguagesProps): JSX.Element {
    const [pullingSubtitles, setPullingSubtitles] = useState<boolean>(false)
    const subtitlesUrl = process.env.REACT_APP_SPINNER_API_URL + '/subtitles/' + contentId

    const getLanguagesAndSubtitles = (update: boolean = false): void => {
        setPullingSubtitles(true)
        fetch(
            subtitlesUrl,
            {
                method: update ? 'POST' : 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token, 
                    'Content-Type': 'application/json'
                }), 
            }
        ).then(response => response.json()).then(response => {
            if ([400, 401, 403, 404].includes(response.status)) {
                return
            }
        
            setPullingSubtitles(false)
            setLanguagesAndSubtitles(response)
        }).catch(error => {
            setPullingSubtitles(false)
        });
    }

    useEffect(() => {

        if (token === null) {
            return
        }

        if (! contentId) {
            return
        }

        if (languagesAndSubtitles !== null) {
            return
        }

        getLanguagesAndSubtitles()
    }, [languagesAndSubtitles, token, contentId])

    const loading = languagesAndSubtitles === null || pullingSubtitles

    const padding = `${gap / 10}px ${gap / 5}px`

    const languageStyle: CSSProperties = {
        fontSize: '1.5em',
        marginBlockStart: '.83em',
        marginBlockEnd: '.83em',
        padding
    }

    return <div style={{...flex, gap: gap / 2}}>
        <h2
            title='Closed Captions'
            style={{
                color: '#696969',
                backgroundColor: '#E5E5E5',
                padding
            }}
        ><a
            href={subtitlesUrl}
            onClick={(e) => {
                e.preventDefault()
                getLanguagesAndSubtitles(true)
            }}
            style={{
                color: 'inherit',
                textDecoration: 'inherit'
            }}
        >CC</a></h2>
        <div style={{...flex, gap: gap / 5}}>
            {loading ? <div
                style={languageStyle}
            >Loading...</div> : languagesAndSubtitles?.map((languageAndSubtitles, languageAndSubtitlesIndex) => {
                return <div key={languageAndSubtitlesIndex}>
                    <div
                        style={languageStyle}
                    >{languageAndSubtitles.language}</div>
                </div>
            })}
        </div>
    </div>
}
