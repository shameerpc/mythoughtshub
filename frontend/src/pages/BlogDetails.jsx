import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.VITE_API_URL || "http://localhost:3000";


console.log(API_URL);

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
const [commentText, setCommentText] = useState(""); // for input box
const [comments, setComments] = useState([]);  

  // Fetch blog on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blog/${id}`);
        setBlog(res.data.response);
        setEditedTitle(res.data.response.title);
        setEditedDescription(res.data.response.description);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };


const fetchComments = async () => {
  try {
        const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API_URL}/api/blogs/${id}/comments`,
      {
         headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(res.data.comments,"grrrr")
    // Set the state after the request succeeds
    setComments(res.data.comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
};


     fetchComments()
    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}/api/blog/${id}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog({ ...blog, title: editedTitle, description: editedDescription });
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You are not authorized to edit this blog.");
      } else {
        console.error("Error updating blog:", err.response?.data || err.message);
      }
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You are not authorized to delete this blog.");
      } else {
        console.error("Error deleting blog:", err.response?.data || err.message);
      }
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required to comment.");

    try {
      const res = await axios.post(
        `${API_URL}/api/blogs/${id}/comment`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlog((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.newComment],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Error posting comment:", err.response?.data || err.message);
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

          {/* Edit/Delete buttons always shown */}
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

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">💬 Comments</h2>

        {/* Comment input */}
        <div className="mb-4">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
          />
          <button
            onClick={handleAddComment}
            className="btn btn-primary mt-2"
            disabled={!commentText.trim()}
          >
            Post Comment
          </button>
        </div>

        {/* Existing comments */}
 {comments.length > 0 ? (
  comments.map((c) => (
    <div key={c._id} className="bg-gray-100 p-3 rounded mb-2 shadow-sm">
     <p className="text-sm text-gray-900">{c.content}</p>
      <p className="text-xs text-gray-500 mt-1">
        {c.creator?.username || "Anonymous"} —{" "}
        {new Date(c.createdAt).toLocaleString()}
      </p>
    </div>
  ))
) : (
  <p className="text-sm text-gray-400">No comments yet.</p>
)}


      </div>
    </div>
  );
}
