import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faDroplet, faWind, faWater } from '@fortawesome/free-solid-svg-icons';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

const Home = () => {
  const { cityName } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [error, setError] = useState('');

  const fetchWeatherForecast = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      setForecastData(response.data);
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
    }
  };

  const fetchData = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=d9dc04eeaebe0687ed17b65e07923022`
      );
      const newWeatherData = response.data;
      setWeatherData(newWeatherData);
      setError('');

      const cityExists = history.some(item => item.name.toLowerCase() === newWeatherData.name.toLowerCase());

      if (!cityExists) {
        const updatedHistory = [newWeatherData, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
      }

      fetchWeatherForecast(newWeatherData.coord.lat, newWeatherData.coord.lon);

    } catch (error) {
      setError('City not found. Please check the city name and try again.');
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (cityName) {
      fetchData(cityName);
    }
  }, [cityName]);

  const changeBackgroundImage = (main) => {
    const body = document.body;
    switch (main.toLowerCase()) {
      case 'clear':
        body.style.backgroundImage = "url(/public/assets/sunny.jpg)";
        break;
      case 'clouds':
        body.style.backgroundImage = "url(/public/assets/cloudy.jpeg)";
        break;
      case 'rain':
        body.style.backgroundImage = "url(/public/assets/rainy.jpg)";
        break;
      case 'drizzle':
        body.style.backgroundImage = "url(/public/assets/dizzle.jpg)";
        break;
      case 'thunderstorm':
        body.style.backgroundImage = "url(/public/assets/thunderstrom.jpg)";
        break;
      case 'snow':
        body.style.backgroundImage = "url(/public/assets/snowfall.jpg)";
        break;
      case 'mist':
      case 'haze':
      case 'fog':
        body.style.backgroundImage = "url(/public/assets/atmospheric.jpg)";
        break;
      default:
        body.style.backgroundImage = "url(/public/assets/default1.jpg)";
        break;
    }
  };

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return <WiDaySunny size={100} />;
      case 'clouds':
        return <WiCloudy size={100} />;
      case 'rain':
        return <WiRain size={100} />;
      case 'snow':
        return <WiSnow size={100} />;
      case 'thunderstorm':
        return <WiThunderstorm size={100} />;
      case 'mist':
      case 'haze':
      case 'fog':
        return <WiFog size={100} />;
      default:
        return <WiDaySunny size={100} />;
    }
  };

  useEffect(() => {
    if (weatherData) {
      changeBackgroundImage(weatherData.weather[0].main);
    }
  }, [weatherData]);

  return (
    <>
      <div className="container">
        <div className="mainContainer">
          <h2 className="text-center mt-3" style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>
            Today's weather in {weatherData?.name}
          </h2>
          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
          {weatherData && (
            <>
              <div>
                <h4 style={{ textAlign: 'left', color: 'white', textShadow: '2px 2px 4px #000000', width: '50vw' }}>Geographic Location</h4>
                <div className="mapContainer" style={{ height: '200px', width: '95%' }}>
                  {weatherData.coord && (
                    <MapContainer center={[weatherData.coord.lat, weatherData.coord.lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
                        <Popup>
                          {weatherData.name}<br />{weatherData.weather[0].description}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
                <div className="mt-4 weather">
                  <Row>
                    <Col className='col-lg-12'>
                      <Card className="mb-3">
                        <Card.Body>
                          <div>
                            <Card.Title>Temperature</Card.Title>
                            <Card.Text>
                              <p>{weatherData.main.temp}°C</p>
                              <p>{weatherData.weather[0].description}</p>
                            </Card.Text></div>
                          <div>
                            {getWeatherIcon(weatherData.weather[0].main)}
                          </div>

                        </Card.Body>
                      </Card>
                    </Col>

                    <Col className='col-lg-6'>
                      <Card className="mb-3">
                        <Card.Body>
                          <div>
                            <Card.Title>Feels Like</Card.Title>
                            <Card.Text>{weatherData.main.feels_like}°C</Card.Text></div>
                          <div>
                            <FontAwesomeIcon icon={faTemperatureThreeQuarters} size='3x' /></div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className='col-lg-6'>
                      <Card className="mb-3">
                        <Card.Body>
                          <div>
                            <Card.Title>Humidity</Card.Title>
                            <Card.Text>{weatherData.main.humidity}%</Card.Text></div>
                          <div>
                            <FontAwesomeIcon icon={faDroplet} size="3x" />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className='col-lg-6'>
                      <Card className="mb-3">
                        <Card.Body>
                          <div>
                            <Card.Title>Pressure</Card.Title>
                            <Card.Text>{weatherData.main.pressure} hPa</Card.Text></div>
                          <div><FontAwesomeIcon icon={faWater} size="3x" />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className='col-lg-6'>
                      <Card className="mb-3">
                        <Card.Body>
                          <div>
                            <Card.Title>Wind Speed</Card.Title>
                            <Card.Text>{weatherData.wind.speed} m/s</Card.Text></div>
                          <div><FontAwesomeIcon icon={faWind} size="3x" />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mt-4 weather-forecast">
                <h3 className="text-center" style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>Weather Forecast</h3>
                <Row>
                  {forecastData && forecastData.daily.time.slice(0, 3).map((date, index) => (
                    <Col key={index} className='col-lg-4'>
                      <Card className="mb-3">
                        <Card.Body>
                        <div>
                            <Card.Title>{new Date(date).toDateString()}</Card.Title>
                          <Card.Text>Max Temp: {forecastData.daily.temperature_2m_max[index]}°C</Card.Text>
                          <Card.Text>Min Temp: {forecastData.daily.temperature_2m_min[index]}°C</Card.Text>
                          <Card.Text>Precipitation: {forecastData.daily.precipitation_sum[index]} mm</Card.Text></div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
