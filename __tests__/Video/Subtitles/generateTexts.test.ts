import Clip from '../../../src/Entity/Clip'
import LanguageAndSubtitles from '../../../src/Entity/Subtitle/LanguageAndSubtitles'
import Text from '../../../src/Entity/Text'
import Transition from '../../../src/Entity/Video/Clip/Crop/Transition'
import generateTexts from '../../../src/Video/Subtitles/generateTexts'
import {assertSameTextLists, assertTextsMatchesSubtitles} from '../../Helper/TextAssertion'

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
    const importantText = "mais c'est pour vous parler de quelque chose qui je pense est important."

    const facileStart = 6.703
    const facileEnd = 10.616
    const facileText = "J'sais pas si vous savez mais c'est incroyablement simple\nde faire ses propres yaourts."

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

    const parametrerEnd = 114.117
    const parametrerText = "Et ensuite, et bah... j'ai plus qu'à paramétrer... euh... pour mettre 10 heures.\nHop ! Et puis je lance ! Et demain j'aurai des yaourts ! C'est aussi simple que ça."

    const petitYaourtStart = 114.117
    const petitYaourtText = "Et après le lendemain... et bien... ça ressemble à ça.\nHop ! Un bon petit yaourt !"

    const LanguageAndSubtitles: LanguageAndSubtitles = {
        language: 'French',
        subtitles: [{
            startTime: 0,
            endTime: 3.831,
            text: "Salut ! Aujourd'hui je vais poster une vidéo\nqui a complètement rien à voir avec ce que je poste d'habitude"
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
            endTime: 97.218,
            text: "Alors voilà j'ai mis les six yaourts dans la yaourtière.\nVous ferez bien attention je n'ai pas mis les couvercles."
        },{
            startTime: 97.218,
            endTime: 102,
            text: "C'est très important ça permet à l'eau de venir condenser\nsur le couvercle de la yaourtière plutôt que dans les yaourts."
        },{
            startTime: 102,
            endTime: 104.324,
            text: "Parce que sinon il y aura de l'eau dans les yaourts, et ça c'est pas ouf. "
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
