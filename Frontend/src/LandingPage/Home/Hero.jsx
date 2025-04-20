import React from "react";
import UserBtn from "./UserBtn";
import JoinCall from "./JoinCall";
function Hero() {
  return (
    <>
      <div className="hero  flex flex-col h-[700px] mb-20 ">
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

        <div className="main-content flex-col gap-4 flex-1 items-center flex w-full ">

          <div className="div mb-16 flex justify-center items-center">
          <div class="notification">
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">Welcome To VibeCall</div>
            <div class="notibody">please sign up or login if already a user</div>
          </div>
          </div>
          
          

         
          <div className="div2 flex justify-evenly gap-2 w-full mt-8">
          <div className="joincall self-center ml-48 ">
            <JoinCall />
          </div>
          <div className="image mr-56">
            <img src="media/images/joincall.png" alt="" />
          </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Hero;
