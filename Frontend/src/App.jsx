import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetingComponent from "./page/VideoComponent";
import Home from "./page/Home";
import FooterDemo from "./ui/Footer";
import PrivateRoute from "./utils/PrivateRoute";
function App() {
  return (
    <>
    
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/:url" element={<PrivateRoute><VideoMeetingComponent/></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>}/>
         </Routes>
          <FooterDemo/>
        </AuthProvider>
      </BrowserRouter>
      
    </>
  );
}

export default App;
