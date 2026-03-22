import React, { useState, useEffect, useMemo } from "react";

// --- MOCK DATABASE: Multiple Products ---
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "SonicFlow Pro Headphones",
    image: "https://picsum.photos/seed/sonic/300/300",
    price: "$299.00",
    description: "Industry-leading noise cancellation with 30-hour battery life."
  },
  {
    id: "p2",
    name: "Lunar Smart Watch",
    image: "https://picsum.photos/seed/watch/300/300",
    price: "$149.00",
    description: "Track your fitness and health with precision accuracy."
  },
  {
    id: "p3",
    name: "AeroGaming Mouse",
    image: "https://picsum.photos/seed/mouse/300/300",
    price: "$59.99",
    description: "Ultra-lightweight design for professional gamers."
  }
];

// --- MOCK DATABASE: Reviews (Linked to Products) ---
const MOCK_REVIEWS = [
  // Reviews for SonicFlow (p1)
  {
    id: 101,
    productId: "p1",
    user: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=1",
    rating: 5,
    title: "Best noise cancelling headphones",
    body: "I fly for work weekly, and these are the best I've owned. The transparency mode is a game changer.",
    date: "2023-10-25",
    verified: true,
    helpful: 42,
  },
  {
    id: 102,
    productId: "p1",
    user: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=2",
    rating: 4,
    title: "Great sound, tight fit",
    body: "Audio is fantastic, but slightly tight after 3 hours.",
    date: "2023-10-20",
    verified: true,
    helpful: 15,
  },
  // Reviews for Lunar Watch (p2)
  {
    id: 201,
    productId: "p2",
    user: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=3",
    rating: 5,
    title: "Amazing battery life!",
    body: "I only charge it once a week. The sleep tracking is surprisingly accurate.",
    date: "2023-10-22",
    verified: true,
    helpful: 30,
  },
  {
    id: 202,
    productId: "p2",
    user: "David Ross",
    avatar: "https://i.pravatar.cc/150?u=4",
    rating: 2,
    title: "Scratches easily",
    body: "Functionally fine, but the glass screen scratched within a week of normal use.",
    date: "2023-10-15",
    verified: true,
    helpful: 8,
  },
   // Reviews for Mouse (p3)
   {
    id: 301,
    productId: "p3",
    user: "Alex Gamer",
    avatar: "https://i.pravatar.cc/150?u=5",
    rating: 5,
    title: "Zero lag",
    body: "Perfect for FPS games. The click response is instant.",
    date: "2023-10-24",
    verified: false,
    helpful: 12,
  },
];

