import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./homepage.css";
import { useEffect, useState } from "react";
import { injectModels } from "../../Redux/injectModel";
import { useNavigate } from "react-router-dom";
import GoogleTranslate from "../../components/translator/GoogleTranslator";
import SearchBar from "../searchSuggestion";

function Homepage(props) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const LIMIT = 20;
 const scrollToTopPicks = () => {
  const section = document.getElementById("top-picks");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

  const loadMorePosts = async () => {
    setLoading(true);
    try {
      const response = await props.posts.getAllPosts({ page, limit: LIMIT });
      if (response.length < LIMIT) {
        setHasMore(false);
      }
      setData((prev) => [...prev, ...response]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.log("Failed to get data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMorePosts(); // initial load
  }, []);

  return (
    <>
      <Header />
      <section className="hero">
        <div style={{ marginTop: "0px", marginBottom: "3rem" }}>
          <SearchBar />
        </div>
        <GoogleTranslate />
        <h1>Ideas that stick, stories that spark</h1>
        <div className="hero-container">
          <div className="desc-box">
            <h2>Informative Content Hub</h2>
            <p>
              Zenticle welcomes you to a world of insightful posts covering
              health, technology, and finance. Our platform is designed to spark
              curiosity, ignite conversations, and empower readers with
              knowledge that matters. Whether you're seeking personal growth,
              staying ahead in tech trends, or making smarter financial choices —
              our articles aim to guide, inspire, and inform.
            </p>
      <button onClick={scrollToTopPicks}>Start Your Journey</button>



          </div>
          <div className="hero-image">
            <img src="./assets/image.png" alt="Blog illustration" />
          </div>
        </div>
      </section>

      <div className="home">
        <div className="homeMain">
          <Posts data={data} />
          {hasMore && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={loadMorePosts} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
        {/* <Sidebar /> */}
      </div>
    </>
  );
}

export default injectModels(["posts"])(Homepage);
