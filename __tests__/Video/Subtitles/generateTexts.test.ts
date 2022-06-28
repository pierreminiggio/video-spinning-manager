import Clip from '../../../src/Entity/Clip'
import LanguageAndSubtitles from '../../../src/Entity/Subtitle/LanguageAndSubtitles'
import Text from '../../../src/Entity/Text'
import generateTexts from '../../../src/Video/Subtitles/generateTexts'

const assertSameTexts = (expected: Text, actual: Text): void => {
    expect(expected.id).toStrictEqual(actual.id)
    expect(expected.start).toStrictEqual(actual.start)
    expect(expected.end).toStrictEqual(actual.end)
    expect(expected.content).toStrictEqual(actual.content)
    expect(expected.height).toStrictEqual(actual.height)
    expect(expected.color).toStrictEqual(actual.color)
    expect(expected.backgroundColor).toStrictEqual(actual.backgroundColor)
    expect(expected.backgroundColorOpacity).toStrictEqual(actual.backgroundColorOpacity)
    expect(expected.leftOffset).toStrictEqual(actual.leftOffset)
    expect(expected.rightOffset).toStrictEqual(actual.rightOffset)
    expect(expected.topOffset).toStrictEqual(actual.topOffset)
}

const assertSameTextLists = (expected: Text[], actual: Text[]): void => {
    expect(expected.length).toStrictEqual(actual.length)

    for (const textKey in expected) {
        assertSameTexts(expected[textKey], actual[textKey])
    }
}

describe('Generate Texts', (): void => {
    it('should return the same texts as before if no subtitles (everything empty)', (): void => {
        const clips: Clip[] = []
        const texts: Text[] = []
        const LanguageAndSubtitles: LanguageAndSubtitles = {
            language: 'French',
            subtitles: []
        }

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        expect(newTexts.length).toStrictEqual(0)
    })

    it('should return the same texts as before if no subtitles (1 Text)', (): void => {
        const clips: Clip[] = []
        const texts: Text[] = [
            {
                id: 3,
                start: 0,
                end: 10,
                content: 'Test',
                height: 7,
                color: '#EEEEEE',
                backgroundColor: '#000000',
                backgroundColorOpacity: 0.6,
                leftOffset: 0,
                rightOffset: 0,
                topOffset: 0
            }
        ]
        const LanguageAndSubtitles: LanguageAndSubtitles = {
            language: 'French',
            subtitles: []
        }

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertSameTextLists(texts, newTexts)
    })

    it('should return the same texts as before if no clip, if even though we have subtitles (no Text)', (): void => {
        const clips: Clip[] = []
        const texts: Text[] = []
        const LanguageAndSubtitles: LanguageAndSubtitles = {
            language: 'French',
            subtitles: [
                {
                    startTime: 0,
                    endTime: 10,
                    text: 'Je suis un sous-titre'
                }
            ]
        }

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertSameTextLists(texts, newTexts)
    })

    it('should return the same texts as before if no clip, if even though we have subtitles (1 Text)', (): void => {
        const clips: Clip[] = []
        const texts: Text[] = [
            {
                id: 3,
                start: 0,
                end: 10,
                content: 'Test',
                height: 7,
                color: '#EEEEEE',
                backgroundColor: '#000000',
                backgroundColorOpacity: 0.6,
                leftOffset: 0,
                rightOffset: 0,
                topOffset: 0
            }
        ]
        const LanguageAndSubtitles: LanguageAndSubtitles = {
            language: 'French',
            subtitles: [
                {
                    startTime: 0,
                    endTime: 10,
                    text: 'Je suis un sous-titre'
                }
            ]
        }

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertSameTextLists(texts, newTexts)
    })
})
