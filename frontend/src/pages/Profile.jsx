import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/userApi";
import { getRatingsForUser } from "../api/ratingApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
        if (res.data?.id) {
          getRatingsForUser(res.data.id)
            .then((rRes) => setRatings(rRes.data))
            .catch(() => setRatings([]));
        }
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await updateMyProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
        registrationNumber: form.registrationNumber,
        capacity: form.capacity,
        vehicleType: form.vehicleType,
      });
      setProfile(res.data);
      setForm(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <p className="meta">Loading social profile...</p>
      </div>
    );
  }

  if (!profile) return <div className="banner-error">Failed to load profile.</div>;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div style={{ marginTop: 24, marginBottom: 48 }}>
      {/* Instagram / Facebook / WhatsApp Style Profile Container */}
      <div className="profile-card-social">
        {/* Cover Banner */}
        <div className="profile-cover-banner">
          <div className="profile-cover-pattern" />
        </div>

        {/* Profile Header Content */}
        <div className="profile-header-content">
          {/* Avatar Row */}
          <div className="profile-avatar-row">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">{initials}</div>
              <div className="profile-verified-badge" title="OTP Verified User">
                ✓
              </div>
            </div>

            <div className="profile-actions-group">
              <button
                className={`btn btn-sm ${activeTab === "edit" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveTab(activeTab === "edit" ? "overview" : "edit")}
              >
                ✏️ {activeTab === "edit" ? "View Profile" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* User Name & Bio Title */}
          <div>
            <div className="profile-name-title">
              {profile.name}
              <span className="role-chip" style={{ fontSize: 11, padding: "3px 10px" }}>
                {profile.role}
              </span>
            </div>
            <div className="profile-handle">@{profile.email ? profile.email.split("@")[0] : "user"} • {profile.email}</div>
          </div>

          {/* Social Stats Bar */}
          <div className="profile-stats-bar">
            {profile.role === "VOLUNTEER" && (
              <div className="profile-stat-box">
                <div className="profile-stat-value" style={{ color: "#10b981" }}>
                  {profile.totalDeliveries || 0}
                </div>
                <div className="profile-stat-label">Deliveries</div>
              </div>
            )}

            <div className="profile-stat-box">
              <div className="profile-stat-value" style={{ color: "#f59e0b" }}>
                ★ {profile.averageStars ? profile.averageStars.toFixed(1) : "5.0"}
              </div>
              <div className="profile-stat-label">
                {profile.totalRatings || 0} Ratings
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="profile-stat-value" style={{ color: "#3b82f6" }}>
                100%
              </div>
              <div className="profile-stat-label">Verified Trust</div>
            </div>

            <div className="profile-stat-box">
              <div className="profile-stat-value" style={{ fontSize: 16, color: "var(--brand-dark)" }}>
                Active
              </div>
              <div className="profile-stat-label">Status</div>
            </div>
          </div>

          {/* Tab Navigation Pills */}
          <div className="profile-tab-pills">
            <button
              className={`profile-pill-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              👤 Overview & Details
            </button>
            <button
              className={`profile-pill-btn ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              ⚙️ Account Settings
            </button>
            <button
              className={`profile-pill-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              ⭐ Reviews & Feedback ({ratings.length})
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div style={{ background: "var(--surface-hover)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 8 }}>
                  Contact & Communication
                </div>
                <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>📧 <strong>Email:</strong> {profile.email}</div>
                  <div>📞 <strong>Phone:</strong> {profile.phone || "Not provided"}</div>
                  <div>📍 <strong>Address:</strong> {profile.address || "Not provided"}</div>
                </div>
              </div>

              <div style={{ background: "var(--surface-hover)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 8 }}>
                  Role Info & Credentials
                </div>
                <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>🏷️ <strong>Role:</strong> {profile.role}</div>
                  {profile.role === "ORPHANAGE" && (
                    <>
                      <div>📜 <strong>Reg No:</strong> {profile.registrationNumber || "N/A"}</div>
                      <div>🏠 <strong>Capacity:</strong> {profile.capacity || "N/A"} residents</div>
                    </>
                  )}
                  {profile.role === "VOLUNTEER" && (
                    <>
                      <div>🚗 <strong>Vehicle Type:</strong> {profile.vehicleType || "Standard"}</div>
                      <div>📦 <strong>Total Deliveries:</strong> {profile.totalDeliveries || 0} completed</div>
                    </>
                  )}
                  <div>🔒 <strong>Security:</strong> Email Verified (OTP)</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Edit Form */}
          {activeTab === "edit" && (
            <div style={{ marginTop: 24, maxWidth: 520 }}>
              <form onSubmit={handleSave}>
                <div className="field">
                  <label className="field-label">Full Name <span className="required-star">*</span></label>
                  <input name="name" className="input" value={form.name || ""} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label className="field-label">Email (Verified) <span className="required-star">*</span></label>
                  <input className="input" value={profile.email} disabled />
                </div>

                <div className="field">
                  <label className="field-label">Phone Number <span className="required-star">*</span></label>
                  <input name="phone" className="input" value={form.phone || ""} onChange={handleChange} placeholder="e.g. +91 98765 43210" required />
                </div>

                <div className="field">
                  <label className="field-label">Primary Pickup / Base Address <span className="required-star">*</span></label>
                  <input name="address" className="input" value={form.address || ""} onChange={handleChange} placeholder="Full base address" required />
                </div>

                {profile.role === "ORPHANAGE" && (
                  <>
                    <div className="field">
                      <label className="field-label">Registration Number</label>
                      <input
                        name="registrationNumber"
                        className="input"
                        value={form.registrationNumber || ""}
                        onChange={handleChange}
                        placeholder="Official NGO / Orphanage Reg ID"
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Accommodated Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        className="input"
                        value={form.capacity || ""}
                        onChange={handleChange}
                        placeholder="Number of children/residents"
                      />
                    </div>
                  </>
                )}

                {profile.role === "VOLUNTEER" && (
                  <div className="field">
                    <label className="field-label">Vehicle Type</label>
                    <input
                      name="vehicleType"
                      className="input"
                      value={form.vehicleType || ""}
                      onChange={handleChange}
                      placeholder="e.g. Scooter, Car, Mini Van, Bicycle"
                    />
                  </div>
                )}

                {error && <div className="banner-error">{error}</div>}
                {saved && <p className="msg-success">✅ Profile updated successfully.</p>}

                <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 8 }}>
                  {saving ? "Saving..." : "Save Profile Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Ratings & Feedback */}
          {activeTab === "reviews" && (
            <div style={{ marginTop: 24 }}>
              {ratings.length === 0 ? (
                <div className="empty-state" style={{ padding: 24, background: "var(--surface-hover)", borderRadius: "var(--radius)" }}>
                  No peer reviews or ratings received yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ratings.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: 16,
                        background: "var(--surface-hover)",
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{r.raterName}</span>
                        <span style={{ color: "#f59e0b", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                        </span>
                      </div>
                      {r.comment && (
                        <p style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 6, fontStyle: "italic" }}>
                          "{r.comment}"
                        </p>
                      )}
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
                        Delivery ID #{r.deliveryId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
