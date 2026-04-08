import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await API.post("/auth/login", formData);

      const profile = await login(res.data.token);

      if (profile) {
        navigate("/");
      } else {
        alert("Login succeeded but profile could not load.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell form-shell">
      <div className="form-card">
        <h2>Login to HackMate</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions full">
            <button type="submit" className="btn btn-orange" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>

            <Link to="/register" className="btn btn-grey">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;