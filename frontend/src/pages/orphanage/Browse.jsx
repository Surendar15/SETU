import { useEffect, useState } from "react";
import MapPreview from "../../components/MapPreview";
import { useNotifications } from "../../context/NotificationContext";
import { getAvailableDonations, createRequest, getMyRequests } from "../../api/deliveryApi";
import { getRatingSummary } from "../../api/ratingApi";

export default function Browse() {
  const { refreshSignal } = useNotifications() || {};
  const [donations, setDonations] = useState([]);
  const [donorRatings, setDonorRatings] = useState({});
  const [rejectedDonationIds, setRejectedDonationIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);

  const load = async () => {
    try {
      const [donationsRes, myRequestsRes] = await Promise.all([
        getAvailableDonations(),
        getMyRequests(),
      ]);
      setDonations(donationsRes.data);

      const rejectedIds = new Set(
        myRequestsRes.data.filter((r) => r.status === "REJECTED").map((r) => r.donationId)
      );
      setRejectedDonationIds(rejectedIds);

      const donorIds = [...new Set(donationsRes.data.map((d) => d.donorId))];
      const summaries = await Promise.all(
        donorIds.map((id) => getRatingSummary(id).then((r) => [id, r.data]).catch(() => [id, null]))
      );
      setDonorRatings(Object.fromEntries(summaries.filter(([, v]) => v)));
    } catch {
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  const handleRequest = async (donationId) => {
    setRequestingId(donationId);
    setError("");
    try {
      await createRequest(donationId);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request donation.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : donations.length === 0 ? (
        <div className="card empty-state">No donations available right now.</div>
      ) : (
        donations.map((d) => (
          <div key={d.id} className="card">
            {d.imageUrl && <img src={d.imageUrl} alt={d.description} className="donation-image-banner" />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div>
                <strong>{d.category}</strong> — {d.description || "No description"}
                <div className="meta" style={{ marginTop: 4 }}>
                  Qty: {d.quantity || "N/A"} · From {d.donorName}
                  {donorRatings[d.donorId] && donorRatings[d.donorId].totalRatings > 0 && (
                    <span className="mono" style={{ marginLeft: 6, color: "var(--gold-dark)" }}>
                      ★ {donorRatings[d.donorId].averageStars.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="meta">Pickup: {d.pickupAddress}</div>
                <MapPreview latitude={d.latitude} longitude={d.longitude} label={d.pickupAddress} />
              </div>
              {rejectedDonationIds.has(d.id) ? (
                <span className="meta" style={{ fontStyle: "italic" }}>Previously declined</span>
              ) : (
                <button className="btn btn-gold btn-sm" onClick={() => handleRequest(d.id)} disabled={requestingId === d.id}>
                  {requestingId === d.id ? "Requesting..." : "Request"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}