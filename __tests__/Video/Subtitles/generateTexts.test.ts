import Clip from '../../../src/Entity/Clip'
import LanguageAndSubtitles from '../../../src/Entity/Subtitle/LanguageAndSubtitles'
import Text from '../../../src/Entity/Text'
import Transition from '../../../src/Entity/Video/Clip/Crop/Transition'
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

class TextListAssertor {

    assertOne: (expected: Text, actual: Text) => void

    constructor (assertOne: (expected: Text, actual: Text) => void) {
        this.assertOne = assertOne
    }

    assertLists (expected: Text[], actual: Text[]): void {
        expect(expected.length).toStrictEqual(actual.length)
    
        for (const textKey in expected) {
            this.assertOne(expected[textKey], actual[textKey])
        }
    }
}

class SubtitleAssertor {
    keys: string[]

    constructor (keys: string[]) {
        this.keys = keys
    }

    assertMatchesSubtitles(expected: Text, actual: Text): void {
        for (const key of this.keys) {
            expect(expected[key]).toStrictEqual(actual[key])
        }
    }

}

const assertSameTextLists = (expected: Text[], actual: Text[]): void => new TextListAssertor(assertSameTexts).assertLists(expected, actual)
const assertTextMatchesSubtitles = (expected: Text[], actual: Text[]): void => new TextListAssertor(
    new SubtitleAssertor(['id', 'start', 'end', 'content']).assertMatchesSubtitles
).assertLists(expected, actual)

