import React from "react";
import Post from "../post/Post";
import { useNavigate } from "react-router-dom";
import "./posts.css";

export default function Posts({ data }) {
  const navigate = useNavigate();

  return (
    <section className="post-section" id="top-picks">
      <h2 className="section-title">Top Picks</h2>
      <div className="posts">
        {data.length === 0 ? (
          <div className="no-posts-message">
            <h2>You haven't created any posts yet.</h2>
          </div>
        ) : (
          data.map((el) => (
            <Post
              key={el._id || el.id}
              _id={el._id}
              title={el.title}
              description={el.description}
              tags={el.tags}
              likes={el.likes?.length || 0}
              views={el.views || 0}
              photo={el.photo}
              createdAt={el.createdAt}
              username={el.username}
            />
          ))
        )}
      </div>
    </section>
  );
}
