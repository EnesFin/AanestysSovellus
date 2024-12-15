import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(role === 'admin');
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/"><img src="/navbar.png" alt="" width="50" height="50" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Etusivu</Link>
            </li>
            {!isLoggedIn && ( 
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/register">REKISTERÖIDY NYT!</Link>
            </li>
             )}
            {isAdmin && (
            <li className="nav-item">
              <Link to="add"><button className="btn btn-outline-success">Lisää uusi kysely</button></Link>
            </li>
                  )}
          </ul>
          {isLoggedIn ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Kirjaudu Ulos</button>
          ) : (
            <Link to="/login"><button className="btn btn-outline-success">Kirjaudu Sisään</button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;