import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';

// handle the public routes
function PublicRoute({ component: Component, passProps: PassProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => !getToken() ? <Component {...{...props, ...PassProps}} /> : <Redirect to={{ pathname: '/dashboard' }} />}
    />
  )
}

export default PublicRoute;