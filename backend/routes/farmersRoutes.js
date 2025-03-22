const express = require("express");
const router = express.Router();
const {
    addFarm,
    getLatestFarmID
} = require("../controllers/FarmersDetailsController");

const {
    generateCropRecommendations,
    selectedCrop,
    getLatestUpdatedSelectedCropID,
    getAllSelectedCrops
} = require("../controllers/SelectedCropsController");


// Route to add farmers input
router.post("/addFarmerInput", addFarm);

// Route to get recommendations 
router.get("/:farmId/recommendations", generateCropRecommendations);

// Route to add the selected crop
router.put("/:farmId/select-crop", selectedCrop);

// Route to lasted id of the input added to database for farmers detail
router.get("/latest-farmer-detail-Id", getLatestFarmID);

// Route to get lasted selectcrop document when we add recommendation
router.get("/latest-recommendation-added-Id", getLatestUpdatedSelectedCropID);

router.get("/allSelectedCrops", getAllSelectedCrops);


module.exports = router;
