import { useState } from "react";

export default function CreateBlogForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newBlog = {
      _id: Date.now().toString(), // Just for example — use backend-generated ID in real use
      title,
      description,
    };

    onCreate(newBlog);
    setTitle("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-200 shadow-md p-4 border border-gray-300 mb-6"
    >
      <div className="card-body space-y-4">
        <h2 className="text-lg font-semibold">Create New Blog</h2>

        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea textarea-bordered w-full"
          rows="4"
          placeholder="Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-fit self-end">
          Create Blog
        </button>
      </div>
    </form>
  );
}
