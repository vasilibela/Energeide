import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Users,
  Flame,
  Leaf,
  PiggyBank,
} from "lucide-react";
import { TEAM_VALUES } from "../data/mock";
import Seo from "../components/Seo";

const iconMap = {
  flame: Flame,
  piggy: PiggyBank,
  leaf: Leaf,
  users: Users,
};

// Larger hero variant for the Chi Siamo page
const PageHero = ({ eyebrow, title, subtitle, large = false }) => (
  <section className="relative bg-[#0A1F44] text-white overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F4C542] rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#0FB36B] rounded-full blur-[120px] opacity-10" />
    </div>
    <div
      className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center ${
        large ? "py-24 sm:py-32 lg:py-40" : "py-20 sm:py-24"
      }`}
    >
      {eyebrow && (
        <span className="inline-block text-xs tracking-[0.25em] text-[#F4C542] font-montserrat font-semibold mb-4">
          {eyebrow}
        </span>
      )}
      <h1
        className={`font-montserrat font-bold mb-5 leading-[1.05] ${
          large
            ? "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
            : "text-4xl sm:text-5xl lg:text-6xl"
        }`}
      >
        {title}
      </h1>
      <p
        className={`text-gray-300 max-w-3xl mx-auto leading-relaxed ${
          large ? "text-lg sm:text-xl" : "text-base sm:text-lg"
        }`}
      >
        {subtitle}
      </p>
    </div>
  </section>
);

const MISSION_POINTS = [
  "Analisi gratuita dei tuoi consumi",
  "Progetto su misura per le tue esigenze",
  "Pratiche burocratiche incluse",
  "Assistenza post-vendita continua",
];

const ChiSiamo = () => (
  <>
    <Seo
      title="Chi Siamo"
      description="Energeide: consulenti energetici con una missione chiara - aiutare le famiglie italiane ad eliminare il gas e risparmiare il più possibile sull'energia."
      path="/chi-siamo"
    />
    <PageHero
      large
      title="Chi Siamo"
      subtitle="Consulenti energetici con una missione chiara: aiutare le famiglie italiane ad eliminare il gas e risparmiare il più possibile sull'energia."
    />

    {/* La Nostra Missione */}
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs tracking-[0.25em] text-[#0FB36B] font-montserrat font-semibold">
            LA NOSTRA MISSIONE
          </span>
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] mt-3 mb-5">
            La Nostra Missione
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            ENERGEIDE nasce dalla passione per l'energia pulita e dal desiderio
            di aiutare concretamente le persone a{" "}
            <strong className="text-[#0A1F44]">eliminare il gas</strong> e a{" "}
            <strong className="text-[#0A1F44]">
              ridurre al massimo il fabbisogno energetico
            </strong>
            .
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Non siamo semplici venditori di pannelli: siamo{" "}
            <strong className="text-[#0A1F44]">consulenti energetici</strong>{" "}
            che analizzano le tue esigenze, studiano la soluzione migliore e ti
            accompagnano in ogni fase, dalla progettazione all'installazione,
            fino alle pratiche burocratiche con ENEA, GSE e comune.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Il nostro obiettivo è semplice: farti risparmiare il più possibile,
            con impianti fotovoltaici, pompe di calore e sistemi di accumulo
            che ti rendono davvero indipendente.
          </p>
          <ul className="space-y-3">
            {MISSION_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#0FB36B]/15 text-[#0FB36B] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </span>
                <span className="text-[#0A1F44] font-montserrat font-medium">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80"
            alt="Pannelli fotovoltaici installati su tetto residenziale"
            referrerPolicy="no-referrer"
            className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]"
          />
          <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white p-5 rounded-xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0FB36B]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0FB36B]" />
              </div>
              <div>
                <p className="text-2xl font-montserrat font-bold text-[#0A1F44] leading-none">
                  500+
                </p>
                <p className="text-xs text-gray-500 mt-1">Famiglie servite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* I Nostri Valori */}
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] mb-4">
            I Nostri Valori
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Principi che guidano ogni nostro progetto e consulenza
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_VALUES.map((v) => {
            const Icon = iconMap[v.icon] || Users;
            return (
              <div
                key={v.title}
                className="bg-white p-7 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4C542]/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#F4C542]" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-[#0A1F44] mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Parla con un Nostro Consulente */}
    <section className="py-16 sm:py-20 bg-[#0A1F44] text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
          Parla con un Nostro Consulente
        </h2>
        <p className="text-gray-300 mb-8 text-base sm:text-lg">
          Scopri quanto puoi risparmiare. Analisi gratuita e senza impegno.
        </p>
        <Link
          to="/contatti"
          className="group inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-7 h-12 font-montserrat font-bold text-sm transition-colors"
        >
          Richiedi Consulenza Gratuita
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  </>
);

export { PageHero };
export default ChiSiamo;
