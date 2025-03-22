import React, { useState } from "react";
import { 
  FaLeaf, 
  FaLandmark, 
  FaChartLine, 
  FaStore, 
  FaUsers, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      name: "Disease Detection",
      icon: <FaLeaf className="mr-2" />,
      link: "#disease-detection"
    },
    {
      name: "Government Schemes",
      icon: <FaLandmark className="mr-2" />,
      link: "#government-schemes"
    },
    {
      name: "Profit Maximization",
      icon: <FaChartLine className="mr-2" />,
      link: "#profit-maximization"
    },
    {
      name: "Market Places",
      icon: <FaStore className="mr-2" />,
      link: "#market-places"
    },
    {
      name: "Community",
      icon: <FaUsers className="mr-2" />,
      link: "#community"
    }
  ];

  return (
    <nav className="bg-lime-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white font-bold text-xl">AgriFarm</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="text-white hover:bg-lime-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-lime-700 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-lime-500">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="text-white hover:bg-lime-700 px-3 py-2 rounded-md text-base font-medium flex items-center"
              >
                {item.icon}
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;