import { Link } from "react-router-dom";

// Helper to get the correct image URL (Development vs Production)
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://picsum.photos/seed/blog/800/600"; // Fallback image
  // If the path starts with http, use it as is. Otherwise prepend backend URL.
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function BlogCard({ blog }) {
  const imageUrl = getImageUrl(blog.image);
  
  return (
    <div className="flex flex-col h-full transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl hover:-translate-y-1 border-base-200 group">
      
      {/* Image Section */}
      <figure className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={blog.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* Optional Category Badge overlay */}
        {blog.category && (
          <div className="absolute shadow-lg top-4 left-4 badge badge-primary">
            {blog.category}
          </div>
        )}
      </figure>

      <div className="flex flex-col flex-grow p-6 card-body">
        
        {/* Meta Data: Date & Read Time (Mock) */}
        <div className="flex items-center justify-between mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          <span>{formatDate(blog.createdAt)}</span>
          <span>5 min read</span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl leading-tight transition-colors card-title group-hover:text-primary">
          {blog.title}
        </h2>

        {/* Description (Truncated) */}
        <p className="flex-grow mb-4 text-sm text-gray-600 line-clamp-3">
          {blog.description || "No description available for this blog post."}
        </p>

        {/* Footer: Author & Button */}
        <div className="items-center justify-between pt-4 mt-auto border-t card-actions border-base-200">
          
          {/* Author Info */}
          {blog.creator && (
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="w-8 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs">{blog.creator.username?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="text-xs">
                <p className="font-bold leading-none text-base-content">{blog.creator.username}</p>
                <p className="text-gray-400 origin-left scale-90">Author</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link 
            to={`/blog/${blog._id}`} 
            className="px-6 transition-all btn btn-sm btn-primary btn-outline hover:bg-primary hover:text-white hover:border-primary"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}