import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">MyThoughtsHub</Link>
      </div>
      <div className="flex-none space-x-2">
        {!token ? (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-outline btn-sm">Register</Link>
          </>
        ) : (
          <button onClick={logout} className="btn btn-error btn-sm text-white">Logout</button>
        )}
      </div>
    </div>
  );
}
