import { useEffect, useState } from "react";
import ExpiryTimer from "../../components/ExpiryTimer";
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
  const [urgentOnly, setUrgentOnly] = useState(false);

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

  const filteredDonations = urgentOnly
    ? donations.filter((d) => d.isUrgent)
    : [...donations].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Available Donations</h2>
        <button
          className={`btn btn-sm ${urgentOnly ? "btn-primary" : "btn-outline"}`}
          onClick={() => setUrgentOnly((prev) => !prev)}
        >
          {urgentOnly ? "⚡ Showing Urgent Only" : "⚡ Filter Urgent First"}
        </button>
      </div>

      {error && <div className="banner-error">{error}</div>}
      {loading ? (
        <p className="meta">Loading...</p>
      ) : filteredDonations.length === 0 ? (
        <div className="card empty-state">No donations available right now.</div>
      ) : (
        filteredDonations.map((d) => (
          <div key={d.id} className="card">
            {d.imageUrl && <img src={d.imageUrl} alt={d.description} className="donation-image-banner" />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                  <strong>{d.category}</strong>
                  <ExpiryTimer expiresAt={d.expiresAt} isUrgent={d.isUrgent} />
                </div>
                <div>{d.description || "No description"}</div>
                <div className="meta" style={{ marginTop: 4 }}>
                  Qty: {d.quantity || "N/A"} · From {d.donorName}
                  {donorRatings[d.donorId] && donorRatings[d.donorId].totalRatings > 0 && (
                    <span className="mono" style={{ marginLeft: 6, color: "var(--gold-dark)" }}>
                      ★ {donorRatings[d.donorId].averageStars.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="meta">Pickup: {d.pickupAddress}</div>
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