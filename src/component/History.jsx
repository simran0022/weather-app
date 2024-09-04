import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (scrollableDivRef.current) {
      new PerfectScrollbar(scrollableDivRef.current);
    }
  }, [history]); 

  const handleCityClick = (cityName) => {
    navigate(`/weather/${cityName}`); 
  };

  return (
    <div className="container">
      <div className="mainContainer">
        <h1 className="text-center mt-3" style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>
          Search History
        </h1>
        <div className='scrollableDiv' ref={scrollableDivRef}>
          {history.length === 0 ? (
            <div className="alert alert-warning mt-4">
              No search history available.
            </div>
          ) : (
            <ul className="list-group mt-4" style={{ listStyle: 'none' }}>
              {history.map((item, index) => (
                <li
                  key={index}
                  className="historyList"
                  onClick={() => handleCityClick(item.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{item.name}</strong> - {item.main.temp}°C, {item.weather[0].description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <ul className='btnSection'>
            <button onClick={() => navigate('/')} className='l-item'>Home</button>
            <button onClick={() => navigate(-1)} className='l-item'>Back</button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
