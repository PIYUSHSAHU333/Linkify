import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";
import LogoutBtn from "../ui/LogOutBtn";
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [meetingHistory, setMeetingHistory] = useState([]);
  const { getUserHistory, addToHistory } = useContext(AuthContext);
  const handleJoinCall = async() => {
    await addToHistory(meetingCode)
    let history = await getUserHistory();
    console.log("history from join btn:",history);
    navigate(`/${meetingCode}`);
  };

  useEffect(() => {
    try {
      const fetchHistory = async () => {
        let history = await getUserHistory();
        console.log("history: ", history)
        setMeetingHistory(history);
      };
      fetchHistory()
    } catch (e) {
      console.log("history not found:",e);
    }
  
  }, []);
  return (
    <div className="homeComp flex flex-col min-h-screen">
      <div className="navBar cursor-pointer text-amber-100 p-2 flex justify-between items-center">
        <div className="name pl-14 text-4xl font-bold">Linkify</div>
        <div className="navLink pr-14 flex justify-evenly gap-9 items-center">
          <Link onClick={()=>{setHistoryOpen(!historyOpen)}}>
            <HistoryIcon /> History
          </Link>
          <Link>Contact</Link>
          <LogoutBtn />
        </div>
      </div>

      {historyOpen ? (
        <div className="cards">
          {meetingHistory.map((e, i) => {
            return (
              <>
                  <div key={i} class="card blue">
                    <p class="tip">Code: {e.meetingCode}</p>
                    <p class="second-text ">Date: {e.date}</p>
                  </div>
               
              </>
            );
          })}
        </div>
      ) : (
       <></>
      )}

      <div className="contentContainer p-5 flex justify-between items-center">
        <div className="p-8">
          <h1 className="text-6xl font-bold text-[#AB1B9E]">
            The Best Video <br /> Confrencing Tool
          </h1>
          <p className="text-amber-100 mt-3 font-semibold text-2xl">
            Connect face-to-face instantly with our seamless <br /> video
            calling app — crystal-clear quality, <br />
            real-time chat, and easy one-click join, anytime, anywhere.
          </p>
          <div className=" mt-5 ">
            <form onSubmit={handleJoinCall} className="flex flex-col gap-2">
              <label htmlFor="meetingCode" className="text-amber-50">
                Enter Meeting code
              </label>
              <input
                id="meetingCode"
                type="text"
                value={meetingCode}
                onChange={(e) => {
                  setMeetingCode(e.target.value);
                }}
                className=" w-[330px] p-2.5 text-amber-50 rounded-xl border-[3px] border-[#f472b6]"
              />
              <Button
                className="w-1/5 !bg-[#AB1B9E] relative left-1"
                onClick={handleJoinCall}
                role="submit"
                variant="contained"
              >
                Join
              </Button>
            </form>
          </div>
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
