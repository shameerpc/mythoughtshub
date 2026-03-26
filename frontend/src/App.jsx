import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
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

// Legal
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
    <h1 className="mb-4 font-bold text-8xl text-error">404</h1>
    <p className="mb-6 text-xl text-gray-500">Oops! The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-outline btn-primary">Go Back Home</Link>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-base-200">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:type" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;