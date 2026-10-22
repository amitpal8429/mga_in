import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
export function Apply() {
  const [sp] = useSearchParams();
  return (<><Head t="Apply now" sub="Share your details and our team will confirm eligibility and batch dates." />
    <section className="wrap sec"><LeadForm course={sp.get("course") || ""} title="Start your application" /></section></>);
}
export default Apply;
