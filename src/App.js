import React, { useEffect, useState } from 'react';

function App() {

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // getLocation();

    const getLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
        setLocationStatus("Geolocation is not supported by your browser");
      } else {
        setLocationStatus("Loading...");
        navigator.geolocation.getCurrentPosition((position) => {
          setLocationStatus(null);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        }, () => {
          console.log("Unable to retrieve your location");
          setLocationStatus("Unable to retrieve your location");
        })
      }
    };

    // Fetch weather data when lat and lon are available
    if (lat !== null && long !== null) {
      const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
      const apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=metric&appid=" + API_KEY;

      console.log(apiURL);
      fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    } else {
      // Get the user's location if lat and long are not available
      getLocation();
    }

  }, [lat, long]);



  return (
    <div>
      <div>Lat: {lat}</div>
      <div>Long: {long}</div>

      {weatherData ? (
        <div>
          <h2>Weather Information</h2>
          <p>Location: {weatherData.name}, {weatherData.sys.country}</p>
          <p>Temperature: {weatherData.main.temp}</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <div>Loading weather data...</div>
      )}
    </div>
  );
}

export default App;
