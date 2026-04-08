import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="hero-card">
          <h2>Loading...</h2>
          <p className="meta-text">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;