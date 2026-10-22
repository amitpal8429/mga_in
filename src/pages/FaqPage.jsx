import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";
export const FaqPage = () => (<><Head t="Frequently asked questions" /><section className="wrap sec narrow"><Faq /></section></>);
export default FaqPage;
