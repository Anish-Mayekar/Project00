import { useState, useEffect } from "react"
import { FaTimes, FaCheckCircle } from "react-icons/fa"

const CropRecommendationModal = ({ isOpen, onClose, onSelectCrop }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCropIndex, setSelectedCropIndex] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        // First get the latest farmer ID
        const idResponse = await fetch(`${import.meta.env.VITE_API_URL}/farmers/latest-farmer-detail-Id`)
        const idData = await idResponse.json()

        if (!idResponse.ok) {
          throw new Error(idData.message || "Failed to fetch latest farmer ID")
        }
        const farmId = idData.farmId

        // Then fetch recommendations using that ID
        const recResponse = await fetch(`${import.meta.env.VITE_API_URL}/farmers/${farmId}/recommendations`)
        const recData = await recResponse.json()

        if (!recResponse.ok) {
          throw new Error(recData.message || "Failed to fetch recommendations")
        }

        setRecommendations(recData.recommendedCrops)
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [isOpen])

  const handleSelectCrop = (index) => {
    setSelectedCropIndex(index)
  }

  const handleConfirmSelection = async () => {
    if (selectedCropIndex === null) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      // 1. Get the latest recommendation document ID
      const idResponse = await fetch(`${import.meta.env.VITE_API_URL}/farmers/latest-recommendation-added-Id`)
      const idData = await idResponse.json()

      if (!idResponse.ok) {
        throw new Error(idData.message || "Failed to fetch latest recommendation ID")
      }

      const { farmId } = idData
      const selectedCrop = recommendations[selectedCropIndex].name

      // 2. Update the document with the selected crop
      const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/farmers/${farmId}/select-crop`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedCrop }),
      })

      const updateData = await updateResponse.json()

      if (!updateResponse.ok) {
        throw new Error(updateData.message || "Failed to update selected crop")
      }

      // 3. Call the onSelectCrop callback with the selected crop data
      if (onSelectCrop) {
        onSelectCrop(recommendations[selectedCropIndex])
      }

      // 4. Close the modal
      onClose()
    } catch (err) {
      console.error("Error saving crop selection:", err)
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-lime-600 rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-lime-500">
          <h2 className="text-xl font-semibold text-white">Recommended Crops</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-white">Loading recommendations...</div>
            </div>
          ) : error ? (
            <div className="text-red-100 p-4 bg-red-500/30 rounded-lg">Error: {error}</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <p className="text-white mb-4">Select the crop you would like to grow:</p>
              {recommendations.map((crop, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectCrop(index)}
                  className={`bg-white rounded-lg p-4 shadow-md cursor-pointer transition-all ${
                    selectedCropIndex === index ? "ring-4 ring-green-400 transform scale-105" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                    {selectedCropIndex === index && <FaCheckCircle className="text-green-500 text-xl" />}
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-medium">₹{crop.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Yield:</span>
                      <span className="font-medium">{crop.estimatedYield.toLocaleString()} kg</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <p className="text-gray-700">{crop.additionalInfo}</p>
                    </div>
                  </div>
                </div>
              ))}

              {submitError && (
                <div className="text-red-100 p-4 bg-red-500/30 rounded-lg mt-4">
                  Error saving selection: {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-4 bg-lime-700 flex justify-center rounded-b-lg">
          <button
            type="button"
            onClick={handleConfirmSelection}
            className={`py-3 px-6 rounded-3xl text-white bg-neutral-950 hover:bg-neutral-800 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={selectedCropIndex === null || loading || submitting}
          >
            {submitting ? "Saving..." : "Confirm Selection"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CropRecommendationModal

