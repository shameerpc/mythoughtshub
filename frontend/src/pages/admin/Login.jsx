import { useState } from "react";

import { loginAdmin } from "../../api/auth.api";

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState(""); // idle | loading | success | error
  const [showPassword , setShowPassword] = useState(false)
  const [formData, setFormData] = useState({email: "", password: ""})
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }
  const togglePassword = () =>setShowPassword(!showPassword)
  const handleLogin = async(e) => {
    
    setStatus("loading");
    // Replace with your real auth call (e.g. NextAuth, Firebase, fetch)
    try{
      const res = await loginAdmin(formData)
      //1.save the token
      localStorage.setItem("accessToken", res.token)
      localStorage.setItem("user", res.user)
      window.location.href = "/admin/dashboard"; 
    }catch(err){
      setStatus("error")
      console.error("Login Error:", err.response?.data);
      const message = err.response?.data?.message || err.response?.data?.error || "Invalid email or password.";
      setMessage(message); 
      return
    }finally {
      
    }
    const message = "Signed in successfully! Redirecting…";
    setMessage(message);
    setTimeout(() => setStatus("success"), 1200);
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1a1a2e] flex-col justify-between p-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute w-80 h-80 rounded-full bg-violet-600 opacity-20 -top-20 -left-20" />
        <div className="absolute w-48 h-48 rounded-full bg-emerald-500 opacity-15 bottom-10 -right-12" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white text-lg font-light tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>
            Verda
          </span>
        </div>

        {/* Tagline */}
        <div className="z-10">
          <h2 className="text-white text-3xl font-light leading-relaxed mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
            Work smarter,{" "}
            <em className="text-emerald-300 not-italic">not harder.</em>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            The platform that brings your team, tools, and tasks into one elegant space.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-12 bg-white">
        <div className="w-full max-w-sm mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">Sign in to continue to your workspace</p>
          </div>

          {/* Success / Error message */}
          {status && (
            <div
              className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
                status === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              name = "email"
              onChange={handleChange}
              className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name = "password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
              />
              
              {/* Toggle Eye Button */}
                <button 
                  type="button" 
                  onClick={togglePassword} 
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                > 
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
            </div>
            
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-violet-600 w-3.5 h-3.5"
              />
              Remember me
            </label>
            <a href="#" className="text-xs text-violet-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button
            onClick={handleLogin}
            disabled={status === "loading"}
            className={`w-full h-11 rounded-lg text-sm font-medium text-white transition active:scale-95 ${
               "bg-violet-600 hover:bg-violet-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {status === "loading"
              ? "Signing in…"
              : "Sign in"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google */}
          <button className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition active:scale-95">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Sign up */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-violet-600 font-medium hover:underline">
              Create one free
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}