import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetingComponent from "./page/VideoComponent";
import Home from "./page/Home";
import {HeroUIProvider} from "@heroui/react";

function App() {
  return (
    <>
    <HeroUIProvider>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/:url" element={<VideoMeetingComponent/>} />
          <Route path="/home" element={<Home/>}/>
         </Routes>
        </AuthProvider>
      </BrowserRouter>
      </HeroUIProvider>
    </>
  );
}

export default App;
