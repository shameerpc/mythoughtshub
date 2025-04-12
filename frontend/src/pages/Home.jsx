import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/blog")
      .then(res => {
        console.log("API response:", res.data);
        if (Array.isArray(res.data.response)) {
          setBlogs(res.data.response); // ✅ fixed here
        } else {
          setBlogs([]);
          console.warn("Unexpected response format:", res.data);
        }
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Latest Blogs</h1>
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
