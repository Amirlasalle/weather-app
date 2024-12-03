"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";
import Image from "next/image";
import { IoCloudy, IoRainy, IoSnow, IoSunny } from "react-icons/io5";

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
    setCity("");
  };

  const fetchWeather = async (location: string) => {
    try {
      let geoUrl = "";

      // Check if the input is likely a ZIP code
      const isZipCode = /^\d{5}(?:[-\s]\d{4})?$/.test(location);
      if (isZipCode) {
        geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${location},US&appid=${API_KEY}`;
      } else {
        geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
      }

      // Fetch geographic data
      const geoResponse = await axios.get(geoUrl);
      const { lat, lon, name, state, country } =
        geoResponse.data?.[0] || geoResponse.data;

      if (!lat || !lon) {
        alert("Location not found. Please try again.");
        return;
      }

      // Format location dynamically (e.g., Flushing, NY)
      const formattedLocation = isZipCode
        ? `${name || "Unknown"}, ${state || ""}`
        : `${name || location}, ${state || ""}`;

      // Fetch current weather
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      setCurrentWeather({
        ...currentWeatherResponse.data,
        displayName: formattedLocation,
      });

      // Fetch weather forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const filteredForecast = forecastResponse.data.list.filter(
        (_: any, index: number) => index % 8 === 0
      );
      setForecast(filteredForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const [showSearchHistory, setShowSearchHistory] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocoding to get location name
          const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          const geoResponse = await axios.get(geoUrl);
          const locationName =
            geoResponse.data?.[0]?.name || "Current Location";

          // Fetch weather data using coordinates
          await fetchWeatherByCoordinates(latitude, longitude, locationName);

          // Clear the search input when current location is accessed
          setCity("");
        },
        (error) => {
          alert("Unable to retrieve location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeatherByCoordinates = async (
    lat: number,
    lon: number,
    locationName: string
  ) => {
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      setCurrentWeather({
        ...currentWeatherResponse.data,
        displayName: locationName,
      });

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
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
      <header className="w-full flex items-center justify-center text-center bg-blue-500 text-white py-4 rounded-xl">
        <span className="text-2xl font-bold text-yellow-400">
          <IoSunny />
        </span>
        <span className="text-2xl font-bold mx-2 text-gray-400">
          <IoCloudy />
        </span>
        <h1 className="text-2xl font-bold mx-2">Weather Dashboard</h1>
        <span className="text-2xl font-bold mx-2 text-blue-900">
          <IoRainy />
        </span>
        <span className="text-2xl font-bold ">
          <IoSnow />
        </span>
      </header>
      <main className="container mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <aside className="bg-white w-full p-4 shadow-md rounded-xl">
            <label htmlFor="city" className="block font-bold mb-2 text-black">
              Search for a City:
            </label>
            <input
              id="city"
              className="w-full p-2 border rounded-xl mb-2 text-black"
              placeholder="e.g., New York City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <div className="flex">
              <button
                className="bg-blue-500 text-white w-full py-2 rounded-xl mr-2"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                onClick={getCurrentLocation}
                className="flex items-center justify-center bg-blue-500 text-white w-10 p-2 rounded-xl"
              >
                <FaLocationArrow className="size-3" />
              </button>
            </div>
            <div
              className="flex items-center justify-center bg-blue-500 text-white w-full py-2 rounded-xl mt-2 cursor-pointer"
              onClick={() => {
                setShowSearchHistory((prevState) => !prevState);
              }}
            >
              {!showSearchHistory ? (
                <p>Search History</p>
              ) : (
                <p>Close History</p>
              )}
            </div>

            {showSearchHistory && (
              <div className="mt-4 h-52 overflow-hidden border px-2 rounded-xl">
                <div className="py-4 h-full overflow-scroll">
                  {previousSearches.map((search, index) => (
                    <button
                      key={index}
                      className="block bg-blue-200 text-blue-700 w-full py-2 rounded-xl mb-2"
                      onClick={() => {
                        fetchWeather(search)
                        setShowSearchHistory(false)
                      }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="col-span-2 text-black">
            {currentWeather && (
              <div className="bg-yellow-100 p-4 shadow-md rounded-xl mb-4">
                <h2 className="font-bold text-xl mb-2 capitalize">
                  Today's current weather in
                </h2>
                <h2 className="font-bold text-lg mb-2">
                  {currentWeather.displayName}
                </h2>
                <p>Temperature: {Math.floor(currentWeather.main.temp)}°F</p>
                <p>Humidity: {Math.floor(currentWeather.main.humidity)}%</p>
                <p>Wind Speed: {Math.floor(currentWeather.wind.speed)} mph</p>
                <Image
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                  width={50}
                  height={50}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-blue-100 p-4 shadow-md rounded-xl"
                >
                  <h3 className="font-bold text-lg">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short", // Day of the week (e.g., "Monday")
                      year: "numeric", // Year (e.g., "2024")
                      month: "long", // Month (e.g., "December")
                      day: "numeric", // Day (e.g., "4")
                    })}
                  </h3>
                  <p className="font-semibold text-base">
                    Temp: {Math.floor(day.main.temp)}°F
                  </p>
                  <p className="font-semibold text-base">
                    Humidity: {Math.floor(day.main.humidity)}%
                  </p>
                  <p className="font-semibold text-base">
                    Wind Speed: {Math.floor(day.wind.speed)} mph
                  </p>
                  <Image
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                    width={50}
                    height={50}
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
