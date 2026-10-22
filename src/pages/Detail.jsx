import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";

// Instagram post IDs
const IG_POSTS = [
  "DcQqQtzBgtD",
  "DcJeMk5h_RQ",
  "Db2exf_BHJl",
  "DbndhCbBVJ5",
  "DbbBANvB1Ye",
  "DbYp-lJhlqQ",
  "DbGamPDhHxN",
  "DaP6a2YBl2I",
  "DaNm4zohqKC",
  "DaDCd99Bjyu",
];

// Apna Instagram profile link yahan confirm kar lena
const IG_PROFILE = "https://www.instagram.com/medicalglobalacademy/";

function IgSlider() {
  const ref = useRef(null);
  const go = (dir) => ref.current?.scrollBy({ left: dir * 700, behavior: "smooth" });

  return (
    <section className="mgs-section">
      <div className="wrap">
        <div className="mgs-head">
          <div>
            <h2 className="mgs-title">What our learners say</h2>
            <p className="mgs-sub">Real feedback from doctors who learned with us</p>
          </div>
          <div className="mgs-arrows">
            <button type="button" aria-label="Previous videos" onClick={() => go(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" aria-label="Next videos" onClick={() => go(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        <div className="mgs-track" ref={ref}>
          {IG_POSTS.map((id) => (
            <div className="mgs-item" key={id}>
              <iframe
                src={`https://www.instagram.com/p/${id}/embed`}
                title={`Instagram post ${id}`}
                loading="lazy"
                allowTransparency="true"
                allowFullScreen
                scrolling="no"
                frameBorder="0"
              />
            </div>
          ))}
        </div>

        <a className="mgs-more" href={IG_PROFILE} target="_blank" rel="noreferrer">
          See more on Instagram →
        </a>
      </div>
    </section>
  );
}

export function Detail() {
  const { slug } = useParams(); 
  const s = useLoad(() => fetchCourse(slug), [slug]); 
  const all = useLoad(fetchCourses); 
  const [open, setOpen] = useState(0);
  
  if (s.error) return <div className="wrap sec"><p className="notice">We couldn't find that page. <Link to="/courses">Browse programs</Link></p></div>;
  if (!s.data) return <div className="wrap sec"><div className="card skel tall" /></div>;
  
  const c = s.data; 
  document.title = `${clean(c.name)} | Medical Global Academy India`;
  const rel = all.data?.filter((x) => x.type === c.type && x.slug !== c.slug).slice(0, 3) || [];

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <p className="crumb"><Link to="/courses">Programs</Link> / {typeLabel(c.type)}</p>
          <h1>{clean(c.name)}</h1>
          <div className="tags">
            <span className="tag amber">{typeLabel(c.type)}</span>
            <span className="tag glass">{months(c.duration)}</span>
            <span className="tag glass">Online</span>
          </div>
        </div>
      </section>

      <div className="wrap dg">
        {/* LEFT SIDE: Content */}
        <div>
          <h2>Overview</h2>
          <p className="lead">{clean(c.description)}</p>
          
          {c.what_you_learn?.length > 0 && (
            <>
              <h2>What you'll learn</h2>
              <div className="learn">
                {c.what_you_learn.map((w) => (
                  <div key={w.id}>
                    <h4>{clean(w.heading)}</h4>
                    <p>{clean(w.description)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {c.module?.length > 0 && (
            <>
              <h2>Curriculum <span className="muted">{c.module.length} modules</span></h2>
              {c.module.map((m, i) => (
                <div className="fq" key={m.id}>
                  <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                    <span>{clean(m.module)}</span>
                    <span>{open === i ? "–" : "+"}</span>
                  </button>
                  {open === i && (
                    <ul>
                      {m.sessions?.map((x) => <li key={x.id}>{clean(x.title)}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {rel.length > 0 && (
            <>
              <h2>Related programs</h2>
              <div className="grid">
                {rel.map((x) => <Card key={x.id} c={x} />)}
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE: Sidebar */}
        <aside>
          
          {/* 1. ACCREDITATION SECTION */}
          <div 
            className="box" 
            style={{ 
              marginBottom: "24px", 
              padding: "24px", 
              background: "#ffffff", 
              borderRadius: "16px", 
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
            }}
          >
            {/* Title with Icon */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <svg width="24" height="24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Accreditation
              </h3>
            </div>

            {/* Subtitle */}
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", marginBottom: "24px", lineHeight: "1.4" }}>
              Globally recognised CPD & ACTD-aligned certification
            </h2>

            {/* Two Columns Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              
              {/* CPD Box */}
              <div style={{ background: "#f8fafc", padding: "16px 12px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img 
                  src="https://medicalglobalacademy.com/wp-content/uploads/2026/09/Untitled-design-8.png" 
                  alt="CPD Logo" 
                  style={{ width: "100%", maxWidth: "90px", height: "auto", objectFit: "contain", marginBottom: "16px" }} 
                />
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155", lineHeight: "1.3" }}>
                  CPD (UK)
                </span>
              </div>

              {/* ACTD Box */}
              <div style={{ background: "#f8fafc", padding: "16px 12px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <img 
                  src="https://medicalglobalacademy.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg" 
                  alt="ACTD Logo" 
                  style={{ width: "100%", maxWidth: "90px", height: "auto", objectFit: "contain", marginBottom: "16px", borderRadius: "4px" }} 
                />
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155", lineHeight: "1.3", textTransform: "uppercase" }}>
                  ACTD (AMERICAN COUNCIL OF TRAINING AND DEVELOPMENT)
                </span>
              </div>

            </div>
          </div>

          {/* 2. PRICING BOX */}
          <div className="box" style={{ marginBottom: "24px" }}>
            <span className="muted">Registration fee</span>
            <b className="price">{inr(c.fee)}</b>
            {c.total_fee > c.fee && <span className="muted">Total online program cost {inr(c.total_fee)}</span>}
            {c.hybrid_cpd > 0 && <span className="muted">Total hybrid program cost {inr(c.hybrid_cpd)}</span>}
            
            <Link className="btn full" to={`/apply?course=${encodeURIComponent(clean(c.name))}`} style={{ marginTop: "16px" }}>
              Apply for this program
            </Link>
            <a className="btn ghost full" href={wa(`Hi, please send the brochure for ${clean(c.name)}.`)} target="_blank" rel="noreferrer">
              Get brochure on WhatsApp
            </a>
          </div>
          
          {/* 3. LEAD FORM */}
          <LeadForm course={clean(c.name)} />

          {/* 4. CERTIFICATE SECTION */}
          <div 
            className="box" 
            style={{ marginTop: "24px", marginBottom: "24px", padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ background: "#1e56a0", color: "#fff", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#1a202c" }}>Certificate</h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#718096" }}>On successful completion</p>
              </div>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#4a5568", marginBottom: "16px" }}>
              Receive a verifiable certificate from Medical Global Academy.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <img src="https://medicalglobalacademy.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-22-at-3.51.36-PM.jpeg" alt="Fellowship Certificate Sample" style={{ width: "100%", borderRadius: "6px", border: "1px solid #edf2f7" }} />
              <img src="https://medicalglobalacademy.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-22-at-3.50.35-PM.jpeg" alt="Sample Certificate" style={{ width: "100%", borderRadius: "6px", border: "1px solid #edf2f7" }} />
            </div>
          </div>

          {/* 5. YOUTUBE VIDEO SECTION */}
          <div 
            className="box" 
            style={{ padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#1a202c", marginBottom: "12px" }}>
              How We Work
            </h3>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
              <iframe 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/ONxaJyAtatQ" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </aside>
      </div>

      <IgSlider />
    </>
  );
}

export default Detail;