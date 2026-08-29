import { useEffect, useState } from "react";
import { getLeaderboardStats } from "../api/statsApi";

const RANK_BADGES = ["🥇", "🥈", "🥉", "🏅", "🎖️"];

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboardStats()
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data) return null;

  const { topDonors = [], topVolunteers = [] } = data;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>🏆 Setu Impact Champions</h2>
        <p style={{ fontSize: 14, color: "var(--text-dim)" }}>
          Recognizing our most dedicated Donors & Volunteer Heroes
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {/* Top Donors Card */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🎁</span> Top Donors
          </h3>

          {topDonors.length === 0 ? (
            <div className="empty-state" style={{ padding: 16 }}>No donor rankings yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topDonors.map((donor, idx) => (
                <div
                  key={donor.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: idx === 0 ? "rgba(234, 179, 8, 0.08)" : "var(--surface)",
                    border: `1px solid ${idx === 0 ? "rgba(234, 179, 8, 0.3)" : "var(--line)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{RANK_BADGES[idx] || "🎖️"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{donor.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                        ⭐ {donor.averageRating} rating
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--brand)" }}>
                      {donor.donationsCount}
                    </span>
                    <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-dim)" }}>
                      Donations
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Volunteers Card */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚚</span> Top Volunteers
          </h3>

          {topVolunteers.length === 0 ? (
            <div className="empty-state" style={{ padding: 16 }}>No volunteer rankings yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topVolunteers.map((vol, idx) => (
                <div
                  key={vol.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: idx === 0 ? "rgba(16, 185, 129, 0.08)" : "var(--surface)",
                    border: `1px solid ${idx === 0 ? "rgba(16, 185, 129, 0.3)" : "var(--line)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{RANK_BADGES[idx] || "🎖️"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{vol.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                        ⭐ {vol.averageRating} • {vol.vehicleType || "Vehicle"}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-mono)", color: "#10b981" }}>
                      {vol.totalDeliveries}
                    </span>
                    <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-dim)" }}>
                      Deliveries
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
