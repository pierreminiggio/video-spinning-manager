import Clip from '../../Entity/Clip';
import Text from '../../Entity/Text';
import LanguageAndSubtitles from '../../Entity/Subtitle/LanguageAndSubtitles';
import orderClips from '../Clip/orderClips';
import findNextId from '../../Math/findNextId';

export default function generateTexts(clips: Clip[], texts: Text[], languageAndSubtitles: LanguageAndSubtitles): Text[] {
    const newTexts: Text[] = JSON.parse(JSON.stringify(texts))
    const orderedClips = orderClips(clips)

    const subtitles = languageAndSubtitles.subtitles

    for (const clip of orderedClips) {
        const clipStart = clip.start
        const clipEnd = clip.end

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

            const newText: Text = {
                id: findNextId(newTexts),
                start: doesSubtitleStartBeforeClipStart ? clipStart : subtitleStart,
                end: doesSubtitleEndAfterClipEnd ? clipEnd : subtitleEnd,
                content: subtitle.text,
                height: 0.7,
                color: '#FFFFFF',
                backgroundColor: '#CCCCCC',
                backgroundColorOpacity: 0.6,
                leftOffset: 0,
                rightOffset: 0,
                topOffset: 0,
            }

            newTexts.push(newText)
        }
    }

    return newTexts
}
