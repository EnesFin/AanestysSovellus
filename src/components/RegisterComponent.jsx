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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { username, password, email, role });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setRegisterSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    let timer;
    if (registerSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [registerSuccess, navigate]);

  return (
    <div className="container">
      <Navbar />
      {registerSuccess ? (
        <div className="text-center">
          <img className="mt-4" src="/assets/success.png" alt="Registration Successful" width="150" height="150" />
          <h1 className="h3 mb-3 fw-normal">You will be transferred to the home page in {countdown} seconds</h1>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <Link to="/"><img className="mt-4" src="/navbar.png" alt="" width="90" height="90" /></Link>
          </div>
          <main className="form-signin w-100 m-auto">
            <form id="registerForm" onSubmit={handleSubmit}>
              <h1 className="h3 mb-3 fw-normal">Rekisteröidy</h1>
              <div className="form-floating">
                <input type="text" className="form-control" id="username" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">User Name</label>
              </div>
              <div className="form-floating">
                <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">Email</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-success w-100 py-2" type="submit">Register</button>
            </form>
            <div className="text-start my-3">
              <a href="remember.html"><label>Unohditko salasanasi?</label></a>
            </div>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
};

export default RegisterComponent;
