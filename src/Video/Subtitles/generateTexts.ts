import Clip from '../../Entity/Clip';
import Text from '../../Entity/Text';
import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles';

export default function generateTexts(clips: Clip[], texts: Text[], LanguageAndSubtitles: LanguageAndSubtitles): Text[] {
    texts.push({
        id: 1,
        start: 0,
        end: 10,
        content: 'test',
        height: 50,
        color: 'orange',
        backgroundColor: 'black',
        backgroundColorOpacity: 0.6,
        leftOffset: 0,
        rightOffset: 0,
        topOffset: 0,
    })

    return texts
}
