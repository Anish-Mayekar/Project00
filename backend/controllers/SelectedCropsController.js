const { ChatOpenAI } = require("@langchain/openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const SelectedCrop = require("../models/SelectedCrops");
const FarmerInput = require("../models/FarmersDetails");
const dotenv = require("dotenv");

dotenv.config();

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.7
});

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Step 3: Based on the id fetched we will run the recommendations for crops
//         This recommendation data will also be store in selectedcrops schema using openai api
// exports.generateCropRecommendations = async (req, res) => {
//   try {
//     const { farmId } = req.params;

//     // Fetch farm details from FarmerInput schema
//     const farm = await FarmerInput.findById(farmId);
//     if (!farm) return res.status(404).json({ message: "Farm details not found" });

//     // LangChain prompt
//     const prompt = `
//       Given the following farm details, recommend up to 5 suitable crops:
//       - **Soil Type:** ${farm.soilType}
//       - **Land Area:** ${farm.landArea} acres
//       - **Budget:** ₹${farm.budget}
//       - **Weather Conditions:**
//         - Temperature: ${farm.weather.temperature}°C
//         - Humidity: ${farm.weather.humidity}%
//         - Rainfall: ${farm.weather.rainfall}mm
//         - Wind Speed: ${farm.weather.windSpeed} m/s
//         - Condition: ${farm.weather.weatherCondition}

//       Provide up to 5 crops in this JSON format:
//       [
//         { "name": "Crop Name", "estimatedCost": 15000, "estimatedYield": 3500, "additionalInfo": "High market demand" },
//         { "name": "Crop Name 2", "estimatedCost": 12000, "estimatedYield": 4000, "additionalInfo": "Requires moderate rainfall" }
//       ]
//     `;

//     // Call LangChain API and use `invoke()` instead of `call()`
//     const response = await openai.invoke(prompt);

//     // Extract and parse JSON response safely
//     let crops = [];
//     try {
//       crops = JSON.parse(response.content); // Use `.content` for OpenAI chat response
//     } catch (parseError) {
//       console.error("Error parsing LangChain response:", parseError);
//       return res.status(500).json({ message: "Error parsing AI response" });
//     }

//     // Find or create SelectedCrop entry for this farm
//     let selectedCropEntry = await SelectedCrop.findOne({ farm: farmId });

//     if (!selectedCropEntry) {
//       selectedCropEntry = new SelectedCrop({
//         farm: farmId,
//         recommendedCrops: crops.slice(0, 5) // Store max 5 crops
//       });
//     } else {
//       selectedCropEntry.recommendedCrops = crops.slice(0, 5); // Update recommendations if entry exists
//     }

//     await selectedCropEntry.save();

//     res.json({ farmId, recommendedCrops: selectedCropEntry.recommendedCrops });

//   } catch (error) {
//     console.error("Error generating recommendations:", error);
//     res.status(500).json({ message: "Error generating crop recommendations" });
//   }
// };

