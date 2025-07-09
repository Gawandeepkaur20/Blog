import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./singlePost.css";
import { format } from "timeago.js";
import { injectModels } from "../../Redux/injectModel";
import PostInteraction from "../../PostInteraction";
import axios from "axios";
import ReactQuill from "react-quill";

function SinglePost(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [desc, setDesc] = useState("");
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [tags,setTags]=useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const pf = "http://localhost:5000/images/blog/";

  const { user, getUser } = props.auth;

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await props.posts.getPostById(id);
        const postData = Array.isArray(response) ? response[0] : response;

        if (!postData || !postData.title) {
          console.error("Invalid post data", postData);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setDesc(postData.desc); // Initialize desc
       setTags(Array.isArray(postData.tags) ? postData.tags.join(", ") : postData.tags);

        console.log("Fetched post:", postData);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    getPost();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      getUser();
    }
  }, [user, getUser]);

  const handleDelete = async () => {
  try {
    const response = await props.posts.deletePostById(id);
    console.log("Delete response:", response);

    // ✅ Broad condition to check if post was deleted
   if (response?.msg?.toLowerCase().includes("deleted")) {
  navigate("/");
} else {
  alert("Delete failed: " + (response?.msg || "Unexpected response"));
}

  } catch (error) {
    console.error("Delete failed:", error);
    alert("Could not delete the post.");
  }
};

  const handleUpdate = async () => {
    try {
      const updatedPost = { title, desc,tags };
      const response = await props.posts.updatePostById(id, updatedPost);
      console.log("Update response:", response);
      setUpdateMode(false);
      setPost({ ...post, title, desc }); // update local state
    } catch (error) {
      console.error("Update failed:", error);
      alert("Could not update the post.");
    }
  };
useEffect(() => {
  const incrementView = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/post/${id}/view`);
    } catch (err) {
      console.error("Failed to update view count", err);
    }
  };

  incrementView();
}, [id]);
  if (!post) return <div>Loading post...</div>;

  
return (
  <div className="singlePost">
    <div className="singlePostWrapper">
      {post.photo && (
        <img className="singlePostImg" src={pf + post.photo} alt="Post" />
      )}

      <div className="postContainer">
        {/* TITLE + META ROW */}
      
<div className="postHeader">
  {/* Row 1: Title and edit/delete */}
  <div className="postTitleRow">
    {updateMode ? (
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="editTitleInput"
    placeholder="Edit title"
  />
) : (
  <h1 className="singlePostTitle">{post.title}</h1>
)}
    {post.username === user?.username && (
      <div className="singlePostEdit">
        <i onClick={() => setUpdateMode(true)}>✎</i>
        <i onClick={handleDelete}>🗑</i>
      </div>
    )}
  </div>

  {/* Row 2: Author and Time */}
  <div className="postMetaRow">
    <span className="postAuthor">By {post.username}</span>
    <span className="postDate">🕒 {format(post.createdAt)}</span>
  </div>
</div>

        {/* DESCRIPTION */}
        <div className="postBody">
          {updateMode ? (
            <ReactQuill
              className="quillEditor"
              theme="snow"
              value={desc}
              onChange={setDesc}
            />
          ) : (
            <div
              className="singlePostDesc"
              dangerouslySetInnerHTML={{ __html: post.desc }}
            />
          )}
{updateMode ? (
  <input
    type="text"
    value={tags}
    onChange={(e) => setTags(e.target.value)}
    className="editTagsInput"
    placeholder="Enter tags separated by commas"
  />
) : (
  tags && (
    <div className="postTags">
      <strong>Tags:</strong> {tags}
    </div>
  )
)}


        </div>

        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
             Update
          </button>
        )}
      </div>
    </div>

    <PostInteraction post={post} postId={id} currentUser={user} />
  </div>
);
}
export default injectModels(["posts", "auth"])(SinglePost);
