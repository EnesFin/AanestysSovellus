import React, { useState } from 'react';
import axios from 'axios';

const AddPollComponent = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

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
    <div>
      <h1>Add a New Poll</h1>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Poll Question" />
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
          />
          <button onClick={() => handleRemoveOption(index)}>Remove Option</button>
        </div>
      ))}
      <button onClick={handleAddOption}>Add Option</button>
      <button onClick={handleAddPoll}>Add Poll</button>
    </div>
  );
};

export default AddPollComponent;
