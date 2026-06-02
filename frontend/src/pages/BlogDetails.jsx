import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, HelpCircle, ThumbsUp, Send, User, ChevronRight, MessageCircle } from "lucide-react";
import { getBlogById, likeBlogApi } from "../api/blog.api";
import { getCommentsByBlogId, addComment } from "../api/comment.api";
import { getQuestionsApi, askQuestionApi, answerQuestionApi, upvoteAnswerApi } from "../api/qna.api";

// --- Helpers ---
const getImageUrl = (imagePath, seed = "blog") => {
  if (!imagePath) return `https://picsum.photos/seed/${seed}/800/600`;
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
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

  // User State
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
  const currentUserId = currentUser._id || currentUser.id;

  // Data State
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Likes State
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Interaction Tabs
  const [activeTab, setActiveTab] = useState("discussion"); // "discussion" or "qna"

  // Comment Form State
  const [commentText, setCommentText] = useState("");

  // Question Form State
  const [questionText, setQuestionText] = useState("");
  const [questionUserName, setQuestionUserName] = useState("");

  // Answer Form State
  const [answerTexts, setAnswerTexts] = useState({}); // questionId -> string
  const [answerUserNames, setAnswerUserNames] = useState({}); // questionId -> string
  const [expandedAnswerForm, setExpandedAnswerForm] = useState({}); // questionId -> boolean

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const blogRes = await getBlogById(id);
      const blogData = blogRes.response || blogRes;

      setBlog(blogData);
      setLikes(blogData.likes || 0);

      // Check if current user or IP has liked the post
      if (currentUserId && blogData.likedBy) {
        setHasLiked(blogData.likedBy.includes(currentUserId));
      } else {
        // Guest likes checked via backend on post trigger, default state false on load
        setHasLiked(false);
      }

      document.title = `${blogData.title} - My Thoughts Hub`;
    } catch (err) {
      console.error("Error fetching blog:", err);
      navigate("/");
      return;
    }

    try {
      const [commentRes, qnaRes] = await Promise.all([
        getCommentsByBlogId(id),
        getQuestionsApi(id),
      ]);
      setComments(commentRes.comments || []);
      setQuestions(qnaRes.response || []);
    } catch (err) {
      console.error("Error fetching Q&A/Comments:", err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate, currentUserId]);

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- LIKE HANDLER ---
  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await likeBlogApi(id);
      setLikes(res.likes);
      setHasLiked(res.hasLiked);
    } catch (err) {
      console.error("Like Error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

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

  // --- QUESTION HANDLERS ---
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    try {
      const res = await askQuestionApi(id, {
        body: questionText,
        userName: token ? undefined : (questionUserName || "Guest"),
      });
      setQuestions((prev) => [res.result, ...prev]);
      setQuestionText("");
      setQuestionUserName("");
    } catch (err) {
      console.error("Ask question error:", err);
      alert("Failed to submit question.");
    }
  };

  const handleAnswerQuestion = async (e, questionId) => {
    e.preventDefault();
    const body = answerTexts[questionId];
    const userName = answerUserNames[questionId];
    if (!body || !body.trim()) return;

    try {
      const res = await answerQuestionApi(questionId, {
        body,
        userName: token ? undefined : (userName || "Guest"),
      });

      setQuestions((prev) =>
        prev.map((q) => {
          if (q._id === questionId) {
            return { ...q, answers: [...(q.answers || []), res.result] };
          }
          return q;
        })
      );

      // Reset inputs
      setAnswerTexts((prev) => ({ ...prev, [questionId]: "" }));
      setAnswerUserNames((prev) => ({ ...prev, [questionId]: "" }));
      setExpandedAnswerForm((prev) => ({ ...prev, [questionId]: false }));
    } catch (err) {
      console.error("Answer question error:", err);
      alert("Failed to post answer.");
    }
  };

  const handleUpvoteAnswer = async (questionId, answerId) => {
    try {
      const res = await upvoteAnswerApi(questionId, answerId);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q._id === questionId) {
            const updatedAnswers = q.answers.map((a) => {
              if (a._id === answerId) {
                return { ...a, upvotes: res.upvotes };
              }
              return a;
            });
            return { ...q, answers: updatedAnswers };
          }
          return q;
        })
      );
    } catch (err) {
      console.error("Upvote answer error:", err);
    }
  };

  // --- IMAGE GALLERY LOGIC ---
  const galleryImages = useMemo(() => {
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
    e.preventDefault();
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
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 bg-slate-50">
        <div className="w-12 h-12 mb-4 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium tracking-wide animate-pulse">Loading Story...</p>
      </div>
    );
  }

  if (!blog) return null;

  const creatorName = blog.creator?.username || blog.creator?.name || blog.creator?.email || "Unknown Author";

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[70] bg-slate-100">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          style={{ width: `${scrollProgress}%` }} 
        ></div>
      </div>

      {/* Floating Back Navigation Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100" 
          : "bg-transparent py-6"
      }`}>
        <div className="flex items-center justify-between px-6 mx-auto lg:px-12 max-w-[1600px]">
          <button 
            onClick={() => navigate(-1)} 
            className={`flex items-center gap-2 font-bold text-sm tracking-wide transition-all duration-300 ${
              scrolled ? "text-slate-800 hover:text-indigo-600" : "text-white hover:text-slate-200 drop-shadow-md"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </nav>

      {/* Hero Image / Content Gallery Header */}
      <div className="relative w-full bg-slate-950">
        <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden group">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Large Hero Carousel */}
          <div className="relative z-0 w-full h-full">
            {galleryImages.map((img, idx) => (
              <div 
                key={img._id || idx} 
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === activeImageIndex ? 'opacity-100 z-20' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={getImageUrl(img.url, blog._id || encodeURIComponent(blog.title) || "blog")} 
                  alt={img.alt || blog.title} 
                  className="object-cover w-full h-full transform scale-105 animate-slow-zoom"
                  onError={(e) => { 
                    e.target.src = `https://picsum.photos/seed/${blog._id || encodeURIComponent(blog.title) || "error"}/800/600`; 
                  }}
                />
              </div>
            ))}
          </div>

          {galleryImages.length > 1 && (
            <>
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

          {/* Title and metadata Overlay */}
          <div className="absolute bottom-0 left-0 z-20 w-full px-6 pt-32 pb-16 text-white">
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40">
                  {blog.category?.name || "Article"}
                </span>
                {blog.tags && blog.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-semibold border rounded-full bg-white/10 backdrop-blur-md border-white/10">#{tag}</span>
                ))}
                
                {/* Micro Like Indicator */}
                <span className="flex items-center gap-1 ml-auto text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  <Heart size={12} fill="currentColor" /> {likes} Likes
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight mb-6 tracking-tight drop-shadow-2xl">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-200 md:text-base">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 p-[2px]">
                    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-slate-900 rounded-full">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${creatorName}`} alt="Author" className="object-cover w-full h-full" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white leading-tight">{creatorName}</span>
                    <span className="text-[10px] font-normal tracking-wider text-slate-400 uppercase">Author</span>
                  </div>
                </div>
                <span className="hidden w-px h-4 bg-slate-500 md:inline"></span>
                <span className="hidden md:inline">{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="absolute left-0 right-0 z-30 flex justify-center gap-2 pointer-events-none bottom-4">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout Container */}
      <div className="relative z-10 bg-white -mt-8 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-slate-100/50">
        <div className="max-w-4xl px-4 md:px-8 py-16 mx-auto">
          
          {/* Article Description Block */}
          <article className="animate-fade-in-up-delayed max-w-3xl mx-auto">
            <div className="prose prose-lg text-slate-700 leading-relaxed font-normal text-lg max-w-none">
              {blog.description && blog.description.split('\n').map((para, i) => (
                <p key={i} className="mb-6 leading-relaxed first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-indigo-600 first-letter:float-left first-letter:mr-2 first-letter:h-8">{para}</p>
              ))}
            </div>

            {/* Dynamic Likable heart system */}
            <div className="flex flex-col items-center justify-center py-10 mt-16 border border-slate-100 rounded-3xl bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-500 mb-3">Enjoyed this article? Give it a like!</p>
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  hasLiked
                    ? "bg-rose-500 text-white border-rose-600 shadow-rose-200"
                    : "bg-white text-slate-700 border-slate-200 hover:border-rose-200 hover:text-rose-600 shadow-slate-100"
                }`}
              >
                <Heart
                  size={18}
                  fill={hasLiked ? "currentColor" : "none"}
                  className={`transition-transform duration-300 ${hasLiked ? "animate-pulse" : "group-hover:scale-120"}`}
                />
                <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
              </button>
            </div>
          </article>

          <div className="flex items-center justify-center my-16 space-x-4">
            <div className="w-12 h-px bg-slate-200"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Discussion & QnA</span>
            <div className="w-12 h-px bg-slate-200"></div>
          </div>

          {/* Interactive Navigation Tabs for Discussion / Q&A */}
          <div className="flex border-b border-slate-100 mb-8 gap-6">
            <button
              onClick={() => setActiveTab("discussion")}
              className={`flex items-center gap-2 pb-4 text-lg font-serif font-bold transition-all border-b-2 ${
                activeTab === "discussion"
                  ? "border-indigo-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <MessageCircle size={18} />
              <span>Discussion ({comments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("qna")}
              className={`flex items-center gap-2 pb-4 text-lg font-serif font-bold transition-all border-b-2 ${
                activeTab === "qna"
                  ? "border-indigo-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <HelpCircle size={18} />
              <span>Q&A ({questions.length})</span>
            </button>
          </div>

          {/* TAB CONTENT: DISCUSSION */}
          {activeTab === "discussion" && (
            <div className="space-y-8 animate-fade-in">
              <div className="p-6 border border-slate-100 shadow-inner bg-slate-50/50 rounded-3xl">
                {token ? (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-5 text-sm transition-all bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Write something thoughtful..." 
                      rows="3"
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddComment} 
                        disabled={!commentText.trim()} 
                        className="px-6 py-2.5 font-bold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 rounded-xl"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-white border-2 border-slate-200 border-dashed rounded-3xl">
                    <div className="inline-flex items-center justify-center w-10 h-10 mb-3 bg-slate-50 text-slate-400 rounded-full">
                      <User size={18} />
                    </div>
                    <p className="text-md font-bold text-slate-800">Join the discussion</p>
                    <p className="mt-1 text-xs text-slate-500">Please <Link to="/login" className="font-bold text-indigo-600 hover:underline">login</Link> to share your thoughts.</p>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {comments.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <p className="italic text-slate-400 text-sm">No comments yet. Be the first to start the discussion!</p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c._id} className="flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 overflow-hidden bg-slate-200 rounded-full shadow-sm ring-2 ring-white">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.creator?.username || c.creator?.name || c.creator?.email || 'User'}`} alt="User" className="w-full h-full" />
                        </div>
                      </div>
                      <div className="flex-grow p-5 transition-shadow duration-300 bg-white border border-slate-100 shadow-sm rounded-2xl hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm text-slate-900">{c.creator?.username || c.creator?.name || "Anonymous"}</h4>
                          <span className="text-[10px] font-medium text-slate-400">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: Q&A */}
          {activeTab === "qna" && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Question Box Form */}
              <form onSubmit={handleAskQuestion} className="p-6 border border-slate-100 bg-slate-50/50 rounded-3xl space-y-4">
                <h4 className="text-md font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-indigo-600" />
                  Have a question about this article?
                </h4>
                <textarea
                  className="w-full p-5 text-sm transition-all bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ask anything..."
                  rows="3"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
                
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {!token ? (
                    <input
                      type="text"
                      placeholder="Your Name (Guest)"
                      className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 bg-white"
                      value={questionUserName}
                      onChange={(e) => setQuestionUserName(e.target.value)}
                      required
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <User size={14} /> Asking as <span className="text-indigo-600">{currentUser.username}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={!questionText.trim()}
                    className="flex items-center gap-1.5 px-6 py-2.5 font-bold text-white transition-all bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100 rounded-xl text-sm ml-auto"
                  >
                    <Send size={14} />
                    Submit Question
                  </button>
                </div>
              </form>

              {/* Questions List */}
              <div className="space-y-8">
                {questions.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <p className="italic text-slate-400 text-sm">No questions asked yet. Be the first to ask!</p>
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q._id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                      
                      {/* The Question Card */}
                      <div className="flex gap-4 items-start mb-6">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 overflow-hidden bg-purple-50 text-purple-700 rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-sm">
                            {(q.userName || "G").charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-900 text-sm">{q.userName}</h4>
                            <span className="text-[10px] font-medium text-slate-400">{formatDate(q.createdAt)}</span>
                          </div>
                          <p className="text-slate-800 text-base font-semibold leading-snug">{q.body}</p>
                          
                          <button
                            onClick={() => setExpandedAnswerForm(prev => ({ ...prev, [q._id]: !prev[q._id] }))}
                            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                          >
                            Reply / Answer <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Answers List */}
                      {q.answers && q.answers.length > 0 && (
                        <div className="ml-10 pl-6 border-l-2 border-slate-100 space-y-4">
                          {q.answers.map((ans) => (
                            <div key={ans._id} className="flex gap-3 items-start bg-slate-50/40 p-4 rounded-2xl border border-slate-100/50">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 overflow-hidden bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-semibold text-xs shadow-sm">
                                  {(ans.userName || "G").charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-bold text-xs text-slate-800">{ans.userName}</h5>
                                  <span className="text-[9px] font-medium text-slate-400">{formatDate(ans.createdAt)}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{ans.body}</p>
                                
                                {/* Upvote Answer button */}
                                <div className="mt-2.5 flex items-center gap-3">
                                  <button
                                    onClick={() => handleUpvoteAnswer(q._id, ans._id)}
                                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 border rounded-lg transition-all ${
                                      ans.upvotedUsers?.includes(currentUserId || "guest-ip")
                                        ? "bg-emerald-500 text-white border-emerald-600"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-emerald-200 hover:text-emerald-600"
                                    }`}
                                  >
                                    <ThumbsUp size={10} fill="currentColor" />
                                    <span>{ans.upvotes || 0} Upvotes</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer Input Form (collapsible) */}
                      {expandedAnswerForm[q._id] && (
                        <form onSubmit={(e) => handleAnswerQuestion(e, q._id)} className="ml-10 mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3">
                          <textarea
                            className="w-full p-4 text-xs transition-all bg-white border border-slate-200 focus:border-indigo-500 rounded-xl resize-none focus:outline-none"
                            placeholder="Write your answer..."
                            rows="2"
                            value={answerTexts[q._id] || ""}
                            onChange={(e) => setAnswerTexts(prev => ({ ...prev, [q._id]: e.target.value }))}
                            required
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {!token && (
                              <input
                                type="text"
                                placeholder="Your Name (Guest)"
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 bg-white"
                                value={answerUserNames[q._id] || ""}
                                onChange={(e) => setAnswerUserNames(prev => ({ ...prev, [q._id]: e.target.value }))}
                                required
                              />
                            )}
                            <button
                              type="submit"
                              disabled={!(answerTexts[q._id] || "").trim()}
                              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-xs ml-auto flex items-center gap-1"
                            >
                              Post Answer
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Styled Animations */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up-delayed { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slow-zoom { animation: slowZoom 25s linear infinite alternate; }
      `}</style>
    </div>
  );
}
