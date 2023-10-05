import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import FourZeroFour from "./404/FourZeroFour";
import DailyWeather from './Components/DailyWeather';
import HourlyWeather from "./Components/HourlyWeather";

import "./css/Header.css"

function App() {

  // Temperature scales state
  const tempScales = ["Celsius", "Fahrenheit"];
  const [tempMode, setTempMode] = useState(null);
  const [activeScale, setActiveScale] = useState(null);

  // Location coordinates state
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);

  // Weather data state
  const [apiData, setAPIData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {
    if (localStorage.getItem("temperatureMode") === null) {
      // set a default
      setTempMode("metric");
      setActiveScale("Celsius");
    } else {
      let scale = localStorage.getItem("temperatureMode");
      if (scale === "metric") {
        setTempMode("metric");
        setActiveScale("Celsius");
      } else {
        setTempMode("imperial");
        setActiveScale("Fahrenheit");
      }
    }
  }, [])

  useEffect(() => {

    setWeatherStatus("Loading weather data...");

    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus("Geolocation is not supported by your browser");
      } else {
        setLocationStatus("Loading...");
        navigator.geolocation.getCurrentPosition((position) => {
          setLocationStatus(null);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        }, () => {
          setLocationStatus("Unable to retrieve your location");
        })
      }
    };

    // Fetch weather data when lat and lon are available
    if (lat !== null && long !== null) {
      const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
      // get the 5-day forecast with 3-hour step
      const apiURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=" + tempMode + "&appid=" + API_KEY;

      fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
          setWeatherStatus(null);
          setAPIData(data);
          setCurrentLocation(data.city.name + ", " + data.city.country);
          formatWeatherData(data.list);

          // // reset the interval
          // setCurrentIndex(0);


        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          setWeatherStatus("There was an error loading the weather data");
        });
    } else {
      // Get the user's location if lat and long are not available
      getLocation();
    }



  }, [lat, long, tempMode]);

  /**
       * Format the weather data;
       * Extract the date, time, temperatures, icons and descriptions for each 3-hour step
       * 
       * Calculate the average temperature for each day
       * 
       * @param {object} data 
       */
  const formatWeatherData = (data) => {

    const fiveDayData = {};

    data.forEach((item) => {
      const [date, hour] = item.dt_txt.split(' ') // Extract the date and time;
      const [hrs, mins] = hour.split(":").slice(0, 2);
      const time = `${hrs}:${mins}`;
      const temperature = item.main.temp; // Extract temperature
      const feelsLike = item.main.feels_like; // Extract 'feels like' temp
      const icon = item.weather[0].icon; // Extract the weather icon
      const description = item.weather[0].description; // Extract the weather description

      if (!fiveDayData[date]) {
        fiveDayData[date] = {
          tempSum: 0,
          count: 0,
          temperatures: [],
          feelsLikeTemps: [],
          hours: [],
          icons: [],
          descriptions: []
        };
      }

      fiveDayData[date].tempSum += temperature;
      fiveDayData[date].count += 1;
      fiveDayData[date].icons.push(icon);
      fiveDayData[date].descriptions.push(description);
      fiveDayData[date].temperatures.push(Math.trunc(temperature));
      fiveDayData[date].feelsLikeTemps.push(Math.trunc(feelsLike));
      fiveDayData[date].hours.push(time);
    });

    // Calculate the average temp for each day
    const formattedData = {};
    for (const date in fiveDayData) {
      formattedData[date] = {
        averageTemp: Math.trunc(fiveDayData[date].tempSum / fiveDayData[date].count),
        icons: fiveDayData[date].icons,
        descriptions: fiveDayData[date].descriptions,
        temperatures: fiveDayData[date].temperatures,
        feelsLikeTemps: fiveDayData[date].feelsLikeTemps,
        hours: fiveDayData[date].hours
      };
    }

    console.log(formattedData);
    setForecast(formattedData);

  }


  const changeWeatherMode = (mode) => {
    setActiveScale(mode);
    if (mode === "Celsius") {
      setTempMode("metric");
      localStorage.setItem("temperatureMode", "metric");
    } else if (mode === "Fahrenheit") {
      setTempMode("imperial");
      localStorage.setItem("temperatureMode", "imperial");
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const format = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString(undefined, format);
  }

  return (
    <>
      {apiData ? (
        <>
          <div className='header'>
            <h2>{currentLocation}</h2>
            <ul className='dropdown'>
              {tempScales.map((item, i) => (
                <li key={item} className={item === activeScale ? "active" : ""} onClick={item === activeScale ? () => { return; } : () => changeWeatherMode(item)}>{item}</li>
              ))}
            </ul>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <DailyWeather
                  tempMode={tempMode}
                  formatDate={formatDate}
                  forecast={forecast}
                  currentIndex={currentIndex}
                />
              }
            />
            <Route
              path="/hourly/:date"
              element={
                <HourlyWeather
                  tempMode={tempMode}
                  formatDate={formatDate}
                  forecast={forecast}
                />
              }
            />
            <Route path="*" element={<FourZeroFour />} />
          </Routes>
        </>
      ) : (
        locationStatus ? (
          <div>{locationStatus}</div>
        ) : (
          weatherStatus && (
            <div>{weatherStatus}</div>
          )
        )
      )}


    </>
  );
}

export default App;