// --- HELPER COMPONENT: Star Rating ---
const StarRating = ({ rating, size = "text-sm" }) => (
  <div className={`flex space-x-1 ${size} text-yellow-400`} aria-label={`Rating: ${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-current" : "text-gray-300"}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// --- MAIN PAGE COMPONENT ---
const ReviewsPage = () => {
  // STATE: Which product are we viewing?
  // Default to 'p1' (SonicFlow)
  const [selectedProductId, setSelectedProductId] = useState("p1");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // DERIVED DATA: Get Product Details
  const currentProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);
  
  // DERIVED DATA: Get Reviews for this specific product
  const productReviews = useMemo(() => {
    return MOCK_REVIEWS.filter(r => r.productId === selectedProductId);
  }, [selectedProductId]);

  // --- SEO LOGIC: Dynamic Metadata Injection ---
  useEffect(() => {
    if (!currentProduct) return;

    const totalReviews = productReviews.length;
    const averageRating = totalReviews === 0 ? 0 : (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);

    // 1. Update Document Title
    document.title = `${currentProduct.name} Reviews | ${averageRating}/5 Stars (${totalReviews} Reviews)`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", `Read ${totalReviews} verified reviews for ${currentProduct.name}. Rated ${averageRating}/5 stars. ${currentProduct.description}`);

    // 3. Inject JSON-LD (Schema.org) for Rich Snippets
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": currentProduct.name,
      "image": currentProduct.image,
      "description": currentProduct.description,
      "offers": {
        "@type": "Offer",
        "price": currentProduct.price.replace('$', ''),
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating,
        "reviewCount": totalReviews,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": productReviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating
        },
        "author": {
          "@type": "Person",
          "name": review.user
        },
        "reviewBody": review.body,
        "datePublished": review.date
      }))
    };

    // Inject Script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = "structured-data-reviews";
    
    // Remove old script if exists (cleanup)
    const oldScript = document.getElementById("structured-data-reviews");
    if (oldScript) oldScript.remove();
    
    document.head.appendChild(script);

  }, [selectedProductId, productReviews, currentProduct]); 

  // --- FILTER & SORT LOGIC (Applies to Current Product Only) ---
  const filteredReviews = useMemo(() => {
    let result = [...productReviews];
    
    if (filterRating !== "all") {
      result = result.filter((r) => r.rating === parseInt(filterRating));
    }

    if (sortBy === "recent") return result.reverse();
    if (sortBy === "highest") return result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "helpful") return result.sort((a, b) => b.helpful - a.helpful);
    
    return result;
  }, [productReviews, filterRating, sortBy]);

  // --- CALCULATED STATS ---
  const totalReviews = productReviews.length;
  const averageRating = totalReviews === 0 ? 0 : (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);

  if (!currentProduct) return <div className="p-10 text-center">Loading Product...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      
      <main className="container flex-grow px-4 py-8 mx-auto max-w-7xl">
        
        {/* --- PRODUCT HERO SECTION --- */}
        <div className="p-6 mb-8 bg-white border shadow-xl rounded-2xl border-base-200">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            
            {/* Product Image */}
            <div className="flex justify-center w-full md:w-1/3">
              <div className="w-48 h-48 p-4 shadow-inner md:w-64 md:h-64 bg-base-100 rounded-xl">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name} 
                  className="object-contain w-full h-full mix-blend-multiply"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full text-center md:w-2/3 md:text-left">
              <div className="flex flex-col gap-2 mb-2 md:flex-row md:items-center">
                <span className="badge badge-primary badge-outline">New Release</span>
                <span className="text-lg font-bold text-primary">{currentProduct.price}</span>
              </div>
              <h1 className="mb-2 text-3xl font-extrabold md:text-4xl text-base-content">
                {currentProduct.name}
              </h1>
              <p className="mb-4 text-lg text-gray-500">{currentProduct.description}</p>
              
              {/* Aggregate Rating in Hero */}
              <div className="flex inline-flex items-center justify-center gap-3 p-3 rounded-lg md:justify-start bg-base-100">
                <div className="leading-none text-center">
                  <span className="block text-3xl font-bold text-base-content">{averageRating}</span>
                  <span className="text-xs text-gray-400 uppercase">Rating</span>
                </div>
                <div className="mx-1 divider divider-horizontal"></div>
                <div className="leading-none text-center">
                  <span className="block text-3xl font-bold text-base-content">{totalReviews}</span>
                  <span className="text-xs text-gray-400 uppercase">Reviews</span>
                </div>
                <div className="mx-1 divider divider-horizontal"></div>
                <div className="leading-none text-left">
                  <StarRating rating={averageRating} size="text-xl" />
                  <span className="block mt-1 text-xs text-gray-400">Verified Buyers</span>
                </div>
              </div>

              {/* Product Switcher (Demo Only) */}
              <div className="pt-6 mt-6 border-t border-base-200">
                <label className="text-xs font-bold text-gray-400 uppercase label">
                  View Reviews For (Demo Switcher):
                </label>
                <select 
                  className="w-full bg-white select select-bordered md:w-64"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  {MOCK_PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT SIDEBAR: Stats & Filters */}
          <aside className="space-y-6 lg:col-span-4" aria-label="Review Statistics">
            <div className="sticky bg-white border shadow-lg card border-base-200 rounded-2xl top-4">
              <div className="card-body">
                <h3 className="mb-4 text-lg font-bold">Rating Breakdown</h3>
                
                {/* Rating Progress Bars */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = productReviews.filter((r) => r.rating === star).length;
                    const percentage = totalReviews === 0 ? 0 : (count / totalReviews) * 100;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-3 font-medium text-gray-600">{star}</span>
                        <div className="flex-grow h-2.5 bg-base-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-700 ease-out bg-yellow-400" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-8 font-mono text-xs text-right text-gray-400">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Filter Buttons */}
                <div className="divider"></div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase">Filter Stars</h3>
                  <div className="flex flex-wrap gap-2">
                    {["all", 5, 4, 3, 2, 1].map((val) => (
                      <button
                        key={val}
                        onClick={() => setFilterRating(val)}
                        className={`badge border-0 cursor-pointer transition-all duration-200 hover:scale-105 ${
                          filterRating === val
                            ? "badge-primary text-white shadow-lg"
                            : "bg-base-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {val === "all" ? "All" : `${val}★`}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Write Review CTA */}
                <div className="mt-4 border card bg-base-100 border-primary/20">
                  <div className="p-4 text-center card-body">
                    <p className="mb-2 text-sm">Own this product?</p>
                    <button className="w-full btn btn-primary btn-sm">Write a Review</button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT: Review Feed */}
          <section className="lg:col-span-8" aria-label="Reviews List">
            
            {/* Sort Controls */}
            <div className="flex flex-col items-center justify-between gap-4 p-4 mb-6 bg-white border shadow-sm sm:flex-row rounded-xl border-base-200">
              <span className="font-medium text-base-content">
                Showing <span className="font-bold text-primary">{filteredReviews.length}</span> reviews
              </span>
              <div className="flex items-center w-full gap-2 sm:w-auto">
                <label htmlFor="sort-select" className="hidden text-sm text-gray-500 sm-block">Sort:</label>
                <select 
                  id="sort-select"
                  className="w-full bg-white select select-bordered select-sm sm:w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <article key={review.id} className="transition-all duration-300 bg-white border shadow-md card border-base-100 hover:shadow-lg">
                  <div className="p-6 card-body">
                    <header className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                      <div className="flex items-center w-full gap-4 sm:w-auto">
                        <div className="avatar">
                          <div className="w-10 rounded-full bg-primary/10 ring-2 ring-transparent">
                             <img src={review.avatar} alt={`Avatar of ${review.user}`} loading="lazy" />
                          </div>
                        </div>
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-base-content">
                            {review.user}
                            {review.verified && (
                              <span className="gap-1 font-normal text-white badge badge-success badge-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                          </h4>
                          <time dateTime={review.date} className="text-xs text-gray-400 block mt-0.5">
                            {new Date(review.date).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:self-center">
                        <StarRating rating={review.rating} size="text-sm" />
                      </div>
                    </header>

                    <h3 className="mb-1 text-base font-bold text-base-content">{review.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{review.body}</p>

                    <footer className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <button className="gap-1 text-gray-500 btn btn-xs btn-ghost hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Helpful ({review.helpful})
                      </button>
                      <button className="text-gray-400 btn btn-xs btn-ghost hover:text-error">
                        Report
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="py-20 text-center bg-white border border-gray-300 border-dashed shadow-sm rounded-xl">
                <div className="mb-4 text-4xl">📝</div>
                <h3 className="text-lg font-bold text-gray-600">Be the first to review</h3>
                <p className="text-gray-500">No reviews match your current filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      
  

    </div>
  );
};

export default ReviewsPage;