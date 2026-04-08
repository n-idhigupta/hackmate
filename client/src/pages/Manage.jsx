import { useEffect, useState } from "react";
import API from "../services/api";

function Manage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/teams/manage/applications");
      console.log("Applications Response:", res.data);
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
      alert(error.response?.data?.message || "Could not load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.put(`/teams/manage/applications/${appId}`, { status });
      alert(`Application ${status} successfully`);
      fetchApplications();
    } catch (error) {
      console.error("Failed to update status", error);
      alert(error.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="page-shell">
      <div className="hero-card">
        <p className="eyebrow">Leader Dashboard</p>
        <h1>Manage Applications</h1>
        <p className="hero-copy">
          Review applicants, compare their profile strength, and build your best team.
        </p>
      </div>

      {loading ? (
        <div className="empty-box">
          <h3>Loading applications...</h3>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-box">
          <h3>No applications yet</h3>
          <p className="meta-text">
            Once students apply to your team roles, they will appear here.
          </p>
        </div>
      ) : (
        <div className="team-grid">
          {applications.map((app) => (
            <div key={app._id} className="team-card">
              <div className="team-card-header">
                <p className="eyebrow">{app.team?.hackathonName}</p>
                <h3>{app.user?.fullName}</h3>
                <p className="meta-text">Applied for: {app.roleApplied}</p>
              </div>

              <div className="team-card-body">
                <p><strong>Email:</strong> {app.user?.email || "N/A"}</p>
                <p><strong>Department:</strong> {app.user?.department || "N/A"}</p>
                <p><strong>Year:</strong> {app.user?.year || "N/A"}</p>
                <p>
                  <strong>Hackathons Participated:</strong>{" "}
                  {app.user?.experiencePoints ?? 0}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        app.status === "accepted"
                          ? "green"
                          : app.status === "rejected"
                          ? "red"
                          : "#f97316",
                      fontWeight: "700",
                    }}
                  >
                    {app.status}
                  </span>
                </p>

                <div style={{ marginTop: "1rem" }}>
                  <p><strong>GitHub:</strong></p>
                  {app.user?.github ? (
                    <a href={app.user.github} target="_blank" rel="noreferrer">
                      Open GitHub
                    </a>
                  ) : (
                    <p className="meta-text">Not Added</p>
                  )}
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <p><strong>LinkedIn:</strong></p>
                  {app.user?.linkedin ? (
                    <a href={app.user.linkedin} target="_blank" rel="noreferrer">
                      Open LinkedIn
                    </a>
                  ) : (
                    <p className="meta-text">Not Added</p>
                  )}
                </div>
              </div>

              <div className="team-card-footer">
                {app.status === "pending" ? (
                  <>
                    <button
                      className="btn btn-orange"
                      onClick={() => handleStatusUpdate(app._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-grey"
                      onClick={() => handleStatusUpdate(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button className="btn btn-grey" disabled>
                    Already {app.status}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Manage;