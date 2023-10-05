import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/HourlyForecast.css";

function HourlyWeather(props) {
    const { date } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (!props.forecast) {
            return navigate("/");
        }
    }, [])

    return (
        <div className="weather-container">
            <h2 className="date-header">{props.formatDate(date)}</h2>
            <div className="weather-columns">
                {props.forecast[date].hours.map((hour, index) => (
                    <div className="column" key={index}>
                        <div className="row">
                            <p className="hour">{hour}</p>
                        </div>
                        <div className="row">
                            <div className="weather-info">
                                <img
                                    src={`http://openweathermap.org/img/w/${props.forecast[date].icons[index]}.png`}
                                    alt={props.forecast[date].descriptions[index]}
                                    className="weather-icon"
                                />
                                <h3>{props.forecast[date].temperatures[index]}&#176;{props.tempMode === "metric" ? "C" : "F"}</h3>
                            </div>
                        </div>
                        <div className="row">
                            <p className="feels-like">feels like {props.forecast[date].feelsLikeTemps[index]}&#176;{props.tempMode === "metric" ? "C" : "F"}</p>
                        </div>
                        <div className="row">
                            <p className="description">{props.forecast[date].descriptions[index]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default HourlyWeather;