const createText = (id: number, start: number, end: number, content: string): Text => {
    return {
        id,
        start,
        end,
        content,
        height: 7,
        color: '#EEEEEE',
        backgroundColor: '#000000',
        backgroundColorOpacity: 0.6,
        leftOffset: 0,
        rightOffset: 0,
        topOffset: 0
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

    it('should generate texts for the first time for the Yaourt video', (): void => {

        const clip1Start = 6.336
        const clip1End = 13.6

        const clip2Start = 18.688
        const clip2End = 29.424

        const clip3Start = 40.256
        const clip3End = 43.52

        const clip4Start = 66
        const clip4End = 92.48

        const clip5Start = 113.856
        const clip5End = 121.8

        const clips: Clip[] = [
            {
                start: clip1Start,
                end: clip1End,
                id: 1,
                order: 1,
                moves: {
                    '0': {
                        offset: 39.67032967032967,
                        transition: Transition.Raw
                    }
                }
            },
            {
                start: clip2Start,
                end: clip2End,
                id: 2,
                order: 2,
                moves: {
                    '0': {
                        offset: 33.73626373626374,
                        transition: Transition.Raw
                    }
                }
            },
            {
                start: clip3Start,
                end: clip3End,
                id: 3,
                order: 3,
                moves:  {
                    '0': {
                        offset: 49.56043956043956,
                        transition: Transition.Raw
                    }
                }
            },
            {
                start: clip4Start,
                end: clip4End,
                id: 4,
                order: 4,
                moves: {
                    '0': {
                        offset: 0,
                        transition: Transition.Raw
                    },
                    '0.88': {
                        offset: 26.593406593406595,
                        transition: Transition.Raw
                    }
                }
            },
            {
                start: clip5Start,
                end: clip5End,
                id: 5,
                order: 5,
                moves: {
                    '0': {
                        offset: 26.153846153846153,
                        transition:Transition.Raw
                    }
                }
            }
        ]

        const texts: Text[] = []
        
        const importantEnd = 6.703
        const importantText = "mais c'est pour vous parler de quelque chose qui je pense est important."

        const facileStart = 6.703
        const facileEnd = 10.616
        const facileText = "Salut ! Aujourd'hui je vais poster une vidéo\nqui a complètement rien à voir avec ce que je poste d'habitude"

        const cEstToutStart = 10.616
        const cEstToutText = "Donc pour faire ça il faut un yaourt, et du lait, c'est tout !"

        const recetteEnd = 20.468
        const recetteText = "Lait entier, demi écrémé, tout marche.\nApparemment lait entier c'est mieux pour faire ça mais tout fonctionne.\nEt il faut tout simplement les mélanger."

        const bruitsStart = 20.468
        const bruitsEnd = 25.551
        const bruitsText = "*Bruits de yaourt*"

        const marcheStart = 25.551
        const marcheText = "Ce qui marche bien pour moi c'est de mettre à peu près\nun litre de lait pour un yaourt."

        const unTiersEnd = 40.973
        const unTiersText = "Donc, ce que je fais c'est que je mets déjà un tout petit peu de lait.\nÀ peu près genre le tiers."

        const melangeStart = 40.973
        const melangeText = "Je mélange jusqu'à ce ça soit à peu près bien mélangé\net ensuite je rajoute la fin pour ça fasse 1 litre."

        const aPeuPresEnd = 68.93
        const aPeuPresText = "Tant que ça à peu près bien mélangé ce sera bon.\nEt ensuite, une fois qu'on a rempli les pots,"

        const cuireStart = 68.93
        const cuireEnd = 72.725
        const cuireText = "il faut les laisser une nuit à 40 degrés (Celsius).\nDonc ça, vous avez deux choix :"

        const demerderStart = 72.725
        const demerderEnd = 77.525
        const demerderText = "C'est soit vous démerdez vous même et vos moyens pour chauffer\npour que ça reste une nuit à 40°C."

        const nombreHeuresStart = 77.525
        const nombreHeuresEnd = 82.254
        const nombreHeuresText = "C'est à peu près entre 9 et 11 heures qu'il faut.\nEuh... ou bien, sinon, c'est de prendre comme moi une yaourtière."

        const lienStart = 82.254
        const lienEnd = 85.562
        const lienText = "Euh... si y'en a que ça intéresse d'avoir la même,\nje vous mettrai un lien dans la description."

        const amazonStart = 85.562
        const amazonEnd = 90.724
        const amazonText = "C'est pas sponsorisé, mais c'est un lien affilié Amazon.\nDonc si jamais vous prenez un truc sur Amazon en passant par mon lien,\nça aidera ma chaîne."

        const merciStart = 90.724
        const merciText = "Donc merci si jamais il y en a qui font ça."

        const demainEnd = 114.117
        const demainText = "Et ensuite, et bah... j'ai plus qu'à paramétrer... euh... pour mettre 10 heures.\nHop ! Et puis je lance ! Et demain j'aurai des yaourts ! C'est aussi simple que ça."

        const condenserStart = 97.218
        const condenserEnd = 102
        const condenserText = "C'est très important ça permet à l'eau de venir condenser\nsur le couvercle de la yaourtière plutôt que dans les yaourts."

        const eauStart = 102
        const eauEnd = 104.324
        const eauText = "Parce que sinon il y aura de l'eau dans les yaourts, et ça c'est pas ouf. "

        const parametrerStart = 104.324
        const parametrerEnd = 114.117
        const parametrerText = "Et ensuite, et bah... j'ai plus qu'à paramétrer... euh... pour mettre 10 heures.\nHop ! Et puis je lance ! Et demain j'aurai des yaourts ! C'est aussi simple que ça."

        const petitYaourtStart = 114.117
        const petitYaourtText = "Et après le lendemain... et bien... ça ressemble à ça.\nHop ! Un bon petit yaourt !"

        const LanguageAndSubtitles: LanguageAndSubtitles = {
            language: 'French',
            subtitles: [{
                startTime: 0,
                endTime: 3.831,
                text: facileText
            },{
                startTime: 3.831,
                endTime: importantEnd,
                text: importantText
            },{
                startTime: facileStart,
                endTime: facileEnd,
                text: "J'sais pas si vous savez mais c'est incroyablement simple\nde faire ses propres yaourts."
            },{
                startTime: cEstToutStart,
                endTime: 13.879,
                text: cEstToutText
            },{
                startTime: 13.879,
                endTime: recetteEnd,
                text: recetteText
            },{
                startTime: bruitsStart,
                endTime: bruitsEnd,
                text: bruitsText
            },{
                startTime: marcheStart,
                endTime: 30,
                text: marcheText
            },{
                startTime: 30,
                endTime: 36.236,
                text: "Et ça me permet de faire environ six yaourts.\nDonc après à tester avec vos propres dosages."
            },{
                startTime: 36.236,
                endTime: unTiersEnd,
                text: unTiersText
            },{
                startTime: melangeStart,
                endTime: 47.056,
                text: melangeText
            },{
                startTime: 47.056,
                endTime: 52.288,
                text: "Ça met à peu près, même pas 5-10 minutes à se mélanger correctement.\nC'est vraiment super rapide à faire."
            },{
                startTime: 52.288,
                endTime: 58.065,
                text: "Hop ! Donc là c'est déjà bien mélangé.\nOn n'a plus qu'à rajouter le reste et ça va être super."
            },{
                startTime: 58.065,
                endTime: 64.227,
                text: "Donc le but c'est juste que... qu'il y ait pas trop trop de grumeaux.\nSi y'a un peu de grumeaux c'est pas la fin du monde. Euh... on s'en fout."
            },{
                startTime: 64.227,
                endTime: aPeuPresEnd,
                text: aPeuPresText
            },{
                startTime: cuireStart,
                endTime: cuireEnd,
                text: cuireText
            },{
                startTime: demerderStart,
                endTime: demerderEnd,
                text: demerderText
            },{
                startTime: nombreHeuresStart,
                endTime: nombreHeuresEnd,
                text: nombreHeuresText
            },{
                startTime: lienStart,
                endTime: lienEnd,
                text: lienText
            },{
                startTime: amazonStart,
                endTime: amazonEnd,
                text: amazonText
            },{
                startTime: merciStart,
                endTime: 92.702,
                text: merciText
            },{
                startTime: 92.702,
                endTime: demainEnd,
                text: demainText
            },{
                startTime: condenserStart,
                endTime: condenserEnd,
                text: condenserText
            },{
                startTime: eauStart,
                endTime: eauEnd,
                text: eauText
            },{
                startTime: parametrerStart,
                endTime: parametrerEnd,
                text: parametrerText
            },{
                startTime: petitYaourtStart,
                endTime: 122.532,
                text: petitYaourtText
            },{
                startTime: 122.532,
                endTime: 124.919,
                text: "Du coup c'est pas très différent que ceux que vous trouvez dans le commerce."
            },{
                startTime: 124.919,
                endTime: 130.866,
                text: "Bah... la seule différence... c'est que, bah au moins, vu que vous les avez fait, vous êtes sûr que y'a rien d'autre que du yaourt et du lait.\nY'a pas d'additif ni rien, donc ça c'est cool."
            },{
                startTime: 130.866,
                endTime: 134.586,
                text: "Et ça permet au passage de ne pas jeter de plastique,\nvu que vous réutilisez les mêmes pots à chaque fois."
            },{
                startTime: 134.586,
                endTime: 138,
                text: "En fait vous achetez... bah... \ndes laits dans des bouteilles en carton / des boîtes en carton."
            },{
                startTime: 138,
                endTime: 142.907,
                text: "Mais au final vous jetez que du carton pour manger des yaourts !\nEt ça c'est super cool !"
            },{
                startTime: 142.907,
                endTime: 148.681,
                text: "Bon bah c'était Pierre ! J'espère que cette vidéo vous a plu.\nEt, sur ce, je vous dis à la prochaine ! Allez salut !"
            }]
        }

        const expectedTexts: Text[] = [
            createText(1, clip1Start, importantEnd, importantText),
            createText(2, facileStart, facileEnd, facileText),
            createText(3, cEstToutStart, clip1End, cEstToutText),
            createText(4, clip2Start, recetteEnd, recetteText),
            createText(5, bruitsStart, bruitsEnd, bruitsText),
            createText(6, marcheStart, clip2End, marcheText),
            createText(7, clip3Start, unTiersEnd, unTiersText),
            createText(8, melangeStart, clip3End, melangeText),
            createText(9, clip4Start, aPeuPresEnd, aPeuPresText),
            createText(10, cuireStart, cuireEnd, cuireText),
            createText(11, demerderStart, demerderEnd, demerderText),
            createText(12, nombreHeuresStart, nombreHeuresEnd, nombreHeuresText),
            createText(13, lienStart, lienEnd, lienText),
            createText(14, amazonStart, amazonEnd, amazonText),
            createText(15, merciStart, clip4End, merciText),
            createText(16, clip5Start, demainEnd, demainText),
            createText(17, condenserStart, condenserEnd, condenserText),
            createText(18, eauStart, eauEnd, eauText),
            createText(19, parametrerStart, parametrerEnd, parametrerText),
            createText(20, petitYaourtStart, clip5End, petitYaourtText)
        ]

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertTextMatchesSubtitles(expectedTexts, newTexts)
    })
})
