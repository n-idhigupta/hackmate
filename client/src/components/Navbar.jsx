import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand-logo">
          HackMate
        </Link>
      </div>

      <nav className="nav-center">
        <Link to="/">Feed</Link>
        {user && <Link to="/create">Create</Link>}
        {user && <Link to="/manage">Manage</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="nav-right">
        {user && <NotificationBell />}

        {loading ? null : !user ? (
          <>
            <Link to="/register" className="btn btn-orange">
              Register to Start
            </Link>
            <Link to="/login" className="btn btn-grey">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn btn-grey">
              Your Profile
            </Link>
            <button className="btn btn-orange" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;