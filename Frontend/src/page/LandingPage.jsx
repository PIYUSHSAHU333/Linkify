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
import Hamburger from "../ui/Hamburger";

function LandingPage() {
  const router = useNavigate();
  const [guest, setGuest] = useState(false);
  const [meetingCode, setMeetingcode] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, userData, setUserData } = useContext(AuthContext);

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("token from landing page:", token);
    isLoggedIn();
  }, []);

  function joinGuest() {
    setGuest(!guest);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }

  function handleJoinCall() {
    console.log("meetingCode", meetingCode);
    router(`/guest/${meetingCode}`);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 w-full h-full -z-10">
        <BeamsBackground />
      </div>
      <div className="landingPageContainer relative z-10">
        <div className="navbar pt-3 p-2 flex items-center justify-between text-amber-50">
          <div className="div text-2xl md:text-4xl cursor-pointer pl-4 md:pl-14 font-bold">
            Linkify
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="navLink cursor-pointer font-semibold text-xl flex items-center gap-11">
              <button
                onClick={joinGuest}
                className="hover:text-[#AB1B9E] cursor-pointer"
              >
                Join as guest
              </button>
              <Link
                
                to="FeatureSection"
                className="hover:text-[#AB1B9E]"
                smooth={true}
                duration={500}
              >
                Features
              </Link>
              <Link
                to="FAQ"
                className="hover:text-[#AB1B9E]"
                smooth={true}
                duration={700}
              >
                FAQ
              </Link>
              <Link
                to="Footer"
                className="hover:text-[#AB1B9E]"
                smooth={true}
                duration={800}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Login/Logout */}
          <div className="hidden md:block font-semibold text-xl pr-4 md:pr-14">
            {userData ? (
              <HoverButton
                onClick={() => {
                  localStorage.removeItem("token");
                  setUserData(null);
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

          
          <div
            className={`${
              mobileMenuOpen ? "fixed right-6 top-6 z-[60]" : "md:hidden pr-4"
            }`}
          >
            <Hamburger isOpen={mobileMenuOpen} onToggle={toggleMobileMenu} />
          </div>

          {/* Mobile Navigation */}
          <div
            className={`fixed inset-y-0 right-0 w-64 mobile-sidebar transition-transform duration-300 ease-in-out z-50 md:hidden ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col gap-8 pt-24 px-6">
              <button
                onClick={joinGuest}
                className="mobile-sidebar-link text-amber-50 hover:text-[#AB1B9E] text-lg p-2 rounded-lg"
              >
                Join as guest
              </button>
              <Link
                to="FeatureSection"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-sidebar-link text-amber-50 hover:text-[#AB1B9E] text-lg p-2 rounded-lg"
                smooth={true}
                duration={500}
              >
                Features
              </Link>
              <Link
                to="FAQ"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-sidebar-link text-amber-50 hover:text-[#AB1B9E] text-lg p-2 rounded-lg"
                smooth={true}
                duration={700}
              >
                FAQ
              </Link>
              <Link
                to="Footer"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-sidebar-link text-amber-50 hover:text-[#AB1B9E] text-lg p-2 rounded-lg"
                smooth={true}
                duration={800}
              >
                Contact
              </Link>

              {/* Login/Logout in Sidebar */}
              <div className="mt-4 mobile-sidebar-link p-2 rounded-lg">
                {userData ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setUserData(null);
                      setMobileMenuOpen(false);
                    }}
                    className="text-amber-50 hover:text-[#AB1B9E] text-lg w-full text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <RouterLink
                    to="/auth"
                    className="text-amber-50 hover:text-[#AB1B9E] text-lg block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </RouterLink>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Semi-transparent overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}

        {guest ? (
          <div className="enterCode rounded-2xl w-full md:w-1/4 mx-4 md:mx-0 md:left-[410px] h-fit p-1.5 absolute bg-[rgba(200,162,200,0.5)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("meetingCode", meetingCode);
                handleJoinCall();
              }}
              className="flex flex-col justify-center items-center"
            >
              <label htmlFor="code">Enter meeting code</label>
              <input
                id="code"
                className="border-2 mb-2 rounded-2xl p-2.5 border-[#000] w-full md:w-auto"
                type="text"
                value={meetingCode}
                onChange={(e) => {
                  setMeetingcode(e.target.value);
                }}
              />
              <Button
                role="submit"
                className="w-full md:w-1/5 !bg-[#AB1B9E] relative left-1"
                variant="contained"
                onClick={handleJoinCall}
              >
                join
              </Button>
            </form>
          </div>
        ) : null}
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
