import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom"; 
import { NAV, SITE } from "../config/site";
import { useAuth } from "../auth/AuthContext";
import LeadForm from "./LeadForm";

const LOGO_URL =
  "https://medicalglobalacademy.com/wp-content/uploads/2026/08/logo_new.png";

const label = (l) => (l === "Programs" ? "Courses" : l);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const openLead = () => {
    setOpen(false);
    setLeadOpen(true);
  };

  const closeLead = () => {
    setLeadOpen(false);
    sessionStorage.setItem(`lead_popup_closed_${location.pathname}`, "true");
  };

  useEffect(() => {
    if (user) return;
    const isClosed = sessionStorage.getItem(`lead_popup_closed_${location.pathname}`);
    if (!isClosed) {
      const timer = setTimeout(() => {
        setLeadOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setLeadOpen(false);
    }
  }, [location.pathname, user]);

  useEffect(() => {
    if (leadOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [leadOpen]);

  return (
    <header className="top">
      <div className="wrap bar">
        <Link to="/" className="logo" aria-label={SITE.name}>
          <img
            src={LOGO_URL}
            alt=""
            className="logo-img"
            height="44"
            decoding="async"
          />
          <span className="logo-text">Medical Global Academy</span>
        </Link>

        <button
          className="burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          {/* Existing Config Links */}
          {NAV.map(([t, l]) => (
            <NavLink key={t} to={t}>
              {label(l)}
            </NavLink>
          ))}

          {/* NAYA BLOG LINK YAHAN ADD KIYA GAYA HAI */}
          <NavLink to="/blog">Blog</NavLink>

          {user ? (
            <span className="nav-user">
              <Link to="/dashboard">{user.name.split(" ")[0]}</Link>
              <button className="linkbtn" onClick={logout}>
                Log out
              </button>
            </span>
          ) : (
            <span className="nav-user">
              <button type="button" className="btn sm" onClick={openLead}>
                Enquire Now
              </button>
            </span>
          )}
        </nav>
      </div>

      {/* Lead Form Modal with Blinking Animation */}
      {leadOpen &&
        createPortal(
          <div
            onClick={closeLead}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "16px",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                padding: "32px 24px 24px",
                animation: "blinkAndSlide 1.5s ease-out",
              }}
            >
              <style>
                {`
                  @keyframes blinkAndSlide {
                    0% { opacity: 0; transform: translateY(20px); }
                    50% { opacity: 0.5; box-shadow: 0 0 0 10px rgba(200, 160, 50, 0.3); }
                    100% { opacity: 1; transform: translateY(0); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
                  }
                `}
              </style>

              <button
                type="button"
                aria-label="Close"
                onClick={closeLead}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4b5563",
                  zIndex: 10,
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              >
                ✕
              </button>

              <LeadForm title="Get curriculum and fees" />
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}