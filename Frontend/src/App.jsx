import React from "react";
import LandingPage from "./page/LandingPage";
import Authentication from "./page/Authentication";
import { Route, BrowserRouter, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
