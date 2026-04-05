import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          HackMate
        </Link>
      </div>

      <div className="nav-center">
        <Link to="/" className="nav-link">
          Feed
        </Link>
        <Link to="/create" className="nav-link">
          Create
        </Link>
        <Link to="/manage" className="nav-link">
          Manage
        </Link>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/register">
              <button className="btn btn-orange">Register to Start</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-grey">Login</button>
            </Link>
          </>
        ) : (
          <>
            <span className="nav-link">
              {user.role === "leader" ? "Leader" : "Member"}
            </span>
            <Link to="/profile">
              <button className="btn btn-outline">Your Profile</button>
            </Link>
            <button className="btn btn-grey" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;