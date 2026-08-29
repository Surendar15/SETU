import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyDonations } from "../../api/donationApi";
import { getAnalyticsStats } from "../../api/statsApi";
import ExpiryTimer from "../../components/ExpiryTimer";

export default function DonorHome() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyDonations(), getAnalyticsStats()])
      .then(([dRes, sRes]) => {
        setDonations(dRes.data || []);
        setStats(sRes.data || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = donations.filter((d) => d.status === "PENDING").length;
  const acceptedCount = donations.filter((d) => d.status === "ACCEPTED").length;
  const deliveredCount = donations.filter((d) => d.status === "DELIVERED").length;

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Donor Landing Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F4C3A 0%, #166534 50%, #0284C7 100%)",
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
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A7F3D0", marginBottom: 8 }}>
            🎁 DONOR LOGISTICS LANDING HUB
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>
            Turn Your Spare Items Into Direct Relief
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, marginBottom: 24 }}>
            Post clothes, fresh food, books, or medical supplies. Volunteers pick up directly from your doorstep and deliver with live GPS tracking to verified orphanages.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/donor/post" className="btn" style={{ background: "#FFFFFF", color: "#0F172A", fontWeight: 800, padding: "10px 24px", fontSize: 14 }}>
              ➕ Post New Donation
            </Link>
            <Link to="/donor/donations" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              📦 View My Donations ({donations.length})
            </Link>
            <Link to="/donor/profile" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              👤 Social Profile & Ratings
            </Link>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--brand-tint)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            ➕
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Post a Donation</h3>
            <p className="meta" style={{ fontSize: 12 }}>List food, clothes, or books with optional urgency & expiry timer.</p>
            <Link to="/donor/post" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", display: "inline-block", marginTop: 6 }}>
              Create Listing →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold-tint)", color: "var(--gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            📦
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Active Items ({donations.length})</h3>
            <p className="meta" style={{ fontSize: 12 }}>{pendingCount} Pending • {acceptedCount} In Delivery • {deliveredCount} Completed</p>
            <Link to="/donor/donations" style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-dark)", display: "inline-block", marginTop: 6 }}>
              Track Progress →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            ⭐
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Community Impact</h3>
            <p className="meta" style={{ fontSize: 12 }}>Total completed deliveries across the Setu logistics network.</p>
            <Link to="/donor/profile" style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", display: "inline-block", marginTop: 6 }}>
              View Profile & Ratings →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Widescreen Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Left Column: Recent Activity & Recent Donations */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 20 }}>Your Recent Donations</h2>
            <Link to="/donor/donations" style={{ fontSize: 13, fontWeight: 600 }}>See all ({donations.length})</Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: 24, textAlign: "center" }}>Loading donations...</div>
          ) : donations.length === 0 ? (
            <div className="empty-state" style={{ padding: 40, background: "var(--surface)", border: "1.5px dashed var(--line)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
              <h3>No donations posted yet</h3>
              <p className="meta" style={{ marginTop: 4, marginBottom: 16 }}>Post your first donation to connect with orphanages and volunteer drivers.</p>
              <Link to="/donor/post" className="btn btn-primary btn-sm">Post a donation now</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {donations.slice(0, 4).map((d) => (
                <div key={d.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{d.category}</span>
                      {d.isUrgent && <span className="chip chip-urgent">⚡ URGENT</span>}
                      <span className="mono meta" style={{ fontSize: 11 }}>#{d.id}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 4 }}>{d.description}</p>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                      📍 Pickup: {d.pickupAddress} • Quantity: {d.quantity}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className={`chip chip-${d.status.toLowerCase()}`}>{d.status}</span>
                    {d.expiresAt && <div style={{ marginTop: 6 }}><ExpiryTimer expiresAt={d.expiresAt} /></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Platform Impact Stats & Workflow */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Platform Activity Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="meta">Total Network Donations</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalDonations || donations.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="meta">Completion Rate</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
                  {stats?.completionRate ? `${stats.completionRate.toFixed(1)}%` : "100%"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="meta">Urgent Items Handled</span>
                <span style={{ fontWeight: 700, color: "#ef4444" }}>{stats?.urgentDonations || 0}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "var(--surface-hover)" }}>
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>How Setu Works</h3>
            <div style={{ fontSize: 12.5, color: "var(--text-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div><strong>1. Post Item:</strong> Fill details and set optional urgency flag.</div>
              <div><strong>2. Orphanage Accept:</strong> Orphanage requests your donation.</div>
              <div><strong>3. Volunteer Delivery:</strong> Volunteer picks up and delivers live.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
