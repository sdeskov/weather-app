import React from 'react';
import { useNavigate } from "react-router-dom";
import "../css/WeatherCard.css"

function DailyWeather(props) {


    const navigate = useNavigate();
    const navigateToHourlyWeather = (date) => {
        navigate(`/hourly/${date}`);
    };

    return (
        <div className="card-container">
            {Object.keys(props.forecast).map((date, index) => (
                <div key={date} className='card' onClick={() => navigateToHourlyWeather(date)}>
                    <div className="date">{props.formatDate(date)}</div>
                    <div className="temperature-container">
                        {/* icon */}
                        <img
                            alt={props.forecast[date].descriptions[props.currentIndex]}
                            src={`http://openweathermap.org/img/w/${props.forecast[date].icons[props.currentIndex]}.png`}
                        />
                        {/* average temperature */}
                        <h1>{props.forecast[date].averageTemp}&#176;{props.tempMode === "metric" ? "C" : "F"}</h1>
                    </div>

                    <p>{props.forecast[date].descriptions[props.currentIndex]}</p>
                </div>
            ))}
        </div>
    );
}

export default DailyWeather;
