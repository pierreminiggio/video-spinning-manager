import Clip from '../../../src/Entity/Clip'
import LanguageAndSubtitles from '../../../src/Entity/Subtitle/LanguageAndSubtitles'
import Text from '../../../src/Entity/Text'
import Transition from '../../../src/Entity/Video/Clip/Crop/Transition'
import generateTexts from '../../../src/Video/Subtitles/generateTexts'

const assertSameTexts = (expected: Text, actual: Text): void => {
    expect(actual.id).toStrictEqual(expected.id)
    expect(actual.start).toStrictEqual(expected.start)
    expect(actual.end).toStrictEqual(expected.end)
    expect(actual.content).toStrictEqual(expected.content)
    expect(actual.height).toStrictEqual(expected.height)
    expect(actual.color).toStrictEqual(expected.color)
    expect(actual.backgroundColor).toStrictEqual(expected.backgroundColor)
    expect(actual.backgroundColorOpacity).toStrictEqual(expected.backgroundColorOpacity)
    expect(actual.leftOffset).toStrictEqual(expected.leftOffset)
    expect(actual.rightOffset).toStrictEqual(expected.rightOffset)
    expect(actual.topOffset).toStrictEqual(expected.topOffset)
}

class TextListAssertor {

    private assertOne: (expected: Text, actual: Text) => void

    constructor (assertOne: (expected: Text, actual: Text) => void) {
        this.assertOne = assertOne
    }

    public assertLists (expected: Text[], actual: Text[]): void {
        expect(actual.length).toStrictEqual(expected.length)
    
        for (const textKey in expected) {
            this.assertOne(expected[textKey], actual[textKey])
        }
    }
}

const assertTextMatchesSubtitles = (expected: Text, actual: Text): void => {
    for (const key of ['id', 'start', 'end', 'content']) {
        expect(actual[key]).toStrictEqual(expected[key])
    }
}

const assertSameTextLists = (expected: Text[], actual: Text[]): void => new TextListAssertor(assertSameTexts).assertLists(expected, actual)
const assertTextsMatchesSubtitles = (expected: Text[], actual: Text[]): void => new TextListAssertor(assertTextMatchesSubtitles).assertLists(expected, actual)

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

