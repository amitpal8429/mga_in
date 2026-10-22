// node scripts/generate-sitemap.js  -> writes public/sitemap.xml from the live course list
import fs from "fs";
const SITE = "https://medicalglobalacademy.in"; // set your real .in domain
const list = await (await fetch("https://24x7.medicalglobalacademy.com/api/course-list")).json();
const paths = ["", "courses", "faculty", "about", "accreditation", "contact", "faq", "apply", ...list.map((c) => c.slug)];
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `<url><loc>${SITE}/${p}</loc></url>`).join("\n")}\n</urlset>\n`);
