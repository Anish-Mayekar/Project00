import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./Components/Homepage";
import FarmHomepage from "./Components/PreliminaryPhase/PreliminaryHomePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />


                <Route path="/farm-homepage" element={<FarmHomepage />} />
            </Routes>
        </Router>
    );
}

export default App;
