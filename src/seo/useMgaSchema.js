// Place at: src/seo/useMgaSchema.js
import { useEffect } from "react";

/**
 * Course detail page (Detail.jsx).
 * course = loaded course object (null/undefined while loading) -> used as the effect dependency.
 * extra  = { name, description, credential, image } overrides passed to the course schema.
 */
export function useCourseSchema(course, extra = {}) {
  useEffect(() => {
    if (!course) return;

    // delay so canonical / meta description / prices are already in the DOM
    const t = setTimeout(() => {
      const w = window;
      w.mgaSetCourseSchema?.({ name: course.name || course.title, ...extra }); // must be first
      w.mgaSetImageSchema?.();
      w.mgaSetFaqSchema?.();
      w.mgaSetBreadcrumbSchema?.();
    }, 300);

    return () => {
      clearTimeout(t);
      const w = window;
      w.mgaClearCourseSchema?.();
      w.mgaClearImageSchema?.();
      w.mgaClearFaqSchema?.();
      w.mgaClearBreadcrumbSchema?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);
}

/** Homepage (Home.jsx) */
export function useHomeSchema() {
  useEffect(() => {
    const t = setTimeout(() => window.mgaSetWebPageSchema?.(), 100);
    return () => {
      clearTimeout(t);
      window.mgaClearWebPageSchema?.();
    };
  }, []);
}