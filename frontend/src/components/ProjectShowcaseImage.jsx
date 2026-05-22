import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const FALLBACK = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80";

/**
 * Carica la prima foto del primo progetto dal Google Sheet.
 * Se l'API non è disponibile, usa l'immagine di fallback.
 */
const ProjectShowcaseImage = ({ alt = "Installazione fotovoltaica", className = "" }) => {
  const [src, setSrc] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/projects`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json) return;
        const projects = Array.isArray(json?.data) ? json.data : [];
        const firstImage = projects
          .map((p) =>
            Array.isArray(p.images) && p.images.length > 0
              ? p.images[0]
              : p.image
          )
          .find((u) => u && typeof u === "string");
        if (firstImage) setSrc(firstImage);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
      }}
      className={className}
    />
  );
};

export default ProjectShowcaseImage;
