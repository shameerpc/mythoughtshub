import { useState } from "react";

export default function CreateBlogForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true); // default value

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newBlog = {
      title,
      description,
      is_active: isActive,
    };

    onCreate(newBlog);
    setTitle("");
    setDescription("");
    setIsActive(true); // reset to default
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
          required
        />

        <textarea
          className="textarea textarea-bordered w-full"
          rows="4"
          placeholder="Blog Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="label cursor-pointer">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            className="toggle toggle-primary ml-2"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </label>

        <button type="submit" className="btn btn-primary w-fit self-end">
          Create Blog
        </button>
      </div>
    </form>
  );
}
