import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="empty-box">
      <h2>404 - Page Not Found</h2>
      <p className="meta-text">This page wandered off to some other hackathon.</p>
      <div className="actions" style={{ justifyContent: "center" }}>
        <Link to="/">
          <button className="btn btn-orange">Go to Feed</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;