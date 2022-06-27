import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles';
import Text from '../../Entity/Text';

export default function generateTexts(existingTexts: Text[], LanguageAndSubtitles: LanguageAndSubtitles): Text[] {
    existingTexts.push({
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

    return existingTexts
}
