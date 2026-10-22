import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LeadForm from "./components/LeadForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import { STATIC_PATHS } from "./config/site";
import { WHATSAPP } from "./lib/api";

// Naye pages (Blog, BlogDetail) yahan add kar diye gaye hain
const L = Object.fromEntries(["Courses","Faculty","About","Accreditation","Contact","Apply","FaqPage","Legal","Detail","Login","Signup","Dashboard","Sitemap","NotFound","Blog","BlogDetail"]
  .map((n) => [n, lazy(() => import(`./pages/${n}.jsx`))]));

// Old URLs (/slug and /programs/slug) move to /courses/slug
const CourseRedirect = () => { const { slug } = useParams(); return <Navigate to={`/courses/${slug}`} replace />; };
const OldCourse = () => { const { slug } = useParams(); return <Navigate to={`/courses/${slug}`} replace />; };

export default function App() {
  const { pathname } = useLocation();
  const showLead = STATIC_PATHS.includes(pathname); // same lead form on every content page; course pages carry it in the sidebar
  
  return (<>
    <ScrollToTop /><Navbar />
    <main><Suspense fallback={<div className="wrap sec"><div className="card skel tall" /></div>}><Routes>
      <Route path="/" element={<Home />} /><Route path="/courses" element={<L.Courses />} />
      <Route path="/courses/:slug" element={<L.Detail />} /><Route path="/programs/:slug" element={<CourseRedirect />} />
      <Route path="/faculty" element={<L.Faculty />} /><Route path="/about" element={<L.About />} />
      <Route path="/accreditation" element={<L.Accreditation />} /><Route path="/contact" element={<L.Contact />} />
      <Route path="/apply" element={<L.Apply />} /><Route path="/faq" element={<L.FaqPage />} />
      <Route path="/privacy" element={<L.Legal k="privacy" />} /><Route path="/terms" element={<L.Legal k="terms" />} />
      <Route path="/refund" element={<L.Legal k="refund" />} />
      <Route path="/sitemap" element={<L.Sitemap />} />
      
      {/* BLOG ROUTES YAHAN ADD KIYE GAYE HAIN */}
      <Route path="/blog" element={<L.Blog />} />
      <Route path="/blog/:slug" element={<L.BlogDetail />} />
      
      <Route path="/login" element={<L.Login />} /><Route path="/signup" element={<L.Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><L.Dashboard /></ProtectedRoute>} />
      <Route path="/:slug" element={<OldCourse />} /><Route path="*" element={<L.NotFound />} />
    </Routes></Suspense></main>
    {showLead && <section className="leadband"><div className="wrap lb">
      <div><h2>Talk to an admissions counsellor</h2><p>Share your details and we'll send the curriculum, fees and next batch dates on WhatsApp.</p></div>
      <LeadForm title="Request a call back" /></div></section>}
    <Footer />
    <a className="wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
  </>);
}