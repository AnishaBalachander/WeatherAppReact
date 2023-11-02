import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
//import WeatherBackground from './WeatherBackground'; // Import the WeatherBackground component
function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [long, setLongitude] = useState("");
  const [lat, setLatitude] = useState("");
  const [condition, setCondition] = useState("");
  const apiKey = "8355fd30261b680a87c754133519aa13";
  function getCurrentLocationWeather() {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      console.log(long, lat);
      let LongLatURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
      // Make API request to get current weather for default location
      axios.get(LongLatURL).then((response) => {
        setData(response.data);
        console.log(response.data);
        setCondition(response.data.weather[0].main);
      });
    });
  }
  const LocationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
  getCurrentLocationWeather();
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(LocationUrl).then((response) => {
        setData(response.data);
        console.log(response.data);
        setCondition(response.data.weather[0].main);
        console.log(condition);
      });
      setLocation("");
    }
  };
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    var destination = utc + 1000 * data.timezone;
    let time;
    destination ? (time = new Date(destination)) : (time = new Date());
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursInAMPM = hour <= 12 ? hour : hour % 12;
    const minutes = ("0" + time.getMinutes()).slice(-2);
    const ampm = hour >= 12 ? "PM" : "AM";
    document.getElementById("time").innerHTML =
      // eslint-disable-next-line no-useless-concat
      hoursInAMPM + ":" + minutes + " " + `${ampm}`;
    document.getElementById("date").innerHTML =
      days[day] + "," + date + " " + months[month];
  });

  return (
    <div className={`app ${condition.toLowerCase()}`}>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="date">
            <p id="time"></p>
            <p id="am-pm"></p>
            <p id="date"></p>
          </div>
          <div className="break">
            <div className="location">
              <h1>{data.name}</h1>
            </div>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <h2>{data.weather[0].main}</h2> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed()}°F</p>
              ) : null}
              <p className="name">Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p className="name">Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              ) : null}
              <p className="name">Wind Speed</p>
            </div>
            <div className="sunrise">
              {data.sys ? (
                <p className="bold">
                  {moment.unix(data.sys.sunrise).format("h:mmA")}
                </p>
              ) : null}
              <p className="name">Sunrise</p>
            </div>
            <div className="sunset">
              {data.sys ? (
                <p className="bold">
                  {moment.unix(data.sys.sunset).format("h:mmA")}
                </p>
              ) : null}
              <p className="name">Sunset</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;