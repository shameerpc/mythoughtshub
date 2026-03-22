import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../api/blog.api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyBlogs();
  }, [token, navigate]);

  const fetchMyBlogs = async () => {
    try {
      const res = await getMyBlogs();
      setBlogs(res.response || []);
    } catch (error) {
      console.error("Error fetching my blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        fetchMyBlogs(); // Refresh list
      } catch (error) {
        alert("Failed to delete blog");
      }
    }
  };

  if (!token) return null;

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />
      
      <main className="container flex-grow max-w-5xl p-4 pt-24 mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center p-6 mb-8 bg-white rounded-lg shadow-md md:flex-row">
          <div className="mb-4 avatar placeholder md:mb-0 md:mr-6">
            <div className="w-24 rounded-full bg-primary text-primary-content">
              <span className="text-3xl">USER</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">My Profile</h2>
            <p className="text-gray-500">Manage your account and blogs</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto">
             <Link to="/create-blog" className="btn btn-primary">
              + Create New Blog
            </Link>
          </div>
        </div>

        {/* My Blogs Section */}
        <h3 className="mb-4 text-xl font-semibold">My Blogs</h3>
        
        {loading ? (
          <div className="flex justify-center py-10">
             <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-lg shadow">
            <p className="text-lg">You haven't written any blogs yet.</p>
            <Link to="/create-blog" className="mt-4 btn btn-outline btn-primary">
              Write your first blog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full bg-white rounded-lg shadow">
              {/* head */}
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <div className="font-bold">{blog.title}</div>
                      <div className="max-w-xs text-sm truncate opacity-50">
                        {blog.description}
                      </div>
                    </td>
                    <td>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {blog.is_active ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-warning">Draft</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link 
                          to={`/edit-blog/${blog._id}`} 
                          className="text-white btn btn-xs btn-info"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          className="text-white btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;