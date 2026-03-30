import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, fetchAffiliateProducts } from "../api/home.api";
import { getAllCategories } from "../api/category.api";
import BlogCard from "../components/BlogCard";
import CreateBlogForm from "../components/CreateBlogForm";
import AffiliateCard from "../components/AffiliateCard";

import {
  ShieldCheck, Zap, Award,
  Cpu, Smartphone, Camera, Headphones,
  Gamepad2, Watch, Laptop, Monitor, Bot,
  ChevronRight, X, Sparkles, PenLine, Loader2
} from "lucide-react";

// ─── Category Icon Mapping ────────────────────────────────────────────────────
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile")) return <Smartphone className="w-8 h-8" />;
  if (n.includes("laptop") || n.includes("computer")) return <Laptop className="w-8 h-8" />;
  if (n.includes("camera")) return <Camera className="w-8 h-8" />;
  if (n.includes("audio") || n.includes("sound") || n.includes("headphone")) return <Headphones className="w-8 h-8" />;
  if (n.includes("gaming")) return <Gamepad2 className="w-8 h-8" />;
  if (n.includes("watch")) return <Watch className="w-8 h-8" />;
  if (n.includes("monitor") || n.includes("tv")) return <Monitor className="w-8 h-8" />;
  return <Cpu className="w-8 h-8" />;
};

