import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetingComponent from "./page/VideoComponent";
function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/:url" element={<VideoMeetingComponent/>} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
