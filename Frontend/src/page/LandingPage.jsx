import React from "react";
// import { Link } from "react-router-dom";
import { Link } from 'react-scroll';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "../App.css";
import HeroSection from "../Sections/HeroSection";
import FeatureSection from "../Sections/FeatureSection";
import Testimony from "../Sections/Testimonial";
import PriceSection from "../Sections/PriceSection";
import FAQ from "../Sections/FAQ";
import {HoverButton} from "../ui/LogOutBtn";

// import { Footer } from "../ui/Footer";
// import { Fab } from "@mui/material";
import BeamsBackground from "../ui/BackgroundBeams";
function LandingPage() {
  return (
    <div className=" min-h-screen ">
  <div className="fixed inset-0 -z-10">
        <BeamsBackground />
      </div>
  <div className="landingPageContainer relative z-10 ">
    <div className="navbar pt-3 p-2 flex items-center justify-between text-amber-50">
      <div className="div text-4xl cursor-pointer pl-14 font-bold">Linkify</div>
      <div className="navLink cursor-pointer font-semibold text-xl flex items-center gap-11 justify-between">
          <Link>Join as guest</Link>
          <Link to="FeatureSection" smooth={true} duration={500}>Features</Link>
          <Link to="FAQ" smooth={true} duration={500} >FAQ</Link>
          <Link to="Footer" smooth={true} duration={500}>Contact</Link>
          
      </div>
      <div className="login font-semibold text-xl pr-14">
          <Link><HoverButton>Login</HoverButton></Link>
      </div>
    </div>
    <HeroSection/>
   <FeatureSection/>
   <Testimony/>
   <PriceSection/>
   <FAQ/>
   
  </div>

  </div>);
}

export default LandingPage;
