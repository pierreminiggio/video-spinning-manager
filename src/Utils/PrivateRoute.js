import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';

// handle the private routes
function PrivateRoute({ component: Component, passProps: PassProps, ...rest }) {
  
  return (
    <Route
      {...rest}
      render={props => getToken() ? <Component {...{...props, ...PassProps}} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

export default PrivateRoute;