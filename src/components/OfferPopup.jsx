import { useState, useEffect } from "react";

const OFFER_IMAGE_URL = "https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-21-at-4.29.43-PM.jpeg";

// Offer ka asli end date/time (IST)
const OFFER_END = new Date("2026-11-08T23:59:59+05:30");

const getTimeLeft = () => {
  const diff = Math.max(0, OFFER_END.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
};

const EMPTY_FORM = { name: "", phone: "", email: "", course: "" };

export default function OfferPopup({ onSubmitForm }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [ended, setEnded] = useState(() => Date.now() >= OFFER_END.getTime());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() >= OFFER_END.getTime()) {
        setEnded(true);
        clearInterval(timer);
        return;
      }
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (ended) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Naam zaroori hai";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = "Sahi 10 digit mobile number daalein";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = "Sahi email daalein";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (onSubmitForm) await onSubmitForm(form);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setErrors({ general: "Kuch galat ho gaya, dobara try karein." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "15px",
    boxSizing: "border-box",
    marginTop: "4px",
  };
  const errorStyle = { color: "#dc2626", fontSize: "12px", marginTop: "3px", display: "block" };
  const labelStyle = { display: "block", textAlign: "left", fontSize: "14px", color: "#334155", marginBottom: "12px" };

  return (
    <div style={{ textAlign: "center", paddingTop: "10px" }}>
      <style>
        {`
          .timer-container { display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 20px; }
          .timer-box { background: #1e293b; color: #fff; padding: 6px 10px; min-width: 44px; border-radius: 6px; font-weight: bold; font-size: 18px; display: flex; flex-direction: column; align-items: center; }
          .timer-label { font-size: 10px; font-weight: normal; color: #94a3b8; margin-top: 2px; }
          .claim-btn { background: #f97316; color: white; width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; margin-top: 10px; }
          .claim-btn:hover { background: #ea580c; }
          .claim-btn:disabled { background: #fdba74; cursor: not-allowed; }
        `}
      </style>

      {!showForm && !submitted && (
        <>
          <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#1e293b", fontWeight: "600" }}>
            Exclusive offer on our programs
          </h3>

          <img
            src={OFFER_IMAGE_URL}
            alt="Diwali Offer"
            style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
          />

          <div className="timer-container">
            <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500", marginRight: "4px" }}>⏱ Ends in</span>
            <div className="timer-box">{String(timeLeft.days).padStart(2, "0")} <span className="timer-label">DAYS</span></div>
            <div className="timer-box">{String(timeLeft.hours).padStart(2, "0")} <span className="timer-label">HRS</span></div>
            <div className="timer-box">{String(timeLeft.mins).padStart(2, "0")} <span className="timer-label">MIN</span></div>
            <div className="timer-box">{String(timeLeft.secs).padStart(2, "0")} <span className="timer-label">SEC</span></div>
          </div>

          <p style={{ color: "#475569", fontSize: "15px", marginBottom: "10px" }}>
            Enquire today and our counsellors will help you claim it.
          </p>

          <button className="claim-btn" onClick={() => setShowForm(true)}>
            Claim this offer
          </button>
        </>
      )}

      {showForm && !submitted && (
        <form onSubmit={handleSubmit} noValidate style={{ textAlign: "left" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "6px", color: "#1e293b", fontWeight: "600", textAlign: "center" }}>
            Offer claim karein
          </h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
            Details bhariye, counsellor aapse contact karega.
          </p>

          <label style={labelStyle}>
            Naam *
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Aapka poora naam" />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </label>

          <label style={labelStyle}>
            Mobile number *
            <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="10 digit mobile" inputMode="numeric" maxLength={10} />
            {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
          </label>

          <label style={labelStyle}>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="aap@example.com" />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </label>

          <label style={labelStyle}>
            Kis course mein interest hai?
            <input name="course" value={form.course} onChange={handleChange} style={inputStyle} placeholder="Course ka naam (optional)" />
          </label>

          {errors.general && <span style={errorStyle}>{errors.general}</span>}

          <button type="submit" className="claim-btn" disabled={submitting}>
            {submitting ? "Bhej rahe hain..." : "Submit karein"}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{ background: "none", border: "none", color: "#64748b", marginTop: "10px", cursor: "pointer", width: "100%", fontSize: "14px" }}
          >
            ← Wapas jayein
          </button>
        </form>
      )}

      {submitted && (
        <div style={{ padding: "20px 0" }}>
          <h3 style={{ fontSize: "20px", color: "#16a34a", marginBottom: "10px" }}>Shukriya!</h3>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Aapki request mil gayi hai. Hamari team jaldi aapse contact karegi.
          </p>
        </div>
      )}
    </div>
  );
}