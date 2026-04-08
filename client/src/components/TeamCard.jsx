import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function TeamCard({ team, refreshTeams, user }) {
  const [applyingRole, setApplyingRole] = useState("");

  // Team creator / leader check
  const isOwner = user && team.leader?._id === user._id;

  const handleApply = async (roleName) => {
    try {
      setApplyingRole(roleName);

      await API.post(`/teams/${team._id}/apply`, {
        roleApplied: roleName,
      });

      alert(`Applied successfully for ${roleName}`);
      refreshTeams();
    } catch (error) {
      console.error("Apply failed:", error);
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingRole("");
    }
  };

  return (
    <div className="team-card">
      <div className="team-card-header">
        <p className="eyebrow">{team.hackathonName}</p>
        <h3>{team.problemStatement}</h3>
        <p className="meta-text">
          Deadline:{" "}
          {team.deadline
            ? new Date(team.deadline).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="team-card-body">
        <p>
          <strong>Leader:</strong> {team.leader?.fullName || "Unknown"}
        </p>
        <p>
          <strong>Department:</strong> {team.leader?.department || "N/A"}
        </p>

        {isOwner && (
          <p
            style={{
              marginTop: "1rem",
              fontWeight: "600",
              color: "#f97316",
            }}
          >
            You created this team.
          </p>
        )}

        <div style={{ marginTop: "1rem" }}>
          <h4 style={{ marginBottom: "0.75rem" }}>Open Roles</h4>

          {team.roles?.length === 0 ? (
            <p className="meta-text">No roles added yet.</p>
          ) : (
            <div className="roles-list">
              {team.roles.map((role, index) => {
                const isFull =
                  (role.filledCount || 0) >= role.requiredCount;

                return (
                  <div key={index} className="role-chip-card">
                    <div>
                      <strong>{role.roleName}</strong>
                      <p className="meta-text">
                        {role.filledCount || 0} / {role.requiredCount} filled
                      </p>
                    </div>

                    {!user ? (
                      <button className="btn btn-grey" disabled>
                        Login to Apply
                      </button>
                    ) : isOwner ? (
                      <button className="btn btn-grey" disabled>
                        Your Team
                      </button>
                    ) : isFull ? (
                      <button className="btn btn-grey" disabled>
                        Role Full
                      </button>
                    ) : (
                      <button
                        className="btn btn-orange"
                        onClick={() => handleApply(role.roleName)}
                        disabled={applyingRole === role.roleName}
                      >
                        {applyingRole === role.roleName
                          ? "Applying..."
                          : "Apply"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="team-card-footer">
        {user && (
          <Link to={`/chat/${team._id}`} className="btn btn-grey">
            Open Team Chat
          </Link>
        )}
      </div>
    </div>
  );
}

export default TeamCard;