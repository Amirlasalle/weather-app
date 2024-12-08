"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaLocationArrow } from "react-icons/fa";
import Image from "next/image";
import { IoCloudy, IoRainy, IoSnow, IoSunny } from "react-icons/io5";
import Loading from "./components/Loading";
import LoadingText from "./components/LoadingText";

// const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_KEY = "8900debc433c038db6f38ffdd6df8280";
interface CurrentWeather {
  displayName: string;
  weather: { description: string; icon: string }[];
  main: { temp: number };
  wind: { speed: number };
}

interface Forecast {
  dt_txt: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

const Home = () => {
  const [city, setCity] = useState<string>("");
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem("weather") || "[]");
    setPreviousSearches(savedSearches);
  }, []);

  const handleSearch = async () => {
    if (!city) return;

    const updatedSearches = [...previousSearches, city];
    localStorage.setItem("weather", JSON.stringify(updatedSearches));
    setPreviousSearches(updatedSearches);

    setLoading(true);
    await fetchWeather(city);
    setCity("");
    setLoading(false);
  };

  // const fetchWeather = async (location: string) => {
  //   try {
  //     const geoUrl = /^\d{5}(?:[-\s]\d{4})?$/.test(location)
  //       ? `https://api.openweathermap.org/geo/1.0/zip?zip=${location},US&appid=${API_KEY}`
  //       : `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;

  //     const geoResponse = await axios.get(geoUrl);
  //     const { lat, lon, name, state } = geoResponse.data?.[0] || geoResponse.data;

  //     if (!lat || !lon) {
  //       alert("Location not found. Please try again.");
  //       return;
  //     }

  //     const formattedLocation = `${name || location}, ${state || ""}`;

  //     const currentWeatherResponse = await axios.get(
  //       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  //     );
  //     setCurrentWeather({
  //       ...currentWeatherResponse.data,
  //       displayName: formattedLocation,
  //     });

  //     const forecastResponse = await axios.get(
  //       `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  //     );
  //     const filteredForecast = forecastResponse.data.list.filter(
  //       (_: Forecast, index: number) => index % 8 === 0
  //     );
  //     setForecast(filteredForecast);
  //   } catch (err) {
  //     console.error("Error fetching weather data:", err);
  //     alert("Error fetching weather data. Please try again later.");
  //   }
  // };

  // const getCurrentLocation = async () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation is not supported by your browser.");
  //     return;
  //   }
  //   setLoading(true);

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       const geoResponse = await axios.get(
  //         `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
  //       );

  //       const locationName = geoResponse.data?.[0]?.name;
  //       await fetchWeather(locationName || `${latitude},${longitude}`);
  //       setLoading(false);
  //     },
  //     (error) => {
  //       alert("Unable to retrieve location.");
  //       setLoading(false);
  //     }
  //   );
  // };

  const fetchWeather = async (location: string) => {
    try {
      const geoUrl = /^\d{5}(?:[-\s]\d{4})?$/.test(location)
        ? `https://api.openweathermap.org/geo/1.0/zip?zip=${location},US&appid=${API_KEY}`
        : `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;

      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      const { lat, lon, name, state } = geoData?.[0] || geoData;

      if (!lat || !lon) {
        alert("Location not found. Please try again.");
        return;
      }

      const formattedLocation = `${name || location}, ${state || ""}`;

      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const currentWeatherData = await currentWeatherResponse.json();
      setCurrentWeather({
        ...currentWeatherData,
        displayName: formattedLocation,
      });

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastResponse.json();
      const filteredForecast = forecastData.list.filter(
        (_: Forecast, index: number) => index % 8 === 0
      );
      setForecast(filteredForecast);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      alert("Error fetching weather data. Please try again later.");
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoResponse.json();

        const locationName = geoData?.[0]?.name;
        await fetchWeather(locationName || `${latitude},${longitude}`);
        setLoading(false);
      },
      (error) => {
        alert("Unable to retrieve location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 overflow-x-hidden">
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
        <div
          className={`${
            !currentWeather || !forecast || loading
              ? "grid grid-cols-1 mdmin:grid-cols-2 mdmin:gap-4 md:space-y-4"
              : "grid grid-cols-1 mdmin:grid-cols-3 mdmin:gap-4 md:space-y-4"
          }`}
        >
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
                        fetchWeather(search);
                        setShowSearchHistory(false);
                      }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {loading ? (
            <div className="w-full flex flex-col items-center justify-center">
              <Loading
                containerClassName="!bg-transparent"
                logoClassName="w-16 h-16"
                srcOne="/images/sun.webp"
                altOne="sunny"
                srcTwo="/images/heavy-rain.webp"
                altTwo="rain"
                srcThree="/images/snow.webp"
                altThree="snow"
                srcFour="/images/cloudy.webp"
                altFour="cloudy"
              />
              <LoadingText text="Loading" />
            </div>
          ) : (
            <section className="col-span-2 text-black">
              {currentWeather && (
                <div className="bg-yellow-100 p-4 shadow-md rounded-xl mb-4 flex items-center justify-between">
                  <div className="flex flex-col items-start justify-center w-1/2">
                    <h2 className="font-bold text-xl  capitalize">
                      Today&apos;s current weather in
                    </h2>
                    <h2 className="font-bold text-lg mb-2">
                      {currentWeather.displayName}
                    </h2>
                    <p className="font-semibold text-base capitalize">
                      {currentWeather.weather[0].description}
                    </p>
                    <p>Temperature: {Math.floor(currentWeather.main.temp)}°F</p>
                    <p>Weather: {currentWeather.weather[0].description}</p>
                    <p>
                      Wind Speed: {Math.floor(currentWeather.wind.speed)} mph
                    </p>
                  </div>
                  <div className="w-1/2">
                    <Image
                      src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                      alt="Weather Icon"
                      width={150}
                      height={150}
                    />
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-1 lg:grid-cols-2 lgmin:grid-cols-3 gap-4 ">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex mdmin:flex-col md:flex-row bg-blue-100 p-4 shadow-md rounded-xl"
                  >
                    <div className="flex flex-col items-start justify-center md:w-1/2 w-full">
                      <h3 className="font-bold text-lg">
                        {new Date(day.dt_txt).toLocaleDateString("en-US", {
                          weekday: "short", // Day of the week (e.g., "Monday")
                          year: "numeric", // Year (e.g., "2024")
                          month: "long", // Month (e.g., "December")
                          day: "numeric", // Day (e.g., "4")
                        })}
                      </h3>
                      <p className="font-semibold text-base capitalize">
                        {day.weather[0].description}
                      </p>
                      <p className="text-base">
                        Temp: {Math.floor(day.main.temp)}°F
                      </p>
                      <p className="text-base">
                        Humidity: {Math.floor(day.main.humidity)}%
                      </p>
                      <p className="text-base">
                        Wind Speed: {Math.floor(day.wind.speed)} mph
                      </p>
                    </div>
                    <div className="md:w-1/2 w-full">
                      <Image
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt="Weather Icon"
                        width={50}
                        height={50}
                        className="md:size-36"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
