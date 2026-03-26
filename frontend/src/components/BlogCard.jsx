import { Link } from "react-router-dom";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://picsum.photos/seed/blog/800/600";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}/${imagePath}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

export default function BlogCard({ blog }) {
  // ✅ FIX: Handle Multiple Images structure
  // Use the first image as the cover, or fallback
  const coverImage = blog.images && blog.images.length > 0 ? blog.images[0] : null;
  const imageUrl = getImageUrl(coverImage?.url);
  const altText = coverImage?.alt || blog.title; // SEO: Use Alt text or fallback to Title

  // Cache Buster (Optional, keep if you like)
  const cacheBuster = blog.updatedAt ? `?t=${new Date(blog.updatedAt).getTime()}` : '';
  const finalImageUrl = `${imageUrl}${cacheBuster}`;

  const displayCategory = blog.category
    ? (typeof blog.category === 'string' ? blog.category : blog.category.name)
    : "General";

  return (
    <div className="flex flex-col h-full transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl hover:-translate-y-1 border-base-200 group">
      <figure className="relative h-56 overflow-hidden">
        <img
          src={finalImageUrl}
          alt={altText} // ✅ SEO: Dynamic Alt Tag
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://picsum.photos/seed/error/800/600"; }}
        />
        {displayCategory && (
          <div className="absolute shadow-lg top-4 left-4 badge badge-primary">{displayCategory}</div>
        )}
      </figure>

      <div className="flex flex-col flex-grow p-6 card-body">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          <span>{formatDate(blog.createdAt)}</span>
          <span>5 min read</span>
        </div>

        <h2 className="mb-3 text-xl leading-tight transition-colors card-title group-hover:text-primary">
          {blog.title}
        </h2>

        <p className="flex-grow mb-4 text-sm text-gray-600 line-clamp-3">
          {blog.description || "No description available."}
        </p>

        <div className="items-center justify-between pt-4 mt-auto border-t card-actions border-base-200">
          {blog.creator && (
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="w-8 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs">
                    {typeof blog.creator === 'string' ? blog.creator.charAt(0).toUpperCase() : (blog.creator.username?.charAt(0).toUpperCase() || 'U')}
                  </span>
                </div>
              </div>
              <div className="text-xs">
                <p className="font-bold leading-none text-base-content">
                  {typeof blog.creator === 'string' ? blog.creator : (blog.creator.username || 'Unknown')}
                </p>
                <p className="text-gray-400 origin-left scale-90">Author</p>
              </div>
            </div>
          )}

          <Link to={`/blog/${blog._id}`} className="px-6 transition-all btn btn-sm btn-primary btn-outline hover:bg-primary hover:text-white hover:border-primary">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}