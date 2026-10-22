const ORIGIN = "https://24x7.medicalglobalacademy.com";
const BASE = `${ORIGIN}/api`;
export const IMG_BASE = `${ORIGIN}/uploads/course/`;
export const WHATSAPP = "919310027474";

const IN_API = "https://medicalglobalacademy.com";
const MGA_API = `${IN_API}/wp-json/drin/v1`;
const WP_BASE = "https://medicalglobalacademy.com/wp-json/wp/v2";

// India Blogs ki ID (3984)
const INDIA_BLOG_CATEGORY_ID = 3984; 

const cache = {};
async function get(path) {
  if (cache[path]) return cache[path];
  const r = await fetch(`${BASE}/${path}`);
  if (!r.ok) { const e = new Error("Request failed"); e.status = r.status; throw e; }
  return (cache[path] = await r.json());
}

export const fetchCourses = () => get("course-list");
export const fetchCourse = (slug) => get(`course-details/${encodeURIComponent(slug)}`);

export const fetchFaculty = async () =>
  (await get("faculty-list")).map(({ id, name, qualification, department }) => ({ id, name, qualification, department }));

export async function submitLead(payload) {
  const r = await fetch(`${MGA_API}/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.message || "Could not send your details.");
  return data;
}

export const imageCandidates = (file) => {
  if (!file) return [];
  if (/^https?:\/\//i.test(file)) return [file];
  const f = encodeURIComponent(file);
  return [
    `${IMG_BASE}${f}`,
    `${ORIGIN}/storage/uploads/course/${f}`,
    `${ORIGIN}/storage/courses/${f}`,
    `${ORIGIN}/storage/${f}`,
    `${ORIGIN}/uploads/${f}`,
    `${ORIGIN}/images/${f}`,
  ];
};

export const inr = (n) => (n ? "₹" + Number(n).toLocaleString("en-IN") : "");
export const months = (n) => (n ? `${n} months` : "");
export const clean = (t = "") => t.replace(/\s+/g, " ").trim();
export const typeLabel = (t = "") => t.replace(/^Pg /i, "PG ");

/* ============================================================
   BLOG API (Filtered by India Blogs ID)
   ============================================================ */

// Blog List Page ke liye
export async function fetchPosts() {
  const res = await fetch(`${WP_BASE}/posts?categories=${INDIA_BLOG_CATEGORY_ID}&_embed`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

// Single Blog Detail Page ke liye
export async function fetchPostBySlug(slug) {
  const res = await fetch(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&categories=${INDIA_BLOG_CATEGORY_ID}&_embed`);
  if (!res.ok) throw new Error("Failed to fetch blog detail");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}