import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="wrap sec"><p className="notice">That page doesn't exist. <Link to="/courses">Browse programs</Link> or <Link to="/">go home</Link>.</p></section>;
}
