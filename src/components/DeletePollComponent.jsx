import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeletePollComponent = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/polls`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPolls(response.data);
      } catch (error) {
        console.error('Failed to fetch polls:', error.response ? error.response.data : error.message);
      }
    };
    fetchPolls();
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/polls/${selectedPoll}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Poll deleted successfully!');
      setPolls(polls.filter(poll => poll._id !== selectedPoll));
      setSelectedPoll('');
    } catch (error) {
      console.error('Failed to delete poll:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Delete a Poll</h1>
      <select value={selectedPoll} onChange={(e) => setSelectedPoll(e.target.value)}>
        {polls.map((poll) => (
          <option key={poll._id} value={poll._id}>
            {poll.question}
          </option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete Poll</button>
    </div>
  );
};

export default DeletePollComponent;
