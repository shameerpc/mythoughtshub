import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();

  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl hover:shadow-2xl transition duration-300">
      {blog.image && (
        <img
          src={`http://localhost:5000/${blog.image}`}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      )}
      <div className="card-body">
        <h2 className="card-title text-2xl font-semibold">{blog.title}</h2>
        <p className="text-gray-600 mb-2">{blog.description.slice(0, 120)}...</p>
        {blog.creator && (
          <p className="text-sm text-gray-500">
            ✍️ <strong>{blog.creator.username}</strong> ({blog.creator.email})
          </p>
        )}
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}
