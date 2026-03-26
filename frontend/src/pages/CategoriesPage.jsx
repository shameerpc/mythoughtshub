import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../api/category.api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.response || res || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center pt-32">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-200">
      <div className="container px-4 py-24 mx-auto max-w-[1600px]">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">
            Browse Library
          </div>
          <h1 className="text-5xl font-extrabold text-base-content">Explore Categories</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Dive into specific topics and find exactly what you're looking for.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/categories/${cat.slug}`}
                className="group relative flex flex-col items-center justify-center p-8 text-center bg-white border border-base-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 mb-6 text-4xl rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center">
                  {cat.icon || "📂"}
                </div>
                
                <h2 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                
                <p className="mt-2 text-sm text-gray-500">
                  {cat.description || `Explore articles in ${cat.name}`}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-bold text-primary">Explore →</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}