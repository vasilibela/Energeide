import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Instagram, Linkedin, Clock, Star, MapPin } from "lucide-react";
import { SITE } from "../data/mock";

// TikTok icon (non presente in lucide-react)
const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.72a8.16 8.16 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1.84-.1z" />
  </svg>
);

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
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                data-testid="footer-linkedin-link"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                data-testid="footer-tiktok-link"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#F4C542] hover:text-[#0A1F44] flex items-center justify-center transition-colors"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE.trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Trustpilot"
                title="Recensioni Trustpilot"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#00B67A] hover:text-white flex items-center justify-center transition-colors"
              >
                <Star className="w-4 h-4 fill-current" />
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
                { label: "Blog", to: "/news" },
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
              <li className="flex items-start gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-[#0FB36B] mt-0.5 shrink-0" />
                <span className="leading-snug">
                  {SITE.hoursWeekdays}
                  <br />
                  {SITE.hoursSaturday}
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#F4C542] mt-0.5 shrink-0" />
                <span className="leading-snug">
                  <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">
                    Magazzino
                  </strong>
                  Viale Sabotino 87
                  <br />
                  20832 Desio (MB)
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#0FB36B] mt-0.5 shrink-0" />
                <span className="leading-snug">
                  <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">
                    Sede Legale
                  </strong>
                  Corso Vittorio Emanuele III, 21
                  <br />
                  83020 Quadrelle (AV)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-xs text-gray-400 text-center">
          <p>
            © {new Date().getFullYear()} ENERGEIDE S.r.l. Tutti i diritti
            riservati. {SITE.vat}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/privacy-policy" className="hover:text-[#F4C542]">
              Privacy Policy
            </Link>
            <Link to="/termini-e-condizioni" className="hover:text-[#F4C542]">
              Termini e Condizioni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
