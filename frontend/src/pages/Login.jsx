import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api"; // Adjust path based on your folder structure

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-base-200">
      {/* Background Image with Overlay */}
      <div 
        className="hero-overlay bg-opacity-60" 
        style={{ backgroundImage: 'url(https://picsum.photos/seed/setup/1920/1080)' }}
      ></div>

      <div className="flex-col w-full max-w-5xl gap-10 hero-content lg:flex-row-reverse">
        
        {/* Text / Illustration Side */}
        <div className="hidden text-center text-white lg:text-left lg:max-w-md lg:block">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="py-6 text-lg">
            Log in to access your dashboard, manage your blogs, and connect with the MyThoughtsHub community.
          </p>
        </div>

        {/* Form Side */}
        <div className="w-full max-w-md border shadow-2xl card shrink-0 bg-base-100/90 backdrop-blur-sm border-white/20">
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="mb-2 text-3xl font-bold text-center text-primary">Login</h2>
            
            {error && (
              <div className="py-2 text-sm alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="font-medium label-text">Email</span>
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="john@example.com" 
                  className="w-full pl-10 input input-bordered" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="font-medium label-text">Password</span>
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 input input-bordered" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <label className="label">
                {/* FIXED: Changed href="#" to a valid route "/forgot-password" */}
                <a href="/forgot-password" className="text-xs label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div className="mt-6 form-control">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Login"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">New to MyThoughtsHub?</span>
              <Link to="/register" className="ml-1 text-sm font-bold link link-primary">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}