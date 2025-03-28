// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { FaPlus, FaLeaf } from "react-icons/fa";
// import FarmDetailsForm from "./FarmersForm";
// import Navbar from "./Navbar";
// import MobileBg from "../../assets/mobile-bg.png";
// import DesktopBg from "../../assets/desktop-bg.jpg";

// function FarmHomepage() {
//   const [showForm, setShowForm] = useState(false);
//   const [selectedCrops, setSelectedCrops] = useState([]);
  
//   // Remove local state for crop details since we'll use navigation
//   const navigate = useNavigate(); // Initialize navigation

//   useEffect(() => {
//     // Fetch selected crops from backend
//     fetch(`${import.meta.env.VITE_API_URL}/farmers/allSelectedCrops`)
//       .then((response) => response.json())
//       .then((data) => setSelectedCrops(data))
//       .catch((error) => console.error("Error fetching crops:", error));
//   }, []);

//   const handleOpenForm = () => setShowForm(true);
//   const handleCloseForm = () => setShowForm(false);

//   const handleCropClick = (cropId) => {
//     // Navigate to the new route with cropId as a parameter
//     // navigate(`/selected-crop/${cropId}`);
//     navigate(`/farm-homepage`);
    
//   };

//   return (
//     <div className="min-h-screen flex flex-col relative">
//       {/* Mobile background (visible on small screens) */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
//         style={{ backgroundImage: `url(${MobileBg})` }}
//       ></div>
      
//       {/* Desktop background (visible on medium screens and up) */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
//         style={{ backgroundImage: `url(${DesktopBg})` }}
//       ></div>
      
//       {/* Content */}
//       <div className="relative z-10 flex flex-col min-h-screen">
//         <Navbar />
//         <div className="flex-grow p-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {selectedCrops.map((crop) => (
//               <div
//                 key={crop._id}
//                 className="bg-stone-800 bg-opacity-90 p-6 rounded-xl shadow-md border border-gray-300 flex flex-row items-center justify-center h-32 w-full md:h-36 lg:h-40 cursor-pointer hover:bg-stone-700 transition"
//                 onClick={() => handleCropClick(crop._id)}
//               >
//                 <FaLeaf className="text-green-600 text-2xl mr-4" />
//                 <p className="text-lg font-semibold text-white text-center">
//                   {crop.selectedCrop}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Floating action button */}
//         <div className="fixed bottom-8 right-8">
//           <button
//             onClick={handleOpenForm}
//             className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center"
//           >
//             <FaPlus size={24} />
//           </button>
//         </div>

//         {showForm && <FarmDetailsForm onClose={handleCloseForm} />}
//       </div>
//     </div>
//   );
// }

// export default FarmHomepage;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaLeaf } from "react-icons/fa";
import FarmDetailsForm from "./FarmersForm";
import Navbar from "./Navbar";
import MobileBg from "../../assets/mobile-bg.png";
import DesktopBg from "../../assets/desktop-bg.jpg";

function FarmHomepage() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    console.log("userid", userId)
    console.log("token", token)
    if (!token) {
      alert("Unauthorized! Please login.");
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/farmers/allSelectedCrops`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setSelectedCrops(data))
      .catch((error) => console.error("Error fetching crops:", error));
  }, [navigate]);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleCropClick = (cropId) => {
    navigate(`/selected-crop/${cropId}`); // Pass user ID to next route
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden" style={{ backgroundImage: `url(${MobileBg})` }}></div>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: `url(${DesktopBg})` }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedCrops.map((crop) => (
              <div
                key={crop._id}
                className="bg-stone-800 bg-opacity-90 p-6 rounded-xl shadow-md border border-gray-300 flex flex-row items-center justify-center h-32 w-full md:h-36 lg:h-40 cursor-pointer hover:bg-stone-700 transition"
                onClick={() => handleCropClick(crop._id)}
              >
                <FaLeaf className="text-green-600 text-2xl mr-4" />
                <p className="text-lg font-semibold text-white text-center">{crop.selectedCrop}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-8 right-8">
          <button onClick={handleOpenForm} className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center">
            <FaPlus size={24} />
          </button>
        </div>

        {showForm && <FarmDetailsForm onClose={handleCloseForm} />}
      </div>
    </div>
  );
}

export default FarmHomepage;
