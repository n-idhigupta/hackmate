import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function CreateTeam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hackathonName: "",
    problemStatement: "",
    deadline: ""
  });

  const [roleName, setRoleName] = useState("");
  const [requiredCount, setRequiredCount] = useState(1);
  const [roles, setRoles] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addRole = () => {
    if (!roleName) return;

    setRoles((prev) => [...prev, { roleName, requiredCount }]);
    setRoleName("");
    setRequiredCount(1);
  };

  const removeRole = (index) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roles.length === 0) {
      alert("Please add at least one role");
      return;
    }

    try {
      await API.post("/teams", {
        ...formData,
        roles
      });

      alert("Team published successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create team");
    }
  };

  return (
    <div className="form-card">
      <h2>Create a Team</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Hackathon Name</label>
          <input
            name="hackathonName"
            value={formData.hackathonName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Problem Statement</label>
          <textarea
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role Selection</label>
          <div className="role-row">
            <select value={roleName} onChange={(e) => setRoleName(e.target.value)}>
              <option value="">Select role</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Database Engineer">Database Engineer</option>
              <option value="API Developer">API Developer</option>
              <option value="PPT Maker">PPT Maker</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="ML Engineer">ML Engineer</option>
            </select>

            <input
              type="number"
              min="1"
              value={requiredCount}
              onChange={(e) => setRequiredCount(Number(e.target.value))}
              placeholder="Count"
            />

            <button type="button" className="btn btn-grey" onClick={addRole}>
              Add +
            </button>
          </div>
        </div>

        {roles.length > 0 && (
          <div className="role-list">
            <h4 style={{ marginBottom: "0.8rem" }}>Added Roles</h4>
            {roles.map((role, index) => (
              <div key={index} className="role-item">
                <span>
                  {role.roleName} — {role.requiredCount}
                </span>
                <button
                  type="button"
                  className="btn btn-grey"
                  onClick={() => removeRole(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button type="submit" className="btn btn-orange">
            Publish Team
          </button>

          <Link to="/">
            <button type="button" className="btn btn-outline">
              Back to Feed
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateTeam;