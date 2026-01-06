import React from "react";
import "./settings.css";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { injectModels } from "../../Redux/injectModel";
import axios from "axios";
import { toast } from "react-toastify";

function Settings(props) {
  const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const PF = `${API_BASE_URL}/images/profiles/`;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");



  const { user, getUser } = props.auth;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      getUser();
    } else if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
       setBio(user.bio || "");
    }
  }, [user]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete your account?")) 
      
      return;

    try {
      if (!user || !user._id) return;

      const response = await props.auth.deleteUser(user._id);
      if (response && response.success !== false) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("isAuthenticated");
        toast.success("Account deleted successfully!", {   
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
        navigate("/signup");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your account.", {  
      style: {
        marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
      navigate("/login");

      return;
    }

    setLoading(true);

    const updatedUser = { username, email, password ,bio};

    try {
       if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("access_token");

        const res = await axios.post(
          `${API_BASE_URL}/upload/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.data.success) {
          updatedUser.profilePic = res.data.filename;
          toast.success("Profile picture updated successfully!", {   
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
        }
        
      }
       
      const response = await props.auth.update(user._id, updatedUser);
      if (response && response.success === true) {
           await getUser();
        navigate("/");
      }
    } catch (error) {
      console.error("Update error:", error);
     
     toast.error("Something went wrong. Try again.", {
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="settings">
      
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Account</span>
          <div>
            <span className="settingsTitleDelete" onClick={handleDelete}>
              Delete Account
            </span>
           
            {user && (
  <Link  className="link-profile"to={`/user/${user.username}`} style={{ marginLeft: "24px" }} >
     My Profile
  </Link>
)}
          </div>
        </div>

        <form className="settingsForm" onSubmit={handleSubmit}>
      <label className="profile-label">Profile Picture</label>
          <div className="settingsPP">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : user?.profilePic
                  ? PF + user.profilePic
                  : "/default-profile.png"
              }
              alt="profile"
            />
            <label htmlFor="fileInput" className="uploadProfileBtn">
  📷 Choose Profile Image
</label>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              className="settingsPPInput"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

        <label className="username-label">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter Username"
            name="username"
            required
          />
 <label className="email-label">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            name="email"
            required
          />

          <label className="password-label">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            name="password"
          />
          <label className="bio-label">Bio</label>
<textarea
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="Write something about yourself..."
  rows="4"
  style={{ resize: "vertical" }}
/>



          <button className="settingsSubmitButton" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default injectModels(["auth"])(Settings);