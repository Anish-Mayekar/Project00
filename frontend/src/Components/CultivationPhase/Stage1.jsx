"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
// import MobileBg from "../../assets/sowing-stage-mobile.jpg"
// import DesktopBg from "../../assets/sowing-stage-desktop.jpg"
import FarmersBot from "../../assets/farmer-bot.png"
import DesktopBg from "../../assets/desktop-bg.jpg";
import MobileBg from "../../assets/mobile-bg.png";
import Chatbot from "../Farmers-bot"
import { FaTemperatureHigh, FaTint, FaCloudRain, FaWind, FaSun } from "react-icons/fa"

const StageOne = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cropid } = location.state || {}
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [weatherData, setWeatherData] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [farmerId, setFarmerId] = useState(null)
  const [formData, setFormData] = useState({
    plantName: "",
    soilTestResults: "",
    plannedSowingDate: "",
    farmerId: "",
  })
  const [logData, setLogData] = useState(null)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    type: "",
  })

  const fetchLogData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/preperation`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Check if data is an array and has at least one item
      if (Array.isArray(data) && data.length > 0) {
        // Get the first item from the array
        setLogData(data[data.length - 1])
        console.log("Log data fetched:", data[data.length - 1])
      } else {
        console.warn("Log data not found in response or empty array:", data)
      }
    } catch (error) {
      console.error("Error fetching log data:", error)
    }
  }

  useEffect(() => {
    // Fetch log data when component mounts
    fetchLogData()
  }, [])

  // Resize and Mobile Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch Farmer ID
  useEffect(() => {
    const fetchFarmerId = async () => {
      if (cropid) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/farmers/crop/${cropid}`)
          const data = await response.json()

          if (data.success && data.data) {
            // Get farm ID from the farm object
            const fetchedFarmerId = data.data.farm._id

            // Prepare initial form data with additional information from the response
            const initialFormData = {
              plantName: data.data.selectedCrop || "", // Use selected crop as default plant name
              soilTestResults: data.data.farm.soilType || "", // Use soil type as soil test results
              plannedSowingDate: new Date(data.data.createdAt).toISOString().split("T")[0], // Use creation date as planned sowing date
              farmerId: fetchedFarmerId,
            }

            console.log("Fetched Farmer ID:", fetchedFarmerId)
            console.log("Initial Form Data:", initialFormData)

            setFarmerId(fetchedFarmerId)

            setFormData(initialFormData)
          } else {
            console.error("Farmer data not found in response:", data)
            setSubmitStatus({
              message: "Could not retrieve Farmer Information",
              type: "error",
            })
          }
        } catch (error) {
          console.error("Error fetching farmer data:", error)
          setSubmitStatus({
            message: "Error fetching Farmer Information",
            type: "error",
          })
        }
      }
    }

    fetchFarmerId()
  }, [cropid])

  // Fetch Weather Data
  useEffect(() => {
    if (cropid) {
      fetch(`${import.meta.env.VITE_API_URL}/farmers/crop/${cropid}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Weather data:", data.data.farm.weather)
          setWeatherData(data.data.farm.weather)
        })
        .catch((error) => console.error("Error fetching weather data:", error))
    }
  }, [cropid])

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Form Submission Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ message: "", type: "" })

    if (!farmerId) {
      setSubmitStatus({
        message: "Farmer ID is required. Please try again.",
        type: "error",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/preperation/prep`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          farmerId: farmerId,
        }),
      })

      const data = await response.json()
      console.log("Response Data:", data)

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setSubmitStatus({
        message: "Data submitted successfully!",
        type: "success",
      })

      setTimeout(() => {
        setIsFormOpen(false)
        setFormData({
          plantName: "",
          soilTestResults: "",
          plannedSowingDate: "",
          farmerId: farmerId,
        })
        setSubmitStatus({ message: "", type: "" })
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        message: error.message || "Failed to submit data. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render Form Method
  const renderForm = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg ${isMobile ? "w-11/12" : "w-1/3"} p-6`}>
        <h2 className="text-xl font-bold text-lime-700 mb-4">Enter Information</h2>

        {submitStatus.message && (
          <div
            className={`mb-4 p-3 rounded ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="plantName" className="block text-gray-700 font-medium mb-1">
              Plant Name
            </label>
            <input
              type="text"
              id="plantName"
              name="plantName"
              value={formData.plantName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="soilTestResults" className="block text-gray-700 font-medium mb-1">
              Soil Test Results
            </label>
            <input
              type="text"
              id="soilTestResults"
              name="soilTestResults"
              value={formData.soilTestResults}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="plannedSowingDate" className="block text-gray-700 font-medium mb-1">
              Planned Sowing Date
            </label>
            <input
              type="text"
              id="plannedSowingDate"
              name="plannedSowingDate"
              value={formData.plannedSowingDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${isSubmitting ? "bg-lime-400" : "bg-lime-600 hover:bg-lime-700"} text-white rounded-md flex items-center justify-center min-w-[80px]`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  // Render Weather Info Method
  const renderWeatherInfo = () =>
    weatherData ? (
      <div>
        <p className="text-lg font-semibold p-1.5 text-black">Today's Weather</p>
        <div className={`grid ${isMobile ? "grid-cols-2 gap-4" : "grid-cols-2 gap-6"} text-white`}>
          <div
            className={`flex flex-col items-center justify-center bg-lime-700 ${
              isMobile ? "p-2" : "p-4"
            } rounded-lg shadow-md`}
          >
            <FaTemperatureHigh className={`text-yellow-400 ${isMobile ? "text-2xl" : "text-5xl"} mb-2`} />
            <p className={`font-bold ${isMobile ? "text-lg" : "text-3xl"}`}>{weatherData.temperature}°C</p>
            <p className="text-sm">Temperature</p>
          </div>
          <div className={`flex flex-col justify-between bg-lime-800 ${isMobile ? "p-2" : "p-4"} rounded-lg shadow-md`}>
            <div className="flex items-center space-x-2">
              <FaTint className="text-blue-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>Humidity: {weatherData.humidity}%</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCloudRain className="text-blue-400" />
              <p className={isMobile ? "text-xs" : "text-md"}>Rainfall: {weatherData.rainfall}mm</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaWind className="text-gray-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>Wind: {weatherData.windSpeed} m/s</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaSun className="text-yellow-300" />
              <p className={isMobile ? "text-xs" : "text-md"}>Condition: {weatherData.weatherCondition}</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-lg font-semibold text-white">Loading Weather Data...</p>
    )

  const handleOpenLogModal = () => {
    // Refresh log data when opening modal
    fetchLogData()
    setIsLogModalOpen(true)
  }

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const renderLogModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg ${isMobile ? "w-11/12 max-h-[90vh]" : "w-2/3 max-h-[80vh]"} p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-lime-700">Daily Logs</h2>
          <button onClick={handleCloseLogModal} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {logData ? (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-bold text-lime-700 mb-3">Basic Information</h3>
                <p className="mb-2">
                  <strong>Plant Name:</strong> {logData.plantName}
                </p>
                <p className="mb-2">
                  <strong>Soil Test Results:</strong> {logData.soilTestResults}
                </p>
                <p className="mb-2">
                  <strong>Planned Sowing Date:</strong> {formatDate(logData.plannedSowingDate)}
                </p>
                <p className="mb-2">
                  <strong>Is Ready for Plowing:</strong> {logData.isReadyForPlowing ? "Yes" : "No"}
                </p>
              </div>

              {logData.aiSuggestions && logData.aiSuggestions.plowing_date_adjustment && (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-bold text-lime-700 mb-3">Plowing Recommendations</h3>
                  <p className="mb-2">
                    <strong>Recommendation:</strong> {logData.aiSuggestions.plowing_date_adjustment.recommendation}
                  </p>
                  <p className="text-sm text-gray-600">{logData.aiSuggestions.plowing_date_adjustment.reason}</p>
                </div>
              )}
            </div>

            {logData.aiSuggestions && logData.aiSuggestions.soil_ph && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-bold text-lime-700 mb-3">Soil pH Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold">Status:</p>
                    <p>{logData.aiSuggestions.soil_ph.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Recommendation:</p>
                    <p>{logData.aiSuggestions.soil_ph.recommendation}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Reason:</p>
                    <p>{logData.aiSuggestions.soil_ph.reason}</p>
                  </div>
                </div>
              </div>
            )}

            {logData.aiSuggestions && logData.aiSuggestions.nutrient_management && (
              <div className="mb-6">
                <h3 className="font-bold text-lime-700 mb-3">Nutrient Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {logData.aiSuggestions.nutrient_management.nitrogen && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-semibold">Nitrogen:</p>
                      <p className="text-sm">
                        <strong>Status:</strong> {logData.aiSuggestions.nutrient_management.nitrogen.status}
                      </p>
                      <p className="text-sm">
                        <strong>Recommendation:</strong>{" "}
                        {logData.aiSuggestions.nutrient_management.nitrogen.recommendation}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {logData.aiSuggestions.nutrient_management.nitrogen.reason}
                      </p>
                    </div>
                  )}

                  {logData.aiSuggestions.nutrient_management.phosphorus && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-semibold">Phosphorus:</p>
                      <p className="text-sm">
                        <strong>Status:</strong> {logData.aiSuggestions.nutrient_management.phosphorus.status}
                      </p>
                      <p className="text-sm">
                        <strong>Recommendation:</strong>{" "}
                        {logData.aiSuggestions.nutrient_management.phosphorus.recommendation}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {logData.aiSuggestions.nutrient_management.phosphorus.reason}
                      </p>
                    </div>
                  )}

                  {logData.aiSuggestions.nutrient_management.potassium && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-semibold">Potassium:</p>
                      <p className="text-sm">
                        <strong>Status:</strong> {logData.aiSuggestions.nutrient_management.potassium.status}
                      </p>
                      <p className="text-sm">
                        <strong>Recommendation:</strong>{" "}
                        {logData.aiSuggestions.nutrient_management.potassium.recommendation}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        {logData.aiSuggestions.nutrient_management.potassium.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {logData.aiSuggestions && logData.aiSuggestions.weather_alerts && (
              <div className="mb-6">
                <h3 className="font-bold text-lime-700 mb-3">Weather Alerts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {logData.aiSuggestions.weather_alerts.high_temperatures && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-semibold">High Temperatures:</p>
                      <p className="text-sm">
                        <strong>Status:</strong> {logData.aiSuggestions.weather_alerts.high_temperatures.status}
                      </p>
                      <p className="text-sm mt-2">{logData.aiSuggestions.weather_alerts.high_temperatures.message}</p>
                    </div>
                  )}

                  {logData.aiSuggestions.weather_alerts.wind && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="font-semibold">Wind:</p>
                      <p className="text-sm">
                        <strong>Status:</strong> {logData.aiSuggestions.weather_alerts.wind.status}
                      </p>
                      <p className="text-sm mt-2">{logData.aiSuggestions.weather_alerts.wind.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {logData.aiSuggestions && logData.aiSuggestions.sowing_date_impact && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-bold text-lime-700 mb-3">Sowing Date Impact</h3>
                <div className="mb-4">
                  <p className="font-semibold">Potential Issues:</p>
                  <p className="text-sm">{logData.aiSuggestions.sowing_date_impact.potential_issues}</p>
                </div>
                <div>
                  <p className="font-semibold">Alternative Considerations:</p>
                  <p className="text-sm">
                    {logData.aiSuggestions.sowing_date_impact.alternative_sowing_date_considerations}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-600"></div>
          </div>
        )}
      </div>
    </div>
  )

  const renderMobileView = () => (
    <>
      {/* Container below Menubar */}
      <div className="bg-white/20 shadow-md p-6 rounded-lg mx-4 my-4 flex flex-col justify-center items-center">
        {renderWeatherInfo()}
      </div>

      <div className="bg-white/30 hover:bg-white/40 shadow-md p-6 rounded-lg mx-4 my-4 flex justify-center items-center h-15 transition-colors duration-300">
        <button onClick={handleOpenLogModal} className="w-full">
          <p className="text-lg font-semibold text-black">Daily Logs</p>
        </button>
      </div>

      {/* Chatbot Image and Circular Buttons */}
      <div className="fixed bottom-25 right-1 flex flex-col items-center">
        <div className="relative w-40 h-40 flex justify-center items-center">
          {/* B1 - Text Above the Button */}
          <div className="absolute top-[-100px] flex flex-col items-center bg-black/50 p-2 rounded-md">
            <h3 className="text-lime-300 text-sm font-semibold">Plant Info</h3>
            {/* <p className="text-lime-300 font-bold text-xs">Short description</p> */}
          </div>
          <button
            className="absolute top-[-50px] bg-blue-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-blue-700"
            onClick={() => setIsFormOpen(true)}
          >
            B1
          </button>

          {/* B2 - Text on the Left */}
          <div className="absolute left-[-140px] top-[-10px] flex flex-col items-end bg-black/50 p-2 rounded-md">
            <h3 className="text-lime-300 text-sm font-semibold">Plant Info</h3>
            {/* <p className="text-lime-300 font-bold text-xs">Short description</p> */}
          </div>
          <button className="absolute left-[-30px] top-[-10px] bg-green-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-green-700">
            B2
          </button>

          {/* B3 - Text on the Left */}
          <div className="absolute left-[-140px] bottom-[25px] flex flex-col items-end bg-black/50 p-2 rounded-md">
            <h3 className="text-lime-300 text-sm font-semibold">Plant Info</h3>
            {/* <p className="text-lime-300 font-bold text-xs">Short description</p> */}
          </div>
          <button className="absolute left-[-30px] bottom-[25px] bg-red-500 text-white w-12 h-12 rounded-full shadow-md hover:bg-red-700">
            B3
          </button>

          {/* Chatbot Image */}
          <img
            src={FarmersBot || "/placeholder.svg"}
            alt="Chatbot"
            className="object-contain md:w-24 md:h-24 w-40 h-40 cursor-pointer"
            onClick={() => setIsChatOpen(true)}
          />
        </div>
      </div>
    </>
  )

  const renderDesktopView = () => (
    <>
      {/* Main Container */}
      <div className="bg-white/20 shadow-md p-6 rounded-lg mx-4 my-4 flex flex-col justify-center items-center">
        {renderWeatherInfo()}
      </div>

      {/* Single Container Below */}
      <div className="bg-white/20 hover:bg-white/30 p-6 rounded-lg shadow-md mx-4 my-4 flex justify-center items-center transition-colors duration-300">
        <button onClick={handleOpenLogModal} className="w-full">
          <p className="text-md font-semibold text-white">Daily Logs</p>
        </button>
      </div>

      {/* Three Circles in Horizontal Line */}
      <div className="flex justify-center space-x-16 my-6">
        <div className="flex flex-col items-center">
          <button
            className="bg-blue-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-blue-700"
            onClick={() => setIsFormOpen(true)}
          >
            B1
          </button>
          <h3 className="text-white text-lg font-semibold mt-2">Plant Info</h3>
          {/* <p className="text-white font-bold text-sm">Short description</p> */}
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-green-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-green-700">B2</button>
          <h3 className="text-white text-lg font-semibold mt-2">Plant Info</h3>
          {/* <p className="text-white font-bold text-sm">Short description</p> */}
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-red-500 text-white w-20 h-20 rounded-full shadow-md hover:bg-red-700">B3</button>
          <h3 className="text-white text-lg font-semibold mt-2">Plant Info</h3>
          {/* <p className="text-white font-bold text-sm">Short description</p> */}
        </div>
      </div>

      {/* Chatbot Image at Bottom Right */}
      <div className="fixed bottom-8 right-3">
        <img
          src={FarmersBot || "/placeholder.svg"}
          alt="Chatbot"
          className="object-contain w-30 h-30 cursor-pointer"
          onClick={() => setIsChatOpen(true)}
        />
      </div>
    </>
  )

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${isMobile ? MobileBg : DesktopBg})` }}
    >
      {/* Navigation Bar */}
      <nav className="bg-lime-600 p-4 shadow-md flex justify-between items-center">
        <FaArrowLeft onClick={() => navigate(-1)} className="text-white text-2xl cursor-pointer hover:text-gray-300" />
        <ul className="flex space-x-6 text-white text-lg font-semibold">
          <p>Beginning of your Journey</p>
        </ul>
      </nav>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Form Modal */}
      {isFormOpen && renderForm()}

      {/* Chatbot Box */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}

      {/* Log Modal */}
      {isLogModalOpen && renderLogModal()}
    </div>
  )
}

export default StageOne

