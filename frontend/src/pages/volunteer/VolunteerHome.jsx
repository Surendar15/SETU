import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOpenDeliveries, getMyDeliveries } from "../../api/deliveryApi";
import ExpiryTimer from "../../components/ExpiryTimer";

export default function VolunteerHome() {
  const [openDeliveries, setOpenDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOpenDeliveries(), getMyDeliveries()])
      .then(([oRes, mRes]) => {
        setOpenDeliveries(oRes.data || []);
        setMyDeliveries(mRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeDeliveries = myDeliveries.filter((d) => d.status !== "DELIVERED");
  const completedDeliveries = myDeliveries.filter((d) => d.status === "DELIVERED");

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Volunteer Landing Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #78350F 0%, #D97706 50%, #B45309 100%)",
          color: "#FFFFFF",
          borderRadius: "var(--radius-lg)",
          padding: "32px 40px",
          marginBottom: 32,
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 780, position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FDE68A", marginBottom: 8 }}>
            🚚 VOLUNTEER MISSION CONTROL
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>
            Carry Hope Last-Mile to Orphanages
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, marginBottom: 24 }}>
            Accept open donation pickup requests in your area. Follow turn-by-turn interactive delivery maps, calculate routes, and deliver essential goods safely.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/volunteer/open" className="btn" style={{ background: "#FFFFFF", color: "#0F172A", fontWeight: 800, padding: "10px 24px", fontSize: 14 }}>
              🚚 Browse Open Pickups ({openDeliveries.length})
            </Link>
            <Link to="/volunteer/my" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              📦 Active Deliveries ({activeDeliveries.length})
            </Link>
            <Link to="/volunteer/profile" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              👤 Driver Profile & Stats
            </Link>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold-tint)", color: "var(--gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            🚚
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Open Pickups ({openDeliveries.length})</h3>
            <p className="meta" style={{ fontSize: 12 }}>Donations matched with orphanages awaiting driver pickup.</p>
            <Link to="/volunteer/open" style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-dark)", display: "inline-block", marginTop: 6 }}>
              View Open Pickups →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--brand-tint)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            📦
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>My Deliveries</h3>
            <p className="meta" style={{ fontSize: 12 }}>{activeDeliveries.length} In Transit • {completedDeliveries.length} Completed</p>
            <Link to="/volunteer/my" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", display: "inline-block", marginTop: 6 }}>
              Open Route Tracker →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            📍
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Address Dispatch</h3>
            <p className="meta" style={{ fontSize: 12 }}>OpenStreetMap geocoded pickup & dropoff addresses.</p>
            <Link to="/volunteer/my" style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", display: "inline-block", marginTop: 6 }}>
              View Deliveries →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Widescreen Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Left Column: Nearby Pickups */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 20 }}>Available Delivery Pickups Nearby</h2>
            <Link to="/volunteer/open" style={{ fontSize: 13, fontWeight: 600 }}>See all ({openDeliveries.length})</Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: 24, textAlign: "center" }}>Loading open deliveries...</div>
          ) : openDeliveries.length === 0 ? (
            <div className="empty-state" style={{ padding: 40, background: "var(--surface)", border: "1.5px dashed var(--line)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
              <h3>No pending pickups</h3>
              <p className="meta" style={{ marginTop: 4 }}>All current donation packages have been assigned to volunteers!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {openDeliveries.slice(0, 4).map((d) => (
                <div key={d.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{d.category || "Donation"} Package</span>
                      {d.isUrgent && <span className="chip chip-urgent">⚡ URGENT</span>}
                      <span className="mono meta" style={{ fontSize: 11 }}>Delivery #{d.id}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 6 }}>
                      📍 <strong>Pickup:</strong> {d.pickupAddress}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 2 }}>
                      🏠 <strong>Dropoff:</strong> {d.orphanageAddress || "Orphanage Destination"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Link to="/volunteer/open" className="btn btn-primary btn-sm">
                      Accept Pickup →
                    </Link>
                    {d.expiresAt && <div style={{ marginTop: 6 }}><ExpiryTimer expiresAt={d.expiresAt} /></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Driver Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Driver Performance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="meta">Completed Deliveries</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>{completedDeliveries.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="meta">Active Deliveries</span>
                <span style={{ fontWeight: 700, color: "#d97706" }}>{activeDeliveries.length}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "var(--surface-hover)" }}>
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>Driver Checklist</h3>
            <div style={{ fontSize: 12.5, color: "var(--text-soft)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div>✅ Verify donor address on map</div>
              <div>✅ Check perishable expiry countdown</div>
              <div>✅ Confirm OTP / delivery receipt at orphanage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
