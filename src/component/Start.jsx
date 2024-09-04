import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const Start = () => {
  const location = useLocation();
  const shouldShowDiv = location.pathname === '/';
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      setCity('');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json')
      .then(response => response.json())
      .then(data => {
        const cityStateSuggestions = data.flatMap(element =>
          [
            element.name,
            ...element.states.flatMap(state => [
              state.name,             
              ...state.cities.map(city => city.name)  
            ])


          ]);

        setSuggestions(cityStateSuggestions);
      })
      .catch(error => console.error('Error fetching the JSON:', error));
  }, []);



  const handleInputChange = (selected) => {
    setCity(selected[0] || '');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    navigate(`/weather/${city}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>Weather App</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/history">History</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {shouldShowDiv && (
        <div className="container " style={{ height: '80vh' }}>
          <div className="text-center">
            <h2 style={{ color: 'white', textShadow: '2px 2px 4px #000000', fontSize: '4rem' }}>Let's see today's weather</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group mt-4">
                <Typeahead
                  id="city-state-typeahead"
                  labelKey="cityState"
                  options={suggestions}
                  placeholder="Enter city name"
                  onChange={handleInputChange}
                />
                <button type="submit" className="btn">
                  Get Weather
                </button>
              </div>
              {error && (
                <div className="alert alert-danger mt-2" style={{ width: '100%', textAlign: 'left' }}>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Start;