// using gemini api
exports.generateCropRecommendations = async (req, res) => {
  try {
    const { farmId } = req.params;

    // Fetch farm details from FarmerInput schema
    const farm = await FarmerInput.findById(farmId);
    if (!farm) return res.status(404).json({ message: "Farm details not found" });

    // Create prompt for Gemini with explicit instructions for specific crop names
    const prompt = `
      Given the following farm details, recommend up to 5 suitable specific crops:
      - Soil Type: ${farm.soilType}
      - Land Area: ${farm.landArea} acres
      - Budget: ₹${farm.budget}
      - Weather Conditions:
        - Temperature: ${farm.weather.temperature}°C
        - Humidity: ${farm.weather.humidity}%
        - Rainfall: ${farm.weather.rainfall}mm
        - Wind Speed: ${farm.weather.windSpeed} m/s
        - Condition: ${farm.weather.weatherCondition}

      IMPORTANT: You must provide SPECIFIC individual crop names only (e.g., "Wheat", "Rice", "Chickpea") 
      rather than crop categories (e.g., do NOT use "Pulses", "Cereals", "Vegetables"). 
      Each recommendation should be a single, specific crop variety.

      Provide up to 5 specific crops in this JSON format:
      [
        { "name": "Wheat", "estimatedCost": 15000, "estimatedYield": 3500, "additionalInfo": "High market demand" },
        { "name": "Rice", "estimatedCost": 12000, "estimatedYield": 4000, "additionalInfo": "Requires moderate rainfall" }
      ]
      
      Only respond with the JSON array. Do not include any other text, explanations or markdown.
    `;

    // Configure the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content with specific generation config
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    };

    // Generate content with Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const responseText = response.text();

    // Extract and parse JSON response safely
    let crops = [];
    try {
      // Find JSON in the response - sometimes Gemini includes additional text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        crops = JSON.parse(jsonMatch[0]);
      } else {
        crops = JSON.parse(responseText);
      }

      // Additional validation to ensure specific crop names
      crops = crops.map(crop => {
        // Check if the crop name contains categories with examples
        if (crop.name.includes("(e.g.,") || crop.name.includes("such as")) {
          // Extract just the first specific crop mentioned
          const specificCrop = crop.name.match(/[A-Za-z]+(?=,|\))/);
          if (specificCrop) {
            crop.name = specificCrop[0];
          }
        }
        return crop;
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return res.status(500).json({ 
        message: "Error parsing AI response",
        rawResponse: responseText
      });
    }

    // Find or create SelectedCrop entry for this farm
    let selectedCropEntry = await SelectedCrop.findOne({ farm: farmId });

    if (!selectedCropEntry) {
      selectedCropEntry = new SelectedCrop({
        farm: farmId,
        recommendedCrops: crops.slice(0, 5) // Store max 5 crops
      });
    } else {
      selectedCropEntry.recommendedCrops = crops.slice(0, 5); // Update recommendations if entry exists
    }

    await selectedCropEntry.save();

    res.json({ farmId, recommendedCrops: selectedCropEntry.recommendedCrops });

  } catch (error) {
    console.error("Error generating recommendations:", error.stack);
    res.status(500).json({ 
      message: "Error generating crop recommendations",
      error: error.message 
    });
  }
};


// Step 4: Fetch the lasted document id where we added recommendation
exports.getLatestUpdatedSelectedCropID = async (req, res) => {
    try {
      // Find the latest updated SelectedCrop entry
      const latestSelectedCrop = await SelectedCrop.findOne().sort({ createdAt: -1 });
  
      if (!latestSelectedCrop) {
        return res.status(404).json({ message: "No selected crop data found" });
      }
  
      res.json({ selectedCropId: latestSelectedCrop._id, farmId: latestSelectedCrop.farm });
    } catch (error) {
      console.error("Error fetching latest selected crop:", error);
      res.status(500).json({ message: "Error retrieving latest selected crop data" });
    }
};

// Step 5: based on fetched id from step 4 and the selected crop we will store the selected crop
exports.selectedCrop = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { selectedCrop } = req.body;

    // Check if the SelectedCrop entry exists for this farm
    let selectedCropEntry = await SelectedCrop.findOne({ farm: farmId });

    if (!selectedCropEntry) {
      return res.status(404).json({ message: "No crop recommendations found for this farm" });
    }

    // Validate if the selected crop is in the recommended list
    const isValidCrop = selectedCropEntry.recommendedCrops.some(crop => crop.name === selectedCrop);

    if (!isValidCrop) {
      return res.status(400).json({ message: "Invalid crop selection. Please select from the recommended crops." });
    }

    // Save the selected crop
    selectedCropEntry.selectedCrop = selectedCrop;
    await selectedCropEntry.save();

    res.json({ message: "Crop selection saved successfully!", selectedCrop });

  } catch (error) {
    console.error("Error selecting crop:", error);
    res.status(500).json({ message: "Error saving crop selection" });
  }
};

// Step 6. Display all the created selectedcrops document
exports.getAllSelectedCrops = async (req, res) => {
  try {
    const selectedCrops = await SelectedCrop.find().populate("farm");
    res.status(200).json(selectedCrops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching selected crops", error });
  }
};

exports.getCropById = async (req, res) => {
  try {
    const { cropId } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(cropId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid crop ID format" 
      });
    }

    // Find the crop by its ID and populate the farm details
    const crop = await SelectedCrop.findById(cropId).populate("farm"); 

    // Check if crop exists
    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: "Crop not found" 
      });
    }

    // Return the crop data with populated farm details
    return res.status(200).json({ 
      success: true, 
      data: crop 
    });

  } catch (error) {
    console.error("Error fetching crop by ID:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while fetching crop details",
      error: error.message 
    });
  }
};