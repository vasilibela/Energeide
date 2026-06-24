import React from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, FileText, MapPin } from "lucide-react";
import { SITE } from "../data/mock";
import { PageHero } from "./ChiSiamo";
import Seo from "../components/Seo";

const SECTIONS = [
  {
    n: "1",
    title: "Raccolta dei Dati",
    body: (
      <p>
        ENERGEIDE S.r.l. raccoglie dati personali forniti volontariamente dagli
        utenti attraverso i form di contatto presenti sul sito. I dati raccolti
        includono: nome, cognome, email, numero di telefono, città di residenza
        e eventuali messaggi.
      </p>
    ),
  },
  {
    n: "2",
    title: "Utilizzo dei Dati",
    body: (
      <p>
        I dati personali vengono utilizzati esclusivamente per rispondere alle
        richieste di preventivo e informazioni, fornire assistenza clienti,
        inviare comunicazioni relative ai servizi richiesti e adempiere agli
        obblighi contrattuali e di legge.
      </p>
    ),
  },
  {
    n: "3",
    title: "Protezione dei Dati",
    body: (
      <p>
        ENERGEIDE adotta misure di sicurezza tecniche e organizzative
        appropriate per proteggere i dati personali da accessi non autorizzati,
        perdita, distruzione o alterazione.
      </p>
    ),
  },
  {
    n: "4",
    title: "Condivisione dei Dati",
    body: (
      <p>
        I dati personali non vengono venduti, affittati o condivisi con terze
        parti per scopi di marketing. Possono essere condivisi solo con partner
        tecnici necessari per l'erogazione del servizio o autorità competenti
        se richiesto dalla legge.
      </p>
    ),
  },
  {
    n: "5",
    title: "Cookie",
    body: (
      <p>
        Il sito utilizza cookie tecnici necessari per il funzionamento e cookie
        analitici per migliorare l'esperienza utente. È possibile gestire le
        preferenze sui cookie attraverso le impostazioni del browser.
      </p>
    ),
  },
  {
    n: "6",
    title: "Diritti dell'Utente",
    body: (
      <p>
        In conformità con il GDPR, gli utenti hanno diritto ad accedere ai
        propri dati personali, richiedere la rettifica o cancellazione dei
        dati, opporsi al trattamento, richiedere la limitazione e la
        portabilità dei dati. Per esercitare questi diritti:{" "}
        <a
          href="mailto:info@energeide.it"
          className="text-[#0FB36B] font-semibold hover:underline"
        >
          info@energeide.it
        </a>
      </p>
    ),
  },
];

const PrivacyPolicy = () => (
  <>
    <Seo
      title="Privacy Policy"
      description="Informativa sul trattamento dei dati personali da parte di ENERGEIDE S.r.l. in conformità con il GDPR."
      path="/privacy-policy"
    />
    <PageHero
      eyebrow="INFORMATIVA SULLA PRIVACY"
      title="Privacy Policy"
      subtitle="La tua privacy è importante per noi. Di seguito le informazioni sul trattamento dei dati personali da parte di ENERGEIDE S.r.l."
    />

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#0FB36B]/15 flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#0FB36B]" />
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <article
              key={s.n}
              className="border border-gray-100 bg-gray-50/60 rounded-xl p-6 sm:p-7"
            >
              <h2 className="flex items-baseline gap-3 text-xl sm:text-2xl font-montserrat font-bold text-[#0A1F44] mb-3">
                <span className="text-[#F4C542]">{s.n}.</span>
                {s.title}
              </h2>
              <div className="text-gray-600 leading-relaxed text-base">
                {s.body}
              </div>
            </article>
          ))}
        </div>

        {/* Contatti del titolare */}
        <article className="mt-10 border border-[#0A1F44]/10 bg-[#0A1F44] text-white rounded-2xl p-7 sm:p-9">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-[#F4C542]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#F4C542]" />
            </span>
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold">
              Contatti
            </h2>
          </div>
          <p className="text-gray-300 mb-5 text-sm">
            Titolare del Trattamento:{" "}
            <strong className="text-white">ENERGEIDE S.r.l.</strong>
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-gray-200">
              <MapPin className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
              <span>
                <strong className="block text-white text-[11px] uppercase tracking-wider mb-0.5">
                  Magazzino
                </strong>
                Viale Sabotino 32
                <br />
                20832 Desio (MB)
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-200">
              <MapPin className="w-4 h-4 text-[#0FB36B] shrink-0 mt-0.5" />
              <span>
                <strong className="block text-white text-[11px] uppercase tracking-wider mb-0.5">
                  Sede Legale
                </strong>
                Corso Vittorio Emanuele III, 21
                <br />
                83020 Quadrelle (AV)
              </span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <FileText className="w-4 h-4 text-[#0FB36B] shrink-0" />
              <span>{SITE.vat}</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Phone className="w-4 h-4 text-[#0FB36B] shrink-0" />
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="hover:text-[#F4C542] transition-colors"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 text-gray-200">
              <Mail className="w-4 h-4 text-[#0FB36B] shrink-0" />
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-[#F4C542] transition-colors"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-gray-400 border-t border-white/10 pt-4">
            Ultimo aggiornamento: 18 Febbraio 2026
          </p>
        </article>

        <div className="mt-10 text-center">
          <Link
            to="/termini-e-condizioni"
            className="text-sm font-montserrat font-semibold text-[#0A1F44] hover:text-[#F4C542] transition-colors underline underline-offset-4"
          >
            Leggi i Termini e Condizioni →
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default PrivacyPolicy;
