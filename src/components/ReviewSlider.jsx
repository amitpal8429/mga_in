import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { INSTAGRAM_REVIEWS, INSTAGRAM_PROFILE } from "../config/reviews";

const SPEED = 0.6;          // auto-scroll speed (px per frame)
const CARD_W = 200;         // card ki chaudai
const GAP = 14;             // cards ke beech ka gap
const RESUME_DELAY = 2500;  // manual scroll ke baad auto-scroll wapas kab shuru ho

// Instagram URL -> code & src
function toEmbed(url) {
  const m = String(url).match(/instagram\.com\/(p|reel)\/([^/?#]+)/i);
  if (!m) return null;
  return { 
    type: m[1],
    code: m[2], 
    src: `https://www.instagram.com/${m[1]}/${m[2]}/embed` 
  };
}

const ITEMS = INSTAGRAM_REVIEWS.map(toEmbed).filter(Boolean);

const CSS = `
  .rv-side {
    padding: 22px 18px 18px;
    background: #ffffff;
    border: 1px solid #dce4ea;
    border-radius: 16px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .rv-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .rv-title {
    margin: 0;
    color: #16324f;
    font-size: 18px;
    line-height: 1.3;
    font-weight: 750;
  }
  .rv-sub {
    margin: 4px 0 0;
    color: #596b7e;
    font-size: 13px;
    line-height: 1.4;
  }
  .rv-arrows { display: flex; gap: 6px; flex: 0 0 auto; }
  .rv-arrow {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #dce4ea;
    background: #ffffff;
    color: #16324f;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s ease, color 0.15s ease;
  }
  .rv-arrow:hover { border-color: #1f7ac4; color: #1f7ac4; }
  
  .rv-track {
    display: flex;
    gap: ${GAP}px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 8px;
  }
  .rv-track::-webkit-scrollbar { display: none; }

  /* Card Thumbnail Design */
  .rv-card-thumb {
    position: relative;
    flex: 0 0 ${CARD_W}px;
    height: ${CARD_W * 1.77}px; /* 9:16 ratio */
    border-radius: 12px;
    overflow: hidden;
    background: #000000;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
  }
  .rv-card-thumb:hover {
    transform: translateY(-2px);
  }
  .rv-card-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .rv-card-thumb .rv-play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.2);
  }
  .rv-card-thumb .rv-play-btn {
    background: rgba(255,255,255,0.9);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .rv-card-thumb .rv-play-btn svg {
    margin-left: 4px;
  }

  .rv-follow {
    display: inline-block;
    margin-top: 12px;
    color: #1f7ac4;
    font-weight: 600;
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* POPUP / MODAL STYLES */
  .rv-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 20px;
    backdrop-filter: blur(4px);
  }
  .rv-modal-content {
    position: relative;
    width: 100%;
    max-width: 360px;
    height: 80vh;
    max-height: 640px;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .rv-modal-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ✅ THE CROPPING TRICK: Video Iframe ko crop karke sirf video dikhana */
  .rv-iframe-crop {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #000;
  }
  .rv-iframe-crop iframe {
    position: absolute;
    top: -54px;           /* Upar ka header crop karne ke liye */
    left: 50%;
    width: 400px;         /* Iframe ki chaudai badha di taaki crop ho sake */
    height: 850px;        /* Iframe ki height badha di */
    transform: translateX(-50%);
    border: 0;
  }

  @media (max-width: 480px) {
    .rv-arrows { display: none; }
  }
`;

export default function ReviewSlider() {
  const trackRef = useRef(null);
  const hold = useRef({ hover: false, manual: false });
  const timer = useRef(null);
  
  const [activeVideo, setActiveVideo] = useState(null);

  // Auto-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let raf;
    let pos = el.scrollLeft;

    const tick = () => {
      const h = hold.current;

      if (h.hover || h.manual) {
        pos = el.scrollLeft; 
      } else {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          pos += SPEED;
          if (pos >= max - 1) pos = 0;
          el.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const holdManual = () => {
    hold.current.manual = true;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      hold.current.manual = false;
    }, RESUME_DELAY);
  };

  const nudge = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    holdManual();
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  // Esc key se popup band karne ke liye
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (ITEMS.length === 0) return null;

  return (
    <>
      <div className="rv-side" aria-labelledby="learner-reviews-title">
        <style>{CSS}</style>

        <div className="rv-head">
          <div>
            <h4 id="learner-reviews-title" className="rv-title">
              What our learners say
            </h4>
            <p className="rv-sub">Real feedback from doctors who learned with us</p>
          </div>

          <div className="rv-arrows">
            <button type="button" className="rv-arrow" onClick={() => nudge(-1)} aria-label="Previous">
              <ChevronLeft size={17} />
            </button>
            <button type="button" className="rv-arrow" onClick={() => nudge(1)} aria-label="Next">
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div
          className="rv-track"
          ref={trackRef}
          onMouseEnter={() => { hold.current.hover = true; }}
          onMouseLeave={() => { hold.current.hover = false; }}
          onTouchStart={() => {
            hold.current.manual = true;
            clearTimeout(timer.current);
          }}
          onTouchEnd={holdManual}
          onWheel={holdManual}
        >
          {ITEMS.map((item) => (
            <div 
              className="rv-card-thumb" 
              key={item.code}
              onClick={() => setActiveVideo(item)}
            >
              {/* Thumbnail Image (Fast load) */}
              <img 
                src={`https://www.instagram.com/p/${item.code}/media/?size=l`} 
                alt="Learner Review" 
                loading="lazy"
              />
              <div className="rv-play-overlay">
                <div className="rv-play-btn">
                  <svg width="20" height="20" fill="#0f172a" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a className="rv-follow" href={INSTAGRAM_PROFILE} target="_blank" rel="noopener noreferrer">
          See more on Instagram →
        </a>
      </div>

      {/* ✅ POPUP WITH THE CROPPING TRICK */}
      {activeVideo && createPortal(
        <div className="rv-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="rv-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="rv-modal-close" onClick={() => setActiveVideo(null)}>
              <X size={28} />
            </button>
            
            {/* The Cropped Iframe */}
            <div className="rv-iframe-crop">
              <iframe
                src={activeVideo.src}
                title={`Learner review ${activeVideo.code}`}
                loading="lazy"
                scrolling="no"
                allow="encrypted-media; autoplay"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}