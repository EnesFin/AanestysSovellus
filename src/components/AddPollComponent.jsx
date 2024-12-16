import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const AddPollComponent = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(false); // Success state
  const [error, setError] = useState(''); // Error message state

  const handleAddPoll = async () => {
    const token = localStorage.getItem('token');
    setLoading(true); // Start loading
    setError(''); // Clear any previous error
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/polls`, 
        { question, options: options.map(option => ({ name: option })) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setQuestion(''); // Clear question input
      setOptions(['', '']); // Reset options
    } catch (error) {
      const errorMsg = error.response && error.response.data ? error.response.data.error : 'Failed to add poll';
      setError(errorMsg);
      console.error('Failed to add poll:', errorMsg);
    } finally {
      setLoading(false); // End loading
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
        {error && <div className="alert alert-danger">Error: {error}</div>}
        {success && (
          <div className="alert alert-success">
            Poll added successfully! <Link to="/">Return to homepage</Link>
          </div>
        )}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <button className="btn btn-secondary me-md-2" onClick={handleAddOption} disabled={loading}>
            Add Option
          </button>
          <button className="btn btn-primary" onClick={handleAddPoll} disabled={loading}>
            {loading ? 'Adding poll...' : 'Add Poll'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddPollComponent;
