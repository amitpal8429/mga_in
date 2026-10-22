import { Link } from "react-router-dom";
import { SITE } from "../config/site";
export default function Footer() {
  return (
    <footer className="foot"><div className="wrap fgrid">
      <div><Link to="/" className="logo"><i>M</i>{SITE.name}</Link><p>Online courses for practising doctors. Professional skill-development courses, not government postgraduate degrees.</p></div>
      <div><h5>Courses</h5><Link to="/courses?type=Fellowship">Fellowships</Link><Link to="/courses?type=Pg Diploma">PG Diplomas</Link><Link to="/courses?type=Certificate">Certificates</Link></div>
      <div><h5>Academy</h5><Link to="/about">About us</Link><Link to="/faculty">Faculty</Link><Link to="/accreditation">Accreditation</Link><Link to="/faq">FAQ</Link></div>
      <div><h5>Account and support</h5><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/refund">Refunds</Link><Link to="/sitemap">Sitemap</Link></div>
    </div><div className="wrap copy">© {new Date().getFullYear()} {SITE.name}. Call {SITE.phone}</div></footer>
  );
}