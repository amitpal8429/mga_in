import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
export function Courses() {
  const s = useLoad(fetchCourses); const [sp, setSp] = useSearchParams();
  const type = sp.get("type") || "All", q = sp.get("q") || ""; const [sort, setSort] = useState("name");
  const set = (k, v) => { const n = new URLSearchParams(sp); v && v !== "All" ? n.set(k, v) : n.delete(k); setSp(n); };
  const list = useMemo(() => (s.data || []).filter((c) => (type === "All" || c.type === type) && (c.name + clean(c.description)).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === "fee" ? a.fee - b.fee : sort === "new" ? new Date(a.start_date) - new Date(b.start_date) : a.name.localeCompare(b.name)), [s.data, type, q, sort]);
  return (<><Head t="All programs" sub="Fellowships, PG diplomas and certificates for doctors." />
    <section className="wrap sec"><div className="filters">
      <input value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search programs" aria-label="Search" />
      <div className="chips">{["All", "Fellowship", "Pg Diploma", "Certificate"].map((x) => <button key={x} className={x === type ? "chip on" : "chip"} onClick={() => set("type", x)}>{typeLabel(x)}</button>)}</div>
      <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="name">Sort: A to Z</option><option value="fee">Sort: Fee, low to high</option><option value="new">Sort: Starting soonest</option></select></div>
      <p className="muted">{s.data ? `${list.length} programs` : ""}</p>
      <Status s={s}>{list.length ? <div className="grid">{list.map((c) => <Card key={c.id} c={c} />)}</div> : <p className="notice">No programs match. Clear the filters to see everything.</p>}</Status></section></>);
}
export default Courses;
