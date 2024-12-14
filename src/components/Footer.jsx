import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-light text-muted text-center">
      <div className="container">
        <p className="mb-1">&copy; 2024 YAHYA - TUOMAS - ENES</p>
        <ul className="list-inline">
          <li className="list-inline-item"><a href="https://github.com/EnesFin/AanestysSovellus" target="_blank" rel="noopener noreferrer">Github Linkki</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
