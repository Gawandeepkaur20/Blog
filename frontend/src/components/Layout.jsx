import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./topbar/Topbar";
import Footer from "./footer";
import "./layout.css"; // make sure this file exists

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Topbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