// ─── AI Blog Creator Modal (Local Logic) ────────────────────────────────────────
const AiBlogCreatorModal = ({ isOpen, onClose, onUse }) => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("informative");
  const [type, setType] = useState("review");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);

  const tones = ["informative", "casual", "professional", "enthusiastic"];
  const types = ["review", "comparison", "buying guide", "how-to", "news"];

  // ─── LOCAL GENERATION LOGIC (NO API) ─────────────────────────────────────
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setDraft(null);
    setError(null);

    // Simulate "Thinking" time
    setTimeout(() => {
      // Smart Category Detection for Tags
      let detectedCat = "Tech";
      const tLower = topic.toLowerCase();
      if (tLower.includes("laptop")) detectedCat = "Laptops";
      else if (tLower.includes("phone") || tLower.includes("mobile")) detectedCat = "Smartphones";
      else if (tLower.includes("watch")) detectedCat = "Wearables";
      else if (tLower.includes("camera")) detectedCat = "Photography";
      else if (tLower.includes("game")) detectedCat = "Gaming";

      // Template Generation
      const generatedTitle = type === 'review' 
        ? `In-Depth Review: ${topic} - Is It Worth It?`
        : `${topic}: The Complete ${type.charAt(0).toUpperCase() + type.slice(1)} Guide`;

      const generatedContent = `## Introduction
In this article, we explore everything about the ${topic}. 
[INSERT PERSONAL HOOK: Why did you choose this topic? What makes it relevant right now?]

## Key Overview
 ${type === 'review' ? `
**Design & Build**
[DESCRIBE LOOKS: Materials, weight, colors]

**Performance**
[DESCRIBE SPEED: Benchmarks, real-world usage, lag]

**Features**
- Feature 1: [Details]
- Feature 2: [Details]
` : `
**What is it?**
[EXPLAIN THE CONCEPT SIMPLY]

**Why does it matter?**
[EXPLAIN THE BENEFIT TO THE USER]
`}

## The Good (Pros)
- [List 2-3 specific pros based on your research]

## The Bad (Cons)
- [List 1-2 specific downsides]

## Verdict
[INSERT FINAL OPINION: Who is this for? Is it worth the price?]

## Conclusion
The ${topic} is a solid choice for ${detectedCat} enthusiasts looking for [key benefit].
`;

      setDraft({
        title: generatedTitle,
        content: generatedContent,
        tags: [detectedCat, type, "2024", "Guide", "Review"]
      });
      setLoading(false);
    }, 1200);
  };

  const handleUseDraft = () => {
    if (draft) {
      onUse(draft);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Smart Blog Creator</h2>
              <p className="text-xs text-slate-400">Generate a structure for free</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-300">Blog Topic *</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Best budget gaming laptops under 50000"
                className="w-full px-4 py-3 text-white placeholder-slate-500 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-300">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 text-white bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors capitalize"
                >
                  {tones.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-300">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 text-white bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors capitalize"
                >
                  {types.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 font-bold text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Generating Structure...</>
              ) : (
                <><Sparkles size={18} /> Generate Draft Structure</>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 text-red-300 border border-red-500/30 rounded-xl bg-red-500/10">
              {error}
            </div>
          )}

          {draft && (
            <div className="space-y-4">
              <div className="h-px bg-slate-700"></div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PenLine size={16} className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">Generated Draft</span>
                </div>
                <div className="p-4 mb-3 bg-slate-800 border border-slate-700 rounded-xl">
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">Title</p>
                  <p className="text-white font-bold text-lg">{draft.title}</p>
                </div>
                <div className="p-4 mb-3 bg-slate-800 border border-slate-700 rounded-xl max-h-64 overflow-y-auto">
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Content Preview</p>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {draft.content}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {draft.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleUseDraft}
                  className="w-full py-3 font-bold text-white transition-all rounded-xl bg-green-600 hover:bg-green-500 flex items-center justify-center gap-2"
                >
                  <PenLine size={18} /> Use This Structure
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const [blogs, setBlogs]           = useState([]);
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [showCreateModal, setShowCreateModal]     = useState(false);
  const [showAiBlogModal, setShowAiBlogModal]     = useState(false);
  const [aiBlogDraft, setAiBlogDraft]             = useState(null);

  const token = localStorage.getItem("accessToken");

  // AI Product Search state
  const [aiQuery, setAiQuery]       = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const formRef = useRef(null);

  // ── 1. SEO ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "MyThoughtsHub | Tech Reviews & Deals";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Discover the latest technology, honest reviews, and verified Amazon deals curated for you."
    );
  }, []);

  // ── 2. Schema Markup (runs after products load) ─────────────────────────────
  useEffect(() => {
    if (!products.length) return;
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "ItemList",
      itemListElement: products.slice(0, 4).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        image: p.image,
        url: window.location.href,
        offers: {
          "@type": "Offer",
          price: p.price || "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: p.affiliateLink,
        },
      })),
    };
    let tag = document.getElementById("product-schema");
    if (!tag) {
      tag = document.createElement("script");
      tag.id = "product-schema";
      tag.type = "application/ld+json";
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(schemaData);
  }, [products]);

  // ── 3. Data Loading ─────────────────────────────────────────────────────────
  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [blogsData, productsData, catsData] = await Promise.all([
        fetchBlogs({ page: 1, limit: 6 }),
        fetchAffiliateProducts(),
        getAllCategories(),
      ]);

      let blogList = [];
      if (Array.isArray(blogsData)) blogList = blogsData;
      else if (Array.isArray(blogsData?.response)) blogList = blogsData.response;
      else if (Array.isArray(blogsData?.data)) blogList = blogsData.data;

      const productList = Array.isArray(productsData) ? productsData : [];
      const catList = Array.isArray(catsData?.response)
        ? catsData.response
        : Array.isArray(catsData) ? catsData : [];

      setBlogs(blogList);
      setProducts(productList);
      setCategories(catList);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
      setLoadingCats(false);
    }
  };

  // ── 4. SMART LOCAL AI SEARCH (NO API) ───────────────────────────────────────
  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    const q = aiQuery.toLowerCase();
    
    // 1. Extract Budget (Numbers) from the query
    const priceMatch = q.match(/(\d{1,3}(?:,\d{3})*(?:\d+)?|\d+)/g);
    const userBudget = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : null;

    // 2. Detect Category Keywords
    const categories = {
      laptop: ['laptop', 'computer', 'macbook', 'pc', 'notebook'],
      phone: ['phone', 'mobile', 'iphone', 'samsung', 'android', 'smartphone'],
      headphone: ['headphone', 'headset', 'audio', 'earbuds', 'sound', 'sony', 'bose'],
      watch: ['watch', 'smartwatch', 'wearable', 'fitbit', 'apple watch'],
      camera: ['camera', 'dslr', 'lens', 'canon', 'nikon', 'gopro'],
      gaming: ['gaming', 'ps5', 'xbox', 'console', 'game']
    };

    let detectedCategory = null;
    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => q.includes(kw))) {
        detectedCategory = cat;
        break;
      }
    }

    // 3. Filter REAL Products based on Logic
    let matches = products.filter(p => {
      const pName = p.name.toLowerCase();
      const pCat = (p.category || "").toLowerCase();
      
      // Must match detected category or name keywords
      const categoryMatch = detectedCategory 
        ? pName.includes(detectedCategory) || pCat.includes(detectedCategory)
        : true; 

      // Must be under budget (if budget specified)
      let pPrice = 0;
      if (p.price) {
        pPrice = parseInt(p.price.toString().replace(/[^0-9]/g, ''));
      }
      
      const budgetMatch = userBudget ? (pPrice <= userBudget) : true;

      return categoryMatch && budgetMatch;
    });

    // 4. Sort Logic: If budget exists, sort by most expensive (best value). 
    if (userBudget) {
      matches.sort((a, b) => {
        const priceA = parseInt((a.price || "0").replace(/[^0-9]/g, ''));
        const priceB = parseInt((b.price || "0").replace(/[^0-9]/g, ''));
        return priceB - priceA; 
      });
    }

    // 5. Generate a Smart Answer
    let answer = "";
    if (matches.length > 0) {
      answer = `I found ${matches.length} option${matches.length > 1 ? 's' : ''} matching your request`;
      if (detectedCategory) answer += ` for ${detectedCategory}s`;
      if (userBudget) answer += ` under ₹${userBudget.toLocaleString()}`;
      answer += ". Here are the best picks:";
    } else {
      answer = `I couldn't find exact matches`;
      if (detectedCategory) answer += ` for ${detectedCategory}s`;
      if (userBudget) answer += ` under ₹${userBudget.toLocaleString()}`;
      answer += ` in our current stock. Here are some popular alternatives you might like:`;
    }

    // 6. Set Result (Simulating a small delay for "thinking" feel)
    setTimeout(() => {
      setAiLoading(false);
      setAiResponse({
        answer: answer,
        // If we found matches, show them. If not, show top 2 trending products
        products: matches.length > 0 ? matches.slice(0, 3) : products.slice(0, 2)
      });
    }, 800); 
  };

  // ── 5. Modal Handlers ───────────────────────────────────────────────────────
  const handleModalClose = () => {
    setShowCreateModal(false);
    setAiBlogDraft(null);
    loadData();
  };

  const handleAiDraftReady = (draft) => {
    setAiBlogDraft(draft);   
    setShowCreateModal(true); 
  };

  // ── Quick Prompts ────────────────────────────────────────────────────────────
  const quickPrompts = [
    "🎧 Best headphones under ₹3000",
    "💻 Laptop for students",
    "📱 Camera phone under ₹20k",
    "⌚ Smartwatch under ₹5000",
  ];

  // ── Dynamic Stats (Real Data) ────────────────────────────────────────────────
  const dynamicStats = [
    {
      icon: "📦",
      value: loading ? "—" : products.length > 0 ? `${products.length}+` : "Coming soon",
      label: "Curated Products",
      color: "text-blue-600",
      sub: "verified deals",
    },
    {
      icon: "✍️",
      value: loading ? "—" : blogs.length > 0 ? `${blogs.length}+` : "New",
      label: "Articles Published",
      color: "text-orange-500",
      sub: "expert reviews",
    },
    {
      icon: "🗂️",
      value: loadingCats ? "—" : categories.length > 0 ? `${categories.length}` : "Growing",
      label: "Categories",
      color: "text-purple-600",
      sub: "tech topics",
    },
    {
      icon: "✅",
      value: "100%",
      label: "Verified Links",
      color: "text-green-500",
      sub: "safe & tested",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // SUB-COMPONENTS
  // ─────────────────────────────────────────────────────────────────────────────

  const FeaturedProduct = ({ product }) => (
    <div className="relative overflow-hidden transition-all duration-300 transform bg-white shadow-xl rounded-2xl hover:-translate-y-2 hover:shadow-2xl lg:col-span-2 group">
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/10 to-secondary/10 group-hover:opacity-100" />
      <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase rounded-full shadow-sm bg-primary">
            🔥 Hot Deal
          </span>
          <h3 className="text-2xl font-extrabold leading-tight text-base-content">{product.name}</h3>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">{product.description}</p>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 font-bold text-white transition-all rounded-full shadow-lg bg-primary hover:bg-primary-focus hover:shadow-xl"
          >
            View Deal
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        <div className="relative flex justify-center flex-shrink-0 w-full md:w-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl" />
          <img
            src={product.image || "https://placehold.co/600x600?text=No+Image"}
            alt={product.name}
            className="relative z-10 object-contain w-full h-48 transition-transform duration-500 md:h-64 mix-blend-multiply drop-shadow-2xl group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600?text=Image+Error"; }}
          />
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ cat }) => (
    <Link
      to={`/categories/${cat.slug}`}
      className="relative overflow-hidden transition-all duration-300 border group rounded-2xl bg-slate-900 border-slate-800 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center h-full min-h-[180px]">
        <div className="p-4 mb-4 transition-transform duration-300 bg-white/10 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 backdrop-blur-sm">
          <div className="transition-colors text-primary group-hover:text-white">
            {getCategoryIcon(cat.name)}
          </div>
        </div>
        <h3 className="text-lg font-bold transition-colors text-slate-100 group-hover:text-white">{cat.name}</h3>
        <div className="flex items-center mt-2 space-x-2 transition-all duration-300 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-xs font-medium text-primary">Explore</span>
          <ChevronRight className="w-3 h-3 text-primary" />
        </div>
      </div>
    </Link>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float-d { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes grad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .a-float  { animation: float 6s ease-in-out infinite; }
        .a-floatd { animation: float-d 8s ease-in-out infinite; }
        .a-grad   { background-size:200% 200%; animation: grad 6s ease infinite; }
        .s1 { animation: fadeUp .8s ease-out forwards; opacity:0; }
        .s2 { animation: fadeUp .8s .2s ease-out forwards; opacity:0; }
        .s3 { animation: fadeUp .8s .4s ease-out forwards; opacity:0; }
      `}</style>

      <div className="w-full bg-base-200">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 a-grad opacity-90" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply blur-3xl opacity-20 a-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply blur-3xl opacity-20 a-floatd" />

          <div className="relative z-10 container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center lg:text-left lg:flex-row lg:gap-16">
              <div className="flex-1 max-w-3xl space-y-8">
                <div className="s1">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-300 uppercase bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    Trusted by Tech Enthusiasts
                  </span>
                </div>
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight s2 md:text-7xl lg:text-8xl">
                  Discover. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 a-grad">
                    Shop Smart.
                  </span>
                </h1>
                <p className="text-lg leading-relaxed s3 text-slate-300 md:text-xl">
                  Your go-to source for honest tech reviews, in-depth coding tutorials, and the best Amazon deals curated by experts.
                </p>
                <div className="flex flex-col justify-center gap-4 pt-4 s3 sm:flex-row">
                  <Link to="/blog" className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 transform bg-blue-600 rounded-xl hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                    Start Reading
                  </Link>
                  <a href="#ai-concierge" className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl backdrop-blur-md hover:bg-white/20 hover:border-white/40 hover:scale-105">
                    Ask AI Assistant
                  </a>
                </div>
              </div>

              {/* Hero floating cards */}
              <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute top-0 right-0 z-10 w-64 p-6 border shadow-2xl bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl a-float">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 text-green-400 rounded-full bg-green-500/20">✓</div>
                      <span className="font-bold text-white">Review Verified</span>
                    </div>
                    <p className="text-xs text-slate-300">"Best tech blog I've read this year."</p>
                  </div>
                  <div className="p-6 mt-20 border shadow-2xl bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl a-floatd">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600" />
                      <div>
                        <h4 className="font-bold text-white">New Arrival</h4>
                        <p className="text-xs text-slate-400">Just now</p>
                      </div>
                    </div>
                    <h3 className="mb-2 font-bold text-white">The Future of AI</h3>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-purple-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-base-200 to-transparent" />
        </div>

        {/* ── STATS (REAL DATA) ──────────────────────────────────────────────── */}
        <div className="relative py-20 overflow-hidden bg-white border-b border-base-300">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="container grid grid-cols-2 gap-8 mx-auto max-w-[1600px] sm:grid-cols-4 relative z-10">
            {dynamicStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">{stat.icon}</div>
                <h3 className={`text-4xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</h3>
                <p className="text-sm font-bold tracking-widest text-gray-700 uppercase">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY TRUST US ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">Our Promise</span>
              <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">Why Trust MyThoughtsHub?</h2>
              <p className="max-w-2xl mx-auto mt-4 text-xl text-slate-600">We don't just review products; we analyze them so you don't have to.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: <ShieldCheck size={32} strokeWidth={1.5} />, color: "blue", title: "Unbiased Reviews", text: "Our reviews are independent and unsponsored. We tell you exactly what's good, what's bad, and what's ugly." },
                { icon: <Zap size={32} strokeWidth={1.5} />, color: "orange", title: "Real-Time Deals", text: "Our algorithm scans Amazon 24/7 to find price drops and hidden gems that actually offer value." },
                { icon: <Award size={32} strokeWidth={1.5} />, color: "purple", title: "Expert Verified", text: "Every link is verified safe. Every product is tested (if possible) or researched by our tech experts." },
              ].map(({ icon, color, title, text }) => (
                <div key={title} className={`relative p-8 transition-all duration-300 bg-white border shadow-sm border-slate-100 rounded-3xl hover:shadow-xl group hover:-translate-y-1`}>
                  <div className={`inline-flex items-center justify-center p-4 mb-6 text-${color}-600 transition-colors duration-300 bg-${color}-50 rounded-2xl group-hover:bg-${color}-600 group-hover:text-white`}>
                    {icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900">{title}</h3>
                  <p className="leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI TECH CONCIERGE (LOCAL LOGIC) ──────────────────────────────────── */}
        <section id="ai-concierge" className="py-24 bg-slate-900 overflow-hidden relative text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

          <div className="container px-4 mx-auto max-w-[1400px] relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-widest text-purple-300 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                <Zap size={14} className="fill-purple-400" /> Smart Search
              </span>
              <h2 className="text-4xl font-extrabold md:text-5xl">Not sure what to buy?</h2>
              <p className="max-w-2xl mt-4 text-xl text-slate-400">
                Describe your needs. Our smart engine scans our verified database for the perfect match.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <form ref={formRef} onSubmit={handleAiSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl">
                  <div className="pl-6 text-slate-400"><Bot size={24} /></div>
                  <input
                    type="text"
                    className="w-full h-16 px-4 text-lg bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                    placeholder="e.g. 'Best noise cancelling headphones under ₹2000'"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="m-2 px-8 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {aiLoading
                      ? <><Loader2 size={18} className="animate-spin" /> Searching...</>
                      : <>Search <ChevronRight size={18} /></>
                    }
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setAiQuery(p);
                      setTimeout(() => formRef.current?.requestSubmit(), 100);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 hover:text-white transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {aiResponse && (
                <div className="mt-10 p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                      <Bot size={24} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-bold text-white mb-2">Recommendation:</h4>
                      <p className="text-slate-300 leading-relaxed mb-6">{aiResponse.answer}</p>

                      {aiResponse.products.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {aiResponse.products.map((prod) => (
                            <a
                              key={prod._id || prod.id}
                              href={prod.affiliateLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/50 hover:bg-slate-800 transition-all group"
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-16 h-16 rounded-lg object-cover bg-white flex-shrink-0"
                                onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Img"; }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                                  {prod.price ?? "🔥 Hot Deal"}
                                </div>
                                <div className="font-bold text-slate-200 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                                  {prod.name}
                                </div>
                              </div>
                              <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-800/30 rounded-lg text-slate-400 text-center border border-dashed border-slate-700">
                          No matches found. Try "Laptop" or "Headphones".
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="mb-12 text-center">
              <span className="text-sm font-bold tracking-widest uppercase text-primary">Library</span>
              <h2 className="mt-2 text-4xl font-bold text-base-content">Explore Categories</h2>
              <p className="mt-2 text-gray-500">Find content that matters to you</p>
            </div>
            {loadingCats ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {categories.length > 0
                  ? categories.map((cat) => <CategoryCard key={cat._id} cat={cat} />)
                  : <p className="col-span-4 text-center text-gray-500">No categories available yet.</p>
                }
              </div>
            )}
          </div>
        </section>

        {/* ── AFFILIATE DEALS ───────────────────────────────────────────────── */}
        <section id="affiliate-section" className="py-24 bg-base-100">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-end">
              <div>
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Marketplace</span>
                <h2 className="mt-2 text-4xl font-bold text-base-content">🔥 Top Deals</h2>
                <p className="mt-2 text-gray-500">Hand-picked products just for you.</p>
              </div>
              <Link to="/reviews" className="items-center hidden gap-2 font-bold md:flex text-primary hover:underline">
                View All Deals →
              </Link>
            </div>

            <p className="p-3 mb-8 text-sm italic text-gray-500 border rounded-lg bg-white/50 border-primary/10 w-fit">
              As an Amazon Associate, we earn from qualifying purchases.
            </p>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-base-300 rounded-3xl animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center bg-white border border-dashed border-gray-200 rounded-3xl">
                <p className="text-2xl mb-2">🛒</p>
                <h3 className="text-xl font-bold text-gray-700">Deals Coming Soon</h3>
                <p className="mt-2 text-gray-500">We're curating the best products for you. Check back shortly!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FeaturedProduct product={products[0]} />
                {products.slice(1, 5).map((p) => <AffiliateCard key={p.id || p._id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        {/* ── BLOG SECTION ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end">
              <div>
                <span className="text-sm font-bold tracking-widest uppercase text-secondary">The Hub</span>
                <h2 className="mt-2 text-4xl font-bold text-base-content">Latest Insights</h2>
              </div>

              {token && (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    onClick={() => setShowAiBlogModal(true)}
                  >
                    <Sparkles size={18} /> AI Blog Creator
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-xl btn btn-accent hover:shadow-2xl hover:-translate-y-1"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PenLine size={18} /> Write Manually
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-base-300 rounded-3xl animate-pulse" />)}
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-24 text-center bg-white border border-gray-300 border-dashed rounded-3xl">
                <h3 className="text-2xl font-bold text-gray-700">No Stories Yet</h3>
                <p className="mt-2 text-gray-500">Be the first to share your thoughts with the world.</p>
                {token && (
                  <div className="flex justify-center gap-3 mt-6">
                    <button className="btn btn-outline gap-2" onClick={() => setShowAiBlogModal(true)}>
                      <Sparkles size={16} /> AI Create
                    </button>
                    <button className="btn btn-primary gap-2" onClick={() => setShowCreateModal(true)}>
                      <PenLine size={16} /> Write Manually
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-16">
                  <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-700">🔥 Featured Story</h3>
                  <BlogCard blog={blogs[0]} featured={true} />
                </div>
                {blogs.length > 1 && (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.slice(1).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
                  </div>
                )}
                <div className="mt-16 text-center">
                  <Link to="/blog" className="px-8 py-3 btn btn-outline btn-wide">View All Articles</Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
        <div className="relative py-24 overflow-hidden bg-neutral text-neutral-content">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="container px-4 mx-auto text-center max-w-[1400px] relative z-10">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">Join Our Community</h2>
            <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-300">
              Get the latest tech news, reviews, and exclusive deals delivered straight to your inbox.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <input type="email" placeholder="Enter your email" className="w-full h-12 text-lg input input-bordered sm:max-w-md bg-base-100 text-base-content" />
              <button className="w-full btn btn-primary btn-lg sm:w-auto">Subscribe</button>
            </div>
          </div>
        </div>

        {/* ── MODALS ────────────────────────────────────────────────────────── */}

        {/* AI Blog Creator Modal */}
        <AiBlogCreatorModal
          isOpen={showAiBlogModal}
          onClose={() => setShowAiBlogModal(false)}
          onUse={handleAiDraftReady}
        />

        {/* Manual / AI-assisted Create Blog Form */}
        <CreateBlogForm
          isOpen={showCreateModal}
          onClose={handleModalClose}
          initialData={aiBlogDraft}
        />

      </div>
    </>
  );
}