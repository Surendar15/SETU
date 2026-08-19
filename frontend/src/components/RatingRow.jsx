import { useState } from "react";
import StarInput from "./StarInput";

export default function RatingRow({ delivery, role, name, existingRating, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (existingRating) {
    return (
      <div className="meta" style={{ marginTop: 6 }}>
        {role === "DONOR" ? "Donor" : "Volunteer"} ({name}): {"★".repeat(existingRating.stars)}{"☆".repeat(5 - existingRating.stars)}
        {existingRating.comment ? ` — "${existingRating.comment}"` : ""}
      </div>
    );
  }

  if (!open) {
    return (
      <button className="btn btn-outline btn-sm" style={{ marginTop: 8, marginRight: 8 }} onClick={() => setOpen(true)}>
        Rate {role === "DONOR" ? "donor" : "volunteer"}
      </button>
    );
  }

  const handleSubmit = async () => {
    if (stars === 0) {
      setError("Pick a star value first.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(delivery, role, stars, comment);
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
      <span className="meta">Rate {role === "DONOR" ? "donor" : "volunteer"} ({name})</span>
      <div style={{ marginTop: 6 }}>
        <StarInput value={stars} onChange={setStars} />
        <input
          className="input"
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ marginTop: 8 }}
        />
        {error && <p className="msg-error">{error}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-gold btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
