import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api"; // Adjust path based on your folder structure

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(formData);
      // Redirect to login page on success
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-base-200">
      {/* Background Image with Overlay */}
      <div 
        className="hero-overlay bg-opacity-60" 
        style={{ backgroundImage: 'url(https://picsum.photos/seed/tech/1920/1080)' }}
      ></div>

      <div className="flex-col w-full max-w-5xl gap-10 hero-content lg:flex-row-reverse">
        
        {/* Text / Illustration Side (Visible on Desktop) */}
        <div className="hidden text-center text-white lg:text-left lg:max-w-md lg:block">
          <h1 className="text-5xl font-bold">Join Us Now!</h1>
          <p className="py-6 text-lg">
            Create an account to share your thoughts, write blogs, and connect with the community. It’s free and takes less than a minute.
          </p>
        </div>

        {/* Form Side */}
        <div className="w-full max-w-md border shadow-2xl card shrink-0 bg-base-100/90 backdrop-blur-sm border-white/20">
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="mb-2 text-3xl font-bold text-center text-primary">Create Account</h2>
            
            {error && (
              <div className="py-2 text-sm alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="font-medium label-text">Username</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="johndoe" 
                  className="w-full pl-10 input input-bordered" 
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

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
            </div>

            <div className="mt-6 form-control">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Register"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link to="/login" className="ml-1 text-sm font-bold link link-primary">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}