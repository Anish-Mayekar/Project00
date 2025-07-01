const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const Sowing = require("../models/SowingStage.model");
const Preparation = require("../models/PrepStage.model");
const FarmerInput = require("../models/FarmersDetails");

const { getGeminiInsights } = require("../utils/geminiService");
dotenv.config();

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

exports.createSowing = async (req, res) => {
  try {
    const { farmerId, seedVariety, soilTemperature, sowingDepth } = req.body;

    // Fetch the plant name from the previous Preparation stage
    const previousStage = await Preparation.findOne({ farmerId });
    if (!previousStage) {
      return res.status(400).json({ message: "No preparation data found for this farmer" });
    }
    const plantName = previousStage.plantName;
    const coordinates = await FarmerInput.findById(farmerId);


    // Get 5-day weather forecast
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: coordinates.coordinates.lat,
        lon: coordinates.coordinates.lng,
        appid: WEATHER_API_KEY,
        units: "metric" // Temperature in Celsius
      }
    });

    // Extract weather insights
    const weatherDataString = weatherResponse.data.list.map(item =>
      `Date: ${new Date(item.dt_txt).toLocaleString()}, Temperature: ${item.main.temp}°C, Weather: ${item.weather[0].description}`
    ).join("\n");

    console.log(weatherDataString);

    // AI Prompt for Sowing Stage
    const geminiPrompt = `
      Generate a JSON response with the following structure:

{
    "temperature_analysis": "Recorded soil temperature is ${soilTemperature}°C. It's crucial to measure and ensure it falls within the ideal range (20-30°C) for optimal germination.",
    "sowing_depth_recommendation": "The provided sowing depth of ${sowingDepth} cm is generally suitable for ${plantName}. However, adjust to 3-4 cm in heavy clay soils and 6-7 cm in sandy soils to ensure proper moisture availability and seedling emergence.",
    "alternative_sowing_methods": [
        "Broadcasting: Evenly scattering seeds on the prepared soil surface, followed by light raking.",
        "Drilling: Sowing seeds in rows using a seed drill for uniform spacing and depth.",
        "Dibbling: Placing seeds individually in small holes made at regular intervals."
    ],
    "weather_risk_assessment": {
        "overall_risk": "Determine the overall risk based on weather conditions.",
        "temperature": "Analyze forecasted air temperatures to assess risks for ${plantName} germination and early growth.",
        "precipitation": "The forecast indicates: ${weatherDataString}. Monitor soil moisture and consider light irrigation if necessary, especially in sandy soils.",
        "cloud_cover": "Evaluate cloud cover trends for potential impact on temperature and growth conditions."
    },
    "adjustments_needed": [
        "Measure soil temperature before sowing to ensure it's within the ideal range.",
        "Adjust sowing depth based on soil type (3-4 cm for heavy clay, 6-7 cm for sandy soils).",
        "Monitor soil moisture and provide light irrigation if needed, especially in sandy soils.",
        "Be prepared to protect seedlings from unexpected weather events like heavy rainfall or strong winds, based on ${weatherDataString}."
    ]
}

Use the given parameters:
- Plant Name: ${plantName}
- Seed Variety: ${seedVariety}
- Recorded Soil Temperature: ${soilTemperature}°C
- Sowing Depth: ${sowingDepth} cm
- 5-day Weather Forecast: ${weatherDataString}

Compare the recorded soil temperature with the ideal range for ${plantName}.  
Provide the best sowing depth recommendations or alternative methods for effective sowing.  
Highlight any risks or adjustments needed based on upcoming weather conditions.  
Ensure the response strictly follows the above JSON format.

    `;

    // Fetch AI-generated suggestions in JSON format
    const geminiSuggestions = await getGeminiInsights(geminiPrompt);

    console.log("Gemini JSON Response (Before Saving):", geminiSuggestions);

    // Save Sowing Data
    const newSowing = new Sowing({
      farmerId,
      plantName,
      seedVariety,
      soilTemperature:20,
      sowingDepth,
      aiSuggestions: geminiSuggestions, // Store structured JSON
    });

    await newSowing.save();
    res.status(201).json(newSowing);
  } catch (error) {
    console.error("Error in sowing process:", error);
    res.status(500).json({ message: "Error processing sowing stage", error: error.message });
  }
};

// Get sowing data by farmer ID
exports.getSowingByFarmer = async (req, res) => {
  try {
    const sowing = await Sowing.find({ farmerId: req.params.farmerId });
    res.json(sowing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sowing records
exports.getAllSowing = async (req, res) => {
  try {
    const sowings = await Sowing.find();
    res.json(sowings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update sowing data
exports.updateSowing = async (req, res) => {
  try {
    const { farmerId, info } = req.params;
    const id = new mongoose.Types.ObjectId(farmerId);
    const coordinates = await FarmerInput.findById(id);
    const latestSowing = await Sowing.findOne({ farmerId: id });

    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        lat: coordinates.coordinates.lat,
        lon: coordinates.coordinates.lng,
        appid: WEATHER_API_KEY,
        units: "metric" // Temperature in Celsius
      }
    });

    const weatherDataString = weatherResponse.data.list.map(item =>
      `Date: ${new Date(item.dt_txt).toLocaleString()}, Temperature: ${item.main.temp}°C, Weather: ${item.weather[0].description}`
    ).join("\n");

    const geminiPrompt = `
      First, identify any necessary changes to the previous sowing data based on the current weather forecast and new information.
      Provide changes in a key-value pair format with a boolean key "Change".
      Maintain the same format as the previous sowing data and modify only necessary fields.
      Previous Sowing Data: ${JSON.stringify(latestSowing)}
      Current Weather: ${weatherDataString}
      New Information: ${info}
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

        // Update sowing data with AI recommendations
        const updatedSowing = await Sowing.findOneAndUpdate(
          { farmerId: id },
          updateData
        );

        console.log("Updated sowing data:", updatedSowing);
      } catch (updateError) {
        console.error("Error updating sowing data:", updateError);
        res.status(500).json({ 
          message: "Error updating sowing data", 
          error: updateError.message 
        });
      }
    }
    res.json(geminiSuggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete sowing data
exports.deleteSowing = async (req, res) => {
  try {
    await Sowing.findByIdAndDelete(req.params.id);
    res.json({ message: "Sowing stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
