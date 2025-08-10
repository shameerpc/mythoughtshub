import { useState } from "react";

export default function CreateBlogForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null); // store selected image

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_active", isActive);
    if (image) formData.append("image", image);

    onCreate(formData);

    // Reset fields
    setTitle("");
    setDescription("");
    setIsActive(true);
    setImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-200 shadow-md p-4 border border-gray-300 mb-6"
      encType="multipart/form-data"
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

        {/* Image Upload */}
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Preview Image */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

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
