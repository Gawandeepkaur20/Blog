import React, { useEffect } from "react";
import Topbar from "./components/topbar/Topbar";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import SinglePost from "./pages/single/Single";
import Write from "./pages/write/Write";
import MyPost from "./pages/mypost/MyPost";
import About from "./pages/about/About";
import { Routes, Route } from "react-router-dom";
import ProtectRoutes from "./ProtectRoute";
import { injectModels } from "./Redux/injectModel";
import RegistrationPage from "./pages/register/Register";
import ForgotPassword from "./forgotpassowrd/forgotpasswod";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./userProfile";
import FollowList from "./components/FollowList";
import Footer from "./components/footer";



function App(props) {

  // const { user, getUser } = props.auth;

  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   const isAuthenticated= localStorage.getItem("isAuthenticated");
  //   if (token && isAuthenticated && !user) {
  //     getUser();
  //   }
  // }, [user, getUser]);


  

return (
  <>
    <Topbar />

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
      {/* Public routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/post/:id" element={<SinglePost />} />
      <Route path="/about" element={<About />} />
      <Route path="/user/:username" element={<UserProfile />} />
      <Route path="/user/:username/followers" element={<FollowList type="followers" />} />
      <Route path="/user/:username/following" element={<FollowList type="following" />} />

      {/* Protected routes */}
      <Route element={<ProtectRoutes />}>
        <Route path="/write" element={<Write />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mypost" element={<MyPost />} />
      </Route>

      {/* Auth pages */}
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>

    {/* ✅ Place Footer here so it appears on all pages */}
    <Footer />
  </>
);

}



export default injectModels(["auth"])(App);
