import { useState } from "react";
import API from "../services/api";

function TeamCard({ team, refreshTeams, user }) {
  const [selectedRole, setSelectedRole] = useState("");
  const isOwnTeam = user && team.leader?._id === user._id;

  const handleApply = async () => {
    if (!selectedRole) {
      alert("Please select a role first");
      return;
    }

    try {
      await API.post(`/teams/${team._id}/apply`, {
        roleApplied: selectedRole
      });
      alert("Applied successfully!");
      refreshTeams();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="card">
      <h2>{team.hackathonName}</h2>
      <p className="meta-text">
        <strong>Leader:</strong> {team.leader?.fullName}
      </p>
      <p className="meta-text">
        <strong>Department:</strong> {team.leader?.department}
      </p>
      <p className="meta-text">
        <strong>Deadline:</strong>{" "}
        {new Date(team.deadline).toLocaleDateString()}
      </p>

      <p style={{ marginTop: "1rem" }}>{team.problemStatement}</p>

      <div style={{ marginTop: "1rem" }}>
        <strong>Open Roles:</strong>
        <div className="role-list">
          {team.roles.map((role, index) => (
            <span className="role-badge" key={index}>
              {role.roleName} ({role.requiredCount})
            </span>
          ))}
        </div>
      </div>

      {user && !isOwnTeam && (
        <div className="actions">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select role</option>
            {team.roles.map((role, index) => (
              <option key={index} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>
          <button className="btn btn-orange" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}

      {isOwnTeam && (
        <div className="actions">
          <span className="status-badge pending">YOUR TEAM</span>
        </div>
      )}
    </div>
  );
}

export default TeamCard;