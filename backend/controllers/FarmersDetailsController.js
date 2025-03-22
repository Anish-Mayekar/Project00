const axios = require("axios");
const Farm = require("../models/FarmersDetails");
const dotenv = require("dotenv");

dotenv.config();

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Step 1: Add the information from the farmers
//         This will fetch data from weather Api and update and save in the database 
exports.addFarm = async (req, res) => {
  try {
    const { village, town, district, coordinates, soilType, landArea, budget } = req.body;

    // Check if coordinates are provided
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ message: "Coordinates (lat, lng) are required" });
    }

    // Fetch weather data from OpenWeatherMap API
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lng,
        appid: WEATHER_API_KEY,
        units: "metric" // Temperature in Celsius
      }
    });

    const weatherData = weatherResponse.data;

    // Extract only the required weather values
    const weatherInfo = {
      temperature: weatherData.main.temp, // Current temperature in °C
      humidity: weatherData.main.humidity, // Humidity in %
      rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0, // Rainfall in mm (last 1 hour)
      windSpeed: weatherData.wind.speed, // Wind speed in m/s
      weatherCondition: weatherData.weather[0].description // Short description (e.g., "moderate rain")
    };

    // Create a new farm entry in MongoDB
    const newFarm = new Farm({
      village,
      town,
      district,
      coordinates,
      soilType,
      landArea,
      budget,
      weather: weatherInfo // Store extracted weather data
    });

    await newFarm.save();

    res.status(201).json({
      message: "Farm data saved successfully!",
      farmId: newFarm._id,
      weather: weatherInfo
    });

  } catch (error) {
    console.error("Error adding farm:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Step 2: When we click submit in the frontend fetch the lasted updated document id
exports.getLatestFarmID = async (req, res) => {
    try {
      // Find the latest farm entry based on creation time
      const latestFarm = await Farm.findOne().sort({ createdAt: -1 });
  
      if (!latestFarm) {
        return res.status(404).json({ message: "No farm data found" });
      }
  
      res.json({ farmId: latestFarm._id });
    } catch (error) {
      console.error("Error fetching latest farm:", error);
      res.status(500).json({ message: "Error retrieving latest farm data" });
    }
};



