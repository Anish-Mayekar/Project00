import React from "react";
import Navbar from "./PreliminaryPhase/Navbar";

const newsData = [
    {
        "title": "Agriculture Infrastructure Fund",
        "links": ["http://agriinfra.dac.gov.in/"]
    },
    {
        "title": "PM-Kisan Samman Nidhi",
        "links": ["https://pmkisan.gov.in/"]
    },
    {
        "title": "ATMA",
        "links": ["https://extensionreforms.da.gov.in/DashBoard_Statusatma.aspx"]
    },
    {
        "title": "AGMARKNET",
        "links": ["http://agmarknet.gov.in/PriceAndArrivals/arrivals1.aspx"]
    },
    {
        "title": "Horticulture",
        "links": ["http://midh.gov.in/nhmapplication/feedback/midhKPI.aspx"]
    },
    {
        "title": "Plant Quarantine Clearance",
        "links": ["https://pqms.cgg.gov.in/pqms-angular/home"]
    },
    {
        "title": "DBT in Agriculture",
        "links": ["https://www.dbtdacfw.gov.in/"]
    },
    {
        "title": "Pradhanmantri Krishi Sinchayee Yojana",
        "links": ["https://pmksy.gov.in/mis/frmDashboard.aspx"]
    },
    {
        "title": "Kisan Call Center",
        "links": ["https://mkisan.gov.in/Home/KCCDashboard"]
    },
    {
        "title": "mKisan",
        "links": ["https://mkisan.gov.in/"]
    },
    {
        "title": "Jaivik Kheti",
        "links": ["https://pgsindia-ncof.gov.in/home.aspx"]
    },
    {
        "title": "e-Nam",
        "links": ["https://enam.gov.in/"]
    },
    {
        "title": "Soil Health Card",
        "links": ["https://soilhealth.dac.gov.in/"]
    },
    {
        "title": "Pradhan Mantri Fasal Bima Yojana",
        "links": ["https://pmfby.gov.in/ext/rpt/ssfr_17"]
    }
];

// NewsCard Component: Displays the title and clickable link
const NewsCard = ({ article }) => (
    <div
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 cursor-pointer"
        onClick={() => window.open(article.links[0], "_blank")} // Opens link in a new tab
    >
        <h2 className="text-lg font-semibold text-gray-800">{article.title}</h2>
        <a
            href={article.links[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 block"
        >
            Visit Website
        </a>
    </div>
);

// NewsContainer Component: Displays all NewsCards
const NewsContainer = () => (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsData.map((article, index) => (
                <NewsCard key={index} article={article} />
            ))}
        </div>
    </div>
);

// GovernmentWebsite Component: Wraps everything with Navbar
const GovernmentWebsite = () => (
    <div>
        <Navbar />
        <NewsContainer />
    </div>
);

export default GovernmentWebsite;
