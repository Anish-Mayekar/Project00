const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const Preparation = require("../models/PrepStage.model");
const FarmerInput = require("../models/FarmersDetails")
const { getGeminiInsights } = require("../utils/geminiService");
dotenv.config();
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

exports.createPreparation = async (req, res) => {
  try {
    const { gpsLocation, soilTestResults, plannedSowingDate, plantName, farmerId } = req.body;

    // Getting the coordinates of the farm
    const coordinates = await FarmerInput.findById(farmerId);

    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: coordinates.coordinates.lat,
        lon: coordinates.coordinates.lng,
        appid: WEATHER_API_KEY,
        units: "metric" // Temperature in Celsius
      }
    });
    
    const getWindDirection = (degrees) => {
      if (degrees === null) return 'No wind data';
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const index = Math.round((degrees % 360) / 45);
      return directions[index % 8];
    };

    const weatherDataString = weatherResponse.data.list.map(item =>
      `Date: ${new Date(item.dt_txt).toLocaleString()}, Temperature: ${item.main.temp}°C, Weather: ${item.weather[0].description}, Wind Speed: ${item.wind.speed} m/s, Wind Direction: ${getWindDirection(item.wind.deg)}`
    ).join("\n");
    
    
    // Helper function to convert wind direction degrees to cardinal directions
  
    console.log(weatherDataString);
    // Generate AI Prompt for Preparation Stage
    const geminiPrompt = `
      Plant Name: ${plantName}
      Soil Test Results: ${soilTestResults}
      Planned Sowing Date: ${plannedSowingDate}
      
      5-day weather forecast is available at any location on the globe. It includes weather forecast data with a 3-hour step. The forecast is available in an array of objects format, where Temperature, Weather, and DateTime are provided. 
      Weather Data: 
      ${weatherDataString}
      
      Provide structured insights on the following JSON format. Strictly keep the output in given JSON Format only:

        plowing_date_adjustment:
          recommendation: Provide a recommendation on whether the plowing date should be adjusted.
          reason: Justify the recommendation based on the 5-day weather forecast.

        soil_ph:
          status: Describe the current soil pH condition.
          recommendation: Suggest necessary soil pH corrections.
          reason: Explain the rationale behind the recommendation.

        nutrient_management:
          nitrogen:
            status: Provide the nitrogen level status.
            recommendation: Suggest necessary nitrogen adjustments.
            reason: Explain the reasoning behind the recommendation.
          phosphorus:
            status: Provide the phosphorus level status.
            recommendation: Suggest necessary phosphorus adjustments.
            reason: Explain the reasoning behind the recommendation.
          potassium:
            status: Provide the potassium level status.
            recommendation: Suggest necessary potassium adjustments.
            reason: Explain the reasoning behind the recommendation.

        weather_alerts:
          high_temperatures:
            status: Indicate any concerns related to high temperatures.
            message: Provide a message regarding potential risks or precautions.
          wind:
            status: Indicate any concerns related to wind conditions.
            message: Provide a message regarding potential risks or precautions.

        sowing_date_impact:
          potential_issues: Identify possible issues related to the planned sowing date.
          alternative_sowing_date_considerations: Suggest adjustments based on the 5-day weather forecast.
    `;

    // Fetch AI-generated suggestions in JSON format
    const geminiSuggestions = await getGeminiInsights(geminiPrompt);

    console.log("🔹 Gemini JSON Response (Before Saving):", geminiSuggestions);

    const newPreparation = new Preparation({
      farmerId,
      plantName,
      soilTestResults,
      plannedSowingDate,
      gpsLocation,
      aiSuggestions: geminiSuggestions, // Store structured JSON
    });

    await newPreparation.save();
    res.status(201).json(newPreparation);
  } catch (error) {
    console.error("Error in preparation process:", error);
    res.status(500).json({ message: "Error processing preparation stage", error: error.message });
  }
};

exports.getPreparationByFarmer = async (req, res) => {
  try {
    const { farmerId} = req.params;

    // Validate and convert farmerId
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: "Invalid farmerId format" });
    }
    
    const preparation = Preparation.findById(farmerId);

    res.json(preparation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPreparations = async (req, res) => {
  try {
    const preparations = await Preparation.find(); 
    res.json(preparations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePreparation = async (req, res) => {
  try {
    const {farmerId, info} = req.params;
    const id = new mongoose.Types.ObjectId(farmerId)
    const coordinates = await FarmerInput.findById(id);
    const latestPreparation = await Preparation.findOne({farmerId:id});
    console.log(latestPreparation);
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: coordinates.coordinates.lat,
        lon: coordinates.coordinates.lng,
        appid: WEATHER_API_KEY,
        units: "metric" // Temperature in Celsius
      }
    });
    
    const getWindDirection = (degrees) => {
      if (degrees === null) return 'No wind data';
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const index = Math.round((degrees % 360) / 45);
      return directions[index % 8];
    };

    const weatherDataString = weatherResponse.data.list.map(item =>
      `Date: ${new Date(item.dt_txt).toLocaleString()}, Temperature: ${item.main.temp}°C, Weather: ${item.weather[0].description}, Wind Speed: ${item.wind.speed} m/s, Wind Direction: ${getWindDirection(item.wind.deg)}`
    ).join("\n");
    

    const geminiPrompt = `
      First tell me if there are any changes to the previous content in a key-value pair with key as Change based on the current weather forecast and new information.Keep Change key as boolean.
      Changes should be strictly in the same format as the previously provided context. Only use the previously used keys and change the value of those keys only. Do not add the current weather and new information to your response.
      Again make sure the if the changes are required.
      Previous context : ${latestPreparation}
      Current weather : ${weatherDataString}
      New Information : ${info}
    `;

    // Fetch AI-generated suggestions in JSON format
    const geminiSuggestions = await getGeminiInsights(geminiPrompt);

    console.log("🔹 Gemini JSON Response:", geminiSuggestions);

    if (geminiSuggestions.Change) {
      try {
        // Extract all fields except 'Change'
        const updateData = Object.keys(geminiSuggestions)
          .filter(key => key !== 'Change')
          .reduce((acc, key) => {
            acc[key] = geminiSuggestions[key];
            return acc;
          }, {});
    
          console.log("Data which will be added to the DB: ", updateData);
          
        // Update the farmer's data with all fields except 'Change'
        const updatedFarmer = await Preparation.findOneAndUpdate(
          {farmerId:id},
          updateData
        );
    
        console.log("Updated farmer data:", updatedFarmer);
      } catch (updateError) {
        console.error("Error updating farmer data:", updateError);
        res.status(500).json({ 
          message: "Error updating farmer data", 
          error: updateError.message 
        });
      }
    }
    res.json(geminiSuggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePreparation = async (req, res) => {
  try {
    await Preparation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Preparation stage deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};