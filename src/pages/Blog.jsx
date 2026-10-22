import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../lib/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="wrap sec" style={{ textAlign: "center", padding: "50px" }}><h2>Loading Blogs...</h2></div>;

  return (
    <div className="wrap sec" style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "30px", color: "#111", fontWeight: "bold" }}>Latest India Blogs</h1>

      {posts.length === 0 ? <p>Abhi koi blog post nahi mila.</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
          {posts.map((post) => {
            let imageUrl = "https://via.placeholder.com/400x200?text=No+Image";
            if (post._embedded && post._embedded["wp:featuredmedia"]) {
              imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
            }
            const postDate = new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

            return (
              <div key={post.id} style={{ backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", border: "1px solid #eaeaea", transition: "transform 0.3s ease, boxShadow 0.3s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img src={imageUrl} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <span style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>{postDate}</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#111", lineHeight: "1.4", marginBottom: "12px" }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <div style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6", flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                  <Link to={`/blog/${post.slug}`} style={{ marginTop: "20px", color: "#0b57d0", fontWeight: "600", textDecoration: "none" }}>Read Full Article &rarr;</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}