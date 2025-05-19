import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
function FAQ() {
  return (
    <div className="min-h-screen flex-col w-8/10 mx-auto items-center justify-center flex" id="FAQ">
      <div className="grid grid-cols-2">
        <div className="flex items-center flex-col justify-center h-1/1">
        
          <h1 className="text-5xl text-amber-100 z-20 font-bold w-[650px] pl-6 text-left">FREQUENTLY ASKED QUESTIONS</h1>
          <div className="cta-glow"></div>
          <p className="text-xl w-[580px] font-medium text-left mt-8 self-start text-gray-200">Can't find the answer you're looking for? Reach out to our <span className="hover:underline hover:cursor-pointer text-[#e871de]"> customer support </span>team.</p>
        </div>
        <div className="flex faq flex-col">
            <h1 className=""> How do I join a meeting without signing up?</h1>
            <p>You can join as a guest by clicking the “Join as Guest” button — no sign-up required.</p>
            <h1>Can I share my screen with others?</h1>
            <p>Yes! Just hit the “Share Screen” button during the call to present your screen in real time.</p>
            <h1>Is my data safe during video calls?</h1>
            <p>Absolutely. All calls are end-to-end encrypted, ensuring your conversations stay private.</p>
            <h1> Can I view past meeting history?</h1>
            <p>Yes, your dashboard keeps track of all your previous meetings and call summaries.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
