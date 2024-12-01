"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Home = () => {
  const [city, setCity] = useState("");
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("weather") || "[]");
    setPreviousSearches(savedSearches);
  }, []);

  const handleSearch = async () => {
    if (!city) return;

    const updatedSearches = [...previousSearches, city];
    localStorage.setItem("weather", JSON.stringify(updatedSearches));
    setPreviousSearches(updatedSearches);

    await fetchWeather(city);
  };

  const fetchWeather = async (city: string) => {
    try {
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
      );
      const filteredForecast = forecastResponse.data.list.filter(
        (_: any, index: number) => index % 8 === 0
      );
      setForecast(filteredForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center bg-blue-500 text-white py-4">
        <h1 className="text-2xl font-bold">Weather Dashboard</h1>
      </header>
      <main className="container mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <aside className="bg-white p-4 shadow-md rounded">
            <label htmlFor="city" className="block font-bold mb-2">
              Search for a City:
            </label>
            <input
              id="city"
              className="w-full p-2 border rounded mb-2"
              placeholder="e.g., New York City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white w-full py-2 rounded mt-2"
              onClick={handleSearch}
            >
              Search
            </button>
            <div className="mt-4">
              {previousSearches.map((search, index) => (
                <button
                  key={index}
                  className="block bg-blue-200 text-blue-700 w-full py-2 rounded mb-2"
                  onClick={() => fetchWeather(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </aside>

          <section className="col-span-2">
            {currentWeather && (
              <div className="bg-yellow-100 p-4 shadow-md rounded mb-4">
                <h2 className="font-bold text-lg mb-2">
                  {currentWeather.name}
                </h2>
                <p>Temperature: {currentWeather.main.temp}°F</p>
                <p>Humidity: {currentWeather.main.humidity}%</p>
                <p>Wind Speed: {currentWeather.wind.speed} mph</p>
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="bg-blue-100 p-4 shadow-md rounded">
                  <h3 className="font-bold">{day.dt_txt}</h3>
                  <p>Temp: {day.main.temp}°F</p>
                  <p>Humidity: {day.main.humidity}%</p>
                  <p>Wind Speed: {day.wind.speed} mph</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
