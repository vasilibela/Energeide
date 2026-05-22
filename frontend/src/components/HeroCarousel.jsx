import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Images as ImagesIcon } from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Immagine di fallback se non ci sono progetti caricati
const FALLBACK = [
  "https://images.unsplash.com/photo-1771479755134-9c1e3143c110?w=1600",
];

const HeroCarousel = () => {
  const [images, setImages] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/projects`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => {
        if (cancelled) return;
        const projects = Array.isArray(json?.data) ? json.data : [];
        // Estrae la prima immagine per ogni progetto, scartando quelle senza foto
        const urls = projects
          .map((p) =>
            Array.isArray(p.images) && p.images.length > 0
              ? p.images[0]
              : p.image
          )
          .filter((u) => u && typeof u === "string");
        if (urls.length > 0) {
          setImages(urls);
          setCount(projects.length);
        }
      })
      .catch(() => {
        /* tieni fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (images.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <Link
      to="/progetti"
      data-testid="hero-carousel"
      aria-label="Vedi tutti i progetti realizzati"
      className="relative block rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group bg-[#0A1F44]"
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`Installazione ${i + 1}`}
          referrerPolicy="no-referrer"
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay scuro per leggibilità del CTA */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/55 via-transparent to-transparent pointer-events-none" />

      {/* CTA in basso a destra */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0A1F44] px-3 py-1.5 rounded-full text-xs font-montserrat font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <ImagesIcon className="w-3.5 h-3.5 text-[#F4C542]" />
        Vedi tutti i progetti
      </div>

      {/* Dots indicator */}
      {images.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-[#F4C542]"
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Badge "n progetti" in alto a sinistra */}
      {count > 1 ? (
        <div className="absolute top-3 left-3 bg-[#F4C542] text-[#0A1F44] text-[11px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          {count} installazioni
        </div>
      ) : null}
    </Link>
  );
};

export default HeroCarousel;
