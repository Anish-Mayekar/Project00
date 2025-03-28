const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  village: {
    type: String,
    required: true,
  },
  states: {
    type: String,
  },
  district: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  soilType: {
    type: String,
    required: true,
  },
  landArea: {
    type: Number,
    required: true,
    min: 0,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  weather: {
    temperature: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    rainfall: {
      type: Number,
      default: 0,
    },
    windSpeed: {
      type: Number,
    },
    weatherCondition: {
      type: String,
    },
  }
}, { timestamps: true });

const Farm = mongoose.model("FarmerInput", farmSchema);
module.exports = Farm;
