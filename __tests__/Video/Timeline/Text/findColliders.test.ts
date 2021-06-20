import findColliders from '../../../../src/Video/Timeline/Text/findColliders'

describe('Find Colliders', () => {
   it('should find none if empty haystack', () => {
       expect(findColliders({
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
       }, [])).toStrictEqual([])
   });
});
