"use client";

import { useState, useEffect } from "react";
import { Search, AlertCircle, Cloud, Sun, CloudRain } from "lucide-react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);

  const API_KEY = "687de40a71289a643fa9fd49d3498be2";

  useEffect(() => {
    if (weather) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [weather]);

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "City not found. Please check the spelling and try again."
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 600)
      return (
        <CloudRain className="w-24 h-24 transition-transform transform hover:scale-110 duration-500 ease-in-out" />
      );
    if (weatherCode >= 600 && weatherCode < 700)
      return (
        <Cloud className="w-24 h-24 transition-transform transform hover:scale-110 duration-500 ease-in-out" />
      );
    if (weatherCode === 800)
      return (
        <Sun className="w-24 h-24 transition-transform transform hover:scale-110 duration-500 ease-in-out" />
      );
    return (
      <Cloud className="w-24 h-24 transition-transform transform hover:scale-110 duration-500 ease-in-out" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 transition-all duration-500 ease-in-out transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
          Weather App
        </h1>
        <form onSubmit={fetchWeather} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              disabled={loading}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-blue-800">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center text-red-500 mt-4 animate-bounce">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {weather && (
          <div
            className={`text-center transition-all duration-500 ease-in-out transform ${
              animate ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-800">
              {weather.name}, {weather.sys.country}
            </h2>

            {/* Centering the icon */}
            <div className="mb-4 flex justify-center">
              {getWeatherIcon(weather.weather[0].id)}
            </div>

            <p className="text-5xl font-bold mb-4 text-blue-900">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="capitalize mb-2 text-blue-800">
              {weather.weather[0].description}
            </p>
            <div className="flex justify-center space-x-4 text-blue-700">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
