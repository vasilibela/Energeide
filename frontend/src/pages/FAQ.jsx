import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus, HelpCircle } from "lucide-react";
import { FAQS, FAQ_CATEGORIES } from "../data/mock";
import { PageHero } from "./ChiSiamo";
import Seo from "../components/Seo";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("Tutti");
  const [open, setOpen] = useState(0);

  const filtered = useMemo(() => {
    if (activeCategory === "Tutti") return FAQS;
    return FAQS.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpen(0);
  };

  return (
    <>
      <Seo
        title="FAQ - Domande Frequenti"
        description="Risposte alle domande più comuni su fotovoltaico, pompe di calore, installazione, incentivi fiscali, pratiche ENEA e GSE, garanzie e manutenzione."
        path="/faq"
      />
      <PageHero
        eyebrow="DOMANDE FREQUENTI"
        title="Tutto quello che vuoi sapere"
        subtitle="Trova le risposte alle domande più comuni sul fotovoltaico, pompe di calore e pratiche burocratiche."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#F4C542]/15 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-[#F4C542]" />
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 h-9 rounded-full text-xs sm:text-sm font-montserrat font-semibold transition-colors border ${
                    isActive
                      ? "bg-[#0A1F44] text-white border-[#0A1F44]"
                      : "bg-white text-[#0A1F44] border-gray-200 hover:border-[#0A1F44]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filtered.map((f, idx) => {
              const isOpen = open === idx;
              return (
                <div
                  key={f.q}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    isOpen
                      ? "border-[#F4C542] bg-[#F4C542]/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-[#0FB36B] font-bold">
                        {f.category}
                      </span>
                      <span className="font-montserrat font-semibold text-[#0A1F44] text-base">
                        {f.q}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-[#F4C542] text-[#0A1F44]"
                          : "bg-gray-100 text-[#0A1F44]"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                Nessuna domanda in questa categoria.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-[#0A1F44] mb-3">
            Non hai trovato la tua risposta?
          </h2>
          <p className="text-gray-600 mb-6">
            Il nostro team è a tua disposizione. Scrivici su WhatsApp o
            contattaci direttamente.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
          >
            Contattaci
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default FAQ;
