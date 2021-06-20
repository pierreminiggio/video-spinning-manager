import Text from '../../../Entity/Text'

function pushIndexIfNotPresent (indexes: number[], newIndex: number): void {
    if (! indexes.includes(newIndex)) {
        indexes.push(newIndex)
    }
}

export default function findColliders(needle: Text, haystack: Array<Text>): number[] {
    const colliderIndexes: number[] = []

    haystack.forEach((text: Text, textIndex: number): void => {
        if (needle.start >= text.start && needle.start <= text.end) {
            pushIndexIfNotPresent(colliderIndexes, textIndex)
            return
        }
    })

    return colliderIndexes
}