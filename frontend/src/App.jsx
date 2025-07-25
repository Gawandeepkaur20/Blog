import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/single/Single";
import Write from "./pages/write/Write";
import MyPost from "./pages/mypost/MyPost";
import About from "./pages/about/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./userProfile";
import FollowList from "./components/FollowList";
import ForgotPassword from "./forgotpassowrd/forgotpasswod";
import RegistrationPage from "./pages/register/Register";
import ProtectRoutes from "./ProtectRoute";
import { injectModels } from "./Redux/injectModel";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* ✅ Wrap ALL layout-based routes here */}
        <Route element={<Layout />}>
          {/* Public routes inside layout */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/user/:username/followers" element={<FollowList type="followers" />} />
          <Route path="/user/:username/following" element={<FollowList type="following" />} />

          {/* Protected routes inside layout */}
          <Route element={<ProtectRoutes />}>
            <Route path="/write" element={<Write />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/mypost" element={<MyPost />} />
          </Route>
        </Route>

        {/* Auth routes WITHOUT layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default injectModels(["auth"])(App);
