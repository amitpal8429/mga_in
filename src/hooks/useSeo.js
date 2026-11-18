import { useEffect } from "react";

const SITE_URL = "https://medicalglobalacademy.in";

/**
 * Finds a <meta> or <link> tag by its selector, creating it if missing,
 * and sets the given attribute on it.
 * selector example: 'meta[name="description"]' or 'link[rel="canonical"]'
 */
function setTag(selector, attr, value) {
  let el = document.head.querySelector(selector);

  if (!el) {
    const tagName = selector.startsWith("link") ? "link" : "meta";
    el = document.createElement(tagName);
    const match = selector.match(/\[(\w+)="([^"]+)"\]/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }

  el.setAttribute(attr, value);
}

export default function useSeo({ title, description, url, image }) {
  useEffect(() => {
    const previousTitle = document.title;

    if (title) {
      document.title = title;
      setTag('meta[property="og:title"]', "content", title);
      setTag('meta[name="twitter:title"]', "content", title);
    }

    if (description) {
      setTag('meta[name="description"]', "content", description);
      setTag('meta[property="og:description"]', "content", description);
      setTag('meta[name="twitter:description"]', "content", description);
    }

    if (url) {
      const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
      setTag('link[rel="canonical"]', "href", fullUrl);
      setTag('meta[property="og:url"]', "content", fullUrl);
    }

    if (image) {
      setTag('meta[property="og:image"]', "content", image);
      setTag('meta[name="twitter:image"]', "content", image);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, url, image]);
}