const mongoose = require('mongoose');

const sowingSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  plantName: { type: String, required: true }, // Now included from Preparation stage
  seedVariety: { type: String, required: true },
  soilTemperature: { type: Number, required: true },
  sowingDepth: { type: Number, required: true },

  // Store AI-generated JSON insights
  aiSuggestions: { 
    type: Object, 
    default: {} 
  }
});

module.exports = mongoose.model('Sowing', sowingSchema);
