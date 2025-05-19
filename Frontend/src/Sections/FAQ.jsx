import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
function FAQ() {
  return (
    <div className="faq min-h-screen flex-col w-8/10 mx-auto items-center justify-center flex">
      <Accordion className="gap-y-3">
         <AccordionItem key="1" className="border-b-2 p-3.5 text-2xl" aria-label="Accordion 1" title="Accordion 1">
        "Wassup"
      </AccordionItem>
    
      <AccordionItem key="1" aria-label="Accordion 1" className="border-b-2 p-3.5" title="Accordion 1">
        "Wassup"
      </AccordionItem>

      </Accordion>
    </div>
  );
}

export default FAQ;
