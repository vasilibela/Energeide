import React from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Battery,
  Thermometer,
  FileCheck,
  Award,
  Wind,
  ArrowRight,
  Check,
} from "lucide-react";
import { SERVICES } from "../data/mock";
import { PageHero } from "./ChiSiamo";
import Seo from "../components/Seo";

const iconMap = {
  sun: Sun,
  battery: Battery,
  thermometer: Thermometer,
  "file-check": FileCheck,
  award: Award,
  wind: Wind,
};

const Servizi = () => (
  <>
    <Seo
      title="Servizi"
      description="Impianti fotovoltaici, sistemi di accumulo, pompe di calore, pratiche ENEA e GSE, condizionatori e APE: tutti i servizi chiavi in mano di Energeide."
      path="/servizi"
    />
    <PageHero
      eyebrow="SERVIZI"
      title="Soluzioni complete per la tua casa"
      subtitle="Dal fotovoltaico alle pompe di calore: ti offriamo un servizio chiavi in mano per eliminare il gas e ridurre i consumi."
    />

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s) => {
            const Icon = iconMap[s.icon] || Sun;
            return (
              <div
                key={s.title}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 w-11 h-11 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0FB36B]" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-montserrat font-semibold text-[#0A1F44] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <Link
                    to="/contatti"
                    className="inline-flex items-center gap-1.5 text-sm font-montserrat font-semibold text-[#0A1F44] hover:text-[#0FB36B] transition-colors"
                  >
                    Maggiori informazioni
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] mb-4">
            Come Lavoriamo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un percorso semplice e trasparente, dal primo contatto alla messa
            in esercizio.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              n: "01",
              t: "Sopralluogo Gratuito",
              d: "Analizziamo i tuoi consumi e valutiamo l'esposizione del tetto.",
            },
            {
              n: "02",
              t: "Progetto Personalizzato",
              d: "Ti proponiamo la soluzione su misura con preventivo dettagliato.",
            },
            {
              n: "03",
              t: "Installazione Rapida",
              d: "Installiamo il tuo impianto in 2-3 giorni lavorativi.",
            },
            {
              n: "04",
              t: "Pratiche & Assistenza",
              d: "Gestiamo ENEA, GSE e ti seguiamo per tutta la vita dell'impianto.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-montserrat font-bold text-[#F4C542] mb-3">
                {s.n}
              </div>
              <h4 className="font-montserrat font-semibold text-[#0A1F44] mb-2">
                {s.t}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-[#0A1F44] text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
          Hai già un'idea? Parliamone.
        </h2>
        <p className="text-gray-300 mb-7">
          Ti rispondiamo entro 24 ore con una proposta personalizzata.
        </p>
        <Link
          to="/contatti"
          className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
        >
          Richiedi Preventivo Gratuito
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-400">
          {["Sopralluogo Gratuito", "Nessun Obbligo", "Risposta in 24h"].map(
            (i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#0FB36B]" />
                <span>{i}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  </>
);

export default Servizi;
