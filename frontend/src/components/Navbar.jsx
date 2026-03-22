import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userAvatar, setUserAvatar] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Generate avatar based on token
  useEffect(() => {
    if (token) {
      setUserAvatar(`https://api.dicebear.com/7.x/identicon/svg?seed=${token.slice(0, 6)}`);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
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
      
      {/* START: Logo & Mobile Menu Toggle */}
      <div className="navbar-start">
        
        {/* Mobile Menu Container */}
        <div className="relative">
          <label 
            className="btn btn-ghost lg:hidden" 
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          
          {/* Mobile Menu Dropdown (Absolute Positioning for Best Responsiveness) */}
          {isMobileMenuOpen && (
            <ul className="absolute left-0 z-50 w-64 p-2 border shadow-xl top-16 menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box border-base-200">
              <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
              <li><Link to="/blog" onClick={closeMobileMenu}>Blog</Link></li>
              
              {/* Mobile Categories Submenu */}
              <li>
                <details>
                  <summary>Categories</summary>
                  <ul className="p-2 rounded-t-none bg-base-200">
                    <li><Link to="/categories/tech" onClick={closeMobileMenu}>Technology</Link></li>
                    <li><Link to="/categories/lifestyle" onClick={closeMobileMenu}>Lifestyle</Link></li>
                    <li><Link to="/categories/coding" onClick={closeMobileMenu}>Coding</Link></li>
                  </ul>
                </details>
              </li>

              <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
              <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
              <li><Link to="/reviews" onClick={closeMobileMenu}>Reviews</Link></li>
              
              {/* Mobile Divider */}
              <div className="my-1 divider"></div>
              
              {/* Mobile Auth Buttons (Only show if not logged in) */}
              {!token && (
                <>
                  <li><Link to="/login" onClick={closeMobileMenu} className="font-bold text-primary">Login</Link></li>
                  <li><Link to="/register" onClick={closeMobileMenu} className="font-bold text-secondary">Register</Link></li>
                </>
              )}
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-bold tracking-wide text-white normal-case transition-transform duration-200 btn btn-ghost md:text-2xl hover:scale-105"
        >
          🚀 MyThoughtsHub
        </Link>
      </div>

      {/* CENTER: Desktop Menu (Hidden on Mobile) */}
      <div className="hidden navbar-center lg:flex">
        <ul className="gap-2 px-1 menu menu-horizontal">
          <li><Link to="/" className="font-medium transition-colors hover:text-primary">Home</Link></li>
          <li><Link to="/blog" className="font-medium transition-colors hover:text-primary">Blog</Link></li>
          
          {/* Desktop Categories Dropdown */}
          <li>
            <details>
              <summary className="font-medium transition-colors hover:text-primary">Categories</summary>
              <ul className="z-50 p-2 mt-4 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52">
                <li><Link to="/categories/tech">Technology</Link></li>
                <li><Link to="/categories/lifestyle">Lifestyle</Link></li>
                <li><Link to="/categories/coding">Coding</Link></li>
                <li><Link to="/categories/design">Design</Link></li>
              </ul>
            </details>
          </li>

          <li><Link to="/about" className="font-medium transition-colors hover:text-primary">About</Link></li>
          <li><Link to="/contact" className="font-medium transition-colors hover:text-primary">Contact</Link></li>
          <li><Link to="/reviews" className="font-medium transition-colors hover:text-primary">Reviews</Link></li>
        </ul>
      </div>

      {/* END: Auth Section (Desktop Only - Hidden on Mobile) */}
      <div className="hidden gap-2 navbar-end lg:flex">
        {!token ? (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="transition-all duration-300 btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="transition-all duration-300 btn btn-sm btn-outline hover:bg-secondary hover:text-white"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="transition-all duration-200 border border-transparent btn btn-ghost btn-circle avatar hover:scale-105 hover:border-primary/50"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={userAvatar} alt="User avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52 border border-base-300"
            >
              <li className="menu-title">My Account</li>
              <li>
                <Link to="/profile" className="flex justify-between">
                  Profile 
                  <span className="badge badge-ghost badge-sm">New</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <div className="my-0 divider"></div>
              <li>
                <button onClick={logout} className="font-medium text-error">🚪 Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}