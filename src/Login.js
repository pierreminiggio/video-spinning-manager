import React, { useState } from 'react';
import fetch from 'node-fetch';
import { setUserSession } from './Utils/Common';

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
    <div>
      Login<br /><br />
      <div>
        <label for="login">Username</label><br/>
        <input type="text" id="login" {...username} autoComplete="login" />
      </div>
      <div style={{ marginTop: 10 }}>
        <label for="password">Password</label><br/>
        <input type="password" id="password" {...password} autoComplete="password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;