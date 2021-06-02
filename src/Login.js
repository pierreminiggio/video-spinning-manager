import { useState } from 'react';
import fetch from 'node-fetch';
import { setUserSession } from './Utils/Common';
import { Button, TextField } from '@material-ui/core'
import flexColumn from './Style/flexColumn';
import useFormInput from './Form/useFormInput';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    const url = `${process.env.REACT_APP_LOGIN_API_URL}/api/auth/login`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        email: username.value,
        password: password.value
      })
    }).then(response => {
      response.json().then(jsonResponse => {
        setLoading(false)
        if ([400, 403, 404].includes(response.status)) {
          setError(jsonResponse.error)
          return
        }

        const user = {...jsonResponse}
        delete user.token

        setUserSession(jsonResponse.token, user);
        props.history.push('/dashboard');
      })
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 403) setError(error.response.data.error);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return (
    <div style={flexColumn}>
      <h1>Login</h1>
      <TextField label="Username" {...username} autoComplete="login"/>
      <TextField label="Password" {...password} autoComplete="password" type="password"/>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleLogin()}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </div>
  );
}

export default Login;
