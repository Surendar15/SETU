import { useEffect, useState } from "react";
import { getAnalyticsStats } from "../api/statsApi";

const CATEGORY_COLORS = {
  CLOTHES: "#3b82f6",
  FOOD: "#10b981",
  BOOKS: "#f59e0b",
  MEDICINE: "#ef4444",
};

const CATEGORY_ICONS = {
  CLOTHES: "👕",
  FOOD: "🍲",
  BOOKS: "📚",
  MEDICINE: "💊",
};

export default function AnalyticsChart() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsStats()
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error("Failed to load analytics stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card" style={{ padding: 24 }}>Loading analytics...</div>;
  }

  if (!analytics) return null;

  const categoryCounts = analytics.categoryCounts || {};
  const totalCategoryDonations = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 24 }}>
      {/* Category Breakdown Bar Chart */}
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Donation Breakdown by Category</h3>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20 }}>
            Live distribution across category types
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalCategoryDonations > 0 ? ((count / totalCategoryDonations) * 100).toFixed(1) : 0;
              const color = CATEGORY_COLORS[cat] || "#6b7280";
              const icon = CATEGORY_ICONS[cat] || "📦";

              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <span>
                      {icon} {cat}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: "var(--line)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 5,
                        transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--text-dim)", display: "flex", justifyContent: "space-between" }}>
          <span>Total Categorized Items</span>
          <span style={{ fontWeight: 700, color: "var(--text)" }}>{totalCategoryDonations}</span>
        </div>
      </div>

      {/* Completion & Efficiency Metrics */}
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Delivery Completion Rate</h3>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20 }}>
            Platform logistics & fulfillment efficiency
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", margin: "24px 0" }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" stroke="var(--line)" strokeWidth="14" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="65"
                stroke="#10b981"
                strokeWidth="14"
                fill="none"
                strokeDasharray={408}
                strokeDashoffset={408 - (408 * (analytics.deliveryCompletionRate || 100)) / 100}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-mono)", color: "#10b981" }}>
                {analytics.deliveryCompletionRate}%
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 600 }}>
                Delivered
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 16, borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>⚡ Urgent Requests</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b", fontFamily: "var(--font-mono)" }}>
              {analytics.urgentDonationsCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>🎁 Available Now</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6", fontFamily: "var(--font-mono)" }}>
              {analytics.totalAvailableDonations}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
