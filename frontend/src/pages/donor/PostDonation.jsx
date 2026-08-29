import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../../api/donationApi";
import { uploadImage } from "../../api/uploadApi";

const CATEGORIES = ["CLOTHES", "FOOD", "BOOKS", "MEDICINE", "OTHER"];

export default function PostDonation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "CLOTHES",
    description: "",
    quantity: "",
    pickupAddress: "",
    imageUrl: "",
    isUrgent: false,
    expiryHours: "",
  });
  const [posting, setPosting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [error, setError] = useState("");

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            setForm((prev) => ({ ...prev, pickupAddress: data.display_name }));
          } else {
            setForm((prev) => ({ ...prev, pickupAddress: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
          }
        } catch {
          setForm((prev) => ({ ...prev, pickupAddress: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        if (err.code === 1) {
          setError("Location permission denied. Please enter your address manually.");
        } else {
          setError("Unable to retrieve location. Please enter your address manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFormChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch {
      setError("Image upload failed. You can still post without a photo.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError("");

    const payload = {
      ...form,
      expiryHours: form.expiryHours ? parseInt(form.expiryHours, 10) : null,
    };

    try {
      await createDonation(payload);
      navigate("/donor/donations");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post donation.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Category <span className="required-star">*</span></label>
            <select name="category" className="input" value={form.category} onChange={handleFormChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Description <span className="required-star">*</span></label>
            <input name="description" className="input" value={form.description} onChange={handleFormChange} placeholder="e.g. Fresh cooked meal packages, winter jackets" required />
          </div>
          <div className="field">
            <label className="field-label">Quantity <span className="required-star">*</span></label>
            <input name="quantity" className="input" value={form.quantity} onChange={handleFormChange} placeholder="e.g. 20 meals / 10 pieces" required />
          </div>
          <div className="field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Pickup address <span className="required-star">*</span></label>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                style={{ fontSize: 12, padding: "3px 10px" }}
              >
                📍 {detectingLocation ? "Detecting location..." : "Use my current location"}
              </button>
            </div>
            <input
              name="pickupAddress"
              className="input"
              value={form.pickupAddress}
              onChange={handleFormChange}
              placeholder="e.g. 123 Hope Street, Sector 4, or click Use my current location"
              required
            />
          </div>

          <div className="field" style={{ background: "var(--surface-hover)", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              <input type="checkbox" name="isUrgent" checked={form.isUrgent} onChange={handleFormChange} style={{ width: 18, height: 18, accentColor: "#eab308" }} />
              ⚡ Mark as Urgent / Perishable Item (Food, Emergency Supplies)
            </label>

            {form.isUrgent && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <label className="field-label">Expiry Time (hours from now)</label>
                <select name="expiryHours" className="input" value={form.expiryHours} onChange={handleFormChange}>
                  <option value="">No set expiry limit</option>
                  <option value="2">2 Hours (Hot Cooked Meals)</option>
                  <option value="4">4 Hours (Fresh Food / Perishables)</option>
                  <option value="12">12 Hours (Same-day Delivery)</option>
                  <option value="24">24 Hours (1 Day)</option>
                  <option value="48">48 Hours (2 Days)</option>
                </select>
              </div>
            )}
          </div>
          <div className="field">
            <label className="field-label">Photo (optional)</label>
            <input type="file" accept="image/*" className="input" onChange={handleImageSelect} />
            {uploadingImage && <p className="meta" style={{ marginTop: 6 }}>Uploading...</p>}
            {imagePreview && !uploadingImage && (
              <img src={imagePreview} alt="Preview" style={{ marginTop: 10, width: 160, height: 160, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
            )}
          </div>
          {error && <div className="banner-error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={posting || uploadingImage}>
            {posting ? "Posting..." : "Post donation"}
          </button>
        </form>
      </div>
    </div>
  );
}
