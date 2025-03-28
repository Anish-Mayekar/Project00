import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaChevronRight,
  FaChevronLeft,
  FaTimes,
} from "react-icons/fa";
import CropRecommendationModal from "./CropsRecommendationModal";

const FarmDetailsForm = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [formData, setFormData] = useState({
    village: "",
    states: "",
    district: "",
    coordinates: { lat: null, lng: null },
    soilType: "",
    landArea: "",
    budget: "",
  });

  const soilTypes = [
    "Alluvial Soil",
    "Black Soil (Regur)",
    "Red Soil",
    "Laterite Soil",
    "Mountain Soil",
    "Desert Soil",
    "Saline Soil",
    "Peaty Soil",
    "Forest Soil",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please try again or enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleNextStep = () => {
    if (formData.village && formData.states && formData.district) {
      setStep(2);
    } else {
      alert("Please fill in the required fields (Village and District)");
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers/addFarmerInput`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Submitting formData:", data);
      if (response.ok) {
        // Show recommendations modal instead of closing
        setShowRecommendations(true);
      } else {
        alert(`Error: ${data.message || "Failed to submit farm details"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    // Here you could save the selected crop to your backend if needed
    console.log("Selected crop:", crop);
    
    // Finally close the form
    if (onClose) onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-lime-600 rounded-lg shadow-xl w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-lime-500">
            <h2 className="text-xl font-semibold text-white">
              {step === 1 ? "Farm Location" : "Farm Details"}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-4">
            {step === 1 ? (
              /* Step 1: Location Information */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">Village*</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">States*</label>
                  <input
                    type="text"
                    name="states"
                    value={formData.states}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">District*</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="flex items-center justify-center w-full py-3 px-4 rounded-3xl shadow-sm text-sm font-medium text-white bg-neutral-950 hover:bg-neutral-800"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Get Current Location
                  </button>
                  {formData.coordinates.lat && (
                    <p className="mt-2 text-sm text-white">
                      Location: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Step 2: Farm Details */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">Soil Type*</label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  >
                    <option value="">Select Soil Type</option>
                    {soilTypes.map((soil, index) => (
                      <option key={index} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Land Area (acres)*</label>
                  <input
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Budget (₹)*</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-3xl h-12 px-4 bg-white text-black border-none shadow-sm"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Modal Footer */}
          <div className="px-4 py-4 bg-lime-700 flex justify-between rounded-b-lg">
            {step === 2 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-3 px-6 rounded-3xl text-white bg-neutral-950 hover:bg-neutral-800"
              >
                <FaChevronLeft className="mr-2 inline" /> Back
              </button>
            )}
            
            <div className={`${step === 1 ? 'w-full' : ''}`}>
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="py-3 px-6 rounded-3xl text-white bg-neutral-950 hover:bg-neutral-800 w-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="py-3 px-6 rounded-3xl text-white bg-neutral-950 hover:bg-neutral-800 w-full"
                >
                  Next <FaChevronRight className="ml-2 inline" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Crop Recommendation Modal */}
      <CropRecommendationModal 
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        onSelectCrop={handleSelectCrop}
      />
    </>
  );
};

export default FarmDetailsForm;