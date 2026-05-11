import React from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  ArrowRight,
  Check,
  Battery,
  Zap,
  Star,
  TrendingUp,
  Shield,
  Users,
  Lightbulb,
  MapPin,
  Facebook,
  ExternalLink,
} from "lucide-react";
import {
  HERO_BADGES,
  STATS,
  PLANS,
  WHY_US,
  TESTIMONIALS,
  SITE,
} from "../data/mock";
import FacebookFeed from "../components/FacebookFeed";

const iconMap = {
  zap: Zap,
  star: Star,
  trending: TrendingUp,
  shield: Shield,
  users: Users,
};

const HeroSection = () => (
  <section className="relative min-h-[88vh] flex items-center bg-[#0A1F44] overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-5 w-72 h-72 bg-[#F4C542] rounded-full blur-[120px] opacity-15" />
      <div className="absolute bottom-10 right-5 w-96 h-96 bg-[#0FB36B] rounded-full blur-[120px] opacity-10" />
    </div>
    <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-6">
            <Sun className="w-4 h-4 text-[#F4C542]" />
            <span className="text-xs sm:text-sm text-[#F4C542] font-montserrat font-semibold">
              {SITE.motto}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-5 leading-[1.08] font-montserrat font-bold tracking-tight">
            Risparmia sull'energia,{" "}
            <span className="text-[#F4C542]">investi nel futuro</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
            Consulenti energetici specializzati in fotovoltaico, pompe di
            calore e soluzioni per eliminare il gas. Impianti fotovoltaici con
            accumulo chiavi in mano da 6 kW a 20 kW
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              to="/contatti"
              className="group inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm shadow-lg shadow-[#F4C542]/20 transition-colors"
            >
              Richiedi Preventivo Gratuito
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/progetti"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#152644] hover:bg-transparent hover:text-[#F4C542] border-2 border-white rounded-md px-6 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              Vedi i Nostri Lavori
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {HERO_BADGES.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0FB36B] flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1771479755134-9c1e3143c110"
              alt="Impianto fotovoltaico residenziale"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/40 to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-5 rounded-xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#F4C542] rounded-xl flex items-center justify-center">
                <Battery className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <div>
                <p className="text-2xl text-[#0A1F44] font-montserrat font-bold leading-none">
                  80%
                </p>
                <p className="text-xs text-gray-500 mt-1">Risparmio in Bolletta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-10 sm:py-12 bg-white border-b border-gray-100">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
        {STATS.map((s) => {
          const Icon = iconMap[s.icon] || Zap;
          return (
            <div key={s.label} className="text-center">
              <Icon className="w-8 h-8 text-[#0FB36B] mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl text-[#0A1F44] mb-1 font-montserrat font-bold">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section className="py-16 sm:py-20 bg-gray-50" id="offerte">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#0FB36B]/10 rounded-full px-4 py-1.5 mb-4">
          <Sun className="w-4 h-4 text-[#0FB36B]" />
          <span className="text-xs text-[#0FB36B] font-montserrat font-semibold tracking-wider">
            OFFERTE FOTOVOLTAICO
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4 text-[#0A1F44] font-montserrat font-bold">
          Scegli la Tua Soluzione
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Soluzioni complete chiavi in mano, IVA inclusa. Ogni piano include
          moduli fotovoltaici e sistema di accumulo dimensionati per le tue
          esigenze.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${
              p.highlight
                ? "border-2 border-[#F4C542] shadow-xl ring-1 ring-[#F4C542]/20"
                : "border border-gray-200 hover:shadow-lg"
            }`}
          >
            {p.badge && (
              <div className="bg-[#F4C542] text-[#0A1F44] py-2 text-center text-xs tracking-[0.2em] font-montserrat font-bold">
                {p.badge}
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xl mb-1 font-montserrat font-semibold text-[#0A1F44]">
                {p.name}
              </h4>
              <p className="text-sm text-gray-500 mb-5">{p.subtitle}</p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2.5 p-2.5 bg-[#F4C542]/10 rounded-lg">
                  <Sun className="w-5 h-5 text-[#F4C542]" />
                  <span className="text-sm text-[#0A1F44] font-semibold">
                    {p.kw} Moduli Fotovoltaici
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 bg-[#0FB36B]/10 rounded-lg">
                  <Battery className="w-5 h-5 text-[#0FB36B]" />
                  <span className="text-sm text-[#0A1F44] font-semibold">
                    {p.battery} Batteria di Accumulo
                  </span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0FB36B] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contatti"
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-md h-10 text-sm font-montserrat font-semibold transition-colors ${
                  p.highlight
                    ? "bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44]"
                    : "bg-[#0A1F44] hover:bg-[#0d2855] text-white"
                }`}
              >
                Richiedi Preventivo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-8">
        Finanziamento a tasso zero disponibile · Installazione in 2-3 giorni ·
        Garanzia fino a 25 anni
      </p>
    </div>
  </section>
);

const SuggestionSection = () => (
  <section className="py-16 sm:py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#0A1F44] to-[#0d2855] rounded-2xl p-6 sm:p-10 lg:p-14 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4C542] rounded-full blur-[100px] opacity-10" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F4C542]/15 rounded-full px-4 py-1.5 mb-4">
              <Lightbulb className="w-4 h-4 text-[#F4C542]" />
              <span className="text-xs text-[#F4C542] font-montserrat font-semibold tracking-wider">
                SUGGERIMENTO PER TE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl mb-4 font-montserrat font-bold">
              Vuoi ancora più autonomia?
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Per chi ha consumi più elevati o vuole eliminare completamente la
              bolletta, offriamo anche soluzioni potenziate con{" "}
              <strong className="text-[#F4C542]">9 kW di pannelli</strong> e{" "}
              <strong className="text-[#F4C542]">15 kWh di accumulo</strong>.
              Ideale per famiglie numerose, chi utilizza pompe di calore o ha
              un'auto elettrica.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Produzione fino a 13.500 kWh/anno",
                "Copertura fino al 95% del fabbisogno",
                "Perfetto per pompe di calore e auto elettrica",
                "Maggiore indipendenza dalla rete",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-[#0FB36B] flex-shrink-0" />
                  <span className="text-gray-300">{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contatti"
              className="group inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
            >
              Richiedi Preventivo 9 kW
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1766507679659-30076abc8c95"
              alt="Ricarica auto elettrica"
              className="w-full rounded-xl shadow-lg object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhySection = () => (
  <section className="py-16 sm:py-20 bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl mb-4 text-[#0A1F44] font-montserrat font-bold">
          Perché Scegliere ENERGEIDE
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Consulenti energetici al tuo fianco per un risparmio reale e duraturo
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {WHY_US.map((w) => {
          const Icon = iconMap[w.icon] || Shield;
          const isYellow = w.color === "yellow";
          return (
            <div
              key={w.title}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: isYellow
                    ? "rgba(244, 197, 66, 0.12)"
                    : "rgba(15, 179, 107, 0.12)",
                }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: isYellow ? "#F4C542" : "#0FB36B" }}
                />
              </div>
              <h3 className="text-lg mb-2 text-[#0A1F44] font-montserrat font-semibold">
                {w.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{w.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-16 sm:py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl mb-4 text-[#0A1F44] font-montserrat font-bold">
          Cosa Dicono i Nostri Clienti
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Oltre 500 famiglie e aziende hanno scelto ENERGEIDE per il loro
          impianto fotovoltaico
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#F4C542] text-[#F4C542]"
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed italic">
              "{t.text}"
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-[#0A1F44] mb-1 font-montserrat font-semibold">
                {t.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{t.location}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.role}</p>
              <p className="text-xs text-[#0FB36B] mt-2">
                Installato: {t.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-sm text-gray-500 mb-5">
          Risparmio medio annuale:{" "}
          <strong className="text-[#0FB36B]">€1.000+</strong> per cliente
        </p>
        <a
          href="https://it.trustpilot.com/review/energeide.it"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 bg-[#00B67A] hover:bg-[#009E69] text-white rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors shadow-md hover:shadow-lg"
        >
          <Star className="w-4 h-4 fill-white" />
          Scrivi una recensione su di noi
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
        <p className="text-xs text-gray-400 mt-2">Su Trustpilot</p>
      </div>
    </div>
  </section>
);

const FacebookSection = () => (
  <section className="py-16 sm:py-20 bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#1877F2]/10 rounded-full px-4 py-1.5 mb-4">
            <Facebook className="w-4 h-4 text-[#1877F2]" />
            <span className="text-xs text-[#1877F2] font-montserrat font-semibold tracking-wider">
              SEGUICI SU FACEBOOK
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl mb-4 text-[#0A1F44] font-montserrat font-bold leading-[1.1]">
            Le ultime novità da ENERGEIDE
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mb-6 max-w-lg">
            Foto dei nostri cantieri, consigli pratici per risparmiare in
            bolletta e aggiornamenti dal mondo del fotovoltaico. Ogni post
            pubblicato sulla nostra Pagina Facebook compare automaticamente qui.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-7">
            {[
              "Aggiornamenti in tempo reale",
              "Foto dei cantieri",
              "Consigli energetici",
              "Promozioni esclusive",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#0FB36B]" />
                <span className="text-sm text-[#0A1F44]">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1466d4] text-white rounded-md px-5 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Visita la Pagina
            </a>
            <Link
              to="/news"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#0A1F44] text-[#0A1F44] rounded-md px-5 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              Vedi tutti i post
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <FacebookFeed height={620} />
        </div>
      </div>
    </div>
  </section>
);


const CTASection = () => (
  <section className="py-16 sm:py-20 bg-[#0A1F44] text-white relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F4C542] rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0FB36B] rounded-full blur-[120px] opacity-10" />
    </div>
    <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-montserrat font-bold">
        Inizia a Risparmiare Oggi
      </h2>
      <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
        Preventivo gratuito e personalizzato in 24 ore. I nostri consulenti ti
        guideranno verso l'indipendenza energetica.
      </p>
      <Link
        to="/contatti"
        className="group inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm shadow-lg shadow-[#F4C542]/20 transition-colors"
      >
        Richiedi Preventivo Gratuito
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
);

const Home = () => (
  <>
    <HeroSection />
    <StatsSection />
    <PricingSection />
    <SuggestionSection />
    <WhySection />
    <TestimonialsSection />
    <FacebookSection />
    <CTASection />
  </>
);

export default Home;
