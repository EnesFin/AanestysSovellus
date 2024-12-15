import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const AddPollComponent = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleAddPoll = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/polls`, 
        { question, options: options.map(option => ({ name: option })) },
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure correct format
        }
      );
      alert('Poll added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to add poll:', error.response ? error.response.data : error.message);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = options.slice();
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.slice();
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <div className="container-fluid bg-light d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <h1 className="text-center mb-4">Add a New Poll</h1>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Poll Question" 
          />
        </div>
        {options.map((option, index) => (
          <div className="input-group mb-3" key={index}>
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button className="btn btn-danger" onClick={() => handleRemoveOption(index)}>Remove</button>
          </div>
        ))}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <button className="btn btn-secondary me-md-2" onClick={handleAddOption}>Add Option</button>
          <button className="btn btn-primary" onClick={handleAddPoll}>Add Poll</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddPollComponent;
