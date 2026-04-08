import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    uid: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    year: "",
    github: "",
    linkedin: ""
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
      const res = await API.post("/auth/register", formData);

      const profile = await login(res.data.token);

      if (profile) {
        navigate("/");
      } else {
        alert("Registration succeeded but profile could not load.");
      }
    } catch (error) {
      console.error("Register failed:", error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell form-shell">
      <div className="form-card">
        <h2>Create your profile</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>UID</label>
            <input type="text" name="uid" value={formData.uid} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gmail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input type="text" name="year" value={formData.year} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Github Link</label>
            <input type="text" name="github" value={formData.github} onChange={handleChange} />
          </div>

          <div className="form-group full">
            <label>LinkedIn Link</label>
            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
          </div>

          <div className="form-actions full">
            <button type="submit" className="btn btn-orange" disabled={submitting}>
              {submitting ? "Creating..." : "Create Profile"}
            </button>

            <Link to="/" className="btn btn-grey">
              Go Back to Feed
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;