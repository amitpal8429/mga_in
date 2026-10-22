import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
export function Accreditation() {
  const L = [["CPD (UK)", "https://medicalglobalacademy.com/wp-content/uploads/2026/09/Untitled-design-8.png", "https://directory.cpdstandards.com/providers/medical-global-academy/"],
    ["ACTD (American Council of Training and Development)", "https://medicalglobalacademy.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-24-at-12-17-06-PM.jpeg".replace("12-17-06", "12.17.06"), "https://www.actd.us/medicalglobalacademy/"]];
  return (<><Head t="Accreditation" sub="Verify our certification directly with the accrediting bodies." />
    <section className="wrap sec"><div className="acc">{L.map(([n, img, h]) => <a key={n} href={h} target="_blank" rel="noreferrer" className="accc"><img src={img} alt={n} loading="lazy" /><b>{n}</b><span>Verify listing</span></a>)}</div></section></>);
}
export default Accreditation;
