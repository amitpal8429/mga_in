import { useState } from "react";

// Custom SVG Icons
const IconWhatsApp = () => (
  <svg width="24" height="24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconPhone = () => (
  <svg width="24" height="24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconChatbot = () => (
  <svg width="24" height="24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"></path>
    <path d="M9 15h.01"></path><path d="M15 15h.01"></path>
    <path d="M9 19h6"></path>
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Common Connect Icon for the main button
const IconConnect = () => (
  <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ 
        position: "fixed", 
        bottom: "24px", 
        right: "24px", 
        zIndex: 9999, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "flex-end", 
        gap: "16px" 
      }}>
        
        {/* Icons jo ek ke upar ek open honge */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "12px", 
            alignItems: "flex-end", 
            animation: "slideUp 0.2s ease-out" 
          }}>
          
            {/* Call Icon - Updated Number */}
            <a 
              href="tel:+919289994218" 
              title="Call AI Support"
              style={{
                width: "50px", height: "50px", borderRadius: "50%", background: "#0f172a", 
                border: "1px solid #1e293b", display: "flex", textDecoration: "none",
                alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <IconPhone />
            </a>

            {/* WhatsApp Icon - Updated Number */}
            <a 
              href="https://wa.me/918796122980" 
              target="_blank" 
              rel="noreferrer"
              title="WhatsApp AI Support"
              style={{
                width: "50px", height: "50px", borderRadius: "50%", background: "#0f172a", 
                border: "1px solid #1e293b", display: "flex", textDecoration: "none",
                alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <IconWhatsApp />
            </a>

          </div>
        )}

        {/* MAIN FLOATING BUTTON (Connect With Us) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "60px", 
            height: "60px", 
            borderRadius: "50%", 
            background: isOpen ? "#334155" : "#25D366", // Green when closed, Dark grey when open
            border: "none", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: isOpen ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 20px rgba(37, 211, 102, 0.4)", 
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          aria-label="Connect with us"
        >
          {isOpen ? (
            <span style={{ color: "#fff" }}><IconClose /></span>
          ) : (
            <IconConnect />
          )}
        </button>
      </div>
    </>
  );
}