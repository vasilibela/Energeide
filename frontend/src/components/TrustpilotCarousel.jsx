import React, { useEffect, useRef, useState } from "react";
import { Star, ExternalLink } from "lucide-react";

// ID widget Trustpilot ufficiali (pubblici)
const TEMPLATE_IDS = {
  carousel: "53aa8912dec7e10d38f59f36",
  slider: "54ad5defc6454f065c28af8b",
  grid: "539ad0ffdec7e10e686debee",
  mini: "53aa8807dec7e10d38f59f32",
};

const BUSINESS_UNIT_ID = "69ef712198a792b1b0343022";
const TRUSTPILOT_URL = "https://it.trustpilot.com/review/energeide.it";
const SCRIPT_SRC =
  "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

/**
 * Sezione carousel recensioni Trustpilot ufficiali.
 * Usa lo script bootstrap pubblico di Trustpilot.
 */
const TrustpilotCarousel = ({ template = "carousel" }) => {
  const ref = useRef(null);
  const [scriptReady, setScriptReady] = useState(
    typeof window !== "undefined" && Boolean(window.Trustpilot)
  );

  useEffect(() => {
    if (window.Trustpilot) {
      setScriptReady(true);
      return undefined;
    }
    // Evita caricamenti multipli dello stesso script
    let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    const onLoad = () => setScriptReady(true);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", onLoad);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", onLoad);
    }
    return () => {
      script?.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (scriptReady && ref.current && window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, [scriptReady]);

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00B67A]/10 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-4 h-4 text-[#00B67A] fill-[#00B67A]" />
            <span className="text-xs text-[#00B67A] font-montserrat font-semibold tracking-wider">
              RECENSIONI VERIFICATE TRUSTPILOT
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#0A1F44] font-montserrat font-bold mb-3">
            Cosa dicono di noi su Trustpilot
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Recensioni reali e verificate dai nostri clienti. Aggiornate in
            tempo reale direttamente da Trustpilot.
          </p>
        </div>

        {/* TrustBox widget */}
        <div
          ref={ref}
          data-testid="trustpilot-widget"
          className="trustpilot-widget"
          data-locale="it-IT"
          data-template-id={TEMPLATE_IDS[template] || TEMPLATE_IDS.carousel}
          data-businessunit-id={BUSINESS_UNIT_ID}
          data-style-height="240px"
          data-style-width="100%"
          data-theme="light"
        >
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#00B67A] hover:underline font-semibold"
          >
            Trustpilot
          </a>
        </div>

        <div className="text-center mt-8">
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 bg-[#00B67A] hover:bg-[#009E69] text-white rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors shadow-md"
          >
            <Star className="w-4 h-4 fill-white" />
            Vedi tutte le recensioni
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustpilotCarousel;
