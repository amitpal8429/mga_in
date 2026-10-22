import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <section className="wrap sec"><div className="box authbox">
      <h1>Hello, {user.name.split(" ")[0]}</h1>
      <p className="muted">{user.email} · {user.phone}</p>
      <Link className="btn full" to="/courses">Browse programs</Link>
      <Link className="btn ghost full" to="/apply">Apply for a program</Link>
      <button className="btn ghost full" onClick={logout}>Log out</button>
    </div></section>
  );
}
