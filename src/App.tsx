import { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import fetch from 'node-fetch';

import Login from './Login';
import Dashboard from './Dashboard';
import ContentToSpin from './ContentToSpin';
import NewForm from './Video/NewForm';
import Home from './Home';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import Detail from './Video/Detail';
import Token from './Struct/Token';
import VideosToUpload from './Video/Upload/VideosToUpload';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState<Token>(null);

  useEffect(() => {
    const appToken = getToken();
    if (! appToken) {
      return;
    }

    fetch(`${process.env.REACT_APP_LOGIN_API_URL}/api/auth/token?token=${appToken}`).then(response => response.json()).then(response => {
      if ([400, 403, 404].includes(response.status)) {
        setToken(null)
        removeUserSession();
        setAuthLoading(false);
        return
      }
      const user = {...response}
      delete user.token

      setToken(appToken)
      setUserSession(response.token, user);
      setAuthLoading(false);
    }).catch(error => {
      setToken(null)
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">Home</NavLink>
            { token && <NavLink exact activeClassName="active" to="/dashboard">Videos to clip</NavLink> }
            { token && <NavLink exact activeClassName="active" to="/to-upload">Videos to upload</NavLink> }
            { (! token) && <NavLink exact activeClassName="active" to="/login">Login</NavLink> }
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} passProps={{setToken}} />
              <PrivateRoute path="/dashboard" component={Dashboard} passProps={{token, setToken}} />
              <PrivateRoute path="/to-upload" component={VideosToUpload} passProps={{token}} />
              <PrivateRoute path="/content/:id/new" component={NewForm} passProps={{token}} />
              <PrivateRoute path="/content/:contentId/video/:id" component={Detail} passProps={{token}} />
              <PrivateRoute path="/content/:id" component={ContentToSpin} passProps={{token}} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
