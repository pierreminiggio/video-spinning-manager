import TimeableEntity from "../../Entity/TimeableEntity";

export default function getWidthForTimeline(clip: TimeableEntity, totalTime: number): number {
    return Math.floor(100 * (clip.end - clip.start) / totalTime)
}