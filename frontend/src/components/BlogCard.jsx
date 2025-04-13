import { useState } from "react";

export default function BlogCard({ blog, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog.title);
  const [editedDescription, setEditedDescription] = useState(blog.description);

  const handleSave = () => {
    onUpdate({ ...blog, title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl p-4 border border-gray-200">
      <div className="card-body space-y-3">
        {isEditing ? (
          <>
            <input
              type="text"
              className="input input-bordered w-full"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="textarea textarea-bordered w-full"
              rows="3"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <h2 className="card-title text-xl font-bold">{blog.title}</h2>
            <p>{blog.description.slice(0, 100)}...</p>

            {/* ✅ Show creator username and email */}
            {blog.creator && (
              <p className="text-sm text-gray-500 mt-1">
                ✍️ <strong>{blog.creator.username}</strong> ({blog.creator.email})
              </p>
            )}
          </>
        )}

        <div className="card-actions justify-between mt-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn btn-success btn-sm">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm">Read More</button>
              <button onClick={() => setIsEditing(true)} className="btn btn-warning btn-sm">
                Edit
              </button>
              <button onClick={() => onDelete(blog._id)} className="btn btn-error btn-sm">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
