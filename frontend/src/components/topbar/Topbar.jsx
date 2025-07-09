import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import { injectModels } from "../../Redux/injectModel";
import axios from 'axios';
import GoogleTranslate from "../translator/GoogleTranslator";

function Topbar(props) {
  const navigate = useNavigate();
  const { user, getUser } = props.auth;
  const isAuthenticated = !!user;
  const [desc, setDesc] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  const PF = "http://localhost:5000/images/profiles/";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      getUser();
    }
  }, [user, getUser]);

  const handleLogout = () => {
    props.auth.logout();
    navigate("/login");
  };

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text: desc,
        to: selectedLang
      });
      alert("Translated Text:\n" + response.data.translatedText);
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Translation failed. Try again.");
    }
  };

  return (
    <div className="top">
      <div className="topLeft">
        <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-twitter-square"></i>
      </div>

      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">HOME</Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/about">ABOUT</Link>
          </li>

          {isAuthenticated && (
            <>
              <li className="topListItem">
                <Link className="link" to="/write">WRITE</Link>
              </li>
              <li className="topListItem" onClick={handleLogout}>
                LOGOUT
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="topRight">
        {isAuthenticated ? (
          user ? (
            <Link className="link profileLink" to="/settings">
              <span className="welcomeText">
                Welcome <strong>{user.username}</strong>
              </span>
              <img
  className="topImg"
  src={
    user.profilePic
      ? PF + user.profilePic
      : "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg"
  }
  alt="profile"
/>
            </Link>
          ) : (
            <div className="loading-placeholder">Loading...</div>
          )
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">LOGIN</Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">REGISTER</Link>
            </li>
          </ul>
        )}

        <div className="translateWrapper">
          <GoogleTranslate />
        </div>

        <i className="topSearchIcon fas fa-search"></i>
      </div>
    </div>
  );
}

export default injectModels(["auth"])(Topbar);
