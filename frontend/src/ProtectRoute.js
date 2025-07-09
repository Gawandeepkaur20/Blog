import React from "react";
import { Navigate, Outlet } from "react-router";

function ProtectRoutes() {
  const access_token = localStorage.getItem("access_token");
  const getAuth = localStorage.getItem("isAuthenticated");
  // console.log(getAuth);
  // console.log(access_token);
  if (access_token && getAuth) {
    return <Outlet />;
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAuthenticated");
    return <Navigate to="/login" />;
  }
}

export default ProtectRoutes;
