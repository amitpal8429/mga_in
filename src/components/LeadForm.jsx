import { useState } from "react";
import { fetchCourses, clean, submitLead } from "../lib/api";
import { getTracking } from "../lib/tracking";
import { useLoad, wa } from "./ui";
import { useAuth } from "../auth/AuthContext";

const QUALS = ["MBBS", "MD / MS / DNB", "BDS / MDS", "Other"];
const COUNTRIES = [
  ["India", "+91"], ["United Arab Emirates", "+971"], ["Saudi Arabia", "+966"], ["Nepal", "+977"],
  ["Bangladesh", "+880"], ["Sri Lanka", "+94"], ["Nigeria", "+234"], ["Kenya", "+254"],
  ["United Kingdom", "+44"], ["United States", "+1"], ["Other", ""],
];

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!v.country) e.country = "Please select your country.";
  const digits = v.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Mobile number is required.";
  else if (v.country === "India") {
    if (!/^[6-9]\d{9}$/.test(digits.slice(-10)) || digits.length < 10) e.phone = "Enter a valid 10-digit mobile number.";
  } else if (digits.length < 6 || digits.length > 14) e.phone = "Enter a valid mobile number.";
  if (!v.email.trim()) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.qual) e.qual = "Please select your qualification.";
  return e;
};

function Fld({ id, label, error, children }) {
  return (
    <div className={`fld${error ? " inv" : ""}`}>
      <label htmlFor={id}>{label} <span className="req" aria-hidden="true">*</span></label>
      {children}
      {error ? <p className="field-err" id={`${id}-err`} role="alert">{error}</p> : null}
    </div>
  );
}

export default function LeadForm({ course = "", title = "Get curriculum and fees" }) {
  const s = useLoad(fetchCourses);
  const { user } = useAuth() || {};
  const uid = useState(() => Math.random().toString(36).slice(2, 7))[0];
  
  // 1. Default state nikal kar ek function me daal diya
  const getInitialState = () => ({
    name: user?.name || "", phone: user?.phone || "", email: user?.email || "",
    country: "India", code: "+91", qual: "MBBS", course,
  });

  const [f, setF] = useState(getInitialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(""); // "" | "saved" | "whatsapp"
  const [serverError, setServerError] = useState("");

  const id = (k) => `${k}-${uid}`;
  const set = (k) => (e) => {
    const next = { ...f, [k]: e.target.value };
    if (k === "country") next.code = COUNTRIES.find(([c]) => c === e.target.value)?.[1] ?? "";
    setF(next);
    if (touched[k] || touched.all) setErrors(validate(next));
  };
  const blur = (k) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(f)); };
  const show = (k) => ((touched[k] || touched.all) ? errors[k] : undefined);
  const a11y = (k) => ({
    id: id(k), "aria-invalid": !!show(k),
    "aria-describedby": show(k) ? `${id(k)}-err` : undefined, onBlur: blur(k),
  });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const errs = validate(f);
    setErrors(errs);
    setTouched({ all: true });
    if (Object.keys(errs).length) {
      document.getElementById(id(Object.keys(errs)[0]))?.focus();
      return;
    }
    setSending(true);
    setServerError("");
    try {
      await submitLead({
        name: f.name.trim(), email: f.email.trim(),
        phone_code: f.code, phone: f.phone,
        country: f.country, qualification: f.qual,
        course: f.course || "Not sure yet",
        website: e.target.elements.website?.value || "", // honeypot
        ...getTracking(),
      });
      setDone("saved");
      
      // ✅ FIX: Success hone par form clear
      setF(getInitialState());
      setTouched({});

    } catch (err) {
      console.error("Lead submit failed:", err);
      setServerError(err?.message || "Unknown error");
      // Server failed: don't lose the lead, fall back to WhatsApp.
      window.open(
        wa(`Enquiry\nName: ${f.name}\nCountry: ${f.country}\nPhone: ${f.code} ${f.phone}\nEmail: ${f.email}\nQualification: ${f.qual}\nProgram: ${f.course || "Not sure yet"}`),
        "_blank", "noopener"
      );
      setDone("whatsapp");
      
      // ✅ FIX: WhatsApp fallback me bhi form clear
      setF(getInitialState());
      setTouched({});

    } finally {
      setSending(false);
    }
  };

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <h3>{title}</h3>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <p className="muted lf-note">Fields marked <span className="req">*</span> are required.</p>

      <Fld id={id("name")} label="Full name" error={show("name")}>
        <input {...a11y("name")} value={f.name} onChange={set("name")} autoComplete="name" required />
      </Fld>

      <Fld id={id("country")} label="Country" error={show("country")}>
        <select {...a11y("country")} value={f.country} onChange={set("country")} autoComplete="country-name" required>
          <option value="">Select country</option>
          {COUNTRIES.map(([c]) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Fld>

      <Fld id={id("phone")} label="Mobile number" error={show("phone")}>
        <div className="phone-row">
          <input className="code" value={f.code} onChange={set("code")} aria-label="Country code" inputMode="tel" />
          <input {...a11y("phone")} type="tel" inputMode="numeric" value={f.phone} onChange={set("phone")} placeholder="Mobile no." autoComplete="tel-national" required />
        </div>
      </Fld>

      <Fld id={id("email")} label="Email" error={show("email")}>
        <input {...a11y("email")} type="email" value={f.email} onChange={set("email")} autoComplete="email" required />
      </Fld>

      <div className="two">
        <Fld id={id("qual")} label="Qualification" error={show("qual")}>
          <select {...a11y("qual")} value={f.qual} onChange={set("qual")} required>
            {QUALS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </Fld>
        <div className="fld">
          <label htmlFor={id("course")}>Program</label>
          <select id={id("course")} value={f.course} onChange={set("course")}>
            <option value="">Not sure yet</option>
            {s.data?.map((c) => <option key={c.id} value={clean(c.name)}>{clean(c.name)}</option>)}
            {f.course && !s.data && <option>{f.course}</option>}
          </select>
        </div>
      </div>

      {touched.all && Object.keys(errors).length ? (
        <p className="err" role="alert">Please fix the highlighted fields and send again.</p>
      ) : null}

      <button className="btn full" type="submit" disabled={sending}>{sending ? "Sending..." : "Send enquiry"}</button>

      {done === "saved" && <p className="ok" role="status">Thank you! Our admissions team will contact you shortly.</p>}
      {done === "whatsapp" && (
        <>
          <p className="ok" role="status">WhatsApp opened with your details. Press send there and we'll reply shortly.</p>
          {serverError && <p className="err" role="alert">Server error: {serverError}</p>}
        </>
      )}
    </form>
  );
}