import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imageCandidates, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";

export const useLoad = (fn, deps = []) => {
  const [s, set] = useState({ data: null, error: null });
  useEffect(() => { let off = false; set({ data: null, error: null });
    fn().then((data) => !off && set({ data, error: null })).catch((error) => !off && set({ data: null, error }));
    return () => { off = true; }; }, deps); // eslint-disable-line
  return s;
};
export const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
export const Head = ({ t, sub }) => <section className="phead"><div className="wrap"><h1>{t}</h1>{sub && <p>{sub}</p>}</div></section>;
export const Status = ({ s, children }) => s.error ? <p className="notice">Couldn't load this. Check your connection and refresh.</p>
  : !s.data ? <div className="grid">{[...Array(6)].map((_, i) => <div key={i} className="card skel" />)}</div> : children;

export const Thumb = ({ c }) => {
  const list = imageCandidates(c.image);
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [c.image]);
  if (!list.length || i >= list.length)
    return <div className="thumb fb">{clean(c.name).replace(/^(Fellowship|Pg Diploma|Certificate) in /i, "").slice(0, 2)}</div>;
  return <img key={list[i]} className="thumb" src={list[i]} alt="" loading="lazy" onError={() => setI((n) => n + 1)} />;
};

export const Card = ({ c }) => (
  <Link to={`/programs/${c.slug}`} className="card"><Thumb c={c} /><div className="cb">
    <div className="tags"><span className="tag">{typeLabel(c.type)}</span><span className="tag soft">{months(c.duration)}</span></div>
    <h3>{clean(c.name)}</h3><p>{clean(c.description).slice(0, 105)}…</p>
    <div className="cf"><b>{inr(c.fee)}</b><span>registration fee</span></div></div></Link>);

export const Person = ({ p }) => (<div className="person"><div className="av">{p.name.replace(/^dr\.?\s*/i, "")[0]?.toUpperCase()}</div>
  <h4>{clean(p.name)}</h4><p>{p.qualification}</p><span className="tag soft">{p.department}</span></div>);

export const FAQS = [
  ["Who can apply?", "Programs are designed for practising doctors and healthcare professionals. Eligibility for each program is listed on its page."],
  ["Is this a government postgraduate degree?", "No. These are professional skill-development programs. They are not a government PG degree, NEET-based residency or a regular medical college seat."],
  ["How are the programs delivered?", "Online through recorded lectures, live sessions, case discussions and assessments. Some programs also offer a hybrid option."],
  ["What does the fee include?", "Each program page shows the registration fee and the total online and hybrid program cost."],
  ["Will I get a certificate?", "Yes. You receive a certificate from Medical Global Academy on successful completion."],
  ["How do I enrol?", "Use the Apply page or message us on WhatsApp. Our team will share batch dates and next steps."]];
export const Faq = ({ items = FAQS }) => { const [o, setO] = useState(0);
  return <div className="faq">{items.map(([q, a], i) => <div key={q} className="fq"><button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}><span>{q}</span><span>{o === i ? "–" : "+"}</span></button>{o === i && <p>{a}</p>}</div>)}</div>; };

export const Field = ({ l, ...p }) => <label>{l}<input {...p} /></label>;