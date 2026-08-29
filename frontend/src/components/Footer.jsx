import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", marginTop: "auto", padding: "48px 0 32px 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div>
            <div className="brand" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/logo.png" alt="Setu Logo" style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6 }} />
              Setu
            </div>
            <p style={{ fontSize: 13, color: "var(--text-soft)", lineHeight: 1.6, maxWidth: 260 }}>
              Bridging donors, volunteers, and orphanages through real-time logistics tracking and direct impact.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 14 }}>
              Platform Roles
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <Link to="/register" style={{ color: "var(--text-soft)" }}>For Donors</Link>
              <Link to="/register" style={{ color: "var(--text-soft)" }}>For Volunteers</Link>
              <Link to="/register" style={{ color: "var(--text-soft)" }}>For Orphanages</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 14 }}>
              Resources
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <Link to="/" style={{ color: "var(--text-soft)" }}>Impact Dashboard</Link>
              <Link to="/" style={{ color: "var(--text-soft)" }}>Live Route Tracking</Link>
              <Link to="/" style={{ color: "var(--text-soft)" }}>Perishable Food Logistics</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 14 }}>
              Trust & Safety
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text-soft)" }}>
              <span>🔒 OTP Verified Email</span>
              <span>📍 Geocoded OpenStreetMap</span>
              <span>⭐ Peer Rating System</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--text-dim)" }}>
          <div>© {new Date().getFullYear()} Setu Donation Logistics Platform. All rights reserved.</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>Stateless JWT Auth</span>
            <span>•</span>
            <span>WebSocket STOMP</span>
            <span>•</span>
            <span>Brevo Transact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
