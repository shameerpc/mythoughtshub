import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/category.api"; // Ensure path is correct

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        const data = res.response || res || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
        // Fallback if API fails
        setCategories([
          { name: "Technology", slug: "tech" },
          { name: "Lifestyle", slug: "lifestyle" }
        ]);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    // FIX: Added 'mt-auto' to push footer to bottom. Added correct border class.
    <footer className="mt-auto bg-neutral text-neutral-content pt-20 border-t border-neutral-focus">
      
      {/* --- MAIN CONTENT --- */}
      <div className="container px-4 py-10 mx-auto grid grid-cols-1 gap-12 max-w-[1600px] md:grid-cols-2 lg:grid-cols-4">
        
        {/* --- BRAND COLUMN --- */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors flex items-center gap-2">
            🚀 MyThoughtsHub
          </Link>
          <p className="text-sm opacity-80 leading-relaxed">
            Empowering creators and tech enthusiasts. Your go-to source for honest reviews, coding tutorials, and lifestyle inspiration.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-xl btn btn-square btn-ghost btn-sm hover:bg-white hover:text-neutral" aria-label="Twitter">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-xl btn btn-square btn-ghost btn-sm hover:bg-white hover:text-neutral" aria-label="LinkedIn">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-xl btn btn-square btn-ghost btn-sm hover:bg-white hover:text-neutral" aria-label="Instagram">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        {/* --- DYNAMIC CATEGORIES --- */}
        <div>
          <h3 className="footer-title">Categories</h3>
          <ul className="space-y-2 text-sm opacity-80">
            {loadingCats ? (
              <li><span className="loading loading-spinner loading-xs"></span></li>
            ) : categories.length > 0 ? (
              categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link 
                    to={`/categories/${cat.slug}`} 
                    className="link link-hover"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li><Link to="/categories/tech" className="link link-hover">Technology</Link></li>
            )}
            <li><Link to="/reviews" className="link link-hover">Reviews</Link></li>
          </ul>
        </div>

        {/* --- COMPANY --- */}
        <div>
          <h3 className="footer-title">Company</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="link link-hover">About Us</Link></li>
            <li><Link to="/contact" className="link link-hover">Contact</Link></li>
            <li><Link to="/profile" className="link link-hover">My Profile</Link></li>
            <li>
              <a href="mailto:shamseerpcshan@gmail.com" className="link link-hover">Support</a>
            </li>
          </ul>
        </div>

        {/* --- NEWSLETTER --- */}
        <div>
          <h3 className="footer-title">Stay Updated</h3>
          <p className="text-sm mb-4 opacity-80">
            Get the latest tech trends and deals delivered straight to your inbox.
          </p>
          <div className="w-full max-w-xs join">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="input input-bordered w-full join-item text-neutral-content placeholder:text-neutral-content/50 focus:outline-none" 
            />
            <button className="btn btn-primary join-item">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="container px-4 mx-auto mt-16 pt-8 border-t max-w-[1600px] border-neutral-focus">
        <div className="flex flex-col items-center justify-between gap-6 text-xs md:flex-row opacity-70">
          
          {/* Copyright */}
          <p>
            © {currentYear} MyThoughtsHub - Built with ❤️ by Shamseer. All rights reserved.
          </p>

          {/* Amazon Disclaimer */}
          <p className="max-w-xl italic text-center">
            Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. 
            As an Amazon Associate we earn from qualifying purchases.
          </p>

          {/* Legal Links */}
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}