import { useState, useEffect } from "react";

const OFFER_IMAGE_URL = "https://medicalglobalacademy.com/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-21-at-4.29.43-PM.jpeg"; 

export default function OfferPopup({ onClaim }) {
  // Countdown timer state (Aapki image ke hisaab se set kiya gaya hai)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 10,
    mins: 7,
    secs: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.days === 0 && prev.hours === 0 && prev.mins === 0 && prev.secs === 0) {
          clearInterval(timer);
          return prev;
        }
        let { days, hours, mins, secs } = prev;
        if (secs > 0) secs--;
        else {
          secs = 59;
          if (mins > 0) mins--;
          else {
            mins = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "10px" }}>
      <style>
        {`
          .timer-container { display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 20px; }
          .timer-box { background: #1e293b; color: #fff; padding: 6px 10px; min-width: 44px; border-radius: 6px; font-weight: bold; font-size: 18px; display: flex; flex-direction: column; align-items: center; }
          .timer-label { font-size: 10px; font-weight: normal; color: #94a3b8; margin-top: 2px; }
          .claim-btn { background: #f97316; color: white; width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; margin-top: 10px; }
          .claim-btn:hover { background: #ea580c; }
        `}
      </style>

      <h3 style={{ fontSize: "20px", marginBottom: "16px", color: "#1e293b", fontWeight: "600" }}>
        Exclusive offer on our programs
      </h3>
      
      {/* Offer Image */}
      <img 
        src={OFFER_IMAGE_URL} 
        alt="Diwali Offer" 
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }} 
      />

      {/* Countdown Timer */}
      <div className="timer-container">
        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500", marginRight: "4px" }}>⏱ Ends in</span>
        <div className="timer-box">
          {String(timeLeft.days).padStart(2, '0')} <span className="timer-label">DAYS</span>
        </div>
        <div className="timer-box">
          {String(timeLeft.hours).padStart(2, '0')} <span className="timer-label">HRS</span>
        </div>
        <div className="timer-box">
          {String(timeLeft.mins).padStart(2, '0')} <span className="timer-label">MIN</span>
        </div>
        <div className="timer-box">
          {String(timeLeft.secs).padStart(2, '0')} <span className="timer-label">SEC</span>
        </div>
      </div>

      <p style={{ color: "#475569", fontSize: "15px", marginBottom: "10px" }}>
        Enquire today and our counsellors will help you claim it.
      </p>

      {/* Jab user is par click karega tab form open hoga */}
      <button className="claim-btn" onClick={onClaim}>
        Claim this offer
      </button>
    </div>
  );
}