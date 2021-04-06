import React from 'react';

function ContentToSpin(props) {
  const token = props.token
  const history = props.history
  const video = history.location.state.video
  
  const finishEditingContent = (e) => {
    e.preventDefault()

    fetch(
        process.env.REACT_APP_SPINNER_API_URL + '/done/' + video.id,
        {
          method: 'post',
          headers: new Headers({
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
          }), 
        }
      ).then(response => {
        if (response.status !== 204) {
          return
        }
  
        history.push({
          pathname: '/dashboard/'
        })
      }).catch(error => {
        // error
      });
  }

  return (
    <div>
      {video.title}
      <br/><a href="" onClick={(e) => finishEditingContent(e)}>Done</a>
    </div>
  );
}

export default ContentToSpin;
