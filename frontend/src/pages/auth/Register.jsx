import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, verifyOtp } from "../../api/otpApi";
import { INDIA_STATES_AND_DISTRICTS, ALL_INDIAN_STATES } from "../../data/indiaLocations";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "", // Default to empty so "-- Select Role --" is shown
    state: "",
    district: "",
    subDivision: "",
    registrationNumber: "",
    vehicleType: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
    if (name === "state") {
      setForm({ ...form, state: value, district: "" });
    } else {
      setForm({ ...form, [name]: value });
    }

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
      setOtpMessage("OTP sent — check your inbox (and spam folder).");
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
      setOtpMessage("Email verified ✓");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Incorrect OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.role) {
      setError("Please select your account role (Donor, Volunteer, or Orphanage).");
      return;
    }

    if (!otpVerified) {
      setError("Please verify your email before registering.");
      return;
    }

    if (!form.phone || form.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!form.state) {
      setError("Please select your State.");
      return;
    }

    if (!form.district) {
      setError("Please select your District.");
      return;
    }

    setLoading(true);

    const fullAddress = `${form.subDivision ? form.subDivision + ", " : ""}${form.district}, ${form.state}`;
    const fullPhone = `+91 ${form.phone}`;

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: fullPhone,
      role: form.role,
      address: fullAddress,
    };

    if (form.role === "ORPHANAGE") {
      payload.registrationNumber = form.registrationNumber;
    } else if (form.role === "VOLUNTEER") {
      payload.vehicleType = form.vehicleType || "Standard Vehicle";
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
    "": "Choose whether you are giving donations, delivering supplies, or running an orphanage.",
    DONOR: "You'll post items you want to give away.",
    VOLUNTEER: "You'll carry donations from pickup to drop-off.",
    ORPHANAGE: "You'll browse and request donations for your organization.",
  };

  const availableDistricts = form.state && INDIA_STATES_AND_DISTRICTS[form.state]
    ? INDIA_STATES_AND_DISTRICTS[form.state]
    : [];

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img src="/logo.png" alt="Setu Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "contain", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }} />
          <span style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-display)" }}>Setu</span>
        </div>
        <span className="auth-eyebrow">Setu · Join the network</span>
        <h1>Pick the role that's actually yours.</h1>
        <p>
          Each account type unlocks a different view of the same chain —
          giving, carrying, or receiving. {roleCopy[form.role || ""]}
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

      <div className="auth-form-side" style={{ flexDirection: "column" }}>
        <div style={{ width: "100%", maxWidth: 420, marginBottom: 14 }}>
          <Link to="/" className="btn btn-outline btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
        <div className="auth-card">
          <h2>Create your account</h2>

          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            {/* Role selection with default "-- Select Role --" */}
            <div className="field">
              <label className="field-label">I am a... <span className="required-star">*</span></label>
              <select
                name="role"
                className="input"
                value={form.role}
                onChange={handleChange}
                required
                style={{ fontWeight: form.role ? "600" : "normal" }}
              >
                <option value="" disabled>-- Select Role --</option>
                <option value="DONOR">Donor (Giving items)</option>
                <option value="VOLUNTEER">Volunteer (Delivering items)</option>
                <option value="ORPHANAGE">Orphanage / Needy Organization (Receiving)</option>
              </select>
            </div>

            <div className="field">
              <label className="field-label">Name <span className="required-star">*</span></label>
              <input name="name" className="input" value={form.name} onChange={handleChange} placeholder="e.g. John Doe / Hope Children Home" required />
            </div>

            <div className="field">
              <label className="field-label">Email <span className="required-star">*</span></label>
              <div className="field-row">
                <input
                  type="email"
                  name="email"
                  className="input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
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
              <label className="field-label">Password <span className="required-star">*</span></label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-dim)",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Separated Phone Field: Non-editable +91 and 10-digit mobile number input */}
            <div className="field">
              <label className="field-label">Mobile Number <span className="required-star">*</span></label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div
                  style={{
                    padding: "12px 14px",
                    background: "var(--surface-sunken)",
                    border: "1.5px solid var(--line)",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--text)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Country Code: India (+91)"
                >
                  <span style={{ fontSize: 16 }}>🇮🇳</span> +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  className="input"
                  value={form.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm({ ...form, phone: onlyNums });
                  }}
                  placeholder="10-digit number (e.g. 9876543210)"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              {form.phone && form.phone.length > 0 && form.phone.length < 10 && (
                <p className="meta" style={{ fontSize: 12, color: "var(--clay)", marginTop: 4 }}>
                  Please enter 10 digits ({form.phone.length}/10 entered)
                </p>
              )}
            </div>

            {/* Structured Location Selection with ALL Indian States & Districts */}
            <div className="field" style={{ background: "var(--surface-hover)", padding: 14, borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)", marginBottom: 10 }}>
                📍 Location & Jurisdiction (All India)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="field-label" style={{ fontSize: 12 }}>State / UT <span className="required-star">*</span></label>
                  <select name="state" className="input" value={form.state} onChange={handleChange} required>
                    <option value="" disabled>-- Select State / UT --</option>
                    {ALL_INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label" style={{ fontSize: 12 }}>District <span className="required-star">*</span></label>
                  <select
                    name="district"
                    className="input"
                    value={form.district}
                    onChange={handleChange}
                    disabled={!form.state}
                    required
                  >
                    <option value="" disabled>
                      {form.state ? "-- Select District --" : "-- Select State First --"}
                    </option>
                    {availableDistricts.map((dst) => (
                      <option key={dst} value={dst}>{dst}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label" style={{ fontSize: 12 }}>Sub-Division / Taluk / Locality <span className="required-star">*</span></label>
                <input
                  name="subDivision"
                  className="input"
                  value={form.subDivision}
                  onChange={handleChange}
                  placeholder="e.g. T. Nagar, Anna Salai, Koramangala"
                  required
                />
              </div>
            </div>

            {form.role === "ORPHANAGE" && (
              <div className="field" style={{ marginTop: 12 }}>
                <label className="field-label">Registration Number <span className="required-star">*</span></label>
                <input name="registrationNumber" className="input" value={form.registrationNumber} onChange={handleChange} placeholder="NGO / Trust / Orphanage Reg ID" required />
              </div>
            )}

            {form.role === "VOLUNTEER" && (
              <div className="field" style={{ marginTop: 12 }}>
                <label className="field-label">Vehicle Type (Optional)</label>
                <input name="vehicleType" className="input" value={form.vehicleType} onChange={handleChange} placeholder="e.g. Scooter, Bike, Car, Van (Optional)" />
              </div>
            )}

            {error && <div className="banner-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading || !otpVerified} style={{ marginTop: 14 }}>
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
