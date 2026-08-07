import { useEffect, useState } from "react";
import TopNav from "../../components/TopNav";
import {
  getAvailableDonations,
  createRequest,
  getMyRequests,
  getIncomingDeliveries,
} from "../../api/deliveryApi";

export default function OrphanageDashboard() {
  const [tab, setTab] = useState("browse");
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [donationsRes, requestsRes, incomingRes] = await Promise.all([
        getAvailableDonations(),
        getMyRequests(),
        getIncomingDeliveries(),
      ]);
      setDonations(donationsRes.data);
      setMyRequests(requestsRes.data);
      setIncoming(incomingRes.data);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleRequest = async (donationId) => {
    setRequestingId(donationId);
    setError("");
    try {
      await createRequest(donationId);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request donation.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h2 className="section-title">Donations</h2>

        <div className="tabs">
          <button className={`tab ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>Browse</button>
          <button className={`tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>My requests</button>
          <button className={`tab ${tab === "incoming" ? "active" : ""}`} onClick={() => setTab("incoming")}>Incoming</button>
        </div>

        {error && <div className="banner-error">{error}</div>}

        {loading ? (
          <p className="meta">Loading...</p>
        ) : (
          <>
            {tab === "browse" && (
              donations.length === 0 ? (
                <div className="card empty-state">No donations available right now.</div>
              ) : (
                donations.map((d) => (
                  <div key={d.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                      <div>
                        <strong>{d.category}</strong> — {d.description || "No description"}
                        <div className="meta" style={{ marginTop: 4 }}>
                          Qty: {d.quantity || "N/A"} · From {d.donorName}
                        </div>
                        <div className="meta">Pickup: {d.pickupAddress}</div>
                      </div>
                      <button className="btn btn-gold btn-sm" onClick={() => handleRequest(d.id)} disabled={requestingId === d.id}>
                        {requestingId === d.id ? "Requesting..." : "Request"}
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {tab === "requests" && (
              myRequests.length === 0 ? (
                <div className="card empty-state">You haven't requested any donations yet.</div>
              ) : (
                myRequests.map((r) => (
                  <div key={r.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{r.donationDescription || "Donation #" + r.donationId}</span>
                      <span className={`status status-${r.status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}

            {tab === "incoming" && (
              incoming.length === 0 ? (
                <div className="card empty-state">No incoming deliveries yet.</div>
              ) : (
                incoming.map((d) => (
                  <div key={d.id} className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{d.donationDescription || "Donation #" + d.donationId}</strong>
                        <div className="meta" style={{ marginTop: 4 }}>
                          Volunteer: {d.volunteerName || "Not yet assigned"}
                        </div>
                      </div>
                      <span className={`status status-${d.status.toLowerCase()}`}>
                        <span className="status-dot" />
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
