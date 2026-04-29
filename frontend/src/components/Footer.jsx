import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram } from "lucide-react";
import { SITE } from "../data/mock";

const Footer = () => {
  return (
    <footer className="bg-[#0A1F44] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="font-montserrat font-extrabold text-2xl tracking-tight">
              {SITE.brand}
            </div>
            <div className="text-[11px] tracking-[0.2em] text-[#F4C542] mt-1 mb-5 font-semibold">
              {SITE.tagline}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Consulenti energetici al tuo fianco per eliminare il gas e
              ridurre al massimo i costi del fabbisogno energetico.
            </p>
            <p className="italic text-[#F4C542] text-sm mt-4">
              "{SITE.motto}"
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-montserrat font-bold tracking-[0.2em] text-sm text-white/90 mb-5">
              LINK RAPIDI
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Chi Siamo", to: "/chi-siamo" },
                { label: "Servizi", to: "/servizi" },
                { label: "Progetti", to: "/progetti" },
                { label: "FAQ", to: "/faq" },
                { label: "Contatti", to: "/contatti" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-300 hover:text-[#F4C542] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold tracking-[0.2em] text-sm text-white/90 mb-5">
              SERVIZI
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Impianti Fotovoltaici",
                "Sistemi di Accumulo",
                "Pompe di Calore",
                "Pratiche ENEA & GSE",
                "APE - Attestato Energetico",
                "Condizionatori",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/servizi"
                    className="text-gray-300 hover:text-[#F4C542] transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-bold tracking-[0.2em] text-sm text-white/90 mb-5">
              CONTATTI
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#F4C542] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#0FB36B]" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-[#F4C542] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#0FB36B]" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} ENERGEIDE S.r.l. Tutti i diritti
            riservati. {SITE.vat}
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#F4C542]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#F4C542]">
              Termini e Condizioni
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
