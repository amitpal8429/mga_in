import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug } from "../lib/api";
// 👇 Canonical Hook Import 👇
import useCanonical from "../hooks/useCanonical";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👇 Canonical & SEO Tags (Dynamic) 👇
  // Hook ko early return se PEHLE call karna zaroori hai
  useCanonical({
    title: post ? `${post.title.rendered.replace(/<[^>]+>/g, '')} | MGA Blog` : "Loading... | MGA Blog",
    description: post 
      ? post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160) 
      : "Read the latest medical articles from Medical Global Academy.",
  });

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
    <div style={{ width: "100%", backgroundColor: "#fff", display: "flex", justifyContent: "center", padding: "40px 0" }}>
      
      <div style={{ width: "100%", maxWidth: "1100px", padding: "0 20px" }}>
        
        <Link to="/blog" style={{ display: "inline-block", marginBottom: "20px", color: "#0066cc", textDecoration: "none", fontWeight: "600", fontSize: "1.1rem" }}>&larr; Back to Blogs</Link>
        
        <h1 style={{ fontSize: "3.2rem", marginBottom: "15px", fontWeight: "bold", lineHeight: "1.2", color: "#0a2540" }} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        
        <p style={{ color: "#666", marginBottom: "30px", fontSize: "1.1rem" }}>Published on: {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        
        {imageUrl && <img src={imageUrl} alt="cover" style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "10px", marginBottom: "40px" }} />}

        <div 
          className="wp-content" 
          style={{ 
            lineHeight: "1.8", 
            fontSize: "1.25rem",
            color: "#333",
            textAlign: "left",
            width: "100%"
          }} 
          dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
        />
        
        <style>{`
          .wp-content h2 { font-size: 2.5rem; color: #0a2540; margin-top: 40px; margin-bottom: 20px; }
          .wp-content h3 { font-size: 2rem; color: #0a2540; margin-top: 30px; margin-bottom: 15px; }
          .wp-content p { margin-bottom: 20px; }
          .wp-content ul, .wp-content ol { margin-bottom: 20px; padding-left: 20px; }
          .wp-content li { margin-bottom: 10px; }
        `}</style>
        
      </div>
    </div>
  );
}