import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Navbar from "./PreliminaryPhase/Navbar";

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://127.0.0.1:5001/predict", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "Error processing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container">
      <div className="card">
        <h1 className="title">🌱 Crop Disease Detection</h1>
        <p className="subtitle">Upload an image of a plant leaf to detect diseases</p>
        
        {/* Upload Area */}
        <div className={`upload-area ${preview ? "has-preview" : ""}`}>
          {preview ? (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <input
                type="file"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleImageChange} // Ensure you have a handler for file selection
              />

              <button 
                className="change-image-btn"
                onClick={() => {
                  const fileInput = document.getElementById("file-input");
                  if (fileInput) {
                    fileInput.click();
                  } else {
                    console.error("File input element not found.");
                  }
                }}
              >
                Change Image
            </button>

            </div>
          ) : (
            <div className="drop-zone">
              <input 
                id="file-input"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📁</div>
                <p>Drag & drop an image here or click to browse</p>
                <p className="file-types">Supports: JPG, JPEG, PNG</p>
              </label>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleUpload} 
          disabled={loading || !image}
          className={`action-btn ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#ffffff" /> Analyzing...
            </>
          ) : (
            "Analyze Plant"
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && !error && (
          <div className="results-card">
            <h2 className="results-title">Analysis Results</h2>
            
            <div className="result-item">
              <span className="result-label">Plant Name:</span>
              <span className="result-value">{result.plant || "Unknown"}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Disease Detected:</span>
              <span className={`result-value ${result.disease === "Healthy" ? "healthy" : "disease"}`}>
                {result.disease || "Unknown"}
              </span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Cause:</span>
              <span className="result-value">{result.cause || "Unknown"}</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Treatment:</span>
              <span className="result-value">{result.treatment || "Unknown"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Add this CSS */}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          transition: all 0.3s ease;
        }
        
        .title {
          color: #2c7d3f;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }
        
        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s;
          text-align: center;
        }
        
        .upload-area.has-preview {
          border-color: #2c7d3f;
          background-color: #f8f9fa;
        }
        
        .drop-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .file-input {
          display: none;
        }
        
        .upload-label {
          cursor: pointer;
        }
        
        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #2c7d3f;
        }
        
        .file-types {
          color: #888;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .image-preview-container {
          position: relative;
          display: inline-block;
        }
        
        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .change-image-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .change-image-btn:hover {
          background: rgba(0, 0, 0, 0.9);
        }
        
        .action-btn {
          background-color: #2c7d3f;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .action-btn:hover:not(:disabled) {
          background-color: #246a34;
        }
        
        .action-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .action-btn.loading {
          background-color: #1a5c2b;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 12px;
          border-radius: 6px;
          margin-top: 1rem;
          text-align: center;
        }
        
        .results-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
          border-left: 4px solid #2c7d3f;
        }
        
        .results-title {
          color: #2c7d3f;
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .result-item {
          display: flex;
          margin-bottom: 1rem;
          align-items: flex-start;
        }
        
        .result-label {
          font-weight: 600;
          min-width: 120px;
          color: #555;
        }
        
        .result-value {
          flex: 1;
          color: #333;
        }
        
        .healthy {
          color: #2c7d3f;
          font-weight: 600;
        }
        
        .disease {
          color: #d32f2f;
          font-weight: 600;
        }
        
        @media (max-width: 600px) {
          .container {
            padding: 1rem;
          }
          
          .card {
            padding: 1.5rem;
          }
          
          .result-item {
            flex-direction: column;
          }
          
          .result-label {
            margin-bottom: 0.3rem;
          }
        }
      `}</style>
    </div>
    </>
    
  );
};

export default DiseaseDetection;