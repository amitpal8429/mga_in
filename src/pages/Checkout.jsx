import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clean, inr } from "../lib/api";
import PayButton from "../components/PayButton";

// Simple Inline SVG Icons (No package needed)
const IconArrowLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
);
const IconShield = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconCheck = () => (
  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default function Checkout() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const courseName = queryParams.get("course") || "Course Enrollment";
  const courseAmount = queryParams.get("amount") || "0";

  const [paid, setPaid] = useState(false);
  const [payer, setPayer] = useState({ name: "", email: "", phone: "" });

  const updatePayer = (field) => (e) =>
    setPayer((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSuccess = () => {
    setPaid(true);
  };

  const validatePayer = () => {
    if (payer.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payer.email.trim())) return "Please enter a valid email address.";
    if (payer.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number (at least 10 digits).";
    return "";
  };

  return (
    <div className="wrap" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "600px" }}>
      
      {!paid && (
        <Link to="/courses" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "20px", fontSize: "14px", fontWeight: "500" }}>
          <IconArrowLeft /> Back to courses
        </Link>
      )}

      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {paid ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ display: "inline-flex", background: "#dff7e8", padding: "16px", borderRadius: "50%", marginBottom: "20px", color: "#166534" }}>
              <IconCheck />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>Payment Successful!</h2>
            <p style={{ color: "#475569", marginBottom: "30px", fontSize: "16px" }}>
              Thank you, <strong>{payer.name}</strong>. Your enrollment for <strong>{clean(courseName)}</strong> is confirmed. Our team will contact you shortly at {payer.email}.
            </p>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", padding: "14px 24px", background: "#1f7ac4", color: "white", borderRadius: "8px", fontWeight: "600" }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Complete Your Enrollment</h1>
              <p style={{ color: "#64748b", fontSize: "15px" }}>You are enrolling for: <strong style={{ color: "#0f172a" }}>{clean(courseName)}</strong></p>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#475569", fontWeight: "500" }}>Registration Amount</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                {courseAmount !== "0" ? inr(courseAmount) : "Pay securely"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Full Name *</label>
                <input type="text" placeholder="Dr. Rajesh Kumar" autoComplete="name" value={payer.name} onChange={updatePayer("name")} style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Email Address *</label>
                <input type="email" placeholder="rajesh@example.com" autoComplete="email" value={payer.email} onChange={updatePayer("email")} style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Phone Number *</label>
                <input type="tel" placeholder="+91 98765 43210" autoComplete="tel" value={payer.phone} onChange={updatePayer("phone")} style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }} />
              </div>
            </div>

            <PayButton
              course={courseName}
              amount={Number(courseAmount) || 0}
              name={payer.name.trim()}
              email={payer.email.trim()}
              phone={payer.phone.trim()}
              label="Proceed to Pay Securely"
              buttonStyle={{ width: "100%", padding: "14px", background: "#f97316", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
              hoverBg="#ea580c"
              validate={validatePayer}
              onSuccess={handleSuccess}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "20px", color: "#64748b", fontSize: "13px" }}>
              <IconShield /> 100% Secure Payment via Razorpay
            </div>
          </>
        )}
      </div>
    </div>
  );
}