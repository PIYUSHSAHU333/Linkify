import React from "react";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
function Testimony() {
  return (
    <div className="Testimony w-full md:w-8/10 mx-auto flex items-center md:min-h-screen py-12 md:py-0 px-4 md:px-0">
      <div className="h-auto md:h-[400px] group relative ceoImg ceo w-full md:w-7/10 mx-auto border-4 border-[#cb4ac0] z-10 rounded-2xl">
      <div className="img-glow"></div>
        <img
          src="/media/images/Ceo.jpg"
          className="h-[250px] md:h-[400px] brightness-50 blur-[3px] rounded-2xl w-full object-cover"
          alt=""
        />
        <FormatQuoteIcon className="z-20 absolute left-4 md:left-16 top-6 md:top-16 text-[#d97500] text-3xl md:text-5xl"/>
        <p className="text-amber-100 text-sm md:text-xl w-full md:w-7/10 font-bold absolute left-4 md:left-16 top-14 md:top-24 z-[20] px-4 md:px-0">
          At Linkify, our mission is simple — to make connecting and
          collaborating effortless. We've built a platform that brings people
          together through seamless video calls, smart messaging, and powerful
          screen sharing — all while keeping privacy at the core.
        </p>
        <p className="opacity-0 text-amber-100 ceo text-sm md:text-base font-semibold group-hover:opacity-100 hover:opacity-4 absolute left-4 md:left-5 bottom-2 z-[20]">
          Piyush sahu | CEO, Linkify
        </p>
      </div>
    </div>
  );
}

export default Testimony;
