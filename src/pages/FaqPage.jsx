import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";

// SCHEMA: FAQS ko {q, a} format mein badalta hai (array ya object, dono chalenge)
const toFaqItems = (list) =>
  (Array.isArray(list) ? list : [])
    .map((x) =>
      Array.isArray(x)
        ? { q: x[0], a: x[1] }
        : { q: x?.q || x?.question || x?.title, a: x?.a || x?.answer || x?.text || x?.description }
    )
    .filter((x) => typeof x.q === "string" && typeof x.a === "string");

export const FaqPage = () => {
  // SCHEMA: FAQPage JSON-LD (sirf wahi questions jo page par dikh rahe hain)
  useEffect(() => {
    const t = setTimeout(() => window.mgaSetFaqSchema?.(toFaqItems(FAQS)), 300);
    return () => {
      clearTimeout(t);
      window.mgaClearFaqSchema?.();
    };
  }, []);

  return (
    <>
      <Head t="Frequently asked questions" />
      <section className="wrap sec narrow"><Faq /></section>
    </>
  );
};
export default FaqPage;