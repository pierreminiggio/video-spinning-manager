import Timeable from "../../Entity/Timeable";

export default function getWidthForTimeline(clip: Timeable, totalTime: number): number {
    return Math.floor(100 * (clip.end - clip.start) / totalTime)
}