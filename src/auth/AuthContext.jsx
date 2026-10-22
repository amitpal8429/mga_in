import { createContext, useContext, useState } from "react";
// Demo auth stored in this browser only (no backend yet). Swap login/signup for real API calls later.
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");
const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read("mga_session"));
  const start = (r) => { const s = { name: r.name, phone: r.phone, email: r.email }; localStorage.setItem("mga_session", JSON.stringify(s)); setUser(s); };
  const signup = async ({ name, phone, email, password }) => {
    const users = read("mga_users") || []; const em = email.toLowerCase();
    if (users.some((u) => u.email === em)) throw new Error("An account with this email already exists. Log in instead.");
    const rec = { name, phone, email: em, hash: await sha(password) };
    localStorage.setItem("mga_users", JSON.stringify([...users, rec])); start(rec);
  };
  const login = async ({ email, password }) => {
    const rec = (read("mga_users") || []).find((u) => u.email === email.toLowerCase());
    if (!rec || rec.hash !== (await sha(password))) throw new Error("Email or password is incorrect.");
    start(rec);
  };
  const logout = () => { localStorage.removeItem("mga_session"); setUser(null); };
  return <Ctx.Provider value={{ user, signup, login, logout }}>{children}</Ctx.Provider>;
}
