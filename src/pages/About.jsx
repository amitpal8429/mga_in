import { Link } from "react-router-dom";
import { Head } from "../components/ui";

const STATS = [
  ["308+", "Active courses"],
  ["203+", "Fellowships"],
  ["41+", "Certificates"],
  ["64+", "PG diplomas"],
];

const OFFERINGS = [
  [
    "Certificate Courses",
    "Short, focused courses for professional learning and skill development.",
    "41+ courses",
    "Most Popular",
  ],
  [
    "Fellowship Courses",
    "Speciality-focused learning with experienced faculty.",
    "203+ courses",
  ],
  [
    "PG Diploma Courses",
    "In-depth postgraduate-level learning to strengthen your clinical knowledge in your chosen speciality.",
    "64+ courses",
  ],
];

const STEPS = [
  [
    "Choose your course",
    "Browse Certificate, Fellowship and PG Diploma courses by speciality.",
  ],
  [
    "Enrol online",
    "Pick the attending or non-attending format that suits your schedule.",
  ],
  [
    "Learn your way",
    "Online learning, live faculty-led sessions and recorded sessions where available.",
  ],
  ["Get certified", "Complete your course and receive your certification."],
];

const SPECIALITIES = [
  "Cardiology",
  "Medicine",
  "Oncology",
  "Nephrology",
  "Neurology",
  "Orthopedics",
  "Obstetrics & Gynecology",
  "and many more",
];

const WHY_MGA = [
  ["Flexible", "Learn around your professional schedule."],
  ["Accessible", "Access online learning and available recorded sessions."],
  ["Faculty-led", "Learn from experienced medical professionals."],
  ["Anywhere", "Access the online learning component from anywhere."],
];

export function About() {
  return (
    <>
      <Head
        t="Medical Education That Fits Your Career"
        sub="Flexible online medical education for practising doctors from every country, with Certificate, Fellowship and PG Diploma courses in 150+ specialities and sub-specialities."
      />

      <section className="wrap sec prose">
        <p>
          <Link className="btn" to="/courses">
            Explore Courses
          </Link>{" "}
          <a className="btn" href="#our-story">
            Our Story
          </a>
        </p>

        <div className="learn">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <h4>{value}</h4>
              <p>{label}</p>
            </div>
          ))}
        </div>

        <h2 id="our-story">Learn without stepping away from clinical practice</h2>
        <p>
          <strong>Who we are.</strong> Medical Global Academy (MGA) is an online
          medical education platform designed for practising doctors who want to
          continue learning while managing their professional responsibilities.
        </p>
        <p>
          <strong>What we do.</strong> We offer Certificate Courses, Fellowships
          and PG Diploma courses across a wide range of specialities. Our
          courses combine structured online learning, live faculty-led
          sessions and course-specific training where applicable.
        </p>
        <p>
          <strong>Our journey.</strong> Since 2020, MGA has been helping doctors
          from all over the world upgrade their clinical knowledge and grow in
          their careers.
        </p>
        <p>
          <strong>Learning formats.</strong> Choose between attending and
          non-attending options, so you can study at your own convenience
          without compromising on quality.
        </p>

        <h2>Our Mission</h2>
        <p>
          To bridge the gap in healthcare education by providing accessible,
          flexible and high-quality learning opportunities. Through specialised
          courses, we help medical professionals gain new skills, advance
          their careers and improve patient care.
        </p>

        <h2>Our Vision</h2>
        <p>
          To be the most trusted destination for continuing medical education
          worldwide, empowering every healthcare professional to learn, grow and
          lead.
        </p>

        <h2>What We Offer</h2>
        <p>Courses for continuous medical learning.</p>
        <div className="learn">
          {OFFERINGS.map(([title, text, count, badge]) => (
            <div key={title}>
              <h4>
                {title}
                {badge ? ` (${badge})` : ""}
              </h4>
              <p>{text}</p>
              <p>
                <strong>{count}</strong>
              </p>
            </div>
          ))}
        </div>

        <h2>How It Works</h2>
        <p>From enrolment to certification in four simple steps.</p>
        <ol>
          {STEPS.map(([title, text]) => (
            <li key={title}>
              <strong>{title}.</strong> {text}
            </li>
          ))}
        </ol>

        <h2>Courses across every major speciality</h2>
        <p>
          Whether you want to deepen expertise in your own field or broaden your
          medical knowledge, there is a course for your goals.
        </p>
        <ul>
          {SPECIALITIES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2>Accreditation</h2>
        <p>
          Our courses are accredited by CPD and ACTD, supporting the quality
          and credibility of your continuing professional development.
        </p>

        <h2>Our Faculty</h2>
        <p>
          Our courses are delivered with experienced medical professionals and
          specialists who bring practical clinical perspectives into teaching.
        </p>

        <h2>Why MGA</h2>
        <p>Flexible learning for working doctors.</p>
        <div className="learn">
          {WHY_MGA.map(([title, text]) => (
            <div key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <p>
          <Link className="btn" to="/courses">
            Browse courses
          </Link>
        </p>
      </section>
    </>
  );
}

export default About;