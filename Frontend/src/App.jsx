import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetingComponent from "./page/VideoComponent";
import Home from "./page/Home";
import FooterDemo from "./ui/Footer";
function App() {
  return (
    <>
    
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/:url" element={<VideoMeetingComponent/>} />
          <Route path="/home" element={<Home/>}/>
         </Routes>
          <FooterDemo/>
        </AuthProvider>
      </BrowserRouter>
      
    </>
  );
}

export default App;
