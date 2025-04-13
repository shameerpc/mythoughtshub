import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import CreateBlogForm from "../components/CreateBlogForm";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch Blogs from API
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/blog");
      if (Array.isArray(res.data.response)) {
        setBlogs(res.data.response);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Correctly receives `newBlog` from the form
  const handleCreate = async (newBlog) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a blog.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/blog", newBlog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs([res.data.result, ...blogs]);
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating blog:", err.response?.data || err.message);
    }
  };

  const handleUpdate = async (updatedBlog) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing, user is not authorized.");
      return; // Don't proceed if no token
    }
  
    console.log("Updated Blog:", updatedBlog); // Log the updatedBlog to check its structure
  
    try {
      await axios.put(
        `http://localhost:3000/api/blog/${updatedBlog._id}`,
        updatedBlog,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setBlogs(
        blogs.map((blog) =>
          blog._id === updatedBlog._id ? { ...blog, ...updatedBlog } : blog
        )
      );
    } catch (err) {
      console.error("Error updating blog:", err.response?.data || err.message);
    }
  };
  
  
  
  

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing, user is not authorized.");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3000/api/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
    }
  };
  

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 Latest Blogs</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Close Form" : "➕ Create Blog"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateBlogForm onCreate={handleCreate} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
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
