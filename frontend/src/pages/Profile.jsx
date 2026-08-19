import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api/userApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
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

  if (loading) return <p className="meta" style={{ marginTop: 24 }}>Loading...</p>;
  if (!profile) return <div className="banner-error">Failed to load profile.</div>;

  const initials = profile.name
    ? profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div style={{ marginTop: 24, maxWidth: 560 }}>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--pine)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <h2 style={{ fontSize: 20 }}>{profile.name}</h2>
            <span className="role-chip">{profile.role}</span>
            {profile.totalRatings > 0 && (
              <span className="mono meta" style={{ marginLeft: 8, color: "var(--gold-dark)" }}>
                ★ {profile.averageStars.toFixed(1)} ({profile.totalRatings})
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="field">
            <label className="field-label">Name</label>
            <input name="name" className="input" value={form.name || ""} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" value={profile.email} disabled />
          </div>

          <div className="field">
            <label className="field-label">Phone</label>
            <input name="phone" className="input" value={form.phone || ""} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="field-label">Address</label>
            <input name="address" className="input" value={form.address || ""} onChange={handleChange} />
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
                />
              </div>
              <div className="field">
                <label className="field-label">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  className="input"
                  value={form.capacity || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {profile.role === "VOLUNTEER" && (
            <>
              <div className="field">
                <label className="field-label">Vehicle Type</label>
                <input
                  name="vehicleType"
                  className="input"
                  value={form.vehicleType || ""}
                  onChange={handleChange}
                  placeholder="e.g. Bike, Car, Van"
                />
              </div>
              <div className="field">
                <label className="field-label">Total deliveries completed</label>
                <input className="input" value={profile.totalDeliveries ?? 0} disabled />
              </div>
            </>
          )}

          {error && <div className="banner-error">{error}</div>}
          {saved && <p className="msg-success">Profile updated.</p>}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
