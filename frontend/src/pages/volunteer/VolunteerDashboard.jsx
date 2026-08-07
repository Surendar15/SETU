import { useEffect, useState } from "react";
import TopNav from "../../components/TopNav";
import {
  getOpenDeliveries,
  getMyDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
} from "../../api/deliveryApi";

const nextStatus = { PENDING_PICKUP: "PICKED_UP", PICKED_UP: "IN_TRANSIT", IN_TRANSIT: "DELIVERED" };
const nextActionLabel = {
  PENDING_PICKUP: "Mark picked up",
  PICKED_UP: "Mark in transit",
  IN_TRANSIT: "Mark delivered",
};

export default function VolunteerDashboard() {
  const [tab, setTab] = useState("open");
  const [openDeliveries, setOpenDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [openRes, myRes] = await Promise.all([getOpenDeliveries(), getMyDeliveries()]);
      setOpenDeliveries(openRes.data);
      setMyDeliveries(myRes.data);
    } catch {
      setError("Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAccept = async (deliveryId) => {
    setActingId(deliveryId);
    setError("");
    try {
      await acceptDelivery(deliveryId);
      await loadAll();
      setTab("my");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept delivery.");
    } finally {
      setActingId(null);
    }
  };

  const handleAdvanceStatus = async (deliveryId, currentStatus) => {
    const newStatus = nextStatus[currentStatus];
    if (!newStatus) return;
    setActingId(deliveryId);
    setError("");
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h2 className="section-title">Deliveries</h2>

        <div className="tabs">
          <button className={`tab ${tab === "open" ? "active" : ""}`} onClick={() => setTab("open")}>Open</button>
          <button className={`tab ${tab === "my" ? "active" : ""}`} onClick={() => setTab("my")}>My deliveries</button>
        </div>

        {error && <div className="banner-error">{error}</div>}

        {loading ? (
          <p className="meta">Loading...</p>
        ) : tab === "open" ? (
          openDeliveries.length === 0 ? (
            <div className="card empty-state">No open deliveries right now.</div>
          ) : (
            openDeliveries.map((d) => (
              <div key={d.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div>
                    <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                    <div className="meta" style={{ marginTop: 4 }}>Pickup: {d.pickupAddress}</div>
                    <div className="meta">Deliver to: {d.orphanageName}</div>
                  </div>
                  <button className="btn btn-gold btn-sm" onClick={() => handleAccept(d.id)} disabled={actingId === d.id}>
                    {actingId === d.id ? "Accepting..." : "Accept"}
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          myDeliveries.length === 0 ? (
            <div className="card empty-state">You haven't accepted any deliveries yet.</div>
          ) : (
            myDeliveries.map((d) => (
              <div key={d.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div>
                    <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                    <div className="meta" style={{ marginTop: 4 }}>Pickup: {d.pickupAddress}</div>
                    <div className="meta">Deliver to: {d.orphanageName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`status status-${d.status.toLowerCase()}`} style={{ marginBottom: 8, display: "inline-flex" }}>
                      <span className="status-dot" />
                      {d.status}
                    </span>
                    {nextStatus[d.status] && (
                      <div>
                        <button className="btn btn-primary btn-sm" onClick={() => handleAdvanceStatus(d.id, d.status)} disabled={actingId === d.id}>
                          {actingId === d.id ? "Updating..." : nextActionLabel[d.status]}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
