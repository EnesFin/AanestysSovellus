import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPolls, setLoadingPolls] = useState(true);

    useEffect(() => {
      const fetchPolls = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/polls`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPolls(response.data);
          setFilteredPolls(response.data);
          const userToken = localStorage.getItem('token');
          if (userToken) {
            const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
            const userId = decodedToken.id;
            const votedPollIds = response.data
              .filter(poll => poll.votedBy.includes(userId))
              .map(poll => poll._id);
            setVotedPolls(votedPollIds);
          }
        } catch (error) {
          console.error('Failed to fetch polls:', error.response ? error.response.data : error.message);
        } finally {
          setLoadingPolls(false);
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
    setLoading(true);
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
      setVotedPolls([...votedPolls, selectedPoll]);
    } catch (error) {
      console.error('Failed to cast vote:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/polls/${pollToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(polls.filter(poll => poll._id !== pollToDelete));
      setDeleteMessage('Poll deleted successfully!');
      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteMessage('');
      }, 2000);
    } catch (error) {
      console.error('Failed to delete poll:', error.response ? error.response.data : error.message);
    }
  };


  const confirmDelete = (pollId) => {
    setPollToDelete(pollId);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <img className="d-block mx-auto mb-4 img-fluid" src="/logo.png" alt="Logo"></img>
        <p className="lead mx-auto">
          Tämä on kouluprojekti ja tiimityö, joka toimii saumattomasti taustajärjestelmän kanssa.
          Sovelluksessa on kaksi käyttäjätyyppiä: tavalliset käyttäjät ja ylläpitäjät.
          Käyttäjät voivat selata etusivulla muiden tekemiä äänestyksiä, tarkastella äänestysten tilanteita ja osallistua niihin.
          Ylläpitäjät voivat luoda uusia äänestyksiä ja poistaa niitä tarvittaessa.
        </p>

        <form className="d-flex mb-4" role="search">
          <input className="form-control me-2" type="search" placeholder="Hae äänestää" aria-label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </form>
        {loadingPolls ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
            <p>Loading polls, please wait...</p>
          </div>
        ) : (
        filteredPolls.map((poll) => (
          <div className="col-md-8 mb-4 mx-auto" key={poll._id}>
            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center">
              <h3>{poll.question}</h3>
            </div>
            {poll.options.map((option) => (
              <div className="d-flex mb-2" key={option._id}>
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
                  <b className="text-secondary">{option.votes} votes</b>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped bg-success"
                      role="progressbar"
                      style={{ width: `${option.votes}%` }}
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleVote}
                disabled={!selectedOption || loading}
              >
                {loading ? 'Processing...' : 'Äänestä'}
              </button>
            )}

            {isAdmin && (
              <button className="btn btn-danger rounded btn-sm ms-2" onClick={() => confirmDelete(poll._id)}>Poista</button>
            )}
          </div>
        )))}

        {/* Delete Confirmation Modal */}
        <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vahvista Poisto</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Haluatko varmasti poistaa tämän äänestyksen?</p>
              </div>
              <div className="modal-footer">
                {deleting ? (
                  <p className="text-center">{'' || 'Please wait, it is being deleted...'}</p>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Peruuta</button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Poista</button>
                  </>
                )}
              </div>

              {deleteMessage && (
                <div className="alert alert-success text-center">
                  <p>{deleteMessage}</p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Bootstrap Modal */}
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Todennus vaaditaan!</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Sinun tulee kirjautua sisään tai rekisteröityä äänestääksesi.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <Link to="/login"> <button type="button" className="btn btn-primary" onClick={() => { setShowModal(false); }}>Kirjaudu Sisään</button></Link>
                <Link to="/register"><button type="button" className="btn btn-success" onClick={() => { setShowModal(false); }}>Rekisteröidy</button></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PollComponent;
