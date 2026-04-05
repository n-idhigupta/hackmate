import { useEffect, useState } from "react";
import API from "../services/api";
import TeamCard from "../components/TeamCard";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/teams?search=${search}&role=${role}&department=${department}`
      );
      setTeams(res.data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeams();
  };

  return (
    <>
      <div className="hero-box">
        <h1>Build Your Dream Hackathon Team</h1>
        <p>
          Discover hackathon teams, apply to roles, or create your own project squad.
        </p>
      </div>

      <div className="form-card" style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Search Teams</h3>

        <form onSubmit={handleSearch} className="form-grid">
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Hackathon / leader / idea"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All Roles</option>
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend Developer</option>
              <option value="Database">Database Engineer</option>
              <option value="API">API Developer</option>
              <option value="PPT">PPT Maker</option>
              <option value="Designer">UI/UX Designer</option>
              <option value="ML">ML Engineer</option>
            </select>
          </div>

          <div className="form-group full">
            <label>Leader Department</label>
            <input
              type="text"
              placeholder="e.g. CSE, IT, AI-DS"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="form-group full">
            <button type="submit" className="btn btn-orange">
              Search Teams
            </button>
          </div>
        </form>
      </div>

      <h2 className="section-title">Team Feed</h2>

      {loading ? (
        <div className="empty-box">
          <h3>Loading teams...</h3>
        </div>
      ) : teams.length === 0 ? (
        <div className="empty-box">
          <h3>No matching teams found.</h3>
          <p className="meta-text">Try changing your search or create one yourself.</p>
        </div>
      ) : (
        <div className="team-grid">
          {teams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              refreshTeams={fetchTeams}
              user={user}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Feed;