const mongoose = require("mongoose");

const selectedCropSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerInput",
    required: true,
  },

  recommendedCrops: [
    {
      name: { type: String, required: true },
      estimatedCost: { type: Number, required: true }, 
      estimatedYield: { type: Number, required: true }, 
      additionalInfo: { type: String }, 
    },
  ],

  selectedCrop: {
    type: String,
    default: null, 
  },
}, { timestamps: true });

const SelectedCrop = mongoose.model("SelectedCrop", selectedCropSchema);
module.exports = SelectedCrop;
