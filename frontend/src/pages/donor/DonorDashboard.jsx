import { useEffect, useState } from "react";
import TopNav from "../../components/TopNav";
import {
  createDonation,
  getMyDonations,
  cancelDonation,
  getRequestsForDonation,
  acceptRequest,
  rejectRequest,
} from "../../api/donationApi";

const CATEGORIES = ["CLOTHES", "FOOD", "BOOKS", "MEDICINE", "OTHER"];

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ category: "CLOTHES", description: "", quantity: "", pickupAddress: "" });
  const [posting, setPosting] = useState(false);

  const [expandedDonationId, setExpandedDonationId] = useState(null);
  const [requestsByDonation, setRequestsByDonation] = useState({});
  const [requestsLoading, setRequestsLoading] = useState(false);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await getMyDonations();
      setDonations(res.data);
    } catch {
      setError("Failed to load your donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePostDonation = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError("");
    try {
      await createDonation(form);
      setForm({ category: "CLOTHES", description: "", quantity: "", pickupAddress: "" });
      await loadDonations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post donation.");
    } finally {
      setPosting(false);
    }
  };

  const handleCancel = async (donationId) => {
    try {
      await cancelDonation(donationId);
      await loadDonations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel donation.");
    }
  };

  const toggleRequests = async (donationId) => {
    if (expandedDonationId === donationId) {
      setExpandedDonationId(null);
      return;
    }
    setExpandedDonationId(donationId);
    setRequestsLoading(true);
    try {
      const res = await getRequestsForDonation(donationId);
      setRequestsByDonation((prev) => ({ ...prev, [donationId]: res.data }));
    } catch {
      setError("Failed to load requests for this donation.");
    } finally {
      setRequestsLoading(false);
    }
  };

  const refreshRequests = async (donationId) => {
    const res = await getRequestsForDonation(donationId);
    setRequestsByDonation((prev) => ({ ...prev, [donationId]: res.data }));
  };

  const handleAccept = async (requestId, donationId) => {
    try {
      await acceptRequest(requestId);
      await loadDonations();
      await refreshRequests(donationId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to accept request.");
    }
  };

  const handleReject = async (requestId, donationId) => {
    try {
      await rejectRequest(requestId);
      await loadDonations();
      await refreshRequests(donationId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject request.");
    }
  };

  return (
    <div className="page-shell">
      <TopNav />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h2 className="section-title">Post a donation</h2>
        <div className="card">
          <form onSubmit={handlePostDonation}>
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
            <button type="submit" className="btn btn-primary" disabled={posting}>
              {posting ? "Posting..." : "Post donation"}
            </button>
          </form>
        </div>

        {error && <div className="banner-error">{error}</div>}

        <div className="section-block">
          <h2 className="section-title">Your donations</h2>
          {loading ? (
            <p className="meta">Loading...</p>
          ) : donations.length === 0 ? (
            <div className="card empty-state">You haven't posted any donations yet.</div>
          ) : (
            donations.map((d) => (
              <div key={d.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <strong>{d.category}</strong> — {d.description || "No description"}
                    <div className="meta" style={{ marginTop: 4 }}>Qty: {d.quantity || "N/A"}</div>
                  </div>
                  <span className={`status status-${d.status.toLowerCase()}`}>
                    <span className="status-dot" />
                    {d.status}
                  </span>
                </div>

                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                  {d.status === "REQUESTED" && (
                    <button className="btn btn-outline btn-sm" onClick={() => toggleRequests(d.id)}>
                      {expandedDonationId === d.id ? "Hide requests" : "View requests"}
                    </button>
                  )}
                  {(d.status === "AVAILABLE" || d.status === "REQUESTED") && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleCancel(d.id)}>
                      Cancel
                    </button>
                  )}
                </div>

                {expandedDonationId === d.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                    {requestsLoading ? (
                      <p className="meta">Loading requests...</p>
                    ) : (requestsByDonation[d.id] || []).length === 0 ? (
                      <p className="meta">No requests yet.</p>
                    ) : (
                      requestsByDonation[d.id].map((r) => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 14 }}>{r.orphanageName}</span>
                          {r.status === "PENDING" ? (
                            <span style={{ display: "flex", gap: 6 }}>
                              <button className="btn btn-gold btn-sm" onClick={() => handleAccept(r.id, d.id)}>Accept</button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleReject(r.id, d.id)}>Reject</button>
                            </span>
                          ) : (
                            <span className={`status status-${r.status.toLowerCase()}`}>
                              <span className="status-dot" />
                              {r.status}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
