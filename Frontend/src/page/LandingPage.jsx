import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Card from "./Card.jsx";
function LandingPage() {
  return (
    <div className="landingPageContainer ">
      <nav className="grid grid-cols-12">
        <div className="navHeader col-span-12 md:col-span-4 text-center md:text-left">
          <h2>Linkify</h2>
        </div>
        <div className="md:col-span-4 col-span-12 "></div>
        <div className="navlist md:col-span-4  col-span-12 flex justify-center items-center md:justify-end">
          <p>Join as guest</p>
          <p>Register</p>
          <button className="login-btn">
            <div class="text">Login</div>
          </button>
        </div>
      </nav>

      <div className="landingMainContainer flex-col-reverse md:flex-row  flex items-center justify-between md:px-16 px-8 ">
        <div className="text-center md:text-left grid ">
          <h1 className="text-3xl md:text-6xl font-bold mb-1 col-span-12">
            <span style={{ color: "#ff9839" }}>Connect</span> with your loved
            ones
          </h1>

          <p className="text-3xl col-span-12">Cover a distace by Linkify</p>

          <div className="col-span-12 flex justify-center md:justify-start">
            <div role="button" className="rounded-xl mt-3 p-2 ">
              <Link to="/auth" className="text-3xl ">
                Get started
              </Link>
            </div>
          </div>
        </div>
        <div>
          <img src="media/images/mobile.png" alt="" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex justify-center md:mt-0 mt-2">
        <a href="#" class="btn-shine">
          Feature we provide
        </a>
      </div>

      <div className="feature-card md:mt-44 mt-12 grid space-y-1 grid-cols-1 md:grid-cols-3 place-items-center gap-6 ">
        <Card
          className=""
          titile={"Screen peak"}
          body={"Share your screen with just one touch"}
        />

        <Card titile={"real time chat"} body={"Messaging"} />

        <Card titile={"Join as guest"} body={"Hop In as a Guest!"} />

        <Card
          titile={"Video Conferencing"}
          body={"Video calls, safe and easy."}
        />
        <Card
          titile={"protected presentation"}
          body={"Share the Moment-Privately"}
        />
        <Card titile={"Secure Your Meeting"} body={"Privacy"} />
      </div>
    </div>
  );
}

export default LandingPage;
