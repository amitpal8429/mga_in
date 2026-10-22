import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Field } from "./ui";
import { useAuth } from "../auth/AuthContext";

/* =========================================================
   LOGIN FORM
   ========================================================= */

function LoginForm({ onDone, onSwitch }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(f);
      onDone();
      nav("/dashboard", { replace: true });
    } catch (x) {
      setErr(x.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={go}>
      <h2 id="auth-title" className="auth-title">Log in</h2>
      {err && (
        <p className="err" role="alert">
          {err}
        </p>
      )}

      <Field
        l="Email"
        type="email"
        required
        autoComplete="email"
        value={f.email}
        onChange={(e) => setF({ ...f, email: e.target.value })}
      />
      <Field
        l="Password"
        type="password"
        required
        autoComplete="current-password"
        value={f.password}
        onChange={(e) => setF({ ...f, password: e.target.value })}
      />

      <button className="btn full" disabled={busy}>
        {busy ? "Please wait…" : "Log in"}
      </button>

      <p className="muted auth-switch">
        New here?{" "}
        <button type="button" className="linkbtn" onClick={onSwitch}>
          Create an account
        </button>
      </p>
    </form>
  );
}

/* =========================================================
   SIGNUP FORM
   ========================================================= */

function SignupForm({ onDone, onSwitch }) {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const u = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const go = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return setErr("Passwords don't match.");

    setErr("");
    setBusy(true);
    try {
      await signup(f);
      onDone();
      nav("/dashboard", { replace: true });
    } catch (x) {
      setErr(x.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={go}>
      <h2 id="auth-title" className="auth-title">Create your account</h2>
      {err && (
        <p className="err" role="alert">
          {err}
        </p>
      )}

      <Field l="Full name" required autoComplete="name" value={f.name} onChange={u("name")} />
      <Field
        l="Mobile number"
        type="tel"
        required
        pattern="[0-9+ ]{10,15}"
        value={f.phone}
        onChange={u("phone")}
      />
      <Field
        l="Email"
        type="email"
        required
        autoComplete="email"
        value={f.email}
        onChange={u("email")}
      />
      <Field
        l="Password (8+ characters)"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={f.password}
        onChange={u("password")}
      />
      <Field
        l="Confirm password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={f.confirm}
        onChange={u("confirm")}
      />

      <button className="btn full" disabled={busy}>
        {busy ? "Please wait…" : "Sign up"}
      </button>

      <p className="muted auth-switch">
        Already registered?{" "}
        <button type="button" className="linkbtn" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  );
}

/* =========================================================
   MODAL
   mode: "login" | "signup" | null (null = closed)
   ========================================================= */

export default function AuthModal({ mode, onClose, onSwitch }) {
  const open = Boolean(mode);

  // Esc se band
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // background scroll band
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {mode === "login" ? (
          <LoginForm key="login" onDone={onClose} onSwitch={() => onSwitch("signup")} />
        ) : (
          <SignupForm key="signup" onDone={onClose} onSwitch={() => onSwitch("login")} />
        )}
      </div>
    </div>,
    document.body
  );
}