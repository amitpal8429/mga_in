/**
 * Converts WordPress HTML (tags + entities like &amp; &#8217;) into plain text.
 * Pass max = 0 to skip trimming.
 */
export function cleanText(html = "", max = 160) {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = (doc.body.textContent || "").replace(/\s+/g, " ").trim();

  if (!max) return text;
  if (text.length <= max) return text;

  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}