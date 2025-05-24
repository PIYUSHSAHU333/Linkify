import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  if (token) {
    return children;
  } else if (!token) {
    return <Navigate to={"/auth"}></Navigate>;
  }
}

export default PrivateRoute;
