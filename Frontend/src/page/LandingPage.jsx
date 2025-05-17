import React from "react";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "../App.css";
import HeroSection from "../Sections/HeroSection";
import FeatureSection from "../Sections/FeatureSection";
function LandingPage() {
  return <div className="landingPageContainer ">
    <div className="navbar pt-3 p-2 flex items-center justify-between text-amber-50">
      <div className="div text-4xl cursor-pointer pl-14 font-bold">Linkify</div>
      <div className="navLink font-semibold text-xl flex items-center gap-11 justify-between">
          <Link>Join as guest</Link>
          <Link>Features</Link>
          <Link>Contact</Link>
          <Link>About</Link>
      </div>
      <div className="login font-semibold text-xl pr-14">
          <Link>Log in <ArrowRightAltIcon/></Link>
      </div>
    </div>
    <HeroSection/>
   <FeatureSection/>
  </div>;
}

export default LandingPage;
