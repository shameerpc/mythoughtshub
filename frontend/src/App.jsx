import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page Components
import Home from "./pages/Home";
import BlogList from "./pages/BlogList"; // <--- ADD THIS IMPORT
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile"; 
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ReviewsPage from "./pages/ReviewsPage"; 

// const ComingSoon = ({ title }) => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
//     <div className="p-6 text-center">
//       <div className="mb-4 text-6xl animate-bounce">🚧</div>
//       <h1 className="mb-2 text-3xl font-bold text-primary">{title || "Page Under Construction"}</h1>
//       <p className="max-w-md mx-auto mb-6 text-gray-500">
//         We are working hard to bring you this feature. Check back soon!
//       </p>
//       <a href="/" className="btn btn-primary">Back to Home</a>
//     </div>
//   </div>
// );

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
    <div className="text-center">
      <h1 className="mb-4 font-bold text-8xl text-error">404</h1>
      <p className="mb-6 text-xl text-gray-600">Oops! The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-outline btn-primary">Go Back Home</a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogList />} /> {/* <--- ADD THIS ROUTE */}
            <Route path="/blog/:id" element={<BlogDetails />} />
            
            {/* Category Routes */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:type" element={<CategoryPage />} />
            
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Placeholder */}
            <Route path="/reviews" element={<ReviewsPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;