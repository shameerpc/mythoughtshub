import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, PenTool, DollarSign, MessageSquare, Menu, LogOut, 
  Search, Bell, X, 
  Home as HomeIcon, Users, Star
} from "lucide-react";

// ==========================================
// 1. IMPORT USER PAGES
// ==========================================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile"; 
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ReviewsPage from "./pages/ReviewsPage"; 
import DealsPage from "./pages/DealsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";

// ==========================================
// 2. IMPORT ADMIN PAGES
// ==========================================
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminAffiliates from "./pages/admin/AdminAffiliates";
import AdminComments from "./pages/admin/AdminComments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import LoginPage from "./pages/admin/Login";
// ==========================================
// 3. LAYOUT: USER SIDE (Public Website)
// ==========================================
const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-200 font-sans">
      <Navbar />
      {/* Outlet renders the child route (Home, Blog, etc.) */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ==========================================
// 4. LAYOUT: ADMIN SIDE (Dashboard)
// ==========================================
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const token = localStorage.getItem("accessToken");
  if (!token || storedUser.role !== "ADMIN") {
    window.location.href = "/admin/login";
    return null;
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* --- MOBILE BACKDROP --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 bg-slate-950 shadow-md px-6">
          <span className="text-xl font-bold tracking-wider text-primary">MYTHOU<span className="text-white">GHTSHUB</span></span>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            {/* X Icon imported correctly above */}
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)] pb-4">
          {/* Dashboard Link */}
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          {/* Blogs Link */}
          <NavLink 
            to="/admin/blogs" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <PenTool size={20} /> Manage Blogs
          </NavLink>

          {/* Affiliates Link */}
          <NavLink 
            to="/admin/affiliates" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <DollarSign size={20} /> Affiliates
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={20} /> Users
          </NavLink>

          {/* Comments Link */}
          <NavLink 
            to="/admin/comments" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <MessageSquare size={20} /> Comments
          </NavLink>

          <NavLink 
            to="/admin/reviews" 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <Star size={20} /> Reviews
          </NavLink>

          {/* Bottom Actions */}
          <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
             <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
                <HomeIcon size={20} /> Back to Website
             </NavLink>
             <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300">
                <LogOut size={20} /> Logout
             </button>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* Admin Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600 hover:text-primary">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">Admin Panel</h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-primary/50 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full text-slate-700" />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 md:border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">{storedUser.username || storedUser.email || "Admin"}</p>
                <p className="text-xs text-gray-500">{storedUser.role || "ADMIN"}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
                {(storedUser.username || storedUser.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          {/* Outlet renders the specific admin page (Dashboard, Blogs, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN APP ROUTER
// ==========================================
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-4">
    <h1 className="mb-4 font-bold text-8xl text-error">404</h1>
    <p className="mb-6 text-xl text-gray-500">Page not found.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ==========================
             USER SIDE ROUTES
             Uses UserLayout (Navbar + Footer)
             ========================== */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:type" element={<CategoryPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="terms" element={<Terms />} />
        </Route>
          <Route path="admin/login" element={<LoginPage />} />
          
        {/* ==========================
             ADMIN SIDE ROUTES
             Uses AdminLayout (Sidebar + Header)
             ========================== */}
        <Route path="/" element={<UserLayout />}/>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="affiliates" element={<AdminAffiliates />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="reviews" element={<AdminReviews />} />
          {/* Redirect /admin to dashboard */}
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* ==========================
             404 FALLBACK
             ========================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
