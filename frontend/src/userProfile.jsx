import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./Redux/slices/userSlice";
import { format } from "timeago.js";
import axios from "axios";
import {jwtDecode }  from "jwt-decode";
import "./userProfile.css";

function UserProfile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profile: user, posts, loading, error } = useSelector((state) => state.user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userId, setUserId] = useState(null);

  const PF = "http://localhost:5000/images/profiles/";
  const BLOG_IMG = "http://localhost:5000/images/blog/";

  // Decode user ID from JWT token
  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Decoded token:", decoded);

      // FIX: Use userId instead of _id
      const id = decoded._id || decoded.userId || decoded.user_?.id;

      if (id) {
        setUserId(id);
        console.log("✅ Set userId from token:", id);
      } else {
        console.warn("⚠️ No usable userId found in token");
      }
    } catch (err) {
      console.error("❌ Token decode failed:", err);
    }
  } else {
    console.warn("⚠️ No access_token in localStorage");
  }
}, []);


  // Fetch user profile from backend
  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [username, dispatch]);

  // Check follow status
  useEffect(() => {
    if (user && userId) {
      setIsFollowing(user.followers.includes(userId));
    }
  }, [user, userId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token || !userId) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const url = `http://localhost:5000/user/${user._id}/${isFollowing ? "unfollow" : "follow"}`;
      const res = await axios.post(url, {}, config);

      if (res.data.success) {
        setIsFollowing((prev) => !prev);
        dispatch(fetchUserProfile(username));
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err.message);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data.</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header-row">
  <div className="profile-left">
    <img
      src={user?.profilePic ? PF + user.profilePic : "/default-profile.png"}
      alt="profile"
      className="profile-pic-large"
    />
 
  <div className="username-row">
      <h2 className="username">{user.username}</h2>
      {user.pronouns && <span className="pronouns">{user.pronouns}</span>}
    </div>

    <p className="bio">{user.bio || "No bio yet."}</p>
 </div>
  <div className="profile-right">
    {/* Stats aligned next to profile image and above name */}
    <div className="profile-stats">
     <div className="stat-item">
       <strong>{posts.length}</strong>
        <span>Posts</span>
        </div>
      <Link to={`/user/${user.username}/followers`} className="follow-link">
      <div className="stat-item">
         <strong>{user.followers.length}</strong>
          <span>Followers</span>
          </div>
      </Link>
    
      <Link to={`/user/${user.username}/following`} className="follow-link">
      <div className="stat-item">
        <strong>{user.following.length}</strong>
          <span>Following</span>
          </div>
      </Link>
    </div>

    {/* Name, pronouns, bio */}
    

    {/* Button */}
    {userId === user._id ? (
      <Link to="/settings">
        <button className="edit-profile-btn">Edit profile</button>
      </Link>
    ) : (
      <button className="follow-btnn" onClick={handleFollowToggle}>
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    )}
  </div>
</div>



    

      <div className="user-posts-section">
        <h2>{user.username}'s Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-Grid">
            {posts.map((post) => (
              <div className="post-card" key={post._id}>
                <img
                  className="postImg"
                  src={
                    post.photo?.startsWith("http")
                      ? post.photo
                      : `${BLOG_IMG}${post.photo}`
                  }
                  alt="blog"
                />
                <div className="postinfo">
                  <h3 className="post-title">
                    <Link to={`/post/${post._id}`} className="post-titleLink">
                      {post.title}
                    </Link>
                  </h3>
                </div>
                <div className="post-meta">
                  <span className="post-Date">🕒 {format(post.createdAt)}</span>
                  <span>👍 {post.likes?.length || 0}</span>
                  <span>👁️ {post.views || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
