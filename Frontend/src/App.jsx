import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VideoMeetingComponent from "./page/VideoComponent";
import Home from "./page/Home";
import FooterDemo from "./ui/Footer";
import PrivateRoute from "./utils/PrivateRoute";
import NotFound from "./page/NotFound";
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/guest/:url" element={<VideoMeetingComponent />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/:url"
              element={
                <PrivateRoute>
                  <VideoMeetingComponent />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FooterDemo />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
