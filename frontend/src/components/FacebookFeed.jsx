import React, { useEffect, useRef, useState } from "react";
import { Facebook, ExternalLink } from "lucide-react";
import { SITE } from "../data/mock";

/**
 * Facebook Page Plugin embed.
 * Mostra il feed (timeline) della Pagina Facebook configurata in mock.SITE.facebookUrl.
 * Nota: il Page Plugin di Meta funziona SOLO con Facebook Pages pubbliche
 * (non con profili personali). Se la URL è di tipo profile.php?id=...
 * deve trattarsi di una Pagina aziendale con quel formato URL.
 */
const FacebookFeed = ({ height = 720, width = 500, showHeader = true }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(width);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setContainerWidth(Math.max(280, Math.min(500, w)));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const params = new URLSearchParams({
    href: SITE.facebookUrl,
    tabs: "timeline",
    width: String(containerWidth),
    height: String(height),
    small_header: "false",
    adapt_container_width: "true",
    hide_cover: "false",
    show_facepile: "true",
    locale: "it_IT",
  });
  const src = `https://www.facebook.com/plugins/page.php?${params.toString()}`;

  return (
    <div ref={containerRef} className="w-full max-w-[500px] mx-auto">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
            </span>
            <span className="font-montserrat font-semibold text-[#0A1F44] text-sm">
              Ultimi post
            </span>
          </div>
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#1877F2] hover:underline font-semibold"
          >
            Apri su Facebook
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white">
        {!loaded && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-sm gap-2"
            style={{ height }}
          >
            <Facebook className="w-7 h-7 text-[#1877F2] animate-pulse" />
            Caricamento feed Facebook...
          </div>
        )}
        <iframe
          title="Feed Facebook Energeide"
          src={src}
          width={containerWidth}
          height={height}
          style={{ border: "none", overflow: "hidden", display: "block" }}
          scrolling="no"
          frameBorder="0"
          allow="encrypted-media"
          allowFullScreen
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
};

export default FacebookFeed;
