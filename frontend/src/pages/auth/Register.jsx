import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, verifyOtp } from "../../api/otpApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "DONOR",
    address: "",
    registrationNumber: "",
    capacity: "",
    vehicleType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email" && otpVerified && value !== otpSentTo) {
      setOtpVerified(false);
      setOtpMessage("");
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpMessage("");
    if (!isValidEmail(form.email)) {
      setOtpError("Enter a valid email address first");
      return;
    }
    setSendingOtp(true);
    try {
      await sendOtp(form.email);
      setOtpSentTo(form.email);
      setOtpMessage("OTP sent — check your inbox (and spam folder, just in case).");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    setVerifyingOtp(true);
    try {
      await verifyOtp(form.email, otpValue);
      setOtpVerified(true);
      setOtpMessage("Email verified.");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Incorrect OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otpVerified) {
      setError("Please verify your email before registering");
      return;
    }
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
      address: form.address,
    };
    if (form.role === "ORPHANAGE") {
      payload.registrationNumber = form.registrationNumber;
      payload.capacity = form.capacity ? parseInt(form.capacity, 10) : null;
    } else if (form.role === "VOLUNTEER") {
      payload.vehicleType = form.vehicleType;
    }

    try {
      const data = await register(payload);
      redirectByRole(data.role);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === "DONOR") navigate("/donor");
    else if (role === "VOLUNTEER") navigate("/volunteer");
    else if (role === "ORPHANAGE") navigate("/orphanage");
  };

  const roleCopy = {
    DONOR: "You'll post items you want to give away.",
    VOLUNTEER: "You'll carry donations from pickup to drop-off.",
    ORPHANAGE: "You'll browse and request donations for your organization.",
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <span className="auth-eyebrow">Setu · Join the network</span>
        <h1>Pick the role that's actually yours.</h1>
        <p>
          Each account type unlocks a different view of the same chain —
          giving, carrying, or receiving. {roleCopy[form.role]}
        </p>
        <div className="waypoint-chain">
          <div className="waypoint">
            <span className={`waypoint-dot ${form.role === "DONOR" ? "active" : ""}`} />
            <span className="waypoint-label">DONOR</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className={`waypoint-dot ${form.role === "VOLUNTEER" ? "active" : ""}`} />
            <span className="waypoint-label">VOLUNTEER</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className={`waypoint-dot ${form.role === "ORPHANAGE" ? "active" : ""}`} />
            <span className="waypoint-label">ORPHANAGE</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create your account</h2>

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="field">
              <label className="field-label">I am a...</label>
              <select name="role" className="input" value={form.role} onChange={handleChange}>
                <option value="DONOR">Donor</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ORPHANAGE">Orphanage / Needy Organization</option>
              </select>
            </div>

            <div className="field">
              <label className="field-label">Name</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Email</label>
              <div className="field-row">
                <input
                  type="email"
                  name="email"
                  className="input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || otpVerified}
                >
                  {otpVerified ? "Verified ✓" : sendingOtp ? "Sending..." : "Send OTP"}
                </button>
              </div>

              {otpSentTo === form.email && !otpVerified && (
                <div className="field-row" style={{ marginTop: 8 }}>
                  <input
                    className="input"
                    placeholder="6-digit OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength={6}
                  />
                  <button type="button" className="btn btn-gold btn-sm" onClick={handleVerifyOtp} disabled={verifyingOtp}>
                    {verifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
              )}

              {otpMessage && <p className="msg-success">{otpMessage}</p>}
              {otpError && <p className="msg-error">{otpError}</p>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" name="password" className="input" value={form.password} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Phone</label>
              <input name="phone" className="input" value={form.phone} onChange={handleChange} />
            </div>

            <div className="field">
              <label className="field-label">Address</label>
              <input name="address" className="input" value={form.address} onChange={handleChange} />
            </div>

            {form.role === "ORPHANAGE" && (
              <>
                <div className="field">
                  <label className="field-label">Registration Number</label>
                  <input name="registrationNumber" className="input" value={form.registrationNumber} onChange={handleChange} />
                </div>
                <div className="field">
                  <label className="field-label">Capacity (number of children)</label>
                  <input type="number" name="capacity" className="input" value={form.capacity} onChange={handleChange} />
                </div>
              </>
            )}

            {form.role === "VOLUNTEER" && (
              <div className="field">
                <label className="field-label">Vehicle Type</label>
                <input name="vehicleType" className="input" value={form.vehicleType} onChange={handleChange} placeholder="e.g. Bike, Car, Van" />
              </div>
            )}

            {error && <div className="banner-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading || !otpVerified} style={{ marginTop: 8 }}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="meta" style={{ marginTop: 20 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
