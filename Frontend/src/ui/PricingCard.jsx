import React from "react";

function PricingCard({price, h1, p, l1,l3}) {
  return (
    <div class="rounded-2xl priceCards shadow-lg p-3 bg-indigo-500 text-gray-600 max-w-xs">
      <div class="relative flex flex-col items-center p-5 pt-10 bg-blue-100 rounded-xl">
        <span class="mt-[-12px] absolute top-0 right-0 flex items-center bg-indigo-500 rounded-l-full py-2 px-3 text-xl font-semibold text-amber-100">
         {price} <small class="text-xs ml-1 text-white">/ month</small>
        </span>
        <p class="text-xl font-semibold text-blue-800 bg-indigo-200 px-2 py-1 rounded-lg">
          {h1}
        </p>
        <p class="text-center mt-3">
          {p}
        </p>
        <ul class="flex flex-col space-y-3 mt-4">
          <li class="flex items-center space-x-2">
            <span class="flex items-center justify-center w-5 h-5 bg-teal-500 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <span>
              <strong class="font-semibold text-gray-800">{l1}</strong> team
              members
            </span>
          </li>
          <li class="flex items-center space-x-2">
            <span class="flex items-center justify-center w-5 h-5 bg-teal-500 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <span>
              Plan
              <strong class="font-semibold text-gray-800">Team meetings</strong>
            </span>
          </li>
          <li class="flex items-center space-x-2">
            <span class="flex items-center justify-center w-5 h-5 bg-teal-500 text-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <span>{l3}</span>
          </li>
        </ul>
        <div class="w-full flex justify-end mt-6">
          <a
            class="w-full py-3 text-center text-white bg-indigo-600 rounded-lg font-medium text-lg hover:bg-indigo-700 focus:outline-none"
            href="#"
          >
            Choose plan
          </a>
        </div>
      </div>
    </div>
  );
}

export default PricingCard;
