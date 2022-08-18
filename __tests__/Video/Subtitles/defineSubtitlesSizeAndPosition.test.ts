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
                content: "J'sais pas si vous savez",
                minWidth: 3.5,
                maxWidth: 4.4
            },
            {
                content: "mais c'est incroyablement simplede faire ses propres yaourts.",
                minWidth: 2.5,
                maxWidth: 3.9
            },
            {
                content: "J'sais pas si vous savez mais c'est incroyablement simplede faire ses propres yaourts.",
                minWidth: 2.1,
                maxWidth: 3.7
            },
            {
                content: "Donc pour faire ça il faut un yaourt, et du lait, c'est tout !",
                minWidth: 3,
                maxWidth: 4.5
            },
            {
                content: "*Bruits de yaourt*",
                minWidth: 4,
                maxWidth: 5.6
            },
            {
                content: "Donc merci si jamais il y en a qui font ça.",
                minWidth: 2.5,
                maxWidth: 5
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
