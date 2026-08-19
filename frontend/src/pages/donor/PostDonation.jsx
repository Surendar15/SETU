import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../../api/donationApi";
import { uploadImage } from "../../api/uploadApi";

const CATEGORIES = ["CLOTHES", "FOOD", "BOOKS", "MEDICINE", "OTHER"];

export default function PostDonation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: "CLOTHES", description: "", quantity: "", pickupAddress: "", imageUrl: "" });
  const [posting, setPosting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    try {
      await createDonation(form);
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
            <label className="field-label">Category</label>
            <select name="category" className="input" value={form.category} onChange={handleFormChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <input name="description" className="input" value={form.description} onChange={handleFormChange} placeholder="e.g. Winter jackets, size M" />
          </div>
          <div className="field">
            <label className="field-label">Quantity</label>
            <input name="quantity" className="input" value={form.quantity} onChange={handleFormChange} placeholder="e.g. 10 pieces" />
          </div>
          <div className="field">
            <label className="field-label">Pickup address</label>
            <input name="pickupAddress" className="input" value={form.pickupAddress} onChange={handleFormChange} />
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
