import { useParams } from "react-router"

export default function Detail(props) {
    const token = props.token
    const {videoId, id} = useParams()

    const navigateToContent = (e, videoId) => {
        e.preventDefault()
        props.history.push({
          pathname: '/content/' + videoId,
        })
      }

    return <div>
        <a href="#" onClick={e => navigateToContent(e, videoId)}>‹ Retour</a>
    </div>
}