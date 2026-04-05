import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    uid: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    github: "",
    linkedin: "",
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
      const res = await API.post("/auth/register", formData);
      login(res.data.token, res.data.user);
      alert("Profile created successfully!");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-card">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>UID</label>
          <input name="uid" value={formData.uid} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gmail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input name="department" value={formData.department} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input name="year" value={formData.year} onChange={handleChange} required />
        </div>

        <div className="form-group full">
          <label>GitHub Link</label>
          <input name="github" value={formData.github} onChange={handleChange} />
        </div>

        <div className="form-group full">
          <label>LinkedIn Link</label>
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
        </div>

        <div className="form-group full">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group full">
          <button type="submit" className="btn btn-orange">
            Create Profile
          </button>
        </div>
      </form>

      <p className="small-text">
        Already have an account?{" "}
        <Link to="/" className="small-link">
          Go back to feed
        </Link>
      </p>
    </div>
  );
}

export default Register;