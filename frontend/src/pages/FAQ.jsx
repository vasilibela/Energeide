import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus, HelpCircle } from "lucide-react";
import { FAQS } from "../data/mock";
import { PageHero } from "./ChiSiamo";

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="DOMANDE FREQUENTI"
        title="Tutto quello che vuoi sapere"
        subtitle="Le risposte alle domande più comuni su fotovoltaico, sistemi di accumulo, pompe di calore e finanziamenti."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#F4C542]/15 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-[#F4C542]" />
            </div>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, idx) => {
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
                    <span className="font-montserrat font-semibold text-[#0A1F44] text-base">
                      {f.q}
                    </span>
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
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-[#0A1F44] mb-3">
            Non hai trovato la tua risposta?
          </h2>
          <p className="text-gray-600 mb-6">
            Scrivici o chiama un nostro consulente: rispondiamo a ogni domanda
            in modo chiaro e senza impegno.
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
