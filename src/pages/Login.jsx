import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field } from "../components/ui";
import { useAuth } from "../auth/AuthContext";
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const [f, setF] = useState({ email: "", password: "" }); const [err, setErr] = useState("");
  const go = async (e) => { e.preventDefault(); try { await login(f); nav(loc.state?.from || "/dashboard", { replace: true }); } catch (x) { setErr(x.message); } };
  return (
    <section className="wrap sec"><form className="box authbox" onSubmit={go}>
      <h1>Log in</h1>{err && <p className="err" role="alert">{err}</p>}
      <Field l="Email" type="email" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Field l="Password" type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="btn full">Log in</button>
      <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
    </form></section>
  );
}
