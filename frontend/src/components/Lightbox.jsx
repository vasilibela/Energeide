import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Lightbox semplice: overlay full-screen con frecce, ESC, click esterno,
 * navigazione da tastiera, e badge "n/totale".
 *
 * Props:
 *  - images: array di URL stringhe
 *  - index: indice corrente (controllato dal parent)
 *  - onClose: chiude il lightbox
 *  - onPrev / onNext: cambia l'indice
 *  - alt: testo alternativo descrittivo per le immagini
 */
const Lightbox = ({ images, index, onClose, onPrev, onNext, alt = "" }) => {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowLeft") onPrev?.();
      else if (e.key === "ArrowRight") onNext?.();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!images || images.length === 0) return null;
  const total = images.length;
  const current = images[index] || images[0];
  const showNav = total > 1;

  return (
    <div
      data-testid="lightbox"
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galleria immagini"
    >
      <button
        type="button"
        data-testid="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Chiudi"
      >
        <X className="w-5 h-5" />
      </button>

      {showNav ? (
        <button
          type="button"
          data-testid="lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Precedente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : null}

      <img
        src={current}
        alt={alt || `Immagine ${index + 1} di ${total}`}
        className="max-w-full max-h-full object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable="false"
      />

      {showNav ? (
        <button
          type="button"
          data-testid="lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Successiva"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      ) : null}

      {showNav ? (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-montserrat font-semibold">
          {index + 1} / {total}
        </div>
      ) : null}
    </div>
  );
};

export default Lightbox;
