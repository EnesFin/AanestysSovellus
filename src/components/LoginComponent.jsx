import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const LoginComponent = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
      if (loginSuccess) {
        let timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
  
        if (countdown === 0) {
          clearInterval(timer);
          navigate('/');
        }
  
        return () => clearInterval(timer);
      }
    }, [loginSuccess, countdown, navigate]);
  
  return (
    <div className="container">
      <Navbar/>
      {loginSuccess ? (
        <div className="text-center">
          <img className="mt-4" src="/success.png" alt="Login Successful" width="150" height="150" />
          <h1 className="h3 mb-3 fw-normal">Siirryt etusivulle {countdown} sekunnin kuluttua...</h1>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <Link to="/"><img className="mt-4" src="/login.png" alt="" width="90" height="90" /></Link>
          </div>
          <main className="form-signin w-100 m-auto">
            <form id="loginForm" onSubmit={handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">Kirjaudu tilillesi</h1>
              <div className="form-floating">
                <input type="text" className="form-control" id="username" placeholder="Käyttäjänimi" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">Käyttäjänimi</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password">Salasana</label>
              </div>
              <button className="btn btn-success w-100 py-2" type="submit">Kirjaudu</button>
            </form>
            <div className="text-start my-3">
               <Link to="/register"><label>Etkö ole jäsen? REKISTERÖIDY NYT!</label></Link>
            </div>
          </main>
        </>
      )}
     <Footer/>
    </div>
  );
};

export default LoginComponent;
