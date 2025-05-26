import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import "../App.css";
import HeroSection from "../Sections/HeroSection";
import FeatureSection from "../Sections/FeatureSection";
import Testimony from "../Sections/Testimonial";
import { AuthContext } from "../context/AuthContext";
import PriceSection from "../Sections/PriceSection";
import FAQ from "../Sections/FAQ";
import { HoverButton } from "../ui/LogInBtn";
import RevealOnScroll from "../ui/RevealOnScroll";
import BeamsBackground from "../ui/BackgroundBeams";
import Button from "@mui/material/Button";
function LandingPage() {
  const router = useNavigate();
  const [guest, setGuest] = useState(false);
  const [meetingCode, setMeetingcode] = useState("")
  const { isLoggedIn, userData, setUserData } = useContext(AuthContext);
  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("token from landing page:", token);
    isLoggedIn();
  }, []);

  function joinGuest(){
    setGuest(!guest)
  }
  function handleJoinCall(){
    router(`/guest/${meetingCode}`)
  }
  
  return (
    <div className=" min-h-screen ">
      <div className="fixed inset-0 -z-10">
        <BeamsBackground />
      </div>
      <div className="landingPageContainer relative z-10 ">
        <div className="navbar pt-3 p-2 flex items-center justify-between text-amber-50">
          <div className="div text-4xl cursor-pointer pl-14 font-bold">
            Linkify
          </div>
          <div className="navLink cursor-pointer font-semibold text-xl flex items-center gap-11 justify-between">
            <Link onClick={joinGuest} className=" hover:text-[#AB1B9E]">Join as guest</Link>
            <Link to="FeatureSection"  className=" hover:text-[#AB1B9E]" smooth={true} duration={500}>
              Features
            </Link>
            <Link to="FAQ" className=" hover:text-[#AB1B9E]" smooth={true} duration={700}>
              FAQ
            </Link>
            <Link to="Footer" className=" hover:text-[#AB1B9E]" smooth={true} duration={800}>
              Contact
            </Link>
          </div>
          <div className="login font-semibold text-xl pr-14">
            {userData ? (
              <HoverButton
                onClick={() => {
                  localStorage.removeItem("token");
                  setUserData(null)
                  
                }}
              >
                Logout
              </HoverButton>
            ) : (
              <RouterLink to="/auth">
                <HoverButton>Login</HoverButton>
              </RouterLink>
            )}
          </div>
        </div>
        {
          guest ? <div className="enterCode rounded-2xl w-1/4 left-[410px]  h-fit p-1.5 absolute bg-[rgba(200,162,200,0.5)]">
            <form onSubmit={(e)=>{
              e.preventDefault();
              handleJoinCall()
            }} className="flex flex-col justify-center items-center">
              <label htmlFor="code">Enter meeting code</label>
                <input id="code" className="border-2 mb-2 rounded-2xl p-2.5 border-[#000]" type="text" value={meetingCode} onChange={(e)=>{
              setMeetingcode(e.target.value)
            }} />
            <Button role="submit"  className="w-1/5 !bg-[#AB1B9E] relative left-1" variant="contained" >
              join
            </Button>
            </form>
            
          </div> : <></>
        }
        <RevealOnScroll>
          <HeroSection />
        </RevealOnScroll>
        <RevealOnScroll>
          <FeatureSection />
        </RevealOnScroll>
        <RevealOnScroll>
          <Testimony />
        </RevealOnScroll>
        <RevealOnScroll>
          <PriceSection />
        </RevealOnScroll>
        <RevealOnScroll>
          <FAQ />
        </RevealOnScroll>
      </div>
    </div>
  );
}

export default LandingPage;
