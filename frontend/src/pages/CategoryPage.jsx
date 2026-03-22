import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogsByCategorySlug } from "../api/category.api";

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" },
  hero: {
    background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
    color: "white",
    padding: "4rem 1rem",
    borderRadius: "0 0 2rem 2rem",
    marginBottom: "3rem",
    textAlign: "center",
  },
  heroTitle: { fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" },
  heroCount: { opacity: 0.9, fontSize: "1.1rem" },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
    paddingBottom: "4rem",
  },
  blogCard: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s",
  },
  blogImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    backgroundColor: "#e5e7eb",
  },
  blogContent: { padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 },
  blogBadge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "600",
    width: "fit-content",
    marginBottom: "0.5rem",
  },
  blogTitle: { fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1f2937", lineHeight: "1.4" },
  blogExcerpt: {
    color: "#6b7280",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  blogMeta: {
    marginTop: "auto",
    paddingTop: "1rem",
    borderTop: "1px solid #f3f4f6",
    display: "flex",
    justifyContent: "space-between",
    color: "#9ca3af",
    fontSize: "0.85rem",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    color: "#4b5563",
    textDecoration: "none",
    fontWeight: "500",
    marginBottom: "1rem",
    cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "2rem", color: "#6b7280" }
};

const CategoryPage = () => {
  const { type } = useParams(); // type is the slug
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBlogsByCategorySlug(type);
        setData(res); // Expecting { category: {}, blogs: [] }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  if (loading) return <div style={styles.empty}>Loading articles...</div>;
  
  if (!data || !data.category) return <div style={styles.empty}>Category not found.</div>;

  return (
    <div>
      <div style={styles.hero}>
        {/* FIXED: Merged duplicate style props into one object */}
        <div style={{ ...styles.container, padding: 0 }}>
          <h1 style={styles.heroTitle}>{data.category.name}</h1>
          <p style={styles.heroCount}>
            {data.blogs.length} Article{data.blogs.length !== 1 && "s"} Found
          </p>
        </div>
      </div>

      <div style={styles.container}>
        <Link to="/categories" style={styles.backLink}>← Back to Categories</Link>

        {data.blogs.length === 0 ? (
          <div style={styles.empty}>No blogs in this category yet.</div>
        ) : (
          <div style={styles.blogGrid}>
            {data.blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                style={styles.blogCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:4000${blog.image}`} // Ensure PORT matches backend (4000)
                    alt={blog.title}
                    style={styles.blogImage}
                  />
                )}
                <div style={styles.blogContent}>
                  <span style={styles.blogBadge}>{data.category.name}</span>
                  <h3 style={styles.blogTitle}>{blog.title}</h3>
                  <p style={styles.blogExcerpt}>{blog.description}</p>
                  <div style={styles.blogMeta}>
                    <span>{blog.creator?.username || "Admin"}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;