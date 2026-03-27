import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogById, updateBlog, deleteBlog } from "../api/blog.api";
import { getCommentsByBlogId, addComment } from "../api/comment.api";
import CreateBlogForm from "../components/CreateBlogForm";

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

  // Data State
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Modal & Interaction State
  const [showEditModal, setShowEditModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  // --- DATA FETCHING ---
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
  }, [id, navigate]); 

  // --- SCROLL LOGIC ---
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTION HANDLERS ---
  const handleUpdate = async (payload) => {
    if (!token) throw new Error("Please login to edit.");
    
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);

    if (payload.image && !payload.image.startsWith("http")) {
      const res = await fetch(payload.image);
      const blob = await res.blob();
      formData.append("image", blob, "cover.jpg");
    }

    await updateBlog(id, formData);
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

  // --- IMAGE GALLERY LOGIC ---
  // Normalize images: Ensure we always have an array.
  // If backend sends 'images' array, use it. If only 'image' string exists, wrap it.
  const galleryImages = React.useMemo(() => {
    if (blog?.images && blog.images.length > 0) {
      return blog.images;
    }
    if (blog?.image) {
      return [{ url: blog.image, alt: blog.title }];
    }
    return [{ url: null, alt: "Placeholder" }];
  }, [blog]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-400">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium tracking-wide animate-pulse">Loading Story...</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* --- 1. READING PROGRESS BAR --- */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[70] bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          style={{ width: `${scrollProgress}%` }} 
        ></div>
      </div>

      {/* --- 2. FLOATING GLASS NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-100" 
          : "bg-transparent py-6"
      }`}>
        <div className="flex items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className={`flex items-center gap-2 font-bold text-sm tracking-wide transition-all duration-300 ${
              scrolled ? "text-gray-800 hover:text-indigo-600" : "text-white hover:text-gray-200 drop-shadow-lg"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          
          {token && (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEditModal(true)} 
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  scrolled 
                    ? "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600" 
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/20"
                }`}
              >
                Edit
              </button>
              <button 
                onClick={handleDelete} 
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  scrolled ? "text-red-500 hover:bg-red-50" : "text-red-200 hover:bg-red-500/20"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- 3. HERO GALLERY SECTION --- */}
      <div className="relative w-full bg-gray-900">
        
        {/* Main Image Display */}
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden group">
          
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

          {/* Image Slider Track */}
          <div className="w-full h-full relative">
             {galleryImages.map((img, idx) => (
               <div 
                 key={idx}
                 className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                   idx === activeImageIndex ? 'opacity-100 z-0' : 'opacity-0'
                 }`}
               >
                 <img 
                   src={getImageUrl(img.url)} 
                   alt={img.alt || blog.title} 
                   className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
                 />
               </div>
             ))}
          </div>

          {/* Gallery Controls (Arrows) - Only show if multiple images */}
          {galleryImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {/* Hero Content Text */}
          <div className="absolute bottom-0 left-0 w-full px-6 pb-16 pt-32 text-white z-20 bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="max-w-5xl mx-auto animate-fade-in-up">
              <div className="flex flex-wrap gap-3 mb-6">
                 <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40">
                   {blog.category?.name || "Article"}
                 </span>
                 {blog.tags && blog.tags.slice(0, 3).map((tag, i) => (
                   <span key={i} className="px-3 py-1 text-xs font-semibold bg-white/10 backdrop-blur-md rounded-full border border-white/10">#{tag}</span>
                 ))}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-gray-200">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.creator?.username || 'User'}`} alt="Author" className="w-full h-full object-cover" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white font-bold text-base">{blog.creator?.username || "Unknown"}</span>
                      <span className="text-xs text-gray-400 font-normal uppercase tracking-wider">Author</span>
                   </div>
                </div>
                <span className="hidden md:inline w-px h-4 bg-gray-500"></span>
                <span className="hidden md:inline">{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip (Only if multiple images) */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 pointer-events-none">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- 4. CONTENT SECTION --- */}
      <div className="relative z-10 bg-white -mt-10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl px-6 mx-auto mt-16 md:px-0 pb-24">
          
          {/* Article Body */}
          <article ref={contentRef} className="animate-fade-in-up-delayed">
             <div className="prose prose-lg prose-slate prose-headings:font-serif prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-lg mx-auto text-gray-700 leading-relaxed">
                {blog.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-8 text-xl font-light text-gray-700">{para}</p>
                ))}
             </div>
          </article>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center my-24 space-x-4">
             <div className="h-px w-16 bg-gray-200"></div>
             <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">End of Article</span>
             <div className="h-px w-16 bg-gray-200"></div>
          </div>

          {/* --- COMMENTS SECTION --- */}
          <div className="animate-fade-in-up-delayed">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-bold text-gray-900">Discussion</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{comments.length} Comments</span>
            </div>
            
            {/* Comment Input */}
            <div className="p-6 mb-12 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
              {token ? (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full p-5 text-base bg-white border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow resize-none"
                      placeholder="Write something thoughtful..." 
                      rows="3"
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddComment} 
                      disabled={!commentText.trim()} 
                      className="px-8 py-3 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center border-2 border-dashed rounded-3xl border-gray-200 bg-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900">Join the conversation</p>
                  <p className="mt-2 text-sm text-gray-500">Please <Link to="/login" className="font-bold text-indigo-600 hover:underline">login</Link> to share your thoughts.</p>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-3xl">
                  <p className="text-gray-400 italic">No comments yet. Be the first to start a discussion!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-4 animate-fade-in">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden ring-2 ring-white shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.creator?.username || 'User'}`} alt="User" className="w-full h-full" />
                      </div>
                    </div>
                    <div className="flex-grow bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{c.creator?.username || "Anonymous"}</h4>
                        <span className="text-xs text-gray-400 font-medium">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
           <div 
             className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto transition-opacity opacity-0 animate-fade-in"
             onClick={() => setShowEditModal(false)}
           ></div>
           
           <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto transform transition-all scale-95 animate-scale-up">
              <CreateBlogForm 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialData={blog} 
                onSubmit={handleUpdate}
              />
           </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up-delayed { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* 20s slow zoom for the hero background */
        .animate-slow-zoom { animation: slowZoom 20s linear infinite alternate; }
      `}</style>
    </div>
  );
}