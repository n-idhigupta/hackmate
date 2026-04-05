import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfileData(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  const { user, applications, createdTeams } = profileData;

  return (
    <div>
      <h2 className="section-title">Your Profile</h2>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>{user.fullName}</h3>
          <p className="meta-text"><strong>UID:</strong> {user.uid}</p>
          <p className="meta-text"><strong>Email:</strong> {user.email}</p>
          <p className="meta-text"><strong>Phone:</strong> {user.phone}</p>
          <p className="meta-text"><strong>Department:</strong> {user.department}</p>
          <p className="meta-text"><strong>Year:</strong> {user.year}</p>
          <p className="meta-text"><strong>Role:</strong> {user.role}</p>
          <p className="meta-text"><strong>Experience Points:</strong> {user.experiencePoints}</p>
        </div>

        <div className="profile-card">
          <h3>Professional Links</h3>
          <p className="meta-text">
            <strong>GitHub:</strong>{" "}
            {user.github ? (
              <a href={user.github} target="_blank" rel="noreferrer" className="small-link">
                Open GitHub
              </a>
            ) : (
              "Not provided"
            )}
          </p>

          <p className="meta-text">
            <strong>LinkedIn:</strong>{" "}
            {user.linkedin ? (
              <a href={user.linkedin} target="_blank" rel="noreferrer" className="small-link">
                Open LinkedIn
              </a>
            ) : (
              "Not provided"
            )}
          </p>
        </div>
      </div>

      <div className="profile-card" style={{ marginTop: "1.5rem" }}>
        <h3>Your Applications</h3>

        {applications.length === 0 ? (
          <p className="meta-text">You have not applied to any teams yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="role-item">
              <div>
                <strong>{app.team?.hackathonName}</strong>
                <p className="meta-text">Role: {app.roleApplied}</p>
              </div>
              <span className={`status-badge ${app.status}`}>
                {app.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="profile-card" style={{ marginTop: "1.5rem" }}>
        <h3>Your Created Teams</h3>

        {createdTeams.length === 0 ? (
          <p className="meta-text">You haven’t created any teams yet.</p>
        ) : (
          createdTeams.map((team) => (
            <div key={team._id} className="role-item">
              <div>
                <strong>{team.hackathonName}</strong>
                <p className="meta-text">
                  Deadline: {new Date(team.deadline).toLocaleDateString()}
                </p>
              </div>
              <span className="status-badge pending">LEADER</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;