import React from 'react';
import { getUser, getToken, removeUserSession } from './Utils/Common';
import ToProcessList from './ToProcessList'

function Dashboard(props) {
  const user = getUser();
  let token = props.token
  
  if (token === null) {
    token = getToken()
  }

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push('/login');
  }

  return (
    <div>
      Welcome {user.name}!<br /><br />
      <input type="button" onClick={handleLogout} value="Logout" />
      <ToProcessList token={token} history={props.history} />
    </div>
  );
}

export default Dashboard;
