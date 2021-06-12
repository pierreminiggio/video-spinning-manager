import baseUrl from "../baseUrl";

export default function getThumbnailUrlByContentIdAndTime(contentId: number, time: number) {
    return baseUrl + '/thumbnail/' + contentId + '?s=' + time
}