import findColliders from '../../../../src/Video/Timeline/Text/findColliders'
import Text from '../../../../src/Entity/Text'

const text1: Text = {
    content: 'test text',
    start: 0,
    end: 5,
    height: 7,
    color: '#fff',
    backgroundColor: 'rgb(255,165,0)',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 40
}

const text2: Text = {
    content: 'test text 2',
    start: 3,
    end: 5,
    height: 7,
    color: '#fff',
    backgroundColor: 'rgb(255,165,0)',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 70
}

const text3: Text = {
    content: 'test text 3',
    start: 6,
    end: 10,
    height: 7,
    color: '#fff',
    backgroundColor: 'rgb(255,165,0)',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 40
}

const texts = [text1, text2, text3]

describe('Find Colliders', () => {
    texts.forEach((text: Text, textIndex: number): void => {
        it('should nothing colliding with text ' + (textIndex + 1) + ' because haystack is empty', () => {
            expect(findColliders(text, [])).toStrictEqual([])
        })
    })

    it('text 2 should collide with text 1 if alone in stack', () => {
        expect(findColliders(text2, [text1])).toStrictEqual([0])
    });

    [text1, text2].forEach((text: Text, textIndex: number): void => {
        it('text 3 should not collide with text ' + (textIndex + 1) + ' if alone in stack', () => {
            expect(findColliders(text3, [text])).toStrictEqual([])
        })
    })

    it('text 3 should not collide with texts 1 and 2', () => {
        expect(findColliders(text3, [text1, text2])).toStrictEqual([])
    })
})
