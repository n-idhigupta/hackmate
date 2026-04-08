import TeamChat from "./pages/TeamChat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateTeam from "./pages/CreateTeam";
import Manage from "./pages/Manage";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
<Route
  path="/chat/:teamId"
  element={
    <ProtectedRoute>
      <TeamChat />
    </ProtectedRoute>
  }
/>
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <Manage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;