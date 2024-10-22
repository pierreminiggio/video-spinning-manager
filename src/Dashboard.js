import { Button } from '@material-ui/core';
import { getUser, getToken, removeUserSession } from './Utils/Common';
import ToProcessList from './ToProcessList'
import gap from './Style/gap';
import flexColumn from './Style/flexColumn';

function Dashboard(props) {
  const user = getUser();
  let token = props.token
  
  if (token === null) {
    token = getToken()
  }

  // handle click event of logout button
  const handleLogout = () => {
    props.setToken(null)
    removeUserSession();
    props.history.push('/login');
  }

  return (
    <div style={flexColumn}>
      <h1 style={{textAlign: 'center'}}>Welcome {user.first_name} {user.name} !</h1>
      <ToProcessList token={token} history={props.history} style={{
        marginTop: gap,
        ...flexColumn,
        gap: 10
      }} />
      <Button
        variant="contained"
        color="secondary"
        style={{marginTop: gap}}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
