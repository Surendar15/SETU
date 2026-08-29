import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, resetPassword as resetPasswordApi } from "../../api/otpApi";

export default function Login() {
  const [loginMode, setLoginMode] = useState("email"); // "email" or "phone"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingResetOtp, setSendingResetOtp] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetErr, setResetErr] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let identifier = "";
    if (loginMode === "email") {
      if (!email.trim()) {
        setError("Please enter your registered email address.");
        return;
      }
      identifier = email.trim();
    } else {
      if (!phone || phone.length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      identifier = `+91 ${phone.trim()}`;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(identifier, password);
      redirectByRole(data.role);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === "DONOR") navigate("/donor");
    else if (role === "VOLUNTEER") navigate("/volunteer");
    else if (role === "ORPHANAGE") navigate("/orphanage");
  };

  const handleSendResetOtp = async () => {
    setResetErr("");
    setResetMsg("");
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetErr("Please enter a valid email address.");
      return;
    }
    setSendingResetOtp(true);
    try {
      await sendOtp(resetEmail);
      setOtpSent(true);
      setResetMsg("OTP sent to your email inbox.");
    } catch (err) {
      setResetErr(err.response?.data?.error || "Failed to send reset OTP.");
    } finally {
      setSendingResetOtp(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetErr("");
    setResetMsg("");
    if (!resetOtp || resetOtp.length < 6) {
      setResetErr("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setResetErr("New password must be at least 4 characters.");
      return;
    }
    setResetting(true);
    try {
      await resetPasswordApi(resetEmail, resetOtp, newPassword);
      setResetMsg("✅ Password reset successfully! You can now log in.");
      setEmail(resetEmail);
      setLoginMode("email");
      setTimeout(() => {
        setForgotOpen(false);
        setOtpSent(false);
        setResetOtp("");
        setNewPassword("");
      }, 1500);
    } catch (err) {
      setResetErr(err.response?.data?.error || "Failed to reset password. Incorrect OTP.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img src="/logo.png" alt="Setu Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "contain", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }} />
          <span style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-display)" }}>Setu</span>
        </div>
        <span className="auth-eyebrow">Setu · Donation Network</span>
        <h1>Every donation is a chain of three people showing up.</h1>
        <p>
          A donor lets go, a volunteer carries it, an orphanage receives it.
          Setu keeps that chain visible from the first offer to the last mile.
        </p>
        <div className="waypoint-chain">
          <div className="waypoint">
            <span className="waypoint-dot active" />
            <span className="waypoint-label">DONOR</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className="waypoint-dot active" />
            <span className="waypoint-label">VOLUNTEER</span>
          </div>
          <span className="waypoint-line" />
          <div className="waypoint">
            <span className="waypoint-dot" />
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
          <h2>Welcome back</h2>
          <p className="meta" style={{ marginTop: 6, marginBottom: 20 }}>
            Log in to continue where you left off.
          </p>

          {/* Spotify-style Toggle: Email or Mobile Number */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "var(--surface-sunken)",
              padding: 4,
              borderRadius: "var(--radius-sm)",
              marginBottom: 20,
              border: "1px solid var(--line)",
            }}
          >
            <button
              type="button"
              onClick={() => { setLoginMode("email"); setError(""); }}
              style={{
                padding: "8px 12px",
                borderRadius: "calc(var(--radius-sm) - 2px)",
                border: "none",
                background: loginMode === "email" ? "var(--surface)" : "transparent",
                color: loginMode === "email" ? "var(--brand)" : "var(--text-dim)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: loginMode === "email" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              ✉️ Email
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode("phone"); setError(""); }}
              style={{
                padding: "8px 12px",
                borderRadius: "calc(var(--radius-sm) - 2px)",
                border: "none",
                background: loginMode === "phone" ? "var(--surface)" : "transparent",
                color: loginMode === "phone" ? "var(--brand)" : "var(--text-dim)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: loginMode === "phone" ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              📱 Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {loginMode === "email" ? (
              <div className="field">
                <label className="field-label">Email Address <span className="required-star">*</span></label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            ) : (
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
                    className="input"
                    value={phone}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(onlyNums);
                    }}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                {phone && phone.length > 0 && phone.length < 10 && (
                  <p className="meta" style={{ fontSize: 12, color: "var(--clay)", marginTop: 4 }}>
                    Please enter 10 digits ({phone.length}/10 entered)
                  </p>
                )}
              </div>
            )}

            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="field-label" style={{ marginBottom: 0 }}>Password <span className="required-star">*</span></label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  style={{ background: "none", border: "none", color: "var(--brand)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && <div className="banner-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="meta" style={{ marginTop: 20 }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 440,
              width: "100%",
              padding: 28,
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18 }}>🔑 Reset Password</h3>
              <button
                onClick={() => setForgotOpen(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-dim)" }}
              >
                ✕
              </button>
            </div>

            <p className="meta" style={{ fontSize: 13, marginBottom: 20 }}>
              Enter your registered email address to receive an OTP verification code.
            </p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="field">
                <label className="field-label">Registered Email</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    className="input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={otpSent}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleSendResetOtp}
                    disabled={sendingResetOtp || otpSent}
                  >
                    {otpSent ? "Sent ✓" : sendingResetOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpSent && (
                <>
                  <div className="field">
                    <label className="field-label">6-Digit OTP Code</label>
                    <input
                      className="input"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 4 chars)"
                        style={{ paddingRight: 40 }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
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
                      >
                        {showNewPassword ? (
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

                  <button type="submit" className="btn btn-primary btn-full" disabled={resetting} style={{ marginTop: 12 }}>
                    {resetting ? "Resetting Password..." : "Reset Password & Login"}
                  </button>
                </>
              )}

              {resetMsg && <p className="msg-success" style={{ marginTop: 12 }}>{resetMsg}</p>}
              {resetErr && <p className="msg-error" style={{ marginTop: 12 }}>{resetErr}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
