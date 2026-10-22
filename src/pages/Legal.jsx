import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchCourses, fetchCourse, fetchFaculty, WHATSAPP, inr, months, clean, typeLabel } from "../lib/api";
import { useLoad, wa, Head, Status, Card, Person, Faq, FAQS, Field } from "../components/ui";
import LeadForm from "../components/LeadForm";

/* =========================================================
   HELPERS
   ========================================================= */

const EMAIL = "support@medicalglobalacademy.com";
const SITE = "medicalglobalacademy.com";

const LINK_SPLIT = /([\w.+-]+@[\w-]+\.[\w.]+|medicalglobalacademy\.com)/g;
const EMAIL_TEST = /^[\w.+-]+@[\w-]+\.[\w.]+$/;

// emails aur website ko automatically link banata hai
const linkify = (text) =>
  text.split(LINK_SPLIT).map((part, i) => {
    if (i % 2 === 0) return part;
    if (EMAIL_TEST.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    return (
      <a key={i} href={`https://${part}`} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    );
  });

function Block({ b }) {
  if (b.h) return <h3>{b.h}</h3>;

  if (b.p) return <p>{linkify(b.p)}</p>;

  if (b.ul) {
    return (
      <ul>
        {b.ul.map((item, i) => (
          <li key={i}>
            {Array.isArray(item) ? (
              <>
                <strong>{item[0]}</strong> {linkify(item[1])}
              </>
            ) : (
              linkify(item)
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (b.lines) {
    return (
      <p>
        {b.lines.map((l, i) => (
          <span key={i}>
            {linkify(l)}
            <br />
          </span>
        ))}
      </p>
    );
  }

  return null;
}

/* =========================================================
   CONTENT
   ========================================================= */

const LEGAL = {
  /* ---------------- PRIVACY ---------------- */
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: September 25, 2026",
    toc: false,
    intro: [],
    sections: [
      {
        id: "who-we-are",
        title: "Who We Are",
        body: [
          {
            p: `Medical Global Academy ("MGA", "we", "us", "our") operates ${SITE} and associated learning platforms.`,
          },
          {
            p: "This Privacy Policy explains how we collect, use, store and share information when you use our services.",
          },
          { p: `For questions about this policy, contact us at ${EMAIL}.` },
        ],
      },
      {
        id: "information-we-collect",
        title: "Information We Collect",
        body: [
          { h: "Information You Provide" },
          {
            ul: [
              "Name, email address and phone number.",
              "Professional details such as medical registration number, qualification and speciality when required.",
              "Payment information processed securely by our payment partners.",
              "Support messages, feedback and other communications.",
            ],
          },
          { h: "Information Collected Automatically" },
          {
            ul: [
              "IP address, browser and device information.",
              "Pages visited and general website usage.",
              "Cookies and similar technologies.",
            ],
          },
        ],
      },
      {
        id: "how-we-use",
        title: "How We Use Your Information",
        body: [
          {
            ul: [
              "To process enrolments and provide our programmes.",
              "To manage accounts, assessments and certifications.",
              "To send programme updates and relevant educational content.",
              "To improve our website and learning platform.",
              "To meet legal and regulatory requirements.",
            ],
          },
        ],
      },
      {
        id: "sharing",
        title: "Sharing Your Information",
        body: [
          {
            p: "We do not sell your personal data to third parties. Information may be shared when necessary with:",
          },
          {
            ul: [
              ["Service providers:", "Payment processors, email services and hosting providers."],
              ["Faculty or partners:", "Where required for programme coordination."],
              [
                "Legal authorities:",
                "When disclosure is required by law or legal process.",
              ],
            ],
          },
        ],
      },
      {
        id: "retention",
        title: "Data Retention",
        body: [
          {
            p: "We retain personal information for as long as necessary to provide our services and meet legal obligations.",
          },
          {
            p: "Programme records and certifications may be retained for the period required by applicable obligations. You may request deletion of your account data, subject to legal requirements.",
          },
        ],
      },
      {
        id: "cookies",
        title: "Cookies",
        body: [
          {
            p: "We use cookies to maintain sessions, remember preferences and understand how visitors use our website.",
          },
          {
            p: "You can control cookies through your browser settings. Disabling certain cookies may affect website functionality.",
          },
          {
            p: "We may use analytics services such as Google Analytics to understand general website usage.",
          },
        ],
      },
      {
        id: "your-rights",
        title: "Your Rights",
        body: [
          { p: "You may have the right to:" },
          {
            ul: [
              "Access the personal information we hold about you.",
              "Request correction of inaccurate information.",
              "Request deletion of your information, where applicable.",
              "Opt out of marketing communications.",
              "Raise a complaint with the relevant authority.",
            ],
          },
          { p: `To exercise your rights, contact us at ${EMAIL}.` },
        ],
      },
      {
        id: "changes",
        title: "Changes to This Policy",
        body: [
          {
            p: "We may update this Privacy Policy from time to time. Material changes may be communicated through email or a notice on our website.",
          },
          {
            p: "The date shown at the top of this page indicates when the policy was most recently updated.",
          },
        ],
      },
    ],
  },

  /* ---------------- TERMS ---------------- */
  terms: {
    title: "Terms & Conditions",
    updated: "Last updated: September 25, 2026",
    toc: true,
    intro: [
      "Please read these Terms & Conditions carefully before using the Medical Global Academy website or enrolling in any of our courses. By accessing our website, you accept these terms in full.",
    ],
    sections: [
      {
        id: "acceptance",
        title: "Acceptance of Terms",
        body: [
          {
            p: "Welcome to Medical Global Academy. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Medical Global Academy if you do not agree to all the terms and conditions stated on this page.",
          },
        ],
      },
      {
        id: "eligibility",
        title: "Eligibility",
        body: [
          {
            p: "Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.) from a recognized institution.",
          },
        ],
      },
      {
        id: "services",
        title: "Services Offered",
        body: [
          {
            p: "Medical Global Academy offers professional training programs aimed at enhancing the skills and knowledge of medical professionals. Our training programs are developed by experts in the field, but they do not substitute for any medical board certification or licensing requirements.",
          },
        ],
      },
      {
        id: "user-responsibilities",
        title: "User Responsibilities",
        body: [
          { p: "By using our website and enrolling in our courses, you agree to:" },
          {
            ul: [
              "Provide accurate information during registration.",
              "Use the website and training materials solely for your personal, professional development.",
              "Comply with all applicable laws and regulations.",
            ],
          },
        ],
      },
      {
        id: "payment",
        title: "Payment and Fees",
        body: [
          {
            p: "All courses offered by Medical Global Academy are subject to fees, which are listed on the website. Payments must be made in full at the time of registration. No refunds will be issued once access to the course materials has been granted.",
          },
        ],
      },
      {
        id: "ip",
        title: "Intellectual Property",
        body: [
          {
            p: "All content on the Medical Global Academy website, including course materials, videos, and resources, is the property of Medical Global Academy.",
          },
          {
            p: "Users may not reproduce, distribute, or use the content for any purpose other than personal education without prior written consent.",
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy Policy",
        body: [
          {
            p: "Your privacy is important to us. We collect and use personal information according to our Privacy Policy, which is available on our website.",
          },
        ],
      },
      {
        id: "liability",
        title: "Limitation of Liability",
        body: [
          {
            p: "Medical Global Academy is not responsible for any errors or omissions in the content provided or any adverse outcomes that arise from applying the skills learned in our courses. Use of the information provided is at your own risk.",
          },
        ],
      },
      {
        id: "termination",
        title: "Termination of Access",
        body: [
          {
            p: "Medical Global Academy reserves the right to terminate your access to the website and its services if you breach any of these terms.",
          },
        ],
      },
      {
        id: "changes",
        title: "Changes to the Terms",
        body: [
          {
            p: "Medical Global Academy may update these terms and conditions from time to time. Any changes will be posted on this page, and continued use of the website implies acceptance of the updated terms.",
          },
        ],
      },
      {
        id: "governing",
        title: "Governing Law",
        body: [
          {
            p: "These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes related to these terms will be subject to the exclusive jurisdiction of the courts in India.",
          },
        ],
      },
      {
        id: "contact",
        title: "Contact Us",
        body: [
          {
            p: "If you have any questions or need further clarification on these terms, please contact us at:",
          },
          {
            lines: [
              "Medical Global Academy",
              `Email: ${EMAIL}`,
              `Website: ${SITE}`,
            ],
          },
        ],
      },
    ],
  },

  /* ---------------- REFUND ---------------- */
  refund: {
    title: "Refund Policy",
    updated: "Last updated: 2026",
    toc: true,
    intro: [
      "Please read our refund policy carefully before enrolling in any course. By enrolling in any of our courses, you acknowledge that you have read, understood, and agreed to this refund policy.",
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          {
            p: "At Medical Global Academy, we strive to provide high-quality training and educational content for MBBS, MD, and other degree holders in the medical field. However, we understand that there may be circumstances where you may request a refund. Please read our refund policy carefully before enrolling in any course.",
          },
        ],
      },
      {
        id: "no-refunds",
        title: "No Refunds",
        body: [
          {
            p: "Due to the nature of digital educational content, once access to the course materials has been granted, no refunds will be issued. By completing the registration and payment process, you agree that all sales are final.",
          },
        ],
      },
      {
        id: "cancellation",
        title: "Course Cancellation",
        body: [
          {
            p: "In the event that Medical Global Academy cancels a course due to unforeseen circumstances or technical issues, we will provide a full refund to all registered participants. The refund will be processed within 10 business days from the date of cancellation.",
          },
        ],
      },
      {
        id: "duplicate-payment",
        title: "Duplicate Payment",
        body: [
          {
            p: `If you mistakenly make multiple payments for the same course, please notify us immediately at ${EMAIL}. We will process a refund for the duplicate payment after verifying the details, typically within 7 business days.`,
          },
          { lines: [`Email: ${EMAIL}`] },
        ],
      },
      {
        id: "technical-issues",
        title: "Technical Issues",
        body: [
          {
            p: "If you experience any technical issues that prevent you from accessing course content, please contact our support team. While we do not offer refunds for technical problems, we will make every effort to resolve the issue and ensure you have access to the course material.",
          },
        ],
      },
      {
        id: "exceptions",
        title: "Exceptions",
        body: [
          { p: "Refunds will only be considered under exceptional circumstances, such as:" },
          {
            ul: [
              "Incorrect payment made due to system error.",
              "Special cases with documented medical emergencies.",
            ],
          },
          {
            p: "All exceptions will be considered on a case-by-case basis, and the decision of Medical Global Academy will be final.",
          },
        ],
      },
      {
        id: "refund-processing",
        title: "Refund Processing",
        body: [
          {
            p: "Approved refunds will be processed back to the original payment method. Depending on the payment provider, it may take up to 7–10 business days for the refund to reflect in your account.",
          },
        ],
      },
      {
        id: "contact",
        title: "Contact Us",
        body: [
          {
            p: "For any inquiries related to refunds or payments, please contact us at:",
          },
          {
            lines: [
              "Medical Global Academy — Support",
              `Email: ${EMAIL}`,
              "Phone: +91 9289994218",
            ],
          },
        ],
      },
    ],
  },
};

/* =========================================================
   COMPONENT
   ========================================================= */

export function Legal({ k }) {
  const doc = LEGAL[k];
  if (!doc) return null;

  const { title, updated, toc, intro, sections } = doc;

  return (
    <>
      <Head t={title} sub={updated} />

      <section className="wrap sec prose narrow">
        {intro.map((p) => (
          <p key={p}>{p}</p>
        ))}

        {toc && (
          <nav aria-label="On this page">
            <h2 style={{ fontSize: "1.1rem" }}>On this page</h2>
            <ul>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {sections.map((s, i) => (
          <div key={s.id} id={s.id} style={{ scrollMarginTop: 90 }}>
            <h2>
              {i + 1}. {s.title}
            </h2>

            {s.body.map((b, j) => (
              <Block key={j} b={b} />
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

export default Legal;