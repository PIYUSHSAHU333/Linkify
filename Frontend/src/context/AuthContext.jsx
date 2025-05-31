import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "https://linkify-production-1188.up.railway.app/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const router = useNavigate();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
   const [logoutinProgress, setLogoutinProgress] = useState(false)
  useEffect(() => {
    isLoggedIn();
  }, []);
  const handleRegister = async (username, name, password) => {
    try {
      const request = await client.post("/register", {
        username: username,
        name: name,
        password: password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username: username,
        password: password,
      });

      if (request.status === httpStatus.OK && request.data.token) {
        localStorage.setItem("token", request.data.token);
        await isLoggedIn();
        console.log("handleLogin");
        router("/home");
        console.log("token stored:", localStorage.getItem("token"));
      } else {
        console.log("token missing");
      }
    } catch (err) {
      throw err;
    }
  };

  const getUserHistory = async () => {
    console.log("user data:", userData);
    try {
      let request = await client.get("/getMeetingHistory", {
        params: {
          userId: userData.userId,
        },
      });
      return request.data;
    } catch (e) {
      throw e;
    }
  };
  const addToHistory = async (meetingCode) => {
    try {
      let request = await client.post("/addMeetingHistory", {
        token: localStorage.getItem("token"),
        userId: userData.userId,
        meetingCode: meetingCode,
      });
      console.log(request.data.message);
      return request;
    } catch (e) {
      throw e;
    }
  };

  const isLoggedIn = async () => {
    try {
      let token = localStorage.getItem("token");
      if (token) {
        const request = await client.get("/verifyUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(request.data.user);
      } else {
        return;
      }
    } catch (e) {
      console.log("error from isLoggedIn:", e);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async()=>{
    
      
      localStorage.removeItem("token");
      router("/");
      setTimeout(()=>{
        setUserData(null);
      }, 500)
      
      
    
    
  }
  return (
    <>
      <AuthContext.Provider
        value={{
          handleRegister,
          getUserHistory,
          isLoggedIn,
          addToHistory,
          handleLogin,
          userData,
          setUserData,
          loading,
          logoutinProgress, 
          logOut        
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
