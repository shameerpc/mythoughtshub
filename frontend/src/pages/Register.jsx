import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "https://mythoughtshub.onrender.com";


export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/register`, formData);
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input name="username" onChange={handleChange} placeholder="Name" className="input input-bordered w-full" />
        <input name="email" onChange={handleChange} placeholder="Email" className="input input-bordered w-full" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="input input-bordered w-full" />
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
