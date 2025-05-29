import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
function FAQ() {
  return (
    <div className="min-h-screen flex-col w-full md:w-8/10 mx-auto items-center justify-center flex px-4 md:px-0 mt-20 md:mt-32 mb-24 md:mb-0" id="FAQ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex items-center flex-col justify-center h-full">
          <h1 className="text-2xl md:text-5xl text-amber-100 z-20 font-bold w-full md:w-[650px] px-4 md:pl-6 text-center md:text-left">FREQUENTLY ASKED QUESTIONS</h1>
          <div className="cta-glow"></div>
          <p className="text-sm md:text-xl w-full md:w-[580px] font-medium text-center md:text-left mt-2 md:mt-8 self-center md:self-start text-gray-200 px-4 md:px-0">Can't find the answer you're looking for? Reach out to our <span className="hover:underline hover:cursor-pointer text-[#e871de]"> customer support </span>team.</p>
        </div>
        <div className="flex faq flex-col space-y-2 md:space-y-4 mt-4 md:mt-0">
            <h1 className="text-base md:text-xl font-semibold"> How do I join a meeting without signing up?</h1>
            <p className="text-sm md:text-lg">You can join as a guest by clicking the "Join as Guest" button — no sign-up required.</p>
            <h1 className="text-base md:text-xl font-semibold">Can I share my screen with others?</h1>
            <p className="text-sm md:text-lg">Yes! Just hit the "Share Screen" button during the call to present your screen in real time.</p>
            <h1 className="text-base md:text-xl font-semibold">Is my data safe during video calls?</h1>
            <p className="text-sm md:text-lg">Absolutely. All calls are end-to-end encrypted, ensuring your conversations stay private.</p>
            <h1 className="text-base md:text-xl font-semibold"> Can I view past meeting history?</h1>
            <p className="text-sm md:text-lg">Yes, your dashboard keeps track of all your previous meetings and call summaries.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
