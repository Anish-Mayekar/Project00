import React from "react";
import { FaTimes, FaArrowUp } from "react-icons/fa";

const Chatbot = ({ onClose }) => {
  const renderMobileView = () => (
    <div className="fixed inset-0 bg-white shadow-lg border border-gray-300 p-4 flex flex-col rounded-lg">
      {/* Header Container */}
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Chatbot</h2>
        <button className="text-2xl text-gray-600" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center text-gray-700 text-lg">
        Chatbot Interface (Mobile View)
      </div>
      {/* Input Box for Mobile */}
      <div className="p-2 flex items-center border border-gray-300 rounded-full overflow-hidden">
        <input 
          type="text" 
          placeholder="Ask your query" 
          className="w-full p-2 focus:outline-none"
        />
        <button className="p-3 text-lime-600 hover:text-lime-800">
          <FaArrowUp />
        </button>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="fixed bottom-20 right-6 md:right-8 md:top-3 md:w-110 md:h-140 bg-white shadow-lg border border-gray-300 p-4 flex flex-col rounded-3xl">
      {/* Header Container */}
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Chatbot</h2>
        <button className="text-2xl text-gray-600" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center text-gray-700 text-lg">
        Chatbot Interface (Desktop View)
      </div>
      {/* Input Box for Desktop */}
      <div className="p-2 flex items-center border border-gray-300 rounded-full overflow-hidden">
        <input 
          type="text" 
          placeholder="Ask your query" 
          className="w-full p-2 focus:outline-none"
        />
        <button className="p-3 text-lime-600 hover:text-lime-800">
          <FaArrowUp />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">{renderMobileView()}</div>
      <div className="hidden md:block">{renderDesktopView()}</div>
    </>
  );
};

export default Chatbot;
