import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sun, Battery, Calendar, MapPin } from "lucide-react";
import { PROJECTS } from "../data/mock";
import { PageHero } from "./ChiSiamo";

const FILTERS = ["Tutti", "Residenziale", "Commerciale", "Industriale"];

const Progetti = () => {
  const [active, setActive] = useState("Tutti");
  const filtered =
    active === "Tutti" ? PROJECTS : PROJECTS.filter((p) => p.type === active);

  return (
    <>
      <PageHero
        eyebrow="PROGETTI"
        title="I nostri lavori, la tua ispirazione"
        subtitle="Scopri alcuni degli impianti che abbiamo realizzato per famiglie, attività commerciali e aziende in tutta la Campania."
      />

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                className={`h-10 px-5 rounded-full text-sm font-montserrat font-semibold transition-colors ${
                  active === f
                    ? "bg-[#0A1F44] text-white"
                    : "bg-gray-100 text-[#0A1F44] hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((p) => (
              <article
                key={p.title}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#F4C542] text-[#0A1F44] text-xs font-montserrat font-bold px-3 py-1 rounded-full">
                    {p.type}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-montserrat font-semibold text-[#0A1F44] mb-3">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[#0A1F44] bg-[#F4C542]/15 px-2.5 py-1 rounded-md font-semibold">
                      <Sun className="w-3.5 h-3.5 text-[#F4C542]" />
                      {p.power}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#0A1F44] bg-[#0FB36B]/15 px-2.5 py-1 rounded-md font-semibold">
                      <Battery className="w-3.5 h-3.5 text-[#0FB36B]" />
                      {p.storage}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.year}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              Nessun progetto in questa categoria al momento.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0A1F44] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
            Il prossimo progetto potrebbe essere il tuo
          </h2>
          <p className="text-gray-300 mb-7">
            Raccontaci la tua casa o la tua attività: ti proponiamo la
            soluzione perfetta.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
          >
            Richiedi Preventivo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Progetti;
