import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouteLink } from "react-router-dom";
import withAuth from "../utils/withAuth";
import LogoutBtn from "../ui/LogOutBtn";
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-scroll";
import Hamburger from "../ui/Hamburger";
import PersonIcon from "@mui/icons-material/Person";
function Home() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [meetingHistory, setMeetingHistory] = useState([]);
  const { getUserHistory, addToHistory, userData, setUserData, logOut } =
    useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleJoinCall = async () => {
    await addToHistory(meetingCode);
    let history = await getUserHistory();
    console.log("history from join btn:", history);
    navigate(`/${meetingCode}`);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function toggleMenu() {
    console.log("toggle");
    setIsOpen((prevState) => {
      return !prevState;
    });
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        let history = await getUserHistory();
        if (history) {
          console.log("history: ", history);
          setMeetingHistory(history);
        }
      } catch (e) {
        console.log("Error from fetchHistory:", e);
      }
    };
    fetchHistory();
  }, [userData]);

  // New useEffect to close history when hamburger menu closes
  useEffect(() => {
    if (!isOpen && historyOpen) {
      setHistoryOpen(false);
    }
  }, [isOpen, historyOpen]); // Dependencies: isOpen and historyOpen

  return (
    <div className="homeComp md:overflow-y-auto  overflow-x-hidden flex flex-col min-h-screen">
      <div className="navBar hidden cursor-pointer text-amber-100 p-2 sm:flex justify-between items-center">
        <RouteLink to={"/"}>
          <div className="name pl-14 text-4xl font-bold">Linkify</div>
        </RouteLink>
        <div className="navLink pr-14 flex justify-evenly gap-9 items-center">
          <Link
            onClick={() => {
              setHistoryOpen(!historyOpen);
            }}
          >
            <HistoryIcon /> History
          </Link>
          <Link to="Footer" smooth={true} duration={700}>
            Contact
          </Link>
          <LogoutBtn
            onClick={() => {
              logOut();
            }}
          />
        </div>
      </div>

      <div className="sm:hidden relative top-11 ">
        <RouteLink to={"/"}>
          <div className="name  text-4xl text-center text-amber-100  font-bold">
            Linkify
          </div>
        </RouteLink>
      </div>

      <button className="sm:hidden absolute right-3 top-3 !text-[4px]">
        <Hamburger onToggle={toggleMenu} />
      </button>

      {isOpen && (
        <>
          <div
            className={`mobile-layout cursor-pointer sm:hidden  absolute top-14 right-2`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg w-44 py-2 px-4 mt-2.5 flex flex-col ">
              <Link
                className="text-xl text-amber-100 p-2"
                onClick={() => {
                  setHistoryOpen(!historyOpen);
                }}
              >
                <HistoryIcon /> History
              </Link>
              <Link
                to="Footer"
                className="text-xl text-amber-100 p-2"
                smooth={true}
                duration={700}
              >
                <PersonIcon /> Contact
              </Link>
              <div className="border-t border-white/30 my-1" />
              <div className="p-2">
                <LogoutBtn
                  onClick={() => {
                    logOut();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {historyOpen ? (
        <div className="cards flex flex-col items-center ">
          {meetingHistory.length > 0 ? (
            meetingHistory.map((e, i) => {
              console.log(e);
              return (
                <div
                  key={e._id}
                  className="card blue "
                  style={{ boxSizing: 'border-box', width: '90vw', maxWidth: 340, margin: '0 auto' }}
                >
                  <p className="tip">Code: {e.meetingCode}</p>
                  <p className="second-text ">Date: {formatDate(e.date)}</p>
                </div>
              );
            })
          ) : (
            <div className="card blue mb-4" style={{ width: '90vw', maxWidth: 340, margin: '0 auto' }}>
              <p className="tip">No meeting history</p>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      <div className="contentContainer sm:mt-0 mt-1 p-5 flex text-center justify-center sm:justify-between items-center">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinCall();
              }}
              className="flex flex-col items-center gap-y-2 relative"
              style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
            >
              <label htmlFor="meetingCode" className="text-amber-50  ">
                Enter Meeting code or create new meeting
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
                className="w-1/5 !bg-[#AB1B9E]"
                onClick={handleJoinCall}
                role="submit"
                variant="contained"
              >
                Join
              </Button>
            </form>
          </div>
        </div>
        <div className="hidden  md:block">
          <img
            src="/media/images/homeImg.png"
            alt=""
            className="lg:w-[600px]  md:w-[300px] sm:h-[200px] sm:w-[200px] md:h-[300px] lg:h-[600px] "
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
