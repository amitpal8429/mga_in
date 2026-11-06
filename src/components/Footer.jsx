import { Link } from "react-router-dom";
import { SITE } from "../config/site";

// Social Media SVG Icons (No package needed)
const SocialIcons = {
  Instagram: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
};

const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/medicalglobalacademy/", icon: <SocialIcons.Instagram /> },
  // LinkedIn profile URL ko direct company page ka kar diya hai taaki login page na khule
  { name: "LinkedIn", url: "https://www.linkedin.com/company/108696261/", icon: <SocialIcons.LinkedIn /> },
  { name: "X (Twitter)", url: "https://x.com/MGA_Courses", icon: <SocialIcons.X /> },
  { name: "YouTube", url: "https://www.youtube.com/@MedicalGlobalAcademy", icon: <SocialIcons.YouTube /> },
  { name: "Facebook", url: "https://www.facebook.com/medicalglobalacademy1", icon: <SocialIcons.Facebook /> },
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap fgrid">
        <div>
          <Link to="/" className="logo">
            <i>M</i>
            {SITE.name}
          </Link>
          <p>
            Online courses for practising doctors. Professional skill-development
            courses, not government postgraduate degrees.
          </p>
          
          {/* Social Links Icons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)", // Glass effect matching dark footer
                  color: "#fff",
                  transition: "background 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1f7ac4"; // Hover theme color
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5>Courses</h5>
          <Link to="/courses?type=Fellowship">Fellowships</Link>
          <Link to="/courses?type=Pg Diploma">PG Diplomas</Link>
          <Link to="/courses?type=Certificate">Certificates</Link>
        </div>

        <div>
          <h5>Academy</h5>
          <Link to="/about">About us</Link>
          <Link to="/faculty">Faculty</Link>
          <Link to="/accreditation">Accreditation</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div>
          <h5>Account and support</h5>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/refund">Refunds</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
      </div>

      <div className="wrap copy">
        © {new Date().getFullYear()} {SITE.name}. Call {SITE.phone}
      </div>
    </footer>
  );
}