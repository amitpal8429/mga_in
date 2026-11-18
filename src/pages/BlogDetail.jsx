import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug } from "../lib/api";
import useSeo from "../hooks/useSeo";
import { cleanText } from "../lib/seoText";

const SITE_URL = "https://medicalglobalacademy.in";

// Is post ka SEO hardcoded hai
const CRITICAL_CARE_SLUG = "critical-care-fellowship-icu-emergencies-guide";
const CRITICAL_CARE_SEO = {
  title: "Critical Care Fellowship: ICU Emergencies Guide",
  description:
    "Sepsis, shock, ARDS and ICU emergencies explained for MBBS doctors. See how a Critical Care Fellowship builds your clinical decision-making skills.",
  url: `${SITE_URL}/blog/critical-care-fellowship-icu-emergencies-guide`,
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCriticalCare = slug === CRITICAL_CARE_SLUG;

  // Hooks early return se pehle hone chahiye
  useSeo({
    title: isCriticalCare
      ? CRITICAL_CARE_SEO.title
      : post
        ? `${cleanText(post.title.rendered, 0)} | MGA Blog`
        : "Loading... | MGA Blog",
    description: isCriticalCare
      ? CRITICAL_CARE_SEO.description
      : post
        ? cleanText(post.excerpt.rendered, 160)
        : "Read the latest medical articles from Medical Global Academy.",
    url: isCriticalCare
      ? CRITICAL_CARE_SEO.url
      : post
        ? `${SITE_URL}/blog/${post.slug}`
        : undefined,
    image: post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  });

  useEffect(() => {
    setLoading(true);
    fetchPostBySlug(slug)
      .then((data) => {
        if (data) setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="wrap sec" style={{ textAlign: "center", padding: "50px" }}>
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="wrap sec" style={{ padding: "50px", textAlign: "center" }}>
        <h2>Article not found.</h2>
        <Link to="/blog">Go back to Blogs</Link>
      </div>
    );
  }

  let imageUrl = null;
  if (post._embedded && post._embedded["wp:featuredmedia"]) {
    imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px", padding: "0 20px" }}>
        <Link
          to="/blog"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#0066cc",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1.1rem",
          }}
        >
          &larr; Back to Blogs
        </Link>

        <h1
          style={{
            fontSize: "3.2rem",
            marginBottom: "15px",
            fontWeight: "bold",
            lineHeight: "1.2",
            color: "#0a2540",
          }}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <p style={{ color: "#666", marginBottom: "30px", fontSize: "1.1rem" }}>
          Published on:{" "}
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={cleanText(post.title.rendered, 0)}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "40px",
            }}
          />
        )}

        <div
          className="wp-content"
          style={{
            lineHeight: "1.8",
            fontSize: "1.25rem",
            color: "#333",
            textAlign: "left",
            width: "100%",
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