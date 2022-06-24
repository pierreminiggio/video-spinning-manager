import { Dispatch, SetStateAction } from 'react';
import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles'

interface LanguagesProps {
    languageAndSubtitles: LanguageAndSubtitles[]|null;
    setLanguageAndSubtitles: Dispatch<SetStateAction<LanguageAndSubtitles[]|null>>
}

export default function Languages({languageAndSubtitles, setLanguageAndSubtitles}: LanguagesProps): JSX.Element {
    return <div>TODO Sous titres</div>
}
