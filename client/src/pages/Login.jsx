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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.token, res.data.user);
      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-card">
      <h2>Login to HackMate</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Gmail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-orange">
          Login
        </button>
      </form>

      <p className="small-text">
        Don’t have an account?{" "}
        <Link to="/register" className="small-link">
          Register now
        </Link>
      </p>
    </div>
  );
}

export default Login;