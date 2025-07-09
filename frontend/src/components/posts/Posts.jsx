import React from "react";
import Post from "../post/Post";
import { useNavigate } from "react-router-dom";
import "./posts.css";

export default function Posts({ data }) {
  const navigate = useNavigate();

  return (
    <section className="post-section">
       <h2 class="section-title">Top Picks</h2>
    <div className="posts">
  
    
      {data.length === 0 && (
        <div className="no-posts-message">
          <h2>You haven't created any posts yet.</h2>
         
        </div>
      )}

      {/* Render existing posts */}
       
      {data.length > 0 &&
        data.map((el) => <Post key={el._id || el.id} 
         {...el} 
              title={el.title}
              description={el.description}
              tags={el.tags}
              likes={el.likes?.length || 0}
              views={el.views || 0}
             photo={el.photo}
             createdAt={el.createdAt}
  _id={el._id}
          />
            )}

      
      
    
    </div>
    </section>
  );
}
