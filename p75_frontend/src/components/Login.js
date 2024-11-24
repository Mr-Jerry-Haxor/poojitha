import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', { username, password });
      setToken(response.data.access_token);
      history.push('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your username and password.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form" aria-label="Login Form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  );
}

export default Login;