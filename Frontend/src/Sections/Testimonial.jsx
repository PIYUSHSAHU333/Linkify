import React from "react";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
function Testimony() {
  return (
    <div className="Testimony w-8/10 mx-auto flex items-center  min-h-screen">
      <div className="h-[400px] group relative ceoImg ceo w-7/10 mx-auto border-4 border-[#cb4ac0] z-10 rounded-2xl">
      <div className="img-glow"></div>
        <img
          src="/media/images/Ceo.jpg"
          className="h-[400px] brightness-50 blur-[3px] rounded-2xl w-1/1"
          alt=""
        />
        <FormatQuoteIcon className="z-20 absolute left-16 top-16 text-[#d97500]"/>
        <p className=" text-amber-100 text-xl w-7/10 font-bold absolute  left-16 top-24 z-[20]">
          At Linkify, our mission is simple — to make connecting and
          collaborating effortless. We’ve built a platform that brings people
          together through seamless video calls, smart messaging, and powerful
          screen sharing — all while keeping privacy at the core.
        </p>
        <p className="opacity-0 text-amber-100 ceo font-semibold group-hover:opacity-100 hover:opacity-4 absolute left-5 bottom-2 z-[20]">
          Piyush sahu | CEO, Linkify
        </p>
      </div>
    </div>
  );
}

export default Testimony;
