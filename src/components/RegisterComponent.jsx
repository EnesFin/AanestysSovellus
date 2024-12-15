import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const RegisterComponent = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // default to 'user', can be 'admin' if required
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { username, password });
      


      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setRegisterSuccess(true);
      } else {
        throw new Error('Login failed: Token not found');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { username, password, email, role });
      
     

      if (response.data && (response.data.message === 'User registered successfully' || response.data.message === 'Admin registered successfully')) {
        
        // Proceed to login if registration is successful
        await handleLogin();
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (registerSuccess) {
      let timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        navigate('/');
      }

      return () => clearInterval(timer);
    }
  }, [registerSuccess, countdown, navigate]);

  return (
    <div className="container">
      <Navbar />
      {registerSuccess ? (
        <div className="text-center">
          <img className="mt-4" src="/success.png" alt="Registration Successful" width="150" height="150" />
          <h1 className="h3 mb-3 fw-normal">Siirryt etusivulle {countdown} sekunnin kuluttua...</h1>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <Link to="/"><img className="mt-4" src="/signup.jpg" alt="" width="90" height="90" /></Link>
          </div>
          <main className="form-signin w-100 m-auto">
            <form id="registerForm" onSubmit={handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">Rekisteröidy</h1>
              <div className="form-floating">
                <input type="text" className="form-control" id="username" placeholder="Käyttäjänimi" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">Käyttäjänimi</label>
              </div>
              <div className="form-floating">
                <input type="email" className="form-control" id="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">Sähköposti</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password">Salasana</label>
              </div>
              <div className="form-floating mb-2">
                <select className="form-control" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label htmlFor="role">Valitse Käyttäjätyyppi</label>
              </div>
              <button className="btn btn-primary w-100 py-2" type="submit">Rekisteröidy nyt</button>
            </form>
            <div className="text-start my-3">
              <Link to="/login"><label>Oletko jo jäsen?</label></Link>
            </div>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
};

export default RegisterComponent;
