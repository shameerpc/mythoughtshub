import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Ensure this API file exists and exports getAllBlogs
import { getAllBlogs } from "../api/blog.api"; 

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogs();
        // Adjust based on your API response structure
        setBlogs(res.response || []);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen pt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container max-w-6xl p-4 pt-24 pb-12 mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-primary">Latest Articles</h1>
          <p className="mt-2 text-gray-500">Discover stories, thinking, and expertise from writers on any topic.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-500">No blogs found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog._id} className="transition-shadow duration-300 shadow-xl card bg-base-100 hover:shadow-2xl">
                <figure>
                  <img
                    src={`http://localhost:4000${blog.image}` || "https://placehold.co/600x400"}
                    alt={blog.title}
                    className="object-cover w-full h-48"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-base-content">
                    {blog.title}
                  </h2>
                  <p className="h-16 overflow-hidden text-sm text-gray-500 line-clamp-2">
                    {blog.description}
                  </p>
                  <div className="justify-end card-actions">
                    <Link to={`/blog/${blog._id}`} className="btn btn-primary btn-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;