import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
// 👇 Canonical Hook Import 👇
import useCanonical from "../hooks/useCanonical"; 

export function Faculty() {
  const s = useLoad(fetchFaculty); 
  const [d, setD] = useState("All");

  // 👇 Canonical & SEO Tags Add Kiye 👇
  useCanonical({
    title: "Our Faculty | Medical Global Academy",
    description: "Meet our practising clinicians and medical specialists who teach and mentor students at Medical Global Academy.",
  });

  const depts = ["All", ...new Set((s.data || []).map((p) => p.department).filter(Boolean))];
  
  return (
    <>
      <Head t="Our faculty" sub="Practising clinicians and specialists who teach and mentor." />
      <section className="wrap sec">
        <Status s={s}>
          <div className="chips mb">
            {depts.map((x) => <button key={x} className={x === d ? "chip on" : "chip"} onClick={() => setD(x)}>{x}</button>)}
          </div>
          <div className="fg">
            {s.data?.filter((p) => d === "All" || p.department === d).map((p) => <Person key={p.id} p={p} />)}
          </div>
        </Status>
      </section>
    </>
  );
}
export default Faculty;