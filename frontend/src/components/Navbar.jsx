import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; // Import useMemo
import { getAllCategories } from "../api/category.api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // 1. Get full user object to access avatar or name
  // FIX: Wrapped in useMemo to prevent reference change on every render
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  const [userAvatar, setUserAvatar] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // 2. Effect to Generate/Set Avatar
  useEffect(() => {
    if (!token) {
      setUserAvatar("");
      return;
    }

    // Priority 1: Use uploaded avatar if it exists
    if (user?.avatar) {
      setUserAvatar(user.avatar);
    } 
    // Priority 2: Generate unique avatar based on User Name (or ID)
    else if (user?.name) {
      // Using 'initials' style is cleaner for names
      setUserAvatar(`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=b6e3f4`);
    } 
    // Priority 3: Fallback to ID/Token
    else {
      setUserAvatar(`https://api.dicebear.com/7.x/identicon/svg?seed=${user._id || token}`);
    }
  }, [token, user]); // Now 'user' is safe to use here

  // 3. Effect to Fetch Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategories();
        const data = res.response || res || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear user data too
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 border-b shadow-lg navbar bg-neutral text-neutral-content backdrop-blur-md bg-opacity-95 border-white/10">
      
      <div className="navbar-start">
        <div className="relative">
          <label className="btn btn-ghost lg:hidden" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          
          {/* MOBILE MENU DROPDOWN */}
          {isMobileMenuOpen && (
            <ul className="absolute left-0 z-50 w-64 p-2 border shadow-xl top-16 menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box border-base-200">
              <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
              <li><Link to="/blog" onClick={closeMobileMenu}>Blog</Link></li>
              
              <li>
                <details>
                  <summary>Categories</summary>
                  <ul className="p-2 overflow-y-auto rounded-t-none bg-base-200 max-h-60">
                    {loadingCats ? (
                      <li><span className="loading loading-spinner loading-xs"></span></li>
                    ) : (
                      categories.map((cat) => (
                        <li key={cat._id}>
                          <Link to={`/categories/${cat.slug}`} onClick={closeMobileMenu}>
                            {cat.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </details>
              </li>
              
              <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
              <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
              
              <div className="my-1 divider"></div>
              
              {/* CONDITIONAL: Show Login/Register if no token, else Profile */}
              {!token ? (
                <>
                  <li><Link to="/login" onClick={closeMobileMenu} className="font-bold text-primary">Login</Link></li>
                  <li><Link to="/register" onClick={closeMobileMenu} className="font-bold text-secondary">Register</Link></li>
                </>
              ) : (
                <>
                  <li className="menu-title"><span className="text-xs uppercase opacity-70">My Account</span></li>
                  <li><Link to="/profile" onClick={closeMobileMenu}>Profile</Link></li>
                  <li><Link to="/settings" onClick={closeMobileMenu}>Settings</Link></li>
                  <li><button onClick={() => { logout(); closeMobileMenu(); }} className="text-error">Logout</button></li>
                </>
              )}
            </ul>
          )}
        </div>

        <Link to="/" className="text-xl font-bold tracking-wide text-white normal-case transition-transform duration-200 btn btn-ghost md:text-2xl hover:scale-105">
          🚀 MyThoughtsHub
        </Link>
      </div>

      <div className="hidden navbar-center lg:flex">
        <ul className="gap-2 px-1 menu menu-horizontal">
          <li><Link to="/" className="font-medium transition-colors hover:text-primary">Home</Link></li>
          <li><Link to="/blog" className="font-medium transition-colors hover:text-primary">Blog</Link></li>
          
          <li>
            <details>
              <summary className="font-medium transition-colors hover:text-primary">Categories</summary>
              <ul className="z-50 p-2 mt-4 overflow-y-auto shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52 max-h-96">
                {loadingCats ? (
                  <li><span className="loading loading-spinner loading-xs"></span></li>
                ) : (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/categories/${cat.slug}`}>{cat.name}</Link>
                    </li>
                  ))
                )}
              </ul>
            </details>
          </li>

          <li><Link to="/about" className="font-medium transition-colors hover:text-primary">About</Link></li>
          <li><Link to="/contact" className="font-medium transition-colors hover:text-primary">Contact</Link></li>
        </ul>
      </div>

      <div className="hidden gap-2 navbar-end lg:flex">
        {/* CONDITIONAL RENDERING: Login/Register vs Avatar */}
        {!token ? (
          <div className="flex space-x-2">
            <Link to="/login" className="transition-all duration-300 btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-white">Login</Link>
            <Link to="/register" className="transition-all duration-300 btn btn-sm btn-outline hover:bg-secondary hover:text-white">Register</Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="transition-all duration-200 border border-transparent btn btn-ghost btn-circle avatar hover:scale-105 hover:border-primary/50">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img 
                  src={userAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                  alt="User Avatar" 
                />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52 border border-base-300">
              <li className="font-bold menu-title text-primary">
                {user?.name || "My Account"}
              </li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <div className="my-0 divider"></div>
              <li><button onClick={logout} className="font-medium text-error">🚪 Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}