import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogsByCategorySlug } from "../api/category.api";

const CategoryPage = () => {
  const { type } = useParams(); // 'type' comes from App.jsx route param
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getBlogsByCategorySlug(type);
        setData(res); // Expecting { category: {}, blogs: [] }
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center pt-32">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!data || !data.category) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-center">
        <h2 className="text-2xl font-bold text-error">Category Not Found</h2>
        <Link to="/categories" className="mt-4 btn btn-outline">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-200">
      <div className="container px-4 py-24 mx-auto max-w-[1600px]">
        
        {/* HERO SECTION */}
        <div className="relative p-10 mb-12 overflow-hidden text-center bg-white rounded-3xl shadow-lg">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
              Category
            </span>
            <h1 className="text-5xl font-extrabold text-base-content capitalize">
              {data.category.name}
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              {data.blogs.length} Article{data.blogs.length !== 1 && "s"} Found
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Link to="/categories" className="btn btn-sm btn-ghost gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Categories
          </Link>
        </div>

        {/* BLOGS GRID */}
        {data.blogs.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-200 border-dashed rounded-3xl">
            <p className="text-gray-500 text-lg">No articles in this category yet.</p>
            <Link to="/blog" className="mt-4 btn btn-outline">Read Other Articles</Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.blogs.map((blog) => (
              <div key={blog._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-200 flex flex-col h-full">
                
                {/* Image */}
                <figure className="relative overflow-hidden bg-gray-200 aspect-video">
                  <img
                    src={blog.image ? `${API_URL}${blog.image}` : "https://placehold.co/800x450?text=No+Image"}
                    alt={blog.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x450?text=Image+Error"; }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-black/50 backdrop-blur-md">
                      {data.category.name}
                    </span>
                  </div>
                </figure>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-base-content mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {blog.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-base-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {blog.creator?.username?.substring(0,2).toUpperCase() || "AD"}
                        </div>
                        <span className="text-xs text-gray-500">{blog.creator?.username || "Admin"}</span>
                      </div>
                      <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-primary btn-outline">
                        Read
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;