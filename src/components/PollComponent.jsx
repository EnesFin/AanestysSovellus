import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from './Navbar';
import Footer from './Footer';
const PollComponent = () => {
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoll, setSelectedPoll] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [votedPolls, setVotedPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/polls`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPolls(response.data);
        setFilteredPolls(response.data);
      } catch (error) {
        console.error('Failed to fetch polls:', error.response ? error.response.data : error.message);
      }
    };
    fetchPolls();
  }, []);
  
  useEffect(() => {
    const filtered = polls.filter((poll) =>
      poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.options.some((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredPolls(filtered);
  }, [searchQuery, polls]);

  const handleVote = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowModal(true);
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/polls/${selectedPoll}/vote`, { optionId: selectedOption }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === selectedPoll
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option._id === selectedOption
                    ? { ...option, votes: option.votes + 1 }
                    : option
                ),
              }
            : poll
        )
      );
    } catch (error) {
      console.error('Failed to cast vote:', error.response ? error.response.data : error.message);
    }
  };
  
  return (
    <div className="container">
       <Navbar />
      <main className="py-5 text-center">
        <img className="d-block mx-auto mb-4" src="/logo.png" alt="" width="600" height="236" />
        <p className="lead">Sovelluksessa on kaksi käyttäjätyyppiä: tavallisia käyttäjiä ja ylläpitäjiä. Käyttäjät voivat
          selata etusivulla muiden tekemiä äänestyksiä, tarkastella äänestysten tilanteita ja osallistua äänestyksiin.
          Ylläpitäjät puolestaan voivat luoda uusia äänestyksiä ja poistaa niitä tarvittaessa.</p>
      </main>

      <form className="d-flex mb-4" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button className="btn btn-outline-success" type="button">Search</button>
      </form>

      {filteredPolls.map((poll) => (
  <div className="col-md-8 mb-4 mx-auto" key={poll._id}>
    <hr className="my-4" />
    <h3>{poll.question}</h3>
    {poll.options.map((option) => (
      <div className="d-flex align-items-center mb-3" key={option._id}>
        <div className="form-check me-2">
          <input
            className="form-check-input"
            type="radio"
            name={`voteGroup-${poll._id}`}
            value={option._id}
            checked={selectedOption === option._id}
            onChange={() => {
              setSelectedPoll(poll._id);
              setSelectedOption(option._id);
            }}
          />
          <label className="form-check-label h4">
            {option.name}
          </label>
        </div>
        
        <div className="w-100">
        <b class="text-secondary">{option.votes} votes</b>
          <div className="progress" >
            <div
              className="progress-bar progress-bar-striped bg-success"
              role="progressbar"
              style={{ width: `${option.votes}%`, backgroundColor: '#007bff', color: '#ffffff' }}
              aria-valuenow={option.votes}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              
            </div>
          </div>
        </div>
      </div>
    ))}
     {votedPolls.includes(poll._id) ? (
              <p className="text-muted">You have voted for this question</p>
            ) : (
              <button type="button" className="btn btn-primary mt-3" onClick={handleVote} disabled={!selectedOption}>Äänestä</button>
            )}
  </div>
))}


      {/* Bootstrap Modal */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Authentication Required</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>You need to log in or register to vote.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => { setShowModal(false); window.location.href = '/login'; }}>Log In</button>
                <button type="button" className="btn btn-success" onClick={() => { setShowModal(false); window.location.href = '/register'; }}>Register</button>
              </div>
            </div>
          </div>
        </div>
      <Footer />
       </div>
  );
};

export default PollComponent;
