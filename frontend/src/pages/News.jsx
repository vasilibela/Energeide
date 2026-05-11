import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Sparkles, Users, Calendar } from "lucide-react";
import { SITE } from "../data/mock";
import { PageHero } from "./ChiSiamo";
import FacebookFeed from "../components/FacebookFeed";

const News = () => (
  <>
    <PageHero
      eyebrow="BLOG"
      title="Blog"
      subtitle="Resta aggiornato sulle nostre attività"
    />

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#0FB36B]/10 rounded-full px-4 py-1.5">
            <Sparkles className="w-4 h-4 text-[#0FB36B]" />
            <span className="text-xs text-[#0FB36B] font-montserrat font-semibold tracking-wider">
              IN TEMPO REALE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#0A1F44] leading-[1.1]">
            Seguici su Facebook
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Ogni nuovo post pubblicato sulla nostra Pagina Facebook compare
            automaticamente qui sul sito. Nessuna copia manuale: pubblichi una
            volta, lo vedi ovunque.
          </p>
          <ul className="space-y-3">
            {[
              {
                Icon: Calendar,
                t: "Aggiornamenti quotidiani",
                d: "Foto cantieri, novit\u00E0 normative, consigli energetici.",
              },
              {
                Icon: Users,
                t: "Una community attiva",
                d: "Lascia un like, commenta o condividi i nostri post.",
              },
              {
                Icon: Facebook,
                t: "Direttamente da Facebook",
                d: "Feed ufficiale, sicuro e gestito da Meta.",
              },
            ].map(({ Icon, t, d }) => (
              <li
                key={t}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50"
              >
                <span className="w-9 h-9 rounded-lg bg-[#F4C542]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#F4C542]" />
                </span>
                <div>
                  <p className="font-montserrat font-semibold text-[#0A1F44] text-sm">
                    {t}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1466d4] text-white rounded-md px-5 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Apri la nostra Pagina
            </a>
            <Link
              to="/contatti"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-[#0A1F44] text-[#0A1F44] rounded-md px-5 h-11 font-montserrat font-semibold text-sm transition-colors"
            >
              Richiedi Preventivo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 flex justify-center lg:justify-end">
          <FacebookFeed height={820} />
        </div>
      </div>
    </section>

    <section className="py-16 bg-[#0A1F44] text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
          Hai una domanda dopo aver letto un post?
        </h2>
        <p className="text-gray-300 mb-7">
          Scrivici, ti rispondiamo entro 24 ore con un preventivo personalizzato.
        </p>
        <Link
          to="/contatti"
          className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
        >
          Contattaci Ora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  </>
);

export default News;
