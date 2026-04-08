import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="hero-card">
          <h2>Loading Profile...</h2>
          <p className="meta-text">Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell">
        <div className="hero-card">
          <h2>Profile not found</h2>
          <p className="meta-text">Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="hero-card">
        <p className="eyebrow">Your HackMate Profile</p>
        <h1>{user?.fullName}</h1>
        <p className="hero-copy">
          Manage your student identity, links, and progress on HackMate.
        </p>
      </div>

      <div className="dashboard-card">
        <h3>Profile Information</h3>

        <div className="profile-grid">
          <div className="profile-stat">
            <p>Full Name</p>
            <h2>{user?.fullName || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>UID</p>
            <h2>{user?.uid || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>Email</p>
            <h2>{user?.email || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>Phone</p>
            <h2>{user?.phone || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>Department</p>
            <h2>{user?.department || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>Year</p>
            <h2>{user?.year || "N/A"}</h2>
          </div>

          <div className="profile-stat">
            <p>Platform Role</p>
            <h2>{user?.role || "member"}</h2>
          </div>

          <div className="profile-stat">
            <p>Hackathons Participated</p>
            <h2>{user?.experiencePoints ?? 0}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Links</h3>

        <div className="profile-grid">
          <div className="profile-stat">
            <p>GitHub</p>
            <h2 style={{ fontSize: "1rem", wordBreak: "break-word" }}>
              {user?.github ? (
                <a href={user.github} target="_blank" rel="noreferrer">
                  Open GitHub
                </a>
              ) : (
                "Not Added"
              )}
            </h2>
          </div>

          <div className="profile-stat">
            <p>LinkedIn</p>
            <h2 style={{ fontSize: "1rem", wordBreak: "break-word" }}>
              {user?.linkedin ? (
                <a href={user.linkedin} target="_blank" rel="noreferrer">
                  Open LinkedIn
                </a>
              ) : (
                "Not Added"
              )}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;