import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./homepage.css";
import { useEffect, useState } from "react";
import { injectModels } from "../../Redux/injectModel";
import { useNavigate } from "react-router-dom"; // ✅ Required for navigation

function Homepage(props) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  async function getAllPost() {
    try {
      const response = await props.posts.getAllPosts();
      setData(response);
    } catch (error) {
      console.log("Fails to get data", error);
    }
  }

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <>
      <Header />
        <section class="hero">
           
    <h1>Unlock Knowledge Gems</h1>
    <div class="desc-box">
      <h3>Informative Content Hub</h3>
      <p>
        Zenticle welcomes you to a world of insightful posts covering health, technology, and finance. Dive into our articles for enriching perspectives.
      </p>
      <button>Start Your Journey</button>
    </div>
  </section>
      <div className="home">
        <div className="homeMain">
          {/* ✅ Button placed before Sidebar */}
          <div className="topControls">
            
            
          </div>

          <Posts data={data} />
        </div>
        {/* <Sidebar /> */}
      </div>
    </>
  );
}

export default injectModels(["posts"])(Homepage);
