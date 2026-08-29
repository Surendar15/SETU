import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableDonations, getMyRequests, getIncomingDeliveries } from "../../api/deliveryApi";
import ExpiryTimer from "../../components/ExpiryTimer";

export default function OrphanageHome() {
  const [available, setAvailable] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAvailableDonations(), getMyRequests(), getIncomingDeliveries()])
      .then(([aRes, rRes, iRes]) => {
        setAvailable(aRes.data || []);
        setRequests(rRes.data || []);
        setIncoming(iRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Orphanage Landing Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #0284C7 100%)",
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
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#BFDBFE", marginBottom: 8 }}>
            🏠 ORPHANAGE RESOURCE CENTER
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>
            Direct Community Support for Your Residents
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6, marginBottom: 24 }}>
            Browse food, clothing, books, and medical supplies posted by generous donors. Request what you need and track incoming deliveries live on interactive route maps.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/orphanage/browse" className="btn" style={{ background: "#FFFFFF", color: "#0F172A", fontWeight: 800, padding: "10px 24px", fontSize: 14 }}>
              🔍 Browse Available Items ({available.length})
            </Link>
            <Link to="/orphanage/incoming" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              🚚 Incoming Shipments ({incoming.length})
            </Link>
            <Link to="/orphanage/requests" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFFFFF", border: "1px solid rgba(255, 255, 255, 0.3)", padding: "10px 24px", fontSize: 14 }}>
              📋 Active Requests ({requests.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            🔍
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Browse Items ({available.length})</h3>
            <p className="meta" style={{ fontSize: 12 }}>Items posted by donors ready for request.</p>
            <Link to="/orphanage/browse" style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", display: "inline-block", marginTop: 6 }}>
              Explore Food & Supplies →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold-tint)", color: "var(--gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            🚚
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Incoming Shipments ({incoming.length})</h3>
            <p className="meta" style={{ fontSize: 12 }}>Volunteers en-route with accepted donations.</p>
            <Link to="/orphanage/incoming" style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-dark)", display: "inline-block", marginTop: 6 }}>
              Track Live Delivery →
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--brand-tint)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            📋
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>My Requests ({requests.length})</h3>
            <p className="meta" style={{ fontSize: 12 }}>History of donations requested & received.</p>
            <Link to="/orphanage/requests" style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", display: "inline-block", marginTop: 6 }}>
              View Request Logs →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Widescreen Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Left Column: Recently Available Items */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 20 }}>Available Donations for Immediate Request</h2>
            <Link to="/orphanage/browse" style={{ fontSize: 13, fontWeight: 600 }}>See all ({available.length})</Link>
          </div>

          {loading ? (
            <div className="card" style={{ padding: 24, textAlign: "center" }}>Loading available items...</div>
          ) : available.length === 0 ? (
            <div className="empty-state" style={{ padding: 40, background: "var(--surface)", border: "1.5px dashed var(--line)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
              <h3>No items currently available</h3>
              <p className="meta" style={{ marginTop: 4 }}>Check back soon as donors post new items daily.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {available.slice(0, 4).map((d) => (
                <div key={d.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{d.category}</span>
                      {d.isUrgent && <span className="chip chip-urgent">⚡ URGENT</span>}
                      <span className="mono meta" style={{ fontSize: 11 }}>#{d.id}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 4 }}>{d.description}</p>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                      📍 Pickup Area: {d.pickupAddress} • Quantity: {d.quantity}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Link to="/orphanage/browse" className="btn btn-primary btn-sm">
                      Request Item →
                    </Link>
                    {d.expiresAt && <div style={{ marginTop: 6 }}><ExpiryTimer expiresAt={d.expiresAt} /></div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Incoming & Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 14 }}>Live Incoming Shipments</h3>
            {incoming.length === 0 ? (
              <p className="meta" style={{ fontSize: 13 }}>No active incoming deliveries right now.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {incoming.slice(0, 3).map((inc) => (
                  <div key={inc.id} style={{ padding: 10, background: "var(--surface-hover)", borderRadius: "var(--radius-sm)", fontSize: 12.5 }}>
                    <div style={{ fontWeight: 700 }}>{inc.category} Package</div>
                    <div style={{ color: "var(--text-soft)", marginTop: 2 }}>Driver: {inc.volunteerName || "Assigned Driver"}</div>
                    <Link to="/orphanage/incoming" style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", marginTop: 4, display: "inline-block" }}>
                      Track Route →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
