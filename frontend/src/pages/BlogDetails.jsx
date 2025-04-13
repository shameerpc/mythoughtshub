import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/blog/${id}`);
        setBlog(res.data.response);
        setEditedTitle(res.data.response.title);
        setEditedDescription(res.data.response.description);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3000/api/blog/${id}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog({ ...blog, title: editedTitle, description: editedDescription });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  if (!blog) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md space-y-6">
      {isEditing ? (
        <>
          <input
            className="input input-bordered w-full text-2xl font-semibold"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full min-h-[150px]"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="flex gap-4">
            <button onClick={handleUpdate} className="btn btn-success">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-gray-900">{blog.title}</h1>
          <p className="text-gray-700 leading-relaxed">{blog.description}</p>
          <div className="text-sm text-gray-500 mt-4">
            ✍️ <strong>{blog.creator?.username}</strong> ({blog.creator?.email})
          </div>

          {/* Always show buttons for now */}
          <div className="mt-6 flex gap-4">
            <button className="btn btn-warning" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
