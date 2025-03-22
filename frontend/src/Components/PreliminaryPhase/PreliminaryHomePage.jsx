import React, { useState, useEffect } from "react";
import { FaPlus, FaLeaf } from "react-icons/fa";
import FarmDetailsForm from "./FarmersForm";
import Navbar from "./Navbar";

function FarmHomepage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);

  useEffect(() => {
    // Fetch selected crops from backend
    fetch(`${import.meta.env.VITE_API_URL}/farmers/allSelectedCrops`)
      .then((response) => response.json())
      .then((data) => setSelectedCrops(data))
      .catch((error) => console.error("Error fetching crops:", error));
  }, []);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {selectedCrops.map((crop) => (
            <div
              key={crop._id}
              className="bg-stone-800 p-6 rounded-xl shadow-md border border-gray-300 flex flex-row items-center justify-center h-32 w-full md:h-36 lg:h-40"
            >
              <FaLeaf className="text-green-600 text-2xl mr-4" />
              <p className="text-lg font-semibold text-white text-center">{crop.selectedCrop}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleOpenForm}
          className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center"
        >
          <FaPlus size={24} />
        </button>
      </div>

      {showForm && <FarmDetailsForm onClose={handleCloseForm} />}
    </div>
  );
}

export default FarmHomepage;
