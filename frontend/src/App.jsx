import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Homepage";
import FarmHomepage from "./Components/PreliminaryPhase/PreliminaryHomePage";
import StageOne from "./Components/CultivationPhase/Stage1";
import StageTwo from "./Components/CultivationPhase/Stage2";
import StageThree from "./Components/CultivationPhase/Stage3";
import StageFour from "./Components/CultivationPhase/Stage4";
import StageFive from "./Components/CultivationPhase/Stage5";
import StageSix from "./Components/CultivationPhase/Stage6";
import StageSeven from "./Components/CultivationPhase/Stage7";

import CropDetails from "./Components/CultivationPhase/CropDetail";
import { AuthProvider } from "../src/context/AuthContext";

import Login from "./Components/Login";
import Signup from "./Components/SignUp";

import Forum from "./Components/Communication/Forum";
import Group from "./Components/Communication/Group";
import GroupDetails from "./Components/Communication/GroupDetails";

import DiseaseDetection from "./Components/DiseaseDetection";

function App() {
  return (
    
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/farm-homepage/:user_id" element={<FarmHomepage />} />
          {/* <Route path="/farm-homepage" element={<FarmHomepage />} />                  */}
          <Route path="/selected-crop/:cropid" element={<CropDetails />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/group" element={<Group />} />
          <Route path="/group/:groupId" element={<GroupDetails />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />

          <Route path="/stage-1" element={<StageOne />} />
          <Route path="/stage-2" element={<StageTwo />} />
          <Route path="/stage-3" element={<StageThree />} />
          <Route path="/stage-4" element={<StageFour />} />
          <Route path="/stage-5" element={<StageFive />} />
          <Route path="/stage-6" element={<StageSix />} />
          <Route path="/stage-7" element={<StageSeven />} />
        </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
