import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import CreateBlogForm from "../components/CreateBlogForm";
const API_URL = process.env.REACT_APP_API_URL  || "http://localhost:3000";



export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blog`);
      setBlogs(Array.isArray(res.data.response) ? res.data.response : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

const handleCreate = async (newBlog) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN SENT:", token); // Add this to debug

  if (!token) return alert("You must be logged in to create a blog.");

  try {
    const res = await axios.post(
      `${API_URL}/api/blog`,
      newBlog,
      {
        headers: {
          "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`, // Important format
        },
      }
    );

    setBlogs([res.data.result, ...blogs]);
    setShowCreateForm(false);
  } catch (err) {
    console.error("Error creating blog:", err.response?.data || err.message);
  }
};


  

  const handleUpdate = async (updatedBlog) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${API_URL}/api/blog/${updatedBlog._id}`,
        updatedBlog,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(blogs.map((b) => (b._id === updatedBlog._id ? updatedBlog : b)));
    } catch (err) {
      console.error("Error updating blog:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content px-4 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold">📝 Latest Blogs</h1>
        <button
          className="btn btn-accent"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Close Form" : "➕ Create Blog"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-10 bg-base-100 p-6 rounded-lg shadow-md">
          <CreateBlogForm onCreate={handleCreate} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

