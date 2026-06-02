import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogById } from "../api/blog.api";
import { getCommentsByBlogId, addComment } from "../api/comment.api";

// --- Helpers ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://picsum.photos/seed/blog/800/600";
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  // Log the generated URL to console to verify it's correct
  const fullUrl = imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
  // console.log("Image URL:", fullUrl); // Uncomment to debug images
  return fullUrl;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Data State
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Interaction State
  const [commentText, setCommentText] = useState("");

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const blogRes = await getBlogById(id);
      const blogData = blogRes.response || blogRes; 
      
      // 🔍 DEBUG: Check your browser console (F12) right here
      console.log("Frontend Received Blog Data:", blogData);
      
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
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial trigger
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- COMMENT HANDLER ---
  const handleAddComment = async () => {
    if (!token) return alert("Login required to comment.");
    if (!commentText.trim()) return;
    try {
      const res = await addComment(id, commentText);
      setComments([...comments, res.comment || res.newComment]);
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  // --- IMAGE GALLERY LOGIC ---
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
    e.preventDefault(); // Prevent default touch behavior
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 bg-gray-50">
        <div className="w-12 h-12 mb-4 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium tracking-wide animate-pulse">Loading Story...</p>
      </div>
    );
  }

  if (!blog) return null;

  // ✅ FIX: Robust fallback for Username. Checks username, then name, then email.
  const creatorName = blog.creator?.username || blog.creator?.name || blog.creator?.email || "Unknown Author";

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* --- 1. READING PROGRESS BAR --- */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[70] bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          style={{ width: `${scrollProgress}%` }} 
        ></div>
      </div>

      {/* --- 2. NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-100" 
          : "bg-transparent py-6"
      }`}>
        <div className="flex items-center justify-between px-6 mx-auto lg:px-12 max-w-7xl">
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
        </div>
      </nav>

      {/* --- 3. HERO GALLERY SECTION --- */}
      <div className="relative w-full bg-gray-900">
        
        {/* Main Image Display */}
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden group">
          
          {/* Background Gradient Overlay - z-10 */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Image Slider Track - z-0 relative */}
          <div className="relative z-0 w-full h-full">
             {galleryImages.map((img, idx) => (
               <div 
                 // ✅ FIX: Use _id as key if available to prevent React bugs
                 key={img._id || idx} 
                 className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                   // ✅ FIX: Ensure active image has higher Z-Index than inactive ones
                   idx === activeImageIndex ? 'opacity-100 z-20' : 'opacity-0 z-0'
                 }`}
               >
                 <img 
                   src={getImageUrl(img.url)} 
                   alt={img.alt || blog.title} 
                   className="object-cover w-full h-full transform scale-105 animate-slow-zoom"
                   // Add fallback if image fails to load
                   onError={(e) => { e.target.src = "https://picsum.photos/seed/error/800/600"; }}
                 />
               </div>
             ))}
          </div>

          {/* Gallery Controls */}
          {galleryImages.length > 1 && (
            <>
              {/* ✅ FIX: Buttons always visible on mobile, hover on desktop */}
              <button 
                onClick={handlePrevImage}
                className="absolute z-30 p-3 text-white transition-all duration-300 -translate-y-1/2 border rounded-full opacity-100 md:opacity-0 left-4 top-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md border-white/20 md:group-hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute z-30 p-3 text-white transition-all duration-300 -translate-y-1/2 border rounded-full opacity-100 md:opacity-0 right-4 top-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md border-white/20 md:group-hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {/* Hero Content Text - z-20 to sit above images but below controls (z-30) */}
          <div className="absolute bottom-0 left-0 z-20 w-full px-6 pt-32 pb-16 text-white bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="max-w-5xl mx-auto animate-fade-in-up">
              <div className="flex flex-wrap gap-3 mb-6">
                 <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40">
                   {blog.category?.name || "Article"}
                 </span>
                 {blog.tags && blog.tags.slice(0, 3).map((tag, i) => (
                   <span key={i} className="px-3 py-1 text-xs font-semibold border rounded-full bg-white/10 backdrop-blur-md border-white/10">#{tag}</span>
                 ))}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-200 md:text-base">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 p-[2px]">
                      <div className="flex items-center justify-center w-full h-full overflow-hidden bg-gray-800 rounded-full">
                         {/* ✅ FIX: Use the robust creatorName variable */}
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${creatorName}`} alt="Author" className="object-cover w-full h-full" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      {/* ✅ FIX: Use the robust creatorName variable */}
                      <span className="text-base font-bold text-white">{creatorName}</span>
                      <span className="text-xs font-normal tracking-wider text-gray-400 uppercase">Author</span>
                   </div>
                </div>
                <span className="hidden w-px h-4 bg-gray-500 md:inline"></span>
                <span className="hidden md:inline">{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {galleryImages.length > 1 && (
          <div className="absolute left-0 right-0 z-30 flex justify-center gap-2 pointer-events-none bottom-4">
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
        <div className="max-w-3xl px-6 pb-24 mx-auto mt-16 md:px-0">
          
          <article className="animate-fade-in-up-delayed">
             <div className="mx-auto leading-relaxed prose prose-lg text-gray-700 prose-slate prose-headings:font-serif prose-a:text-indigo-600 prose-img:rounded-xl prose-img:shadow-lg">
                {blog.description && blog.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-8 text-xl font-light text-gray-700">{para}</p>
                ))}
             </div>
          </article>

          <div className="flex items-center justify-center my-24 space-x-4">
             <div className="w-16 h-px bg-gray-200"></div>
             <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">End of Article</span>
             <div className="w-16 h-px bg-gray-200"></div>
          </div>

          {/* --- COMMENTS SECTION --- */}
          <div className="animate-fade-in-up-delayed">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-gray-900">Discussion</h3>
              <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full">{comments.length} Comments</span>
            </div>
            
            <div className="p-6 mb-12 border border-gray-100 shadow-inner bg-gray-50 rounded-3xl">
              {token ? (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full p-5 text-base transition-shadow bg-white border-0 shadow-sm resize-none rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                      className="px-8 py-3 font-bold text-white transition-all duration-300 bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center bg-white border-2 border-gray-200 border-dashed rounded-3xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </div>
                  <p className="text-lg font-medium text-gray-900">Join the conversation</p>
                  <p className="mt-2 text-sm text-gray-500">Please <Link to="/login" className="font-bold text-indigo-600 hover:underline">login</Link> to share your thoughts.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-3xl">
                  <p className="italic text-gray-400">No comments yet. Be the first to start a discussion!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-4 animate-fade-in">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 overflow-hidden bg-indigo-100 rounded-full shadow-sm ring-2 ring-white">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.creator?.username || c.creator?.name || c.creator?.email || 'User'}`} alt="User" className="w-full h-full" />
                      </div>
                    </div>
                    <div className="flex-grow p-6 transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-md">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{c.creator?.username || c.creator?.name || "Anonymous"}</h4>
                        <span className="text-xs font-medium text-gray-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="leading-relaxed text-gray-600 whitespace-pre-wrap">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up-delayed { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slow-zoom { animation: slowZoom 20s linear infinite alternate; }
      `}</style>
    </div>
  );
}
