import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
export function Contact() {
  const [f, setF] = useState({ name: "", phone: "", msg: "" }); const u = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (<><Head t="Contact us" sub="Questions about a program? We reply on WhatsApp." />
    <section className="wrap sec cg"><div className="prose"><h2>Reach us</h2><p>WhatsApp and phone: <a href={`tel:+${WHATSAPP}`}>+91 9289994218</a></p><p><a className="btn" href={wa("Hi, I have a question about your programs.")} target="_blank" rel="noreferrer">Message on WhatsApp</a></p></div>
      <form className="box" onSubmit={(e) => { e.preventDefault(); window.open(wa(`Hi, I'm ${f.name} (${f.phone}). ${f.msg}`), "_blank"); }}>
        <Field l="Your name" required value={f.name} onChange={u("name")} /><Field l="Mobile number" required type="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={u("phone")} />
        <label>Message<textarea required rows="4" value={f.msg} onChange={u("msg")} /></label><button className="btn full">Send on WhatsApp</button></form></section></>);
}
export default Contact;
