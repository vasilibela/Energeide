import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Bottone "torna su" che appare dopo aver scrollato 400px.
 * Posizionato in basso a destra, sopra il chat widget se presente.
 */
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      data-testid="scroll-to-top"
      onClick={scrollUp}
      aria-label="Torna in cima"
      title="Torna in cima"
      className={`fixed bottom-6 right-6 z-[1000] w-12 h-12 rounded-full bg-[#0A1F44] hover:bg-[#0d2855] text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTopButton;
