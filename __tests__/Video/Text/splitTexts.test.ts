import Text from '../../../src/Entity/Text'
import splitText, {SplitMarker} from '../../../src/Video/Text/splitText'
import assertSameTextLists from '../../Helper/TextAssertion'

describe('Split Text', (): void => {
    it('Test je sais pas si vous savez', (): void => {
        const jeSaisSiVousSavezText: Text = {
            backgroundColor: "#ffa500",
            backgroundColorOpacity: 0.7,
            color: "#ffffff",
            content: "J'sais pas si vous savez mais c'est incroyablement simple\nde faire ses propres yaourts.",
            end: 4.279999999999999,
            height: 2.1,
            id: 2,
            leftOffset: 3,
            rightOffset: 3,
            start: 0,
            subtitleId: "French",
            topOffset: 0
        }
    
        const jeSaisPasSiVousSavezMarkers: SplitMarker[] = [{
            textCharIndex: 25,
            time: 1.2
        }]

        const finalTexts: Text[] = [
            {
                backgroundColor: "#ffa500",
                backgroundColorOpacity: 0.7,
                color: "#ffffff",
                content: "J'sais pas si vous savez",
                end: 1.2,
                height: 2.1,
                id: 2,
                leftOffset: 3,
                rightOffset: 3,
                start: 0,
                subtitleId: "French",
                topOffset: 0
            },
            {
                backgroundColor: "#ffa500",
                backgroundColorOpacity: 0.7,
                color: "#ffffff",
                content: "mais c'est incroyablement simple\nde faire ses propres yaourts.",
                end: 4.279999999999999,
                height: 2.1,
                id: 2,
                leftOffset: 3,
                rightOffset: 3,
                start: 1.2,
                subtitleId: "French",
                topOffset: 0
            }
        ]

        expect(splitText(jeSaisSiVousSavezText, jeSaisPasSiVousSavezMarkers)).toBe(finalTexts)
    })
})
