import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../components/ui";
import { useAuth } from "../auth/AuthContext";
export default function Signup() {
  const { signup } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "", confirm: "" }); const [err, setErr] = useState("");
  const u = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async (e) => { e.preventDefault();
    if (f.password !== f.confirm) return setErr("Passwords don't match.");
    try { await signup(f); nav("/dashboard", { replace: true }); } catch (x) { setErr(x.message); } };
  return (
    <section className="wrap sec"><form className="box authbox" onSubmit={go}>
      <h1>Create your account</h1>{err && <p className="err" role="alert">{err}</p>}
      <Field l="Full name" required autoComplete="name" value={f.name} onChange={u("name")} />
      <Field l="Mobile number" type="tel" required pattern="[0-9+ ]{10,15}" value={f.phone} onChange={u("phone")} />
      <Field l="Email" type="email" required autoComplete="email" value={f.email} onChange={u("email")} />
      <Field l="Password (8+ characters)" type="password" required minLength={8} autoComplete="new-password" value={f.password} onChange={u("password")} />
      <Field l="Confirm password" type="password" required minLength={8} autoComplete="new-password" value={f.confirm} onChange={u("confirm")} />
      <button className="btn full">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form></section>
  );
}