const getYaourtTestData = (): {
    expectedTexts: Text[]
    clips: Clip[]
    LanguageAndSubtitles: LanguageAndSubtitles
} => {
    const clip1Start = 6.336
    const clip1End = 13.6
    const clip1Length = clip1End - clip1Start

    const clip2Start = 18.688
    const clip2End = 29.424
    const clip2Length = clip2End - clip2Start
    const clip1Et2Length = clip1Length + clip2Length

    const clip3Start = 40.256
    const clip3End = 43.52
    const clip3Length = clip3End - clip3Start
    const clip1Et2Et3Length = clip1Et2Length + clip3Length

    const clip4Start = 66
    const clip4End = 92.48
    const clip4Length = clip4End - clip4Start
    const clip1Et2Et3Et4Length = clip1Et2Et3Length + clip4Length

    const clip5Start = 113.856
    const clip5End = 121.8
    const clip5Length = clip5End - clip5Start
    const clip1Et2Et3Et4Et5Length = clip1Et2Et3Et4Length + clip5Length

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
    
    const importantEnd = 6.703
    const importantText = "mais c'est pour vous parler de??quelque chose qui je pense est important."

    const facileStart = 6.703
    const facileEnd = 10.616
    const facileText = "J'sais pas??si vous savez mais c'est incroyablement simple\nde faire ses propres yaourts."

    const cEstToutStart = 10.616
    const cEstToutText = "Donc pour faire ??a??il faut un yaourt, et du lait, c'est tout !"

    const recetteEnd = 20.468
    const recetteText = "Lait entier, demi ??cr??m??, tout marche.\nApparemment??lait entier c'est mieux pour faire ??a mais tout fonctionne.\nEt il faut tout simplement les m??langer."

    const bruitsStart = 20.468
    const bruitsEnd = 25.551
    const bruitsText = "*Bruits de yaourt*"

    const marcheStart = 25.551
    const marcheText = "Ce qui marche bien pour moi c'est de mettre ????peu pr??s\nun litre de lait pour un yaourt."

    const unTiersEnd = 40.973
    const unTiersText = "Donc, ce que je fais c'est que je mets d??j?? un tout petit peu de lait.\n?? peu pr??s genre le tiers."

    const melangeStart = 40.973
    const melangeText = "Je m??lange jusqu'?? ce????a soit ?? peu pr??s bien m??lang??\net ensuite??je rajoute la fin pour ??a fasse 1 litre."

    const aPeuPresEnd = 68.93
    const aPeuPresText = "Tant que ??a ?? peu pr??s bien m??lang????ce sera bon.\nEt ensuite, une fois qu'on a rempli??les pots,"

    const cuireStart = 68.93
    const cuireEnd = 72.725
    const cuireText = "il faut les laisser une nuit ?? 40??degr??s (Celsius).\nDonc ??a, vous avez deux choix :"

    const demerderStart = 72.725
    const demerderEnd = 77.525
    const demerderText = "C'est soit vous??d??merdez vous m??me et vos moyens pour chauffer\npour que ??a reste une nuit ?? 40??C."

    const nombreHeuresStart = 77.525
    const nombreHeuresEnd = 82.254
    const nombreHeuresText = "C'est ?? peu pr??s??entre 9 et 11 heures qu'il faut.\nEuh... ou bien, sinon, c'est de prendre comme moi une yaourti??re."

    const lienStart = 82.254
    const lienEnd = 85.562
    const lienText = "Euh... si y'en a que ??a int??resse d'avoir la m??me,\nje vous??mettrai un lien dans la description."

    const amazonStart = 85.562
    const amazonEnd = 90.724
    const amazonText = "C'est pas sponsoris??, mais c'est un lien affili?? Amazon.\nDonc si jamais??vous prenez un truc sur Amazon en passant par mon??lien,\n??a aidera ma cha??ne."

    const merciStart = 90.724
    const merciText = "Donc merci si jamais il y en a qui??font ??a."

    const parametrerEnd = 114.117
    const parametrerText = "Et ensuite, et bah... j'ai plus qu'?? param??trer... euh...??pour mettre 10 heures.\nHop ! Et puis je lance ! Et demain j'aurai des yaourts ! C'est aussi??simple que ??a."

    const petitYaourtStart = 114.117
    const petitYaourtText = "Et apr??s le lendemain... et bien... ??a??ressemble ?? ??a.\nHop ! Un bon petit yaourt !"

    const LanguageAndSubtitles: LanguageAndSubtitles = {
        language: 'French',
        subtitles: [{
            startTime: 0,
            endTime: 3.831,
            text: "Salut ! Aujourd'hui je vais poster une vid??o\nqui a compl??tement rien ?? voir avec ce que je??poste d'habitude"
        },{
            startTime: 3.831,
            endTime: importantEnd,
            text: importantText
        },{
            startTime: facileStart,
            endTime: facileEnd,
            text: facileText
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
            text: "Et ??a me permet de faire environ six yaourts.\nDonc apr??s???? tester avec vos propres dosages."
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
            text: "??a met ?? peu pr??s, m??me pas 5-10 minutes ?? se m??langer??correctement.\nC'est vraiment super rapide ?? faire."
        },{
            startTime: 52.288,
            endTime: 58.065,
            text: "Hop ! Donc l?? c'est d??j?? bien m??lang??.\nOn n'a plus qu'????rajouter le reste et ??a va ??tre super."
        },{
            startTime: 58.065,
            endTime: 64.227,
            text: "Donc le but??c'est juste que... qu'il y ait pas trop trop de grumeaux.\nSi y'a un peu de grumeaux c'est pas la fin du monde. Euh... on s'en fout."
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
            endTime: 97.218,
            text: "Alors voil?? j'ai mis les six yaourts dans la yaourti??re.\nVous ferez bien attention je n'ai pas mis les couvercles."
        },{
            startTime: 97.218,
            endTime: 102,
            text: "C'est tr??s important ??a permet???? l'eau de venir condenser\nsur le couvercle de la??yaourti??re plut??t que dans les yaourts."
        },{
            startTime: 102,
            endTime: 104.324,
            text: "Parce que sinon??il y aura de l'eau dans les yaourts, et ??a c'est??pas ouf.??"
        },{
            startTime: 104.324,
            endTime: parametrerEnd,
            text: parametrerText
        },{
            startTime: petitYaourtStart,
            endTime: 122.532,
            text: petitYaourtText
        },{
            startTime: 122.532,
            endTime: 124.919,
            text: "Du coup c'est??pas tr??s diff??rent que ceux que vous trouvez dans??le commerce."
        },{
            startTime: 124.919,
            endTime: 130.866,
            text: "Bah... la seule diff??rence... c'est que,??bah au moins, vu que vous les avez fait, vous ??tes s??r que y'a rien d'autre que du yaourt et du lait.\nY'a pas d'additif ni rien, donc ??a c'est cool."
        },{
            startTime: 130.866,
            endTime: 134.586,
            text: "Et ??a permet au passage de ne??pas jeter de plastique,\nvu que vous r??utilisez les m??mes??pots ?? chaque fois."
        },{
            startTime: 134.586,
            endTime: 138,
            text: "En fait vous achetez... bah... \ndes laits dans des bouteilles en carton / des bo??tes en carton."
        },{
            startTime: 138,
            endTime: 142.907,
            text: "Mais au final vous jetez que du carton??pour manger des yaourts !\nEt ??a c'est super??cool !"
        },{
            startTime: 142.907,
            endTime: 148.681,
            text: "Bon bah c'??tait Pierre ! J'esp??re que cette vid??o vous??a plu.\nEt, sur ce, je vous dis ?? la prochaine ! Allez salut !"
        }]
    }

    const expectedTexts: Text[] = [
        createText(1, 0, importantEnd - clip1Start, importantText),
        createText(2, facileStart - clip1Start, facileEnd - clip1Start, facileText),
        createText(3, cEstToutStart - clip1Start, clip1End - clip1Start, cEstToutText),
        createText(4, clip1Length, clip1Length + (recetteEnd - clip2Start), recetteText),
        createText(5, clip1Length + (bruitsStart - clip2Start), clip1Length + (bruitsEnd - clip2Start), bruitsText),
        createText(6, clip1Length + (marcheStart - clip2Start), clip1Et2Length, marcheText),
        createText(7, clip1Et2Length, clip1Et2Length + (unTiersEnd - clip3Start), unTiersText),
        createText(8, clip1Et2Length + (melangeStart - clip3Start), clip1Et2Et3Length, melangeText),
        createText(9, clip1Et2Et3Length, clip1Et2Et3Length + (aPeuPresEnd - clip4Start), aPeuPresText),
        createText(10, clip1Et2Et3Length + (cuireStart - clip4Start), clip1Et2Et3Length + (cuireEnd - clip4Start), cuireText),
        createText(11, clip1Et2Et3Length + (demerderStart - clip4Start), clip1Et2Et3Length + (demerderEnd - clip4Start), demerderText),
        createText(12, clip1Et2Et3Length + (nombreHeuresStart - clip4Start), clip1Et2Et3Length + (nombreHeuresEnd - clip4Start), nombreHeuresText),
        createText(13, clip1Et2Et3Length + (lienStart - clip4Start), clip1Et2Et3Length + (lienEnd - clip4Start), lienText),
        createText(14, clip1Et2Et3Length + (amazonStart - clip4Start), clip1Et2Et3Length + (amazonEnd - clip4Start), amazonText),
        createText(15, clip1Et2Et3Length + (merciStart - clip4Start), clip1Et2Et3Et4Length, merciText),
        createText(16, clip1Et2Et3Et4Length, clip1Et2Et3Et4Length + (parametrerEnd - clip5Start), parametrerText),
        createText(17, clip1Et2Et3Et4Length + (petitYaourtStart - clip5Start), clip1Et2Et3Et4Et5Length, petitYaourtText)
    ]

    return {expectedTexts, clips, LanguageAndSubtitles}
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

        const {expectedTexts, clips, LanguageAndSubtitles} = getYaourtTestData()
        const texts: Text[] = []

        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertTextsMatchesSubtitles(expectedTexts, newTexts)
    })

    it('should generate texts for the Yaourt video and replace old ones', (): void => {

        const {expectedTexts, clips, LanguageAndSubtitles} = getYaourtTestData()
        const texts: Text[] = expectedTexts.map((text: Text): Text => ({...text, subtitleId: 'French'}))
        
        const newTexts = generateTexts(clips, texts, LanguageAndSubtitles)
        assertTextsMatchesSubtitles(expectedTexts, newTexts)
    })
})
