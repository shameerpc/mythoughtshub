import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs, fetchAffiliateProducts } from "../api/home.api";
import BlogCard from "../components/BlogCard";
import CreateBlogForm from "../components/CreateBlogForm";
import AffiliateCard from "../components/AffiliateCard";
import api from "../api/axios"; 

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const token = localStorage.getItem("token");

  // --- SEO: Dynamic Metadata Injection ---
  useEffect(() => {
    document.title = "MyThoughtsHub | Tech Reviews, Blogs & Deals";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", "Discover the latest in technology, read insightful blogs, and find the best Amazon deals on MyThoughtsHub.");

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MyThoughtsHub",
      "url": "https://www.mythoughtshub.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.mythoughtshub.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = "seo-schema-home";
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("seo-schema-home");
      if (existingScript) existingScript.remove();
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [blogsData, productsData] = await Promise.all([
        fetchBlogs(),
        fetchAffiliateProducts()
      ]);
      
      setBlogs(Array.isArray(blogsData.response) ? blogsData.response : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newBlog) => {
    try {
      const res = await api.post('/api/blog', newBlog); 
      if (res.data.success) {
        setBlogs([res.data.result, ...blogs]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    }
  };

  // --- COMPONENT: Featured Product (Responsive Layout) ---
  const FeaturedProduct = ({ product }) => (
    <div className="relative w-full overflow-hidden transition-transform duration-300 transform bg-white shadow-xl rounded-2xl lg:col-span-2 hover:-translate-y-2 group">
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:opacity-100"></div>
      <div className="flex flex-col items-center p-6 md:flex-row md:p-8">
        <div className="w-full mb-6 md:w-1/2 md:mb-0 text-center md:text-left">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-white uppercase rounded-full bg-primary">🔥 Hot Deal</span>
          <h3 className="mb-2 text-2xl font-extrabold text-base-content md:text-3xl">{product.name}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2 md:text-base">{product.description || "Check out this amazing deal available now on Amazon."}</p>
          <a 
            href={product.affiliateLink} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full px-6 py-3 font-bold text-white transition-colors rounded-full shadow-lg bg-primary hover:bg-primary-focus md:w-auto"
          >
            View Deal on Amazon
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>
        <div className="flex justify-center w-full md:w-1/2">
          <img src={product.image} alt={product.name} className="object-contain w-full max-w-[250px] h-auto max-h-[250px] drop-shadow-2xl mix-blend-multiply md:max-w-[300px] md:h-[300px]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-base-200">
      
      {/* --- HERO SECTION (Fully Responsive) --- */}
      <div className="relative w-full overflow-hidden bg-base-100">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        {/* Full Width Wrapper */}
        <div className="w-full px-4 py-12 mx-auto md:py-20 lg:py-24 max-w-[1600px] sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse items-center gap-10 lg:gap-16 lg:flex-row">
            
            {/* Left Content */}
            <div className="flex-1 w-full space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mx-auto lg:mx-0">
                <span className="flex w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs font-bold tracking-wide uppercase sm:text-sm">New v2.0 Released</span>
              </div>
              
              <h1 className="text-4xl font-extrabold leading-tight text-base-content sm:text-5xl lg:text-7xl">
                Discover. Read. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Shop Smart.</span>
              </h1>
              
              <p className="text-base text-gray-500 sm:text-lg lg:max-w-xl mx-auto lg:mx-0">
                Join thousands of tech enthusiasts reading in-depth reviews and discovering the best Amazon deals curated by experts.
              </p>
              
              <div className="flex flex-col justify-center w-full gap-4 sm:flex-row lg:justify-start">
                <Link to="/blog" className="px-8 py-4 text-white rounded-full shadow-lg btn btn-primary hover:shadow-primary/50 w-full sm:w-auto">
                  Start Reading
                </Link>
                <a href="#affiliate-section" className="px-8 py-4 border-2 rounded-full btn btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent w-full sm:w-auto">
                  Find Deals
                </a>
              </div>

              <div className="pt-6 border-t border-base-300">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 lg:justify-start">
                  <div className="flex items-center gap-2"><span className="text-xl">👥</span><span className="font-semibold">10k+</span> Readers</div>
                  <div className="flex items-center gap-2"><span className="text-xl">📝</span><span className="font-semibold">500+</span> Articles</div>
                  <div className="flex items-center gap-2"><span className="text-xl">⭐</span><span className="font-semibold">4.9/5</span> Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center flex-1 w-full lg:justify-end">
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20 blur-2xl"></div>
               <img 
                  src="https://picsum.photos/seed/tech/600/400" 
                  alt="Technology Illustration" 
                  className="relative z-10 w-full max-w-[400px] transition-transform duration-500 border-4 shadow-2xl rounded-2xl rotate-2 hover:rotate-0 border-base-100 lg:max-w-lg"
               />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-12 mx-auto space-y-20 sm:py-16 lg:py-24 sm:px-6 lg:px-8 max-w-[1600px]">

        {/* --- AFFILIATE SECTION (Responsive Grid) --- */}
        <section id="affiliate-section">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <span className="text-sm font-bold tracking-widest uppercase text-primary">Marketplace</span>
              <h2 className="mt-1 text-3xl font-extrabold text-base-content sm:text-4xl">Gear We Recommend</h2>
              <p className="max-w-xl mt-2 text-base text-gray-500 md:text-lg mx-auto md:mx-0">
                We've tested hundreds of products. Here are the absolute best deals available right now.
              </p>
            </div>
            <Link to="/reviews" className="items-center hidden gap-2 font-bold md:flex text-primary hover:underline">
              View All Reviews
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
               {[1,2,3,4].map(i => <div key={i} className="h-64 bg-base-300 rounded-2xl animate-pulse"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.length > 0 && <FeaturedProduct product={products[0]} />}
              {products.slice(1, 5).map((product) => (
                <AffiliateCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* --- BLOG SECTION (Responsive Grid) --- */}
        <section id="blog-section">
          <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <span className="text-sm font-bold tracking-widest uppercase text-secondary">The Hub</span>
              <h2 className="mt-1 text-3xl font-extrabold text-base-content sm:text-4xl">Latest Thoughts</h2>
              <p className="mt-2 text-base text-gray-500 md:text-lg">Dive into tutorials, reviews, and developer insights.</p>
            </div>
            
            {token && (
              <button
                className="px-6 py-3 font-bold text-white transition-all shadow-lg btn btn-accent hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? "✕ Cancel" : "✨ Write New Blog"}
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="p-6 mb-12 overflow-hidden border-2 shadow-xl bg-base-100 rounded-3xl border-accent/20 animate-fade-in-down">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Share your thoughts</h3>
                <p className="text-sm text-gray-500">Your post will be visible to the community immediately.</p>
              </div>
              <CreateBlogForm onCreate={handleCreate} />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {[1,2,3].map(i => <div key={i} className="h-96 bg-base-300 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center bg-white border border-gray-300 border-dashed shadow-sm rounded-3xl">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="text-xl font-bold text-gray-800">No stories yet</h3>
              <p className="mb-6 text-gray-500">Be the first to share something amazing.</p>
              {token && <button className="btn btn-primary btn-sm" onClick={() => setShowCreateForm(true)}>Write Now</button>}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onUpdate={token ? () => {} : null} 
                  onDelete={token ? () => {} : null} 
                />
              ))}
            </div>
          )}
          
          {blogs.length > 0 && (
             <div className="mt-12 text-center">
               <Link to="/blog" className="btn btn-outline btn-wide w-full sm:w-auto">Load More Articles</Link>
             </div>
          )}
        </section>

      </div>

      {/* --- FOOTER CTA (Responsive) --- */}
      <div className="w-full py-16 bg-neutral text-neutral-content">
        <div className="w-full px-4 mx-auto max-w-[1400px] text-center sm:px-6">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to join the community?</h2>
          <p className="max-w-lg mx-auto mb-8 text-sm opacity-80 md:text-base">Get the latest tech news and deals delivered straight to your inbox.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <input type="email" placeholder="Enter your email" className="w-full input input-bordered sm:max-w-md bg-base-100 text-base-content" />
            <button className="btn btn-primary w-full sm:w-auto">Subscribe</button>
          </div>
        </div>
      </div>

    </div>
  );
}