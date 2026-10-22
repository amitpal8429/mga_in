import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug } from "../lib/api";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostBySlug(slug)
      .then((data) => {
        if (data) setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="wrap sec" style={{ textAlign: "center", padding: "50px" }}>Loading article...</div>;
  if (!post) return <div className="wrap sec" style={{ padding: "50px", textAlign: "center" }}><h2>Article not found.</h2><Link to="/blog">Go back to Blogs</Link></div>;

  let imageUrl = null;
  if (post._embedded && post._embedded["wp:featuredmedia"]) {
    imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
  }

  return (
    <div className="wrap sec" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <Link to="/blog" style={{ display: "inline-block", marginBottom: "20px", color: "#0066cc", textDecoration: "none", fontWeight: "600" }}>&larr; Back to Blogs</Link>
      
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", fontWeight: "bold" }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <p style={{ color: "#666", marginBottom: "20px" }}>Published on: {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      
      {imageUrl && <img src={imageUrl} alt="cover" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "10px", marginBottom: "30px" }} />}

      <div className="wp-content" style={{ lineHeight: "1.8", fontSize: "1.1rem" }} dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </div>
  );
}