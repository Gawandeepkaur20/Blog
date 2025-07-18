import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectRoutes() {
  const token = localStorage.getItem("access_token");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (token && isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectRoutes;
