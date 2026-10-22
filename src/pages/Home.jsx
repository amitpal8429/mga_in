import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCourses, fetchFaculty, typeLabel } from "../lib/api";
import { useLoad, Status, Card, Person } from "../components/ui";

const LEVELS = [
  ["Fellowship", "12 months", "Advanced, specialty-level training for experienced clinicians."],
  ["Pg Diploma", "12 months", "Focused clinical depth in a single field of practice."],
  ["Certificate", "6 months", "Short, flexible programs to build a specific skill set."],
];

const WHY = [
  ["Practising faculty", "Learn from clinicians and specialists who treat patients every week."],
  ["Built around your schedule", "Recorded lectures and live sessions that fit around clinic and ward hours."],
  ["Accredited certification", "CPD-aligned and ACTD-aligned certificates you can verify online."],
  ["Clear, upfront fees", "Registration fee and total program cost are shown on every program page."],
];

const STEPS = [
  ["Choose a program", "Browse by level or specialty."],
  ["Apply", "Send your details and we confirm eligibility."],
  ["Learn online", "Lectures, live sessions and case discussions."],
  ["Get certified", "Receive your certificate on completion."],
];

export default function Home() {
  const s = useLoad(fetchCourses), f = useLoad(fetchFaculty);
  const nav = useNavigate();
  const [q, setQ] = useState(""), [t, setT] = useState("");
  
  const count = (x) => s.data?.filter((c) => c.type === x).length ?? "";
  const totalCourses = s.data?.length || "308";
  const fellowshipCount = count("Fellowship") || "203";
  const certificateCount = count("Certificate") || "41";
  const pgDiplomaCount = count("Pg Diploma") || "64";

  const logoLeft = "https://medicalglobalacademy.com/wp-content/uploads/2026/09/Untitled-design-8.png";
  const logoRight = "https://medicalglobalacademy.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-24-at-12.17.06-PM.jpeg";

  return (
    <>
      <section className="hero">
        <div className="wrap hg">
          <div>
            <span className="pill">CPD and ACTD aligned certification</span>
            <h1>Advance your clinical career with programs built for doctors.</h1>
            <p>Fellowships, PG diplomas and certificates delivered online by practising specialists.</p>
            <div className="row">
              <Link className="btn" to="/courses">Explore programs</Link>
            </div>
            
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px 24px",
                marginTop: "40px",
                paddingTop: "30px",
                borderTop: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", 
                fontSize: "1.1rem",
              }}
            >
              <div>
                <strong style={{ fontWeight: "700" }}>{totalCourses}+</strong>{" "}
                <span style={{ color: "#cbd5e0" }}>active programs</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <div>
                <strong style={{ fontWeight: "700" }}>{fellowshipCount}+</strong>{" "}
                <span style={{ color: "#cbd5e0" }}>fellowships</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <div>
                <strong style={{ fontWeight: "700" }}>{certificateCount}+</strong>{" "}
                <span style={{ color: "#cbd5e0" }}>certificates</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <div>
                <strong style={{ fontWeight: "700" }}>{pgDiplomaCount}+</strong>{" "}
                <span style={{ color: "#cbd5e0" }}>PG diplomas</span>
              </div>
            </div>
          </div>
          
          <form
            className="finder"
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/courses?type=${encodeURIComponent(t)}&q=${encodeURIComponent(q)}`);
            }}
          >
            <h2>Find your program</h2>
            <label>
              Level
              <select value={t} onChange={(e) => setT(e.target.value)}>
                <option value="">All levels</option>
                {LEVELS.map(([x]) => <option key={x} value={x}>{typeLabel(x)}</option>)}
              </select>
            </label>
            <label>
              Specialty
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Cardiology, Radiology" />
            </label>
            <button className="btn full">Show programs</button>
          </form>
        </div>
      </section>

      <section className="trust">
        <div className="wrap tg">
          <span>Accredited and verifiable</span>
          <a href="https://directory.cpdstandards.com/providers/medical-global-academy/" target="_blank" rel="noreferrer">CPD (UK)</a>
          <a href="https://www.actd.us/medicalglobalacademy/" target="_blank" rel="noreferrer">ACTD (USA)</a>
          <Link to="/accreditation">View accreditation</Link>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-top">
          <h2 className="h2">Choose your level</h2>
          <p>Three tracks, one standard of teaching.</p>
        </div>
        <div className="tiles">
          {LEVELS.map(([x, d, p]) => (
            <Link 
              key={x} 
              to={`/courses?type=${x}`} 
              className="tile" 
              style={{ 
                position: "relative", 
                overflow: "hidden",
                backgroundColor: "#11223f",
                minHeight: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                zIndex: 0,
              }}>
                <div style={{
                  width: "50%",
                  backgroundImage: `url(${logoLeft})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRight: "2px solid rgba(255,255,255,0.2)"
                }} />
                <div style={{
                  width: "50%",
                  backgroundImage: `url(${logoRight})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }} />
                
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(10, 20, 40, 0.8), rgba(10, 20, 40, 0.5), rgba(10, 20, 40, 0.8))",
                  pointerEvents: "none"
                }} />
              </div>

              <div style={{ position: "relative", zIndex: 1, padding: "10px" }}>
                <em style={{ color: "rgba(255,255,255,0.4)", textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>
                  {count(x)}
                </em>
                <b style={{ display: "block", textShadow: "0px 2px 4px rgba(0,0,0,0.9)" }}>
                  {typeLabel(x)}
                </b>
                <span style={{ display: "block", color: "#fbbf24", textShadow: "0px 2px 4px rgba(0,0,0,0.9)" }}>
                  {d}
                </span>
                <p style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.9)" }}>
                  {p}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap sec">
          <div className="sh">
            <div className="sec-top"><h2 className="h2">Popular programs</h2></div>
            <Link to="/courses">View all programs</Link>
          </div>
          <Status s={s}>
            <div className="grid">
              {s.data?.filter((c) => c.top_courses).slice(0, 6).map((c) => <Card key={c.id} c={c} />)}
            </div>
          </Status>
        </div>
      </section>

      <section className="wrap sec why">
        <div>
          <h2 className="h2">Why doctors choose MGA</h2>
          <p className="lead">Professional skill-development programs, designed to fit around patient care.</p>
          <Link className="btn" to="/about">About the academy</Link>
        </div>
        <div className="wgrid">
          {WHY.map(([a, b]) => <div key={a}><h4>{a}</h4><p>{b}</p></div>)}
        </div>
      </section>

      <section className="navy">
        <div className="wrap sec">
          <h2 className="h2">How it works</h2>
          <ol className="steps">
            {STEPS.map(([a, b]) => <li key={a}><b>{a}</b><p>{b}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="wrap sec">
        <div className="sh">
          <div className="sec-top"><h2 className="h2">Learn from practising faculty</h2></div>
          <Link to="/faculty">Meet all faculty</Link>
        </div>
        <Status s={f}>
          <div className="fg">
            {f.data?.slice(0, 8).map((p) => <Person key={p.id} p={p} />)}
          </div>
        </Status>
      </section>
    </>
  );
}