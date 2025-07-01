import React, { useState } from "react";
import Navbar from "./PreliminaryPhase/Navbar";

const onlineNews = [
    {
        "crop": "Maize",
        "min_price_per_kg": 0.2,
        "max_price_per_kg": 190.0,
        "mode_price_per_kg": 25.0
    }
];

const offlineNews = [
    {
        "Achalpur": {
            "average_min_price": 20.0,
            "average_max_price": 21.5,
            "average_modal_price": 20.75
        },
        "Ahmednagar": {
            "average_min_price": 21.0,
            "average_max_price": 21.5,
            "average_modal_price": 21.25
        },
        "Akluj": {
            "average_min_price": 22.5,
            "average_max_price": 22.5,
            "average_modal_price": 22.5
        },
        "Chandvad": {
            "average_min_price": 23.0,
            "average_max_price": 24.0,
            "average_modal_price": 23.5
        },
        "Chattrapati Sambhajinagar": {
            "average_min_price": 18.9,
            "average_max_price": 21.0,
            "average_modal_price": 19.95
        },
        "Chopada": {
            "average_min_price": 18.0,
            "average_max_price": 21.0,
            "average_modal_price": 19.0
        },
        "Deoulgaon Raja": {
            "average_min_price": 17.0,
            "average_max_price": 17.0,
            "average_modal_price": 17.0
        },
        "Devala": {
            "average_min_price": 22.3,
            "average_max_price": 22.45,
            "average_modal_price": 22.4
        },
        "Dharangaon": {
            "average_min_price": 18.5,
            "average_max_price": 21.76,
            "average_modal_price": 20.75
        },
        "Dharni": {
            "average_min_price": 20.0,
            "average_max_price": 21.0,
            "average_modal_price": 20.5
        },
        "Dhule": {
            "average_min_price": 17.05,
            "average_max_price": 18.87,
            "average_modal_price": 17.85
        },
        "Dondaicha": {
            "average_min_price": 17.95,
            "average_max_price": 21.75,
            "average_modal_price": 20.0
        },
        "Dound": {
            "average_min_price": 21.0,
            "average_max_price": 21.0,
            "average_modal_price": 21.0
        },
        "Dudhani": {
            "average_min_price": 23.2,
            "average_max_price": 23.2,
            "average_modal_price": 23.2
        },
        "Fulmbri": {
            "average_min_price": 22.5,
            "average_max_price": 23.25,
            "average_modal_price": 22.75
        },
        "Gevrai": {
            "average_min_price": 18.0,
            "average_max_price": 18.0,
            "average_modal_price": 18.0
        },
        "Indapur": {
            "average_min_price": 21.0,
            "average_max_price": 22.0,
            "average_modal_price": 22.0
        },
        "Jalana": {
            "average_min_price": 14.75,
            "average_max_price": 22.04,
            "average_modal_price": 18.5
        },
        "Jalgaon": {
            "average_min_price": 17.11,
            "average_max_price": 17.11,
            "average_modal_price": 17.11
        },
        "Jalgaon Jamod(Aasalgaon)": {
            "average_min_price": 18.0,
            "average_max_price": 20.0,
            "average_modal_price": 19.0
        },
        "Jalgaon(Masawat)": {
            "average_min_price": 18.5,
            "average_max_price": 19.0,
            "average_modal_price": 18.75
        },
        "Jamkhed": {
            "average_min_price": 20.0,
            "average_max_price": 21.0,
            "average_modal_price": 20.5
        },
        "Jaykissan Krushi Uttpan Khajgi Bazar": {
            "average_min_price": 17.85,
            "average_max_price": 17.85,
            "average_modal_price": 17.85
        },
        "Kada": {
            "average_min_price": 22.3,
            "average_max_price": 23.0,
            "average_modal_price": 22.5
        },
        "Kalamb (Dharashiv)": {
            "average_min_price": 22.51,
            "average_max_price": 22.51,
            "average_modal_price": 22.51
        },
        "Kalvan": {
            "average_min_price": 22.51,
            "average_max_price": 23.21,
            "average_modal_price": 22.71
        },
        "Karjat": {
            "average_min_price": 23.0,
            "average_max_price": 23.0,
            "average_modal_price": 23.0
        },
        "Karmala": {
            "average_min_price": 22.25,
            "average_max_price": 22.51,
            "average_modal_price": 22.25
        },
        "Katol": {
            "average_min_price": 23.41,
            "average_max_price": 23.41,
            "average_modal_price": 23.41
        },
        "Khamgaon": {
            "average_min_price": 17.6,
            "average_max_price": 18.11,
            "average_modal_price": 17.86
        },
        "Kopargaon": {
            "average_min_price": 20.01,
            "average_max_price": 22.0,
            "average_modal_price": 20.8
        },
    }
];

// Component to display a news card for both online and offline news
const NewsCard = ({ data, isOnline }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
            {isOnline ? (
                <>
                    <h2 className="text-lg font-semibold text-gray-800">{data.crop}</h2>
                    <p className="text-sm text-gray-500">Min Price: ₹{data.min_price_per_kg} per kg</p>
                    <p className="text-sm text-gray-500">Max Price: ₹{data.max_price_per_kg} per kg</p>
                    <p className="text-sm text-gray-500">Mode Price: ₹{data.mode_price_per_kg} per kg</p>
                </>
            ) : (
                <>
                    <h2 className="text-lg font-semibold text-gray-800">{data.city}</h2>
                    <p className="text-sm text-gray-500">Min Price: ₹{data.average_min_price} per kg</p>
                    <p className="text-sm text-gray-500">Max Price: ₹{data.average_max_price} per kg</p>
                    <p className="text-sm text-gray-500">Modal Price: ₹{data.average_modal_price} per kg</p>
                </>
            )}
        </div>
    );
};

// News container to display online or offline news
const NewsContainer = ({ isOnline }) => {
    const offlineNewsArray = Object.entries(offlineNews[0]).map(([city, prices]) => ({
        city,
        ...prices
    }));

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold text-center mb-4">
                {isOnline ? "Online Market News" : "Offline Market News"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {(isOnline ? onlineNews : offlineNewsArray).map((data, index) => (
                    <NewsCard key={index} data={data} isOnline={isOnline} />
                ))}
            </div>
        </div>
    );
};

// Main market component with toggle
const Market = () => {
    const [isOnline, setIsOnline] = useState(true);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center my-4">
                <button
                    className={`px-4 py-2 mx-2 rounded ${isOnline ? "bg-lime-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setIsOnline(true)}
                >
                    Online Market
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded ${!isOnline ? "bg-lime-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setIsOnline(false)}
                >
                    Offline Market
                </button>
            </div>
            <NewsContainer isOnline={isOnline} />
        </div>
    );
};

export default Market;
