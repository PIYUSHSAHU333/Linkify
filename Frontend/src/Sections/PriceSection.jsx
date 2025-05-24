import React from "react";
import PricingCard from "../ui/PricingCard";
function PriceSection() {
  return (
    <div className="priceSection flex-col w-8/10 mx-auto items-center justify-center flex min-h-screen">
      <div className="flex flex-col items-center">
        <div className="feature-glow"></div>
        <p className="text-[#F083E7] text-2xl font-bold z-20">Pricing</p>
        <h1 className="text-6xl text-amber-100 z-20 font-bold w-[650px] text-center">
          Pricing that grows with you
        </h1>
        <p className="text-2xl w-[670px] font-medium text-center mt-8 text-gray-200">
          Transparent, flexible pricing built to scale with your needs — no
          hidden fees, no surprises, just value.
        </p>
      </div>
      <div className="pricingCards grid grid-cols-3 gap-x-7 mt-15">
        <PricingCard
          h1={"Buisness Plan"}
          price={"20$"}
          p={"Powerful tools and priority support for fast-growing teams."}
          l1={100}
          l3={"Dedicated account manager"}
        />
        <PricingCard
          className="transform scale-108"
          h1={"Startup Plan"}
          price={"12$"}
          p={
            "Scalable features to help your startup move fast and stay focused."
          }
          l1={50}
          l3={"File Sharing"}
        />
        <PricingCard
          h1={"Freelance Plan"}
          price={"4$"}
          p={"Essential features built for solo creators and consultants."}
          l1={5}
          l3={"File Sharing"}
        />
      </div>
    </div>
  );
}

export default PriceSection;
