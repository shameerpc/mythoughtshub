import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    if (token) {
      setUserAvatar(`https://api.dicebear.com/7.x/identicon/svg?seed=${token.slice(0, 6)}`);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-neutral text-neutral-content shadow-md">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl md:text-2xl font-bold tracking-wide hover:scale-105 transition-all"
        >
          🚀 MyThoughtsHub
        </Link>
      </div>

      <div className="flex-none gap-2">
        {!token ? (
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="btn btn-sm btn-outline hover:btn-primary transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-sm btn-outline hover:btn-secondary transition-all duration-300"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar hover:scale-110 transition-all"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 animate-pulse">
                <img src={userAvatar} alt="User avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 text-base-content rounded-box w-52"
            >
              <li>
                <Link to="/profile">👤 Profile</Link>
              </li>
              <li>
                <button onClick={logout}>🚪 Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
