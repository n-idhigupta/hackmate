import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Manage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/teams/leader/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/teams/application/${appId}`, { status });
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update application");
    }
  };

  if (user?.role !== "leader") {
    return (
      <div className="empty-box">
        <h2>Leader Access Only</h2>
        <p className="meta-text">
          You’ll see this page after you create a team and become a leader.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Leader's Manage Dashboard</h2>

      {loading ? (
        <div className="empty-box">
          <h3>Loading applications...</h3>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-box">
          <h3>No applications yet.</h3>
          <p className="meta-text">When students apply, they will appear here.</p>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="manage-card">
            <h3>{app.team?.hackathonName}</h3>
            <p className="meta-text">
              <strong>Applicant:</strong> {app.user?.fullName}
            </p>
            <p className="meta-text">
              <strong>Email:</strong> {app.user?.email}
            </p>
            <p className="meta-text">
              <strong>Department:</strong> {app.user?.department}
            </p>
            <p className="meta-text">
              <strong>Year:</strong> {app.user?.year}
            </p>
            <p className="meta-text">
              <strong>GitHub:</strong> {app.user?.github || "Not provided"}
            </p>
            <p className="meta-text">
              <strong>LinkedIn:</strong> {app.user?.linkedin || "Not provided"}
            </p>
            <p className="meta-text">
              <strong>Applied Role:</strong> {app.roleApplied}
            </p>

            <div style={{ marginTop: "1rem" }}>
              <span className={`status-badge ${app.status}`}>
                {app.status.toUpperCase()}
              </span>
            </div>

            {app.status === "pending" && (
              <div className="actions">
                <button
                  className="btn btn-orange"
                  onClick={() => updateStatus(app._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-grey"
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Manage;