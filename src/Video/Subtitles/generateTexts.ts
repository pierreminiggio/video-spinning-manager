import Clip from '../../Entity/Clip';
import Text from '../../Entity/Text';
import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles';
import orderClips from '../Clip/orderClips';
import findNextId from '../../Math/findNextId';
import defineSubtitlesSizeAndPosition from './defineSubtitlesSizeAndPosition';

export default function generateTexts(clips: Clip[], texts: Text[], languageAndSubtitles: LanguageAndSubtitles): Text[] {
    const newTexts: Text[] = []

    for (const text of texts) {
        if (text.subtitleId) {
            continue
        }

        newTexts.push(text)
    }

    const orderedClips = orderClips(clips)

    const language = languageAndSubtitles.language
    const subtitles = languageAndSubtitles.subtitles

    let textStartOffset = 0

    for (const clip of orderedClips) {
        const clipStart = clip.start
        const clipEnd = clip.end
        const clipLength = clipEnd - clipStart

        for (const subtitle of subtitles) {
            const subtitleStart = subtitle.startTime
            const subtitleEnd = subtitle.endTime

            const doesSubtitleEndBeforeClipStart = subtitleEnd < clipStart

            if (doesSubtitleEndBeforeClipStart) {
                continue
            }

            const doesSubtitleStartAfterClipEnd = clipEnd < subtitleStart

            if (doesSubtitleStartAfterClipEnd) {
                continue
            }

            const doesSubtitleStartBeforeClipStart = subtitleStart < clipStart
            const doesSubtitleEndAfterClipEnd = clipEnd < subtitleEnd

            const subtitleText = subtitle.text

            const newText: Text = {
                id: findNextId(newTexts),
                start: doesSubtitleStartBeforeClipStart ? textStartOffset : (textStartOffset + (subtitleStart - clipStart)),
                end: doesSubtitleEndAfterClipEnd ? (textStartOffset + clipLength) : (textStartOffset + (subtitleEnd - clipStart)),
                content: subtitleText,
                ...defineSubtitlesSizeAndPosition(subtitleText),
                color: '#FFFFFF',
                backgroundColor: '#CCCCCC',
                backgroundColorOpacity: 0.6,
                subtitleId: language
            }

            newTexts.push(newText)
        }

        textStartOffset += clipLength
    }

    return newTexts
}
