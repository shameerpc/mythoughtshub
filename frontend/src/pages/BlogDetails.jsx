import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogById, updateBlog, deleteBlog } from "../api/blog.api";
import { getCommentsByBlogId, addComment } from "../api/comment.api";
import CreateBlogForm from "../components/CreateBlogForm"; // Keeping your component name

// --- Helpers ---
const getImageUrl = (path) => {
  if (!path) return "https://picsum.photos/seed/blog/1600/900";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
  return path.startsWith("http") ? path : `${API_URL}/${path}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Comment State
  const [commentText, setCommentText] = useState("");

  // --- CORRECTION 1: WRAP FETCH LOGIC IN USECALLBACK ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const blogRes = await getBlogById(id);
      const blogData = blogRes.response || blogRes; 
      setBlog(blogData);
      document.title = `${blogData.title} - My Blog`;
    } catch (err) {
      console.error("Error fetching blog:", err);
      navigate("/");
      return; 
    }

    try {
      const commentRes = await getCommentsByBlogId(id);
      setComments(commentRes.comments || []); 
    } catch (err) {
      setComments([]); 
    } finally {
      setLoading(false);
    }
  }, [id, navigate]); // Dependencies: if id or navigate changes, recreate the function

  // --- Scroll Listeners ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Data Fetching (Uses extracted function) ---
  useEffect(() => {
    fetchData();
  }, [fetchData]); // FIX: Added fetchData to dependencies. It is now stable due to useCallback.

  // --- CORRECTION 2: REFETCH DATA AFTER UPDATE ---
  const handleUpdate = async (payload) => {
    if (!token) throw new Error("Please login to edit.");
    
    // Prepare FormData
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);

    // Handle Image
    if (payload.image && !payload.image.startsWith("http")) {
      const res = await fetch(payload.image);
      const blob = await res.blob();
      formData.append("image", blob, "cover.jpg");
    }

    await updateBlog(id, formData);
    
    // --- Call fetchData to get the latest image URL and other data ---
    await fetchData();
    
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    if (!token) return alert("Please login to delete.");
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await deleteBlog(id);
      navigate("/");
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  const handleAddComment = async () => {
    if (!token) return alert("Login required to comment.");
    if (!commentText.trim()) return;
    try {
      const res = await addComment(id, commentText);
      setComments([...comments, res.newComment]);
      setCommentText("");
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-base-100 pb-20 font-sans text-gray-800 relative">
      {/* --- READING PROGRESS BAR --- */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-200">
        <div className="h-full bg-primary transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* --- FLOATING NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3 border-base-200" : "bg-transparent py-6 border-transparent"
      }`}>
        <div className="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-2 font-bold transition-colors ${scrolled ? "text-gray-800 hover:text-primary" : "text-white hover:text-gray-200 drop-shadow-md"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Back to Articles</span>
          </button>
          
          {token && (
            <div className="flex gap-2">
              <button onClick={() => setShowEditModal(true)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-transform hover:scale-105 ${scrolled ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"}`}>
                Edit Post
              </button>
              <button onClick={handleDelete} className={`p-2 rounded-full transition-transform hover:scale-110 ${scrolled ? "text-red-500 hover:bg-red-50" : "text-red-200 hover:bg-white/20"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- ANIMATED HERO SECTION --- */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-out transform scale-105 animate-zoom-slow">
          <img src={getImageUrl(blog.image)} alt={blog.title} className="object-cover w-full h-full opacity-90" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-base-100"></div>
        
        <div className="absolute bottom-0 left-0 w-full px-6 pb-16 text-white md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex gap-3 mb-6">
               <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary rounded-full shadow-lg">{blog.category?.name || "Article"}</span>
               {blog.tags && blog.tags.slice(0, 2).map((tag, i) => (
                 <span key={i} className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">#{tag}</span>
               ))}
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl font-serif mb-6 drop-shadow-2xl">{blog.title}</h1>
            <div className="flex items-center gap-4 text-gray-100 text-sm md:text-base">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/50">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.creator?.username || 'User'}`} alt="Author" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-white">{blog.creator?.username || "Unknown"}</span>
                    <span className="text-xs text-gray-300">Author</span>
                 </div>
              </div>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 bg-base-100 -mt-10 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl px-6 mx-auto mt-12 md:px-8">
          {/* READ MODE ONLY */}
          <article ref={contentRef} className="py-10 animate-fade-in-up-delayed">
             <div className="prose prose-lg prose-slate prose-headings:font-serif prose-a:text-primary max-w-none mx-auto text-gray-700">
                {blog.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-6 leading-8 text-lg">{para}</p>
                ))}
             </div>
          </article>

          {/* Divider */}
          <div className="my-20 border-t border-gray-200 relative">
             <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 px-4 text-gray-400 text-sm">End of Article</span>
          </div>

          {/* --- COMMENTS SECTION --- */}
          <div className="mb-20 animate-fade-in-up-delayed">
            <h3 className="mb-8 text-3xl font-bold font-serif">Discussion ({comments.length})</h3>
            
            <div className="p-6 mb-10 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
              {token ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 transition-all border-none rounded-xl textarea textarea-ghost focus:ring-2 focus:ring-primary bg-white shadow-inner"
                    placeholder="Share your thoughts..." rows="3"
                    value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button onClick={handleAddComment} disabled={!commentText.trim()} className="px-8 py-2.5 font-bold text-white rounded-full bg-primary hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                      Post Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 border-2 border-dashed rounded-xl border-gray-300 bg-white">
                  <p className="text-lg font-medium">Join the conversation</p>
                  <p className="mt-2 text-sm">Please <Link to="/login" className="font-bold text-primary hover:underline">login</Link> to comment.</p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {comments.length === 0 ? (
                <p className="py-10 text-center text-gray-400 bg-gray-50 rounded-2xl">No comments yet. Be the first!</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.creator?.username || 'User'}`} alt="User" />
                      </div>
                    </div>
                    <div className="flex-grow bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{c.creator?.username || "Anonymous"}</h4>
                        <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
             onClick={() => setShowEditModal(false)}
           ></div>
           
           {/* Modal Content */}
           <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto">
              <CreateBlogForm 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialData={blog} 
                onSubmit={handleUpdate}
              />
           </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomSlow { from { transform: scale(1); } to { transform: scale(1.05); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-up-delayed { animation: fadeInUp 0.8s ease-out 0.3s forwards; opacity: 0; }
        .animate-fade-in { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-zoom-slow { animation: zoomSlow 10s linear infinite alternate; }
      `}</style>
    </div>
  );
}