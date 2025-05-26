import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function PrivateRoute({ children }) {
  const {userData, loading} = useContext(AuthContext)
  const navigate = useNavigate();

  if(loading){
    return  <div className="min-h-screen ">Please wait a while</div>
  }

  if(!userData){
    console.log("Navigate")
    return <Navigate to={"/auth"}></Navigate>
  }
  return children

 
}

export default PrivateRoute;
