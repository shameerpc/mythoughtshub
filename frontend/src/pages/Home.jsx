import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, fetchAffiliateProducts } from "../api/home.api";
import { getAllCategories } from "../api/category.api";
import BlogCard from "../components/BlogCard";
import CreateBlogForm from "../components/CreateBlogForm";
import AffiliateCard from "../components/AffiliateCard";

// Import Icons for Design
import { 
  ShieldCheck, Zap, Award, 
  Cpu, Smartphone, Camera, Headphones, 
  Gamepad2, Watch, Laptop, Monitor 
} from "lucide-react";

// Icon Mapping for Categories (Dynamic Icons based on category name)
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile")) return <Smartphone className="w-8 h-8" />;
  if (n.includes("laptop") || n.includes("computer")) return <Laptop className="w-8 h-8" />;
  if (n.includes("camera")) return <Camera className="w-8 h-8" />;
  if (n.includes("audio") || n.includes("sound") || n.includes("headphone")) return <Headphones className="w-8 h-8" />;
  if (n.includes("gaming")) return <Gamepad2 className="w-8 h-8" />;
  if (n.includes("watch")) return <Watch className="w-8 h-8" />;
  if (n.includes("monitor") || n.includes("tv")) return <Monitor className="w-8 h-8" />;
  return <Cpu className="w-8 h-8" /> // Default
};

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const token = localStorage.getItem("accessToken");

  // --- 1. SEO EFFECT ---
  useEffect(() => {
    document.title = "MyThoughtsHub | Tech Reviews & Deals";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", "Discover the latest technology, honest reviews, and verified Amazon deals curated for you.");
  }, []);

  // --- 2. DATA LOADING EFFECT (FIXED) ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ FIX: Pass default params to mimic the working BlogList page behavior
      const params = { page: 1, limit: 6 };

      const [blogsData, productsData, catsData] = await Promise.all([
        fetchBlogs(params), 
        fetchAffiliateProducts(),
        getAllCategories()
      ]);

      // ✅ FIX: Use the exact same robust logic as BlogList.jsx to extract data
      // This handles cases where the API might return { data: [...] }, { response: [...] }, or [...]
      let blogList = [];
      if (Array.isArray(blogsData)) {
        blogList = blogsData;
      } else if (blogsData?.response && Array.isArray(blogsData.response)) {
        blogList = blogsData.response;
      } else if (blogsData?.data && Array.isArray(blogsData.data)) {
        blogList = blogsData.data;
      }

      const productList = Array.isArray(productsData) ? productsData : [];
      const catList = Array.isArray(catsData?.response) ? catsData.response : (Array.isArray(catsData) ? catsData : []);

      console.log("Home Blogs Loaded:", blogList.length); // Debugging
      console.log("Home Categories Loaded:", catList.length);

      setBlogs(blogList);
      setProducts(productList);
      setCategories(catList);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setLoadingCats(false);
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    loadData();
  };

  // --- 3. INTERNAL COMPONENTS ---

  const FeaturedProduct = ({ product }) => (
    <div className="relative overflow-hidden transition-all duration-300 transform bg-white shadow-xl rounded-2xl hover:-translate-y-2 hover:shadow-2xl lg:col-span-2 group">
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/10 to-secondary/10 group-hover:opacity-100"></div>
      <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase rounded-full shadow-sm bg-primary">
            🔥 Hot Deal
          </span>
          <h3 className="text-2xl font-extrabold leading-tight text-base-content">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
            {product.description}
          </p>
          <a 
            href={product.affiliateLink} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center px-6 py-3 font-bold text-white transition-all rounded-full shadow-lg bg-primary hover:bg-primary-focus hover:shadow-xl"
          >
            View Deal
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
        <div className="relative flex justify-center flex-shrink-0 w-full md:w-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl"></div>
          <img 
            src={product.image || "https://placehold.co/600x600?text=No+Image"} 
            alt={product.name} 
            className="relative z-10 object-contain w-full h-48 transition-transform duration-500 md:h-64 mix-blend-multiply drop-shadow-2xl group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/600x600?text=Image+Error&font=roboto";
            }}
          />
        </div>
      </div>
    </div>
  );

  // ✅ NEW BEAUTIFUL CATEGORY CARD
  const CategoryCard = ({ cat }) => {
    const Icon = getCategoryIcon(cat.name);
    return (
      <Link 
        to={`/categories/${cat.slug}`} 
        className="relative overflow-hidden transition-all duration-300 border group rounded-2xl bg-slate-900 border-slate-800 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:opacity-100"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center h-full min-h-[180px]">
          <div className="p-4 mb-4 text-white transition-transform duration-300 bg-white/10 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 backdrop-blur-sm">
            <div className="transition-colors text-primary group-hover:text-white">
              {Icon}
            </div>
          </div>
          <h3 className="text-lg font-bold transition-colors text-slate-100 group-hover:text-white">
            {cat.name}
          </h3>
          <div className="flex items-center mt-2 space-x-2 transition-all duration-300 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-xs font-medium text-primary">Explore</span>
            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </div>
        </div>
      </Link>
    );
  };

  // Animated Counter Component
  const StatCard = ({ stat }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 2000; 
      const incrementTime = 50;
      
      const step = stat.end / (duration / incrementTime);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= stat.end) {
          setCount(stat.end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }, [stat.end]);

    return (
      <div className="flex flex-col items-center text-center transition-all duration-300 group">
        <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm">{stat.icon}</div>
        <h3 className={`text-4xl font-extrabold mb-2 ${stat.color}`}>
          {typeof count === 'number' && !Number.isInteger(count) ? count.toFixed(1) : count}{stat.suffix}
        </h3>
        <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">{stat.label}</p>
      </div>
    );
  };

  return (
    <>
      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-xy 6s ease infinite; }
        .stagger-1 { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .stagger-2 { animation: fade-in-up 0.8s ease-out 0.2s forwards; opacity: 0; }
        .stagger-3 { animation: fade-in-up 0.8s ease-out 0.4s forwards; opacity: 0; }
      `}</style>

      <div className="w-full bg-base-200">
        
        {/* --- HERO SECTION --- */}
        <div className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient opacity-90"></div>
          <div className="absolute top-0 bg-purple-500 rounded-full left-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 bg-blue-500 rounded-full right-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>

          <div className="relative z-10 container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center lg:text-left lg:flex-row lg:gap-16">
              <div className="flex-1 max-w-3xl space-y-8">
                <div className="stagger-1">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-300 uppercase bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    Trusted by Tech Enthusiasts
                  </span>
                </div>

                <h1 className="text-5xl font-extrabold leading-tight tracking-tight stagger-2 md:text-7xl lg:text-8xl">
                  Discover. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                    Shop Smart.
                  </span>
                </h1>

                <p className="text-lg leading-relaxed stagger-3 text-slate-300 md:text-xl">
                  Your go-to source for honest tech reviews, in-depth coding tutorials, and the best Amazon deals curated by experts.
                </p>

                <div className="flex flex-col justify-center gap-4 pt-4 stagger-3 sm:flex-row">
                  <Link 
                    to="/blog" 
                    className="relative px-8 py-4 text-lg font-bold text-white transition-all duration-300 transform bg-blue-600 rounded-xl hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]"
                  >
                    Start Reading
                  </Link>
                  <a 
                    href="#affiliate-section" 
                    className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl backdrop-blur-md hover:bg-white/20 hover:border-white/40 hover:scale-105"
                  >
                    Find Deals
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute top-0 right-0 z-10 w-64 p-6 border shadow-2xl bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl animate-float">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 text-green-400 rounded-full bg-green-500/20">✓</div>
                      <span className="font-bold text-white">Review Verified</span>
                    </div>
                    <p className="text-xs text-slate-300">"Best tech blog I've read this year."</p>
                  </div>

                  <div className="p-6 mt-20 border shadow-2xl bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl animate-float-delayed">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600"></div>
                      <div>
                        <h4 className="font-bold text-white">New Arrival</h4>
                        <p className="text-xs text-slate-400">Just now</p>
                      </div>
                    </div>
                    <h3 className="mb-2 font-bold text-white">The Future of AI</h3>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-base-200 to-transparent"></div>
        </div>

        {/* --- METRICS SECTION --- */}
        <div className="relative py-20 overflow-hidden bg-white border-b border-base-300">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
          <div className="container grid grid-cols-2 gap-8 mx-auto max-w-[1600px] sm:grid-cols-4 relative z-10">
            {[
              { icon: "📦", end: 500, suffix: "+", label: "Curated Products", color: "text-blue-600" },
              { icon: "🔥", end: 50, suffix: "+", label: "Daily Deals", color: "text-orange-500" },
              { icon: "⭐", end: 4.9, suffix: "", label: "Avg Rating", color: "text-yellow-500" },
              { icon: "✅", end: 100, suffix: "%", label: "Verified Links", color: "text-green-500" }
            ].map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>
        </div>

        {/* --- ✅ NEW: WHY TRUST US (BEAUTIFUL GRID) --- */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">Our Promise</span>
              <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">Why Trust MyThoughtsHub?</h2>
              <p className="max-w-2xl mx-auto mt-4 text-xl text-slate-600">We don't just review products; we analyze them so you don't have to.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative p-8 transition-all duration-300 bg-white border shadow-sm border-slate-100 rounded-3xl hover:shadow-xl group hover:-translate-y-1">
                <div className="inline-flex items-center justify-center p-4 mb-6 text-blue-600 transition-colors duration-300 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">Unbiased Reviews</h3>
                <p className="leading-relaxed text-slate-600">
                  Our reviews are independent and unsponsored. We tell you exactly what's good, what's bad, and what's ugly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative p-8 transition-all duration-300 bg-white border shadow-sm border-slate-100 rounded-3xl hover:shadow-xl group hover:-translate-y-1">
                <div className="inline-flex items-center justify-center p-4 mb-6 text-orange-600 transition-colors duration-300 bg-orange-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white">
                  <Zap size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">Real-Time Deals</h3>
                <p className="leading-relaxed text-slate-600">
                  Our algorithm scans Amazon 24/7 to find price drops and hidden gems that actually offer value.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative p-8 transition-all duration-300 bg-white border shadow-sm border-slate-100 rounded-3xl hover:shadow-xl group hover:-translate-y-1">
                <div className="inline-flex items-center justify-center p-4 mb-6 text-purple-600 transition-colors duration-300 bg-purple-50 rounded-2xl group-hover:bg-purple-600 group-hover:text-white">
                  <Award size={32} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">Expert Verified</h3>
                <p className="leading-relaxed text-slate-600">
                  Every link is verified safe. Every product is tested (if possible) or researched by our tech experts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ✅ NEW: DYNAMIC CATEGORIES (TRENDING DESIGN) --- */}
        <section className="py-24 bg-white">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="mb-12 text-center">
              <span className="text-sm font-bold tracking-widest uppercase text-primary">Library</span>
              <h2 className="mt-2 text-4xl font-bold text-base-content">Explore Categories</h2>
              <p className="mt-2 text-gray-500">Find content that matters to you</p>
            </div>
            
            {loadingCats ? (
               <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>)}
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {categories.length > 0 ? (
                  categories.map((cat) => <CategoryCard key={cat._id} cat={cat} />)
                ) : (
                  <p className="col-span-4 text-center text-gray-500">No categories available.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* --- AFFILIATE SECTION --- */}
        <section id="affiliate-section" className="py-24 bg-base-100">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-end">
              <div>
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Marketplace</span>
                <h2 className="mt-2 text-4xl font-bold text-base-content">🔥 Top Deals</h2>
                <p className="mt-2 text-gray-500">Hand-picked products just for you.</p>
              </div>
              <Link to="/reviews" className="items-center hidden gap-2 font-bold md:flex text-primary hover:underline">View All Deals →</Link>
            </div>
            <p className="p-3 mb-8 text-sm italic text-center text-gray-500 border rounded-lg md:text-left bg-white/50 border-primary/10 w-fit">
              As an Amazon Associate, we earn from qualifying purchases.
            </p>

            {loading ? (
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-80 bg-base-300 rounded-3xl animate-pulse"></div>)}
               </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {products.length > 0 && <FeaturedProduct product={products[0]} />}
                {products.slice(1, 5).map(p => (
                  <AffiliateCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- BLOG SECTION --- */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 mx-auto max-w-[1600px]">
            <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end">
              <div>
                <span className="text-sm font-bold tracking-widest uppercase text-secondary">The Hub</span>
                <h2 className="mt-2 text-4xl font-bold text-base-content">Latest Insights</h2>
              </div>
              {token && (
                <button
                  className="w-full px-8 py-3 font-bold text-white transition-all shadow-xl btn btn-accent hover:shadow-2xl hover:-translate-y-1 md:w-auto"
                  onClick={() => setShowCreateModal(true)}
                >
                  ✨ Write New Blog
                </button>
              )}
            </div>

            {/* DEBUGGING & EMPTY STATE */}
            {loading ? (
               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 {[1,2,3].map(i => <div key={i} className="h-96 bg-base-300 rounded-3xl animate-pulse"></div>)}
               </div>
            ) : blogs.length === 0 ? (
               <div className="py-24 text-center bg-white border border-gray-300 border-dashed rounded-3xl">
                  <h3 className="text-2xl font-bold text-gray-700">No Stories Yet</h3>
                  <p className="mt-2 text-gray-500">Be the first to share your thoughts with the world.</p>
                  {token && (
                    <button 
                      className="mt-6 btn btn-primary"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Write the First Story
                    </button>
                  )}
               </div>
            ) : (
              <>
                {/* Featured Blog */}
                {blogs.length > 0 && (
                  <div className="mb-16">
                    <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-700">🔥 Featured Story</h3>
                    <BlogCard blog={blogs[0]} featured={true} />
                  </div>
                )}

                {/* Blog Grid */}
                {blogs.length > 1 && (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.slice(1).map(blog => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                )}

                <div className="mt-16 text-center">
                  <Link to="/blog" className="px-8 py-3 btn btn-outline btn-wide">View All Articles</Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <div className="relative py-24 overflow-hidden bg-neutral text-neutral-content">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/20 blur-3xl"></div>
          
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

        {/* --- CREATE BLOG MODAL --- */}
        <CreateBlogForm 
          isOpen={showCreateModal} 
          onClose={handleModalClose} 
        />

      </div>
    </>
  );
}