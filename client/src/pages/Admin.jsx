import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user, loading } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes, teamsRes, appsRes] = await Promise.all([
        API.get("/admin/analytics"),
        API.get("/admin/users"),
        API.get("/admin/teams"),
        API.get("/admin/applications")
      ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setTeams(teamsRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error("Admin data fetch failed", error);
      setError("Failed to load admin dashboard. Make sure this account is admin.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminData();
    } else if (!loading) {
      setPageLoading(false);
    }
  }, [user, loading]);

  const handleDeleteTeam = async (id) => {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/team/${id}`);
      fetchAdminData();
    } catch (error) {
      console.error("Failed to delete team", error);
      alert("Failed to delete team");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/user/${id}`);
      fetchAdminData();
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user");
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="page-shell">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell">
        <section className="hero-card">
          <p className="eyebrow">Access Denied</p>
          <h1>Admin only</h1>
          <p className="hero-copy">
            This page is only available for admin accounts.
          </p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <section className="hero-card">
          <p className="eyebrow">Admin Error</p>
          <h1>Something went wrong</h1>
          <p className="hero-copy">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Admin Panel</p>
        <h1>HackMate Platform Control Center</h1>
        <p className="hero-copy">
          Monitor users, teams, applications, and overall platform health.
        </p>
      </section>

      {analytics && (
        <>
          <section className="stats-grid">
            <div className="stat-card"><p>Total Users</p><h2>{analytics.totalUsers}</h2></div>
            <div className="stat-card"><p>Total Leaders</p><h2>{analytics.totalLeaders}</h2></div>
            <div className="stat-card"><p>Total Admins</p><h2>{analytics.totalAdmins}</h2></div>
            <div className="stat-card"><p>Total Teams</p><h2>{analytics.totalTeams}</h2></div>
            <div className="stat-card"><p>Total Applications</p><h2>{analytics.totalApplications}</h2></div>
            <div className="stat-card"><p>Accepted</p><h2>{analytics.acceptedApplications}</h2></div>
            <div className="stat-card"><p>Rejected</p><h2>{analytics.rejectedApplications}</h2></div>
            <div className="stat-card"><p>Pending</p><h2>{analytics.pendingApplications}</h2></div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Top Departments</h3>
              {analytics.topDepartments?.length === 0 ? (
                <p className="meta-text">No department data yet.</p>
              ) : (
                analytics.topDepartments?.map((dept) => (
                  <div key={dept._id} className="dashboard-row">
                    <span>{dept._id || "Unknown"}</span>
                    <strong>{dept.count}</strong>
                  </div>
                ))
              )}
            </div>

            <div className="dashboard-card">
              <h3>Most Applied Roles</h3>
              {analytics.topRoles?.length === 0 ? (
                <p className="meta-text">No role application data yet.</p>
              ) : (
                analytics.topRoles?.map((role) => (
                  <div key={role._id} className="dashboard-row">
                    <span>{role._id || "Unknown"}</span>
                    <strong>{role.count}</strong>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}

      <section className="dashboard-card">
        <h3>All Users</h3>
        {users.length === 0 ? (
          <p className="meta-text">No users found.</p>
        ) : (
          <div className="admin-list">
            {users.map((u) => (
              <div className="admin-item" key={u._id}>
                <div>
                  <h4>{u.fullName}</h4>
                  <p>{u.email}</p>
                  <span>{u.department} • Year {u.year} • {u.role}</span>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(u._id)}>
                  Delete User
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <h3>All Teams</h3>
        {teams.length === 0 ? (
          <p className="meta-text">No teams found.</p>
        ) : (
          <div className="admin-list">
            {teams.map((team) => (
              <div className="admin-item" key={team._id}>
                <div>
                  <h4>{team.hackathonName}</h4>
                  <p>{team.problemStatement}</p>
                  <span>
                    Leader: {team.leader?.fullName || "Unknown"} • Deadline:{" "}
                    {new Date(team.deadline).toLocaleDateString()}
                  </span>
                </div>
                <button className="btn btn-danger" onClick={() => handleDeleteTeam(team._id)}>
                  Delete Team
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <h3>All Applications</h3>
        {applications.length === 0 ? (
          <p className="meta-text">No applications yet.</p>
        ) : (
          <div className="admin-list">
            {applications.map((app) => (
              <div className="admin-item" key={app._id}>
                <div>
                  <h4>{app.user?.fullName || "Unknown Applicant"}</h4>
                  <p>
                    Applied for <strong>{app.roleApplied}</strong> in{" "}
                    <strong>{app.team?.hackathonName || "Unknown Team"}</strong>
                  </p>
                  <span>Status: {app.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;