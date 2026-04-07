import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wait until user is fetched
  if (token && !user) {
    return <div className="page-shell"><p>Loading...</p></div>;
  }

  return children;
}

export default ProtectedRoute;