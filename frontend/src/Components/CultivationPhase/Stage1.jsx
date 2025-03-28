import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate, useLocation
import { FaArrowLeft } from "react-icons/fa"; // Import icons
import MobileBg from "../../assets/sowing-stage-mobile.jpg";
import DesktopBg from "../../assets/sowing-stage-desktop.jpg"; // Desktop background
import FarmersBot from "../../assets/farmer-bot.png";
import Chatbot from "../Farmers-bot"; // Import Chatbot component
import {
  FaTemperatureHigh,
  FaTint,
  FaCloudRain,
  FaWind,
  FaSun,
} from "react-icons/fa"; // Import icons

const StageOne = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cropid } = location.state || {};
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cropid) {
      fetch(`${import.meta.env.VITE_API_URL}/farmers/crop/${cropid}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("dsfsddsfs", data.data.farm.weather);
          setWeatherData(data.data.farm.weather);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    }
  }, [cropid]);

  const renderWeatherInfo = () =>
    weatherData ? (
      <div>
        <p className="text-lg font-semibold p-1.5 text-black">
          Today's Weather
        </p>
        <div
          className={`grid ${
            isMobile ? "grid-cols-2 gap-4" : "grid-cols-2 gap-6"
          } text-white`}
        >
          <div
            className={`flex flex-col items-center justify-center bg-lime-700 ${
              isMobile ? "p-2" : "p-4"
            } rounded-lg shadow-md`}
          >
            <FaTemperatureHigh
              className={`text-yellow-400 ${
                isMobile ? "text-2xl" : "text-5xl"
              } mb-2`}
            />
            <p className={`font-bold ${isMobile ? "text-lg" : "text-3xl"}`}>
              {weatherData.temperature}°C
            </p>
            <p className="text-sm">Temperature</p>
          </div>
          <div
            className={`flex flex-col justify-between bg-lime-800 ${
              isMobile ? "p-2" : "p-4"
            } rounded-lg shadow-md`}
          >
            <div className="flex items-center space-x-2">
              <FaTint className="text-blue-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>
                Humidity: {weatherData.humidity}%
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCloudRain className="text-blue-400" />
              <p className={isMobile ? "text-xs" : "text-md"}>
                Rainfall: {weatherData.rainfall}mm
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaWind className="text-gray-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>
                Wind: {weatherData.windSpeed} m/s
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaSun className="text-yellow-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>
                Condition: {weatherData.weatherCondition}
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-lg font-semibold text-white">
        Loading Weather Data...
      </p>
    );

  const renderMobileView = () => (
    <>
      {/* Container below Menubar */}
      <div className="bg-white/20 shadow-md p-6 rounded-lg mx-4 my-4 flex flex-col justify-center items-center">
        {renderWeatherInfo()}
      </div>

      <div className="bg-white/30 hover:bg-white/40 shadow-md p-6 rounded-lg mx-4 my-4 flex justify-center items-center h-15 transition-colors duration-300">
        <button>
          <p className="text-lg font-semibold text-black">Daily Logs</p>
        </button>
      </div>

      {/* Chatbot Image and Circular Buttons */}
      <div className="fixed bottom-25 right-1 flex flex-col items-center">
  <div className="relative w-40 h-40 flex justify-center items-center">
    {/* B1 - Text Above the Button */}
    <div className="absolute top-[-100px] flex flex-col items-center bg-black/50 p-2 rounded-md">
      <h3 className="text-lime-300 text-sm font-semibold">Title 1</h3>
      <p className="text-lime-300 font-bold text-xs">Short description</p>
    </div>
    <button className="absolute top-[-50px] bg-blue-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-blue-700">
      B1
    </button>

    {/* B2 - Text on the Left */}
    <div className="absolute left-[-140px] top-[-10px] flex flex-col items-end bg-black/50 p-2 rounded-md">
      <h3 className="text-lime-300 text-sm font-semibold">Title 2</h3>
      <p className="text-lime-300 font-bold text-xs">Short description</p>
    </div>
    <button className="absolute left-[-30px] top-[-10px] bg-green-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-green-700">
      B2
    </button>

    {/* B3 - Text on the Left */}
    <div className="absolute left-[-140px] bottom-[25px] flex flex-col items-end bg-black/50 p-2 rounded-md">
      <h3 className="text-lime-300 text-sm font-semibold">Title 3</h3>
      <p className="text-lime-300 font-bold text-xs">Short description</p>
    </div>
    <button className="absolute left-[-30px] bottom-[25px] bg-red-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-red-700">
      B3
    </button>

    {/* Chatbot Image */}
    <img
      src={FarmersBot}
      alt="Chatbot"
      className="object-contain md:w-24 md:h-24 w-40 h-40 cursor-pointer"
      onClick={() => setIsChatOpen(true)}
    />
  </div>
</div>

    </>
  );

  const renderDesktopView = () => (
    <>
      {/* Main Container */}
      <div className="bg-white/20 shadow-md p-6 rounded-lg mx-4 my-4 flex flex-col justify-center items-center">
        {renderWeatherInfo()}
      </div>

      {/* Single Container Below */}
      <div className="bg-white/20 hover:bg-white/30 p-6 rounded-lg shadow-md mx-4 my-4 flex justify-center items-center transition-colors duration-300">
        <button>
          <p className="text-md font-semibold text-white">Daily Logs</p>
        </button>
      </div>

      {/* Three Circles in Horizontal Line */}
      <div className="flex justify-center space-x-16 my-6">
        <div className="flex flex-col items-center">
          <button className="bg-blue-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-blue-700">
            B1
          </button>
          <h3 className="text-white text-lg font-semibold mt-2">Title 1</h3>
          <p className="text-white font-bold text-sm">Short description</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-green-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-green-700">
            B2
          </button>
          <h3 className="text-white text-lg font-semibold mt-2">Title 2</h3>
          <p className="text-white font-bold text-sm">Short description</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-red-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-red-700">
            B3
          </button>
          <h3 className="text-white text-lg font-semibold mt-2">Title 3</h3>
          <p className="text-white font-bold text-sm">Short description</p>
        </div>
      </div>

      {/* Chatbot Image at Bottom Right */}
      <div className="fixed bottom-8 right-3">
        <img
          src={FarmersBot}
          alt="Chatbot"
          className="object-contain w-30 h-30 cursor-pointer"
          onClick={() => setIsChatOpen(true)}
        />
      </div>
    </>
  );

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${isMobile ? MobileBg : DesktopBg})` }}
    >
      {/* Navigation Bar */}
      <nav className="bg-lime-600 p-4 shadow-md flex justify-between items-center">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-white text-2xl cursor-pointer hover:text-gray-300"
        />
        <ul className="flex space-x-6 text-white text-lg font-semibold">
          <p>Beginning of your Journey</p>
        </ul>
      </nav>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Chatbot Box */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default StageOne;
