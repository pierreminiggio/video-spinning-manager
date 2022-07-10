import defineSubtitlesSizeAndPosition from '../../../src/Video/Subtitles/defineSubtitlesSizeAndPosition'

describe('Define Subtitles\' Size And Position', (): void => {
    it('should look nice', (): void => {
        const padding = 3
        const tests: {
            content: string
            minWidth: number
            maxWidth: number
        }[] = [
            {
                content: "J'sais pas si vous savez mais c'est incroyablement simplede faire ses propres yaourts.",
                minWidth: 2.1,
                maxWidth: 3.7
            }
        ]
        
        for (const test of tests) {
            const {height, leftOffset, rightOffset} = defineSubtitlesSizeAndPosition(test.content)
            expect(leftOffset).toStrictEqual(padding)
            expect(rightOffset).toStrictEqual(padding)
            expect(height).toBeGreaterThanOrEqual(test.minWidth)
            expect(height).toBeLessThanOrEqual(test.maxWidth)
        }
    })
})
