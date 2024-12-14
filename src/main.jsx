import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import PollComponent from './components/PollComponent';
import AddPollComponent from './components/AddPollComponent';
import DeletePollComponent from './components/DeletePollComponent';
import './index.css';

const App = () => {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PollComponent token={token} />} />
        <Route path="/login" element={<LoginComponent setToken={setToken} />} />
        <Route path="/register" element={<RegisterComponent setToken={setToken} />} />
        <Route path="/add" element={<AddPollComponent token={token} />} />
        <Route path="/delete" element={<DeletePollComponent token={token} />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
