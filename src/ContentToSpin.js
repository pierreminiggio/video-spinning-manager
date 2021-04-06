import React from 'react';

function ContentToSpin(props) {
  const history = props.history
  const video = history.location.state.video
  
  const finishEditingContent = (e) => {
    e.preventDefault()
    console.log(video.id)
    props.history.push({
      pathname: '/dashboard/'
    })
  }

  return (
    <div>
      {video.title}
      <br/><a href="" onClick={(e) => finishEditingContent(e)}>Done</a>
    </div>
  );
}

export default ContentToSpin;
