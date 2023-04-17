import React, { useRef, useState, useEffect } from 'react';
import './Login.css';
import PropTypes from 'prop-types';
import { Navigate, Link, useNavigate } from 'react-router-dom';

var api_host = process.env.REACT_APP_API_URL,
  statusCode = '';

async function loginUser(credentials) {
  return fetch(api_host + '/api/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((res) => {
    statusCode = res.status;
    return res.json();
  });
}
export default function Login() {

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [responseMessage, setReponseMessage] = useState('');

  useEffect(() => {
    const checkToken = () => {
      if (sessionStorage.getItem('token')) {
        navigate('/dashboard');
      }
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username == null || password == null) {

      setReponseMessage('Please fill in all fields');
    } else {

      const token = await loginUser({
        "username": username,
        "password": password
      });

      setReponseMessage(token.message);
      setUserName('');
      setPassword('');

      if (statusCode >= 200 && statusCode <= 202) {
        setSuccess(true);

        sessionStorage.setItem('token', JSON.stringify(token));
        navigate('/dashboard');
      } else {
        setSuccess(false);
      }
      setReponseMessage(token.message.toString());
    }
  }

  return (
    <div className="login-wrapper">
      <h1 className="app-header-name">snapfu</h1>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
            <button disabled={!username || !password ? true : false}>Log In</button>
        </div>
      </form>
      <p className="invalid"> {responseMessage} </p>
      <span className="line">
        <p>No Account yet?</p>
        <Link to="/signup">Sign Up</Link>
      </span>
    </div>
  )
}
