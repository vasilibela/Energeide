import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Award,
  Headphones,
  ArrowRight,
  Check,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { TEAM_VALUES } from "../data/mock";

const iconMap = { eye: Eye, award: Award, headphones: Headphones };

const PageHero = ({ eyebrow, title, subtitle }) => (
  <section className="relative bg-[#0A1F44] text-white overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F4C542] rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#0FB36B] rounded-full blur-[120px] opacity-10" />
    </div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
      <span className="inline-block text-xs tracking-[0.25em] text-[#F4C542] font-montserrat font-semibold mb-4">
        {eyebrow}
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold mb-5 leading-[1.1]">
        {title}
      </h1>
      <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  </section>
);

const ChiSiamo = () => (
  <>
    <PageHero
      eyebrow="CHI SIAMO"
      title="Energia pulita, fatta da persone vere"
      subtitle="Siamo una squadra di consulenti energetici, ingegneri e installatori certificati. Da anni accompagniamo famiglie e aziende verso l'indipendenza dalla bolletta."
    />

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs tracking-[0.25em] text-[#0FB36B] font-montserrat font-semibold">
            LA NOSTRA STORIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] mt-3 mb-5">
            Il sole splende, il pannello rende
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            ENERGEIDE nasce in provincia di Avellino con una missione chiara:
            rendere il fotovoltaico semplice, accessibile e davvero conveniente
            per ogni famiglia italiana.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Scegliamo solo componenti premium, lavoriamo con installatori
            certificati e seguiamo ogni cliente passo dopo passo: dal
            sopralluogo gratuito alla messa in esercizio dell'impianto, fino
            all'assistenza post-vendita.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Il risultato? Oltre 500 impianti installati, il 98% di clienti
            soddisfatti e oltre 2 milioni di euro risparmiati in bolletta dai
            nostri clienti.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contatti"
              className="group inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
            >
              Parla con un Consulente
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/progetti"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#0A1F44] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              Scopri i Nostri Lavori
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1705579603327-a2ac14ec2f3f"
            alt="Installatore fotovoltaico al lavoro"
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

    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] mb-4">
            I Nostri Valori
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tre principi guidano ogni nostro progetto.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TEAM_VALUES.map((v) => {
            const Icon = iconMap[v.icon] || Eye;
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

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "10+", label: "Anni di Esperienza", Icon: Shield },
            { value: "500+", label: "Impianti Installati", Icon: TrendingUp },
            { value: "15", label: "Tecnici Certificati", Icon: Users },
            { value: "€2M", label: "Risparmio Generato", Icon: Award },
          ].map((s) => (
            <div
              key={s.label}
              className="p-6 rounded-xl bg-gray-50 border border-gray-100"
            >
              <s.Icon className="w-7 h-7 text-[#0FB36B] mx-auto mb-3" />
              <p className="text-3xl font-montserrat font-bold text-[#0A1F44]">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-[#0A1F44] text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
          Pronto a iniziare il tuo progetto?
        </h2>
        <p className="text-gray-300 mb-7">
          Sopralluogo gratuito, nessun obbligo, risposta in 24 ore.
        </p>
        <Link
          to="/contatti"
          className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
        >
          Richiedi Preventivo Gratuito
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  </>
);

export { PageHero };
export default ChiSiamo;
