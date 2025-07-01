const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBoblnjdxbN2HUwVsf94xRNXluHFK35T80");

exports.getGeminiInsights = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 50,
      maxOutputTokens: 1024
    };

    const jsonPrompt = `
      ${prompt}

      Please provide the response strictly in **valid JSON format**, without markdown formatting (no triple backticks). The response should contain key-value pairs relevant to the given prompt.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
      generationConfig
    });

    // Extract AI response properly
    let responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    console.log("Raw Gemini JSON Response:", responseText); // Debugging

    // Clean up the response by removing markdown formatting (triple backticks and "json" tag)
    responseText = responseText.replace(/```json|```/g, "").trim();

    return JSON.parse(responseText); // Convert to JSON
  } catch (error) {
    console.error("Error fetching Gemini AI insights:", error.stack);
    throw new Error("Failed to retrieve AI-generated insights");
  }
};
