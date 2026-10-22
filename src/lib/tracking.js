const KEY = "mga_track";

const platformOf = (src = "", ref = "") => {
  const s = (src || ref).toLowerCase();
  if (!s) return "Direct";
  if (s.includes("google")) return "Google";
  if (s.includes("facebook") || s.includes("fb") || s.includes("instagram") || s.includes("meta")) return "Meta";
  if (s.includes("linkedin")) return "LinkedIn";
  if (s.includes("youtube")) return "YouTube";
  if (s.includes("whatsapp")) return "WhatsApp";
  return "Other";
};

export function captureTracking() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(location.search);
    const g = (k) => q.get(k) || "";
    const utm_source = g("utm_source"), utm_medium = g("utm_medium");
    const ref = document.referrer || "";
    const paid = /cpc|ppc|paid|ads/i.test(utm_medium) || q.has("gclid") || q.has("fbclid");
    sessionStorage.setItem(KEY, JSON.stringify({
      utm_source, utm_medium,
      utm_campaign: g("utm_campaign"), utm_content: g("utm_content"), utm_term: g("utm_term"),
      platform: platformOf(utm_source, ref),
      traffic_type: utm_source || utm_medium ? "Campaign" : ref ? "Referral" : "Direct",
      is_paid: paid ? "Paid" : "Unpaid",
      referrer: ref,
      landing_page: location.href,
    }));
  } catch { /* storage blocked */ }
}

export const getTracking = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || "{}"); } catch { return {}; }
};