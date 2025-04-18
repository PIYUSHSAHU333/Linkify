import React from "react";
import UserBtn from "./UserBtn";
import JoinCall from "./JoinCall";
function Hero() {
  return (
    <>
      <div className="hero  flex flex-col h-[700px] ">
        <div className="w-full flex justify-between items-center">
          <img src="media/images/logo2.png" alt="#" style={{ width: "20%" }} />

          <div className="UserBtn w-full flex justify-end p-2 gap-x-3 ">
            <button className="Guest-btn">
              <span>GUEST</span>
            </button>

            <UserBtn />
            <UserBtn />
          </div>
        </div>

        <div className="main-content flex-1 items-center flex justify-evenly w-full ">
          <div class="notification">
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">Welcome To VibeCall</div>
            <div class="notibody">please sign up or login if already a user</div>
          </div>

          <div className="joincall ml-48">
            <JoinCall />
          </div>
          <div className="image mr-56">
            <img src="media/images/joincall.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
