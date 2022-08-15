import Text from '../../src/Entity/Text'

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

export function assertSameTextLists (expected: Text[], actual: Text[]): void {
    return new TextListAssertor(assertSameTexts).assertLists(expected, actual)
}

export function assertTextsMatchesSubtitles (expected: Text[], actual: Text[]): void {
    return new TextListAssertor(assertTextMatchesSubtitles).assertLists(expected, actual)
}
