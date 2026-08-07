import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      redirectByRole(data.role);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === "DONOR") navigate("/donor");
    else if (role === "VOLUNTEER") navigate("/volunteer");
    else if (role === "ORPHANAGE") navigate("/orphanage");
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <span className="auth-eyebrow">Setu · Donation Network</span>
        <h1>Every donation is a chain of three people showing up.</h1>
        <p>
          A donor lets go, a volunteer carries it, an orphanage receives it.
          Setu keeps that chain visible from the first offer to the last mile.
        </p>
        <div className="waypoint-chain">
          <div className="waypoint">
            <span className="waypoint-dot active" />
            <span className="waypoint-label">DONOR</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className="waypoint-dot active" />
            <span className="waypoint-label">VOLUNTEER</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className="waypoint-dot" />
            <span className="waypoint-label">ORPHANAGE</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="meta" style={{ marginTop: 6, marginBottom: 28 }}>
            Log in to continue where you left off.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="banner-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="meta" style={{ marginTop: 20 }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
