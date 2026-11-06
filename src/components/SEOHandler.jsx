// src/components/SEOHandler.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SEOHandler() {
  const location = useLocation();

  useEffect(() => {
    // 🛑 Agar Course Detail page hai (e.g., /courses/pg-diploma...), toh kuch mat karo. 
    // Uska kaam Detail.jsx khud karega.
    if (location.pathname.startsWith("/courses/")) {
      return; 
    }

    // 1. Canonical URL Setup (Baaki sabhi pages ke liye)
    const baseUrl = "https://medicalglobalacademy.in";
    const currentUrl = baseUrl + location.pathname;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', currentUrl);

    // 2. Baaki pages ke liye ek Default Title/Description (Aap isko change kar sakte hain)
    // Note: Agar aap chahte hain ki har static page ka alag title ho, toh yahan switch-case laga sakte hain.
    if (location.pathname === "/" || location.pathname === "/courses" || location.pathname === "/about" || location.pathname === "/faculty") {
        // Yahan filhal hum sirf canonical set kar rahe hain, title aapke purane component (Head) se aa raha hoga.
    }

    // 3. Robots Meta Tag
    let metaRobots = document.querySelector("meta[name='robots']");
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'index, follow');

  }, [location.pathname]);

  return null;
}