import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../api/category.api";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 1rem",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  header: { textAlign: "center", marginBottom: "3rem" },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  subtitle: { color: "#6b7280", fontSize: "1.1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    transition: "all 0.3s ease",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    marginBottom: "1rem",
  },
  cardTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" },
  cardDesc: { fontSize: "0.95rem", color: "#6b7280", lineHeight: "1.5" },
  loading: { textAlign: "center", padding: "2rem", color: "#6b7280" }
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div style={styles.loading}>Loading categories...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Browse by Category</h1>
        <p style={styles.subtitle}>Find exactly what you're looking for.</p>
      </div>

      <div style={styles.grid}>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/categories/${cat.slug}`} // Uses slug from DB
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.iconCircle}>{cat.icon || "📂"}</div>
            <h2 style={styles.cardTitle}>{cat.name}</h2>
            <p style={styles.cardDesc}>
              {cat.description || `Explore the best articles in ${cat.name}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;