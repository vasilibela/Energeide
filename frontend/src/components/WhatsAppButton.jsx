import React from "react";
import { MessageCircle } from "lucide-react";
import { SITE } from "../data/mock";

const WhatsAppButton = () => {
  const url = `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(SITE.whatsappText)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contattaci su WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-2xl shadow-[#25D366]/40 transition-transform hover:scale-105 active:scale-95 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      <span className="relative flex items-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline text-sm font-montserrat font-semibold">
          Parla con un Consulente
        </span>
      </span>
    </a>
  );
};

export default WhatsAppButton;
