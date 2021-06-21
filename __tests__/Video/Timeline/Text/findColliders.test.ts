import findColliders from '../../../../src/Video/Timeline/Text/findColliders'
import Text from '../../../../src/Entity/Text'

const text1: Text = {
    id: 1,
    content: 'test text',
    start: 0,
    end: 5,
    height: 7,
    color: '#fff',
    backgroundColor: '#FFA500',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 40
}

const text2: Text = {
    id: 2,
    content: 'test text 2',
    start: 3,
    end: 5,
    height: 7,
    color: '#fff',
    backgroundColor: '#FFA500',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 70
}

const text3: Text = {
    id: 3,
    content: 'test text 3',
    start: 6,
    end: 10,
    height: 7,
    color: '#fff',
    backgroundColor: '#FFA500',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 40
}

const text4: Text = {
    id: 4,
    content: 'test text 4',
    start: 5,
    end: 10,
    height: 7,
    color: '#fff',
    backgroundColor: '#FFA500',
    backgroundColorOpacity: .7,
    leftOffset: 20,
    rightOffset: 20,
    topOffset: 40
}

const texts = [text1, text2, text3, text4]

describe('Find Colliders', (): void => {
    texts.forEach((text: Text, textIndex: number): void => {
        it('should nothing colliding with text ' + (textIndex + 1) + ' because haystack is empty', (): void => {
            expect(findColliders(text, [])).toStrictEqual([])
        })
    })

    it('text 1 should collide with text 2 if alone in stack', (): void => {
        expect(findColliders(text1, [text2])).toStrictEqual([0])
    })

    it('text 2 should collide with text 1 if alone in stack', (): void => {
        expect(findColliders(text2, [text1])).toStrictEqual([0])
    });

    [text1, text2].forEach((text: Text, textIndex: number): void => {
        it('text 3 should not collide with text ' + (textIndex + 1) + ' if alone in stack', (): void => {
            expect(findColliders(text3, [text])).toStrictEqual([])
        })
    })

    it('text 2 should collide with text 1 even with text 3 in stack', (): void => {
        expect(findColliders(text2, [text1, text3])).toStrictEqual([0])
        expect(findColliders(text2, [text3, text1])).toStrictEqual([1])
    })

    it('text 1 should collide with text 2 even with text 3 in stack', (): void => {
        expect(findColliders(text1, [text2, text3])).toStrictEqual([0])
        expect(findColliders(text1, [text3, text2])).toStrictEqual([1])
    })

    it('text 3 should not collide with texts 1 and 2', (): void => {
        expect(findColliders(text3, [text1, text2])).toStrictEqual([])
    })

    it('text 4 should not collide with texts 1 and 2', (): void => {
        expect(findColliders(text4, [text1, text2])).toStrictEqual([])
    })
})
