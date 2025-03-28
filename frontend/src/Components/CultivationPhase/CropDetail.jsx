import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaLock, FaCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

function CropDetails() {
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const { cropid } = useParams(); // Extract cropid from URL params

  // Example state for unlocked levels
  const [unlockedLevels, setUnlockedLevels] = useState({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/farmers/crop/${cropid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch crop details");
        }
        return response.json();
      })
      .then((data) => {
        setCropData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching crop details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [cropid]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Level information
  const levels = [
    { number: 1, title: "Begin your Journey", position: "right" },
    { number: 2, title: "Sowing Stage", position: "left" },
    { number: 3, title: "Germination Stage", position: "right" },
    { number: 4, title: "Vegetative Growth Stage", position: "left" },
    { number: 5, title: "Flowering Stage", position: "right" },
    { number: 6, title: "Maturation Stage", position: "left" },
    { number: 7, title: "Harvesting Stage", position: "right" },
  ];

  // Handle level click
  const handleLevelClick = (levelNumber) => {
    if (unlockedLevels[levelNumber]) {
      // Navigate to the level component with cropid as a URL param
      // navigate(`/stage-${levelNumber}/${cropid}`);
      navigate(`/stage-${levelNumber}`, { state: { cropid } });
    } else {
      console.log(`Level ${levelNumber} is locked`);
    }
  };
  

  // Handle going back to farm homepage
  const handleGoBack = (cropid) => {
    navigate(`/farm-homepage/${cropid}`);
    // navigate(`/farm-homepage`);

  };

  // Render mobile view with zigzag pattern and alternating text positions
  const renderMobileView = () => (
    <div className="max-w-md mx-auto mt-4 relative px-4">
      {/* Central line connecting all circles */}
      <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-lime-200 -translate-x-1/2 z-0"></div>

      {levels.map((level) => (
        <div key={level.number} className="relative mb-16 z-10">
          {/* Center circle container */}
          <div className="flex justify-center">
            <div
              className={`
                w-14 h-14 rounded-full flex items-center justify-center relative border-4 border-white shadow-lg
                ${
                  unlockedLevels[level.number]
                    ? "bg-lime-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500"
                }
              `}
              onClick={() => handleLevelClick(level.number)}
              role={unlockedLevels[level.number] ? "button" : "presentation"}
              aria-disabled={!unlockedLevels[level.number]}
            >
              <span className="text-lg font-bold">{level.number}</span>
              {!unlockedLevels[level.number] && (
                <div className="absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-1">
                  <FaLock size={12} />
                </div>
              )}
              {unlockedLevels[level.number] && level.number !== 1 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <FaCheck size={12} />
                </div>
              )}
            </div>
          </div>

          {/* Level Title - Positioned to left or right */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 max-w-[40%]
              ${
                level.position === "left"
                  ? "left-0 text-right pr-4"
                  : "right-0 text-left pl-4"
              }
              ${unlockedLevels[level.number] ? "text-black" : "text-gray-500"}
            `}
          >
            <h3 className="font-medium text-sm">{level.title}</h3>
            <p className="text-xs">
              {unlockedLevels[level.number]
                ? level.number === 1
                  ? "Current level"
                  : "Completed"
                : "Locked"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Render desktop view
  const renderDesktopView = () => (
    <div className="relative flex w-full pt-8">
      <div className="w-3/4 max-w-4xl mx-auto mt-8 relative px-8">
        <div className="relative grid grid-cols-2 gap-x-50 gap-y-22">
          {levels.map((level, index) => (
            <div
              key={level.number}
              className={`flex ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              } items-center relative z-10`}
            >
              {/* Text for even levels (left side) */}
              {index % 2 === 0 && (
                <div
                  className={`text-right pr-6 max-w-sm ${
                    unlockedLevels[level.number]
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{level.title}</h3>
                  <p className="text-md">
                    {unlockedLevels[level.number]
                      ? level.number === 1
                        ? "Current Level"
                        : "Completed"
                      : "Locked"}
                  </p>
                </div>
              )}

              {/* Circle & Connector */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl text-xl font-bold
                    ${
                      unlockedLevels[level.number]
                        ? "bg-lime-600 text-white cursor-pointer hover:bg-lime-700 transition-colors"
                        : "bg-gray-300 text-gray-500"
                    }
                  `}
                  onClick={() => handleLevelClick(level.number)}
                  role={
                    unlockedLevels[level.number] ? "button" : "presentation"
                  }
                  aria-disabled={!unlockedLevels[level.number]}
                >
                  {level.number}
                  {!unlockedLevels[level.number] && (
                    <div className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-2 shadow-md">
                      <FaLock size={16} />
                    </div>
                  )}
                  {unlockedLevels[level.number] && level.number !== 1 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-md">
                      <FaCheck size={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Text for odd levels (right side) */}
              {index % 2 === 1 && (
                <div
                  className={`text-left pl-6 max-w-sm ${
                    unlockedLevels[level.number]
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  <h3 className="font-semibold text-lg">{level.title}</h3>
                  <p className="text-md">
                    {unlockedLevels[level.number]
                      ? level.number === 1
                        ? "Current Level"
                        : "Completed"
                      : "Locked"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="w-full h-full bg-white flex flex-col relative">
        {/* Menubar */}
        <div className="w-full bg-lime-600 text-white py-4 px-6 flex items-center z-50">
          <button onClick={handleGoBack} className="mr-4">
            <FaArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">
            {loading ? "Loading..." : cropData?.selectedCrop}
          </h2>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-lime-50 bg-opacity-50 z-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2365a30d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Gamified Levels Section */}
        <div className="flex-1 overflow-y-auto p-4 relative z-10">
          {error ? (
            <div className="text-red-500 text-center p-4 bg-white rounded-lg shadow-md">
              {error}
            </div>
          ) : loading ? (
            <div className="text-center p-8">
              <div className="inline-block w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading levels...</p>
            </div>
          ) : (
            <>
              {/* Conditionally render based on screen size */}
              <div className="md:hidden">{renderMobileView()}</div>
              <div className="hidden md:block">{renderDesktopView()}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropDetails;
