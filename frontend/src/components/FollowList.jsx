import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FollowList.css";

function FollowList() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("followers");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user/${username}/${selectedTab}`);
        setUsers(res.data[selectedTab]);
      } catch (err) {
        console.error(`Error fetching ${selectedTab}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollows();
  }, [username, selectedTab]);

  return (
   
    <div className="follow-list-container">
      {/* Header with back arrow and username */}
      <div className="follow-header">
        <button onClick={() => navigate(-1)} className="back-btn">&#8592;</button>
        <span className="header-username">{username}</span>
      </div>

      {/* Followers / Following toggle row */}
      <div className="tab-toggle">
        <span
          className={selectedTab === "followers" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("followers")}
        >
          Followers
        </span>
        <span
          className={selectedTab === "following" ? "tab active" : "tab"}
          onClick={() => setSelectedTab("following")}
        >
          Following
        </span>
      </div>

      {/* List display */}
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No {selectedTab} found.</p>
      ) : (
        <ul className="follow-user-list">
          {users.map((user) => (
            <li key={user._id} className="follow-user-item">
              <div className="user-info">
                <Link to={`/user/${user.username}`} className="follow-user-link">
                  <img
                    src={user.profilePic ? `${API_BASE_URL}/images/profiles/${user.profilePic}` : "/default-profile.png"}
                    alt="profile"
                    className="follow-user-avatar"
                  />
                  <div className="user-text">
                    <span className="username">{user.username}</span>
                  </div>
                </Link>
              </div>
              <button className="follow-button">Following</button>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}

export default FollowList;