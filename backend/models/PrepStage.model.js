const mongoose = require('mongoose');

const preparationSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  plantName: { type: String, required: true },
  soilTestResults: { type: String, required: true },
  plannedSowingDate: { type: Date, required: true },
  isReadyForPlowing: { type: Boolean, default: false },

  // Store AI-generated JSON insights
  aiSuggestions: {
    type: Object, 
    default: {} 
  },

  alerts: { type: [String], default: [] } // Store critical weather-based alerts
});

module.exports = mongoose.model('Preparation', preparationSchema);

