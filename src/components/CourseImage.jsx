import { useState } from "react";
import { imageCandidates } from "../lib/api";

export default function CourseImage({ file, alt = "", title = "", className = "thumb" }) {
  const list = imageCandidates(file);
  const [i, setI] = useState(0);

  if (!list.length || i >= list.length) {
    const letter = (title || alt || "M").trim().charAt(0).toUpperCase();
    return <div className="thumb fb" aria-hidden="true">{letter}</div>;
  }

  return (
    <img
      key={list[i]}
      className={className}
      src={list[i]}
      alt={alt}
      loading="lazy"
      onError={() => setI((n) => n + 1)}
    />
  );
}