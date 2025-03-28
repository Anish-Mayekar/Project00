import React from "react";
import farmerImg from "../assets/happy_farmer.jpg";
import howdoesitworks from "../assets/how-does-it-works.png";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white-600 text-black p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="font-bold text-xl">AgriFarm</div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => navigate("/login")} 
                        className="px-4 py-2 font-bold rounded-3xl hover:text-lime-900 transition"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate("/signup")} 
                        className="px-4 py-2 font-bold bg-lime-100 text-lime-600 rounded-3xl hover:bg-gray-100 transition"
                    >
                        Register
                    </button>
                </div>
            </div>
        </nav>

      {/* Hero Section */}
      <section className="bg-[#e3f0cd] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                A System That Supports Farmers Throughout Their Journey
              </h1>
              <p className="text-sm md:text-lg mb-6">
                A unified digital ecosystem providing AI-driven crop
                recommendations, real-time monitoring, market insights, and a
                farmer community for sustainable agriculture.
              </p>
              <button className="px-6 py-3 bg-lime-600 text-white rounded-3xl hover:bg-lime-700 transition">
                Get Started
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={farmerImg}
                alt="Hero Image"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Does It Work
          </h2>
          <p className="text-[14px] mb-10 max-w-6xl mx-auto md:text-[18px]">
            Our AI-powered system supports farmers throughout their journey,
            from crop selection to post-harvest. It provides data-driven
            recommendations, real-time monitoring, and early disease detection.
            Post-harvest, it connects farmers to markets and financial aid while
            a community platform fosters knowledge-sharing and expert support.
          </p>

          <div className="flex justify-center">
            <img
              src={howdoesitworks}
              alt="How It Works"
              className="rounded-lg w-full max-w-4xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#e3f0cd]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 max-w-4xl mx-auto">
            We offer end-to-end support for pre-harvest, cultivation, and
            post-harvest stages.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-sky-800 p-6 rounded-4xl shadow-md">
              <h3 className="text-xl text-white font-semibold mb-4">
                Preliminary Support (Before Cultivation)
              </h3>
              <ul className="list-disc text-white pl-5 space-y-2">
                <li>Adding farmer information (location, budget)</li>
                <li>List of crop recommendations based on added information</li>
                <li>Detailed insights on selected crops</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-lime-900 p-6 rounded-4xl shadow-md">
              <h3 className="text-xl text-white font-semibold mb-4">
                Cultivation Support
              </h3>
              <ul className="list-disc text-white pl-5 space-y-2">
                <li>Gamified chatbot for guidance</li>
                <li>Crop disease detection</li>
                <li>Crop lifetime tracking</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-stone-700 p-6 rounded-4xl shadow-md">
              <h3 className="text-xl text-white font-semibold mb-4">
                Post-Harvest Support
              </h3>
              <ul className="list-disc text-white pl-5 space-y-2">
                <li>Access to government schemes</li>
                <li>Help in increasing and maximizing profit</li>
                <li>Suggest best markets to sell produce</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lime-950 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Team: </h3>
              <ul className="space-y-2">
                <li>Gaurang Mapuskar</li>
                <li>Mayuresh Pednekar</li>
                <li>Abujaid Ansari</li>
                <li>Soham Phalke</li>
                <li>Anish Mayekar</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
