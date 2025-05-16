import React from "react";
import { Link } from "react-router-dom";
import withAuth from "../utils/withAuth";
import LogoutBtn from "../ui/LogOutBtn";
import HistoryIcon from "@mui/icons-material/History";
function Home() {
  return (
    <div className="homeComp flex flex-col min-h-screen">
      <div className="navBar cursor-pointer text-amber-100 p-2 flex justify-between items-center">
        <div className="name pl-14 text-4xl font-bold">Linkify</div>
        <div className="navLink pr-14 flex justify-evenly gap-9 items-center">
          <Link>
            <HistoryIcon /> History
          </Link>
          <Link>Contact</Link>
          <LogoutBtn />
        </div>
      </div>

      <div className="contentContainer p-5 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold text-[#AB1B9E]">The Best Video <br /> Confrencing Tool</h1>
        </div>
        <div>
          <img
            src="/media/images/homeImg.png"
            alt=""
            className="w-[600px] h-[600px] "
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
