import React, { useEffect, useState, useCallback, useRef } from "react";
import BlogCard from "../components/BlogCard";
import { fetchBlogs } from "../api/home.api"; 

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Create a ref for searchTerm to allow useCallback to access the latest value
  // without causing the function to be recreated on every keystroke.
  const searchRef = useRef(searchTerm);

  // Keep the ref in sync with state
  useEffect(() => {
    searchRef.current = searchTerm;
  }, [searchTerm]);

  // --- WRAPPED IN USECALLBACK ---
  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { 
        page: currentPage, 
        limit: 6, 
        search: searchRef.current, // Use ref value here
        sort: sortBy,
        _: Date.now() 
      };
      
      const res = await fetchBlogs(params);
      console.log("API Response:", res); 

      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res?.response && Array.isArray(res.response)) {
        data = res.response;
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data;
      }

      setBlogs(data);
      
      if (res?.pagination) {
        setTotalPages(res.pagination.totalPages);
      } else {
        setTotalPages(data.length > 0 ? 1 : 1); 
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      setError("Failed to load articles.");
      setBlogs([]); 
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy]); // Dependencies: Page and Sort. Search is handled via Ref.

  // --- USE EFFECT ---
  useEffect(() => {
    loadBlogs(); 
    window.scrollTo(0, 0);
  }, [currentPage, sortBy, loadBlogs]); // FIX: Added loadBlogs to dependencies

  // --- HANDLERS ---

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // We call loadBlogs manually here because useEffect won't trigger 
    // on searchTerm change (due to the Ref optimization).
    loadBlogs(); 
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    // Small timeout to allow state update to flush to ref
    setTimeout(loadBlogs, 0); 
  };

  // --- RENDER ---

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center min-h-screen pt-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-24">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="text-center md:text-left">
            <h1 className="mb-2 text-5xl font-extrabold tracking-tight text-primary">Latest Articles</h1>
            <p className="text-gray-500">Discover stories, thinking, and expertise.</p>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border shadow-sm md:flex-row rounded-xl border-base-200">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full form-control md:w-2/3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full pr-16 input input-bordered input-primary focus:outline-none" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute top-0 right-0 rounded-l-none btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="w-full form-control md:w-1/3">
              <label className="label">
                <span className="font-semibold text-gray-600 label-text">Sort By:</span>
              </label>
              <select className="w-full select select-bordered select-sm" value={sortBy} onChange={handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="trending">Trending (Most Viewed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div role="alert" className="mb-8 alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {blogs.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white shadow-sm rounded-2xl">
            <p className="text-xl font-semibold">
              {searchTerm ? "No articles found matching your search." : "No articles found."}
            </p>
            {searchTerm && (
              <button className="mt-4 btn btn-outline btn-sm" onClick={handleClearSearch}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button 
                    className="join-item btn btn-outline" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >«</button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`join-item btn btn-outline ${
                        currentPage === pageNum 
                        ? 'btn-active bg-primary text-white border-primary' 
                        : ''
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    className="join-item btn btn-outline" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >»</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;