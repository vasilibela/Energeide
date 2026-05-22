import React from "react";
import { Link } from "react-router-dom";
import { ScrollText, Mail, Phone, FileText, MapPin } from "lucide-react";
import { SITE } from "../data/mock";
import { PageHero } from "./ChiSiamo";
import Seo from "../components/Seo";

const SECTIONS = [
  {
    n: "1",
    title: "Oggetto e Accettazione",
    body: (
      <p>
        I presenti Termini e Condizioni regolano l'utilizzo del sito
        energeide.it e dei servizi forniti da ENERGEIDE S.r.l. (di seguito
        anche "ENERGEIDE" o "noi"). Navigando il sito, richiedendo un
        preventivo o utilizzando i nostri servizi, l'utente dichiara di
        accettare integralmente i presenti Termini.
      </p>
    ),
  },
  {
    n: "2",
    title: "Servizi Offerti",
    body: (
      <p>
        ENERGEIDE progetta, fornisce e installa impianti fotovoltaici, sistemi
        di accumulo, pompe di calore, condizionatori e si occupa delle pratiche
        burocratiche connesse (ENEA, GSE, connessione alla rete, APE). Le
        caratteristiche tecniche, le tempistiche e i costi sono dettagliati nel
        preventivo personalizzato che inviamo dopo il sopralluogo.
      </p>
    ),
  },
  {
    n: "3",
    title: "Preventivi e Contratti",
    body: (
      <p>
        I preventivi rilasciati hanno validità di 30 giorni salvo diversa
        indicazione. Il contratto si perfeziona con la firma del preventivo e
        l'eventuale versamento dell'acconto. Modifiche successive devono essere
        approvate per iscritto da entrambe le parti.
      </p>
    ),
  },
  {
    n: "4",
    title: "Prezzi e Pagamenti",
    body: (
      <p>
        I prezzi indicati sui pacchetti pubblicati sul sito sono indicativi e
        soggetti a personalizzazione in base al sopralluogo. Il pagamento
        avviene secondo le modalità concordate nel contratto (acconto alla
        firma, saldo a fine installazione o tramite finanziamento
        convenzionato). I prezzi si intendono IVA inclusa salvo diversa
        indicazione.
      </p>
    ),
  },
  {
    n: "5",
    title: "Garanzie",
    body: (
      <>
        <p className="mb-3">
          ENERGEIDE garantisce i propri prodotti e servizi secondo i seguenti
          termini:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
          <li>Pannelli fotovoltaici: fino a 25 anni (garanzia produttore)</li>
          <li>Inverter: 10-15 anni</li>
          <li>Batterie di accumulo: fino a 15 anni</li>
          <li>Manodopera e installazione: 10 anni</li>
        </ul>
        <p className="mt-3">
          La garanzia non copre danni derivanti da uso improprio, eventi
          atmosferici eccezionali, manomissioni o interventi non autorizzati.
        </p>
      </>
    ),
  },
  {
    n: "6",
    title: "Diritto di Recesso",
    body: (
      <p>
        Per i contratti conclusi a distanza o fuori dai locali commerciali, il
        consumatore ha diritto di recedere entro 14 giorni dalla stipula, ai
        sensi del D.Lgs. 206/2005 (Codice del Consumo), senza alcuna penalità
        e senza specificarne il motivo, salvo i casi previsti dalla legge
        (servizi già completamente eseguiti con consenso espresso).
      </p>
    ),
  },
  {
    n: "7",
    title: "Limitazioni di Responsabilità",
    body: (
      <p>
        ENERGEIDE risponde per i danni diretti causati da dolo o colpa grave.
        Non è responsabile per danni indiretti o consequenziali, per ritardi
        causati da forza maggiore, da terzi (gestori di rete, enti pubblici) o
        per dati di produzione non corrispondenti alle stime in caso di
        condizioni meteorologiche significativamente diverse dalla media
        storica.
      </p>
    ),
  },
  {
    n: "8",
    title: "Proprietà Intellettuale",
    body: (
      <p>
        Tutti i contenuti del sito (testi, immagini, loghi, grafica) sono di
        proprietà esclusiva di ENERGEIDE S.r.l. o utilizzati su licenza. È
        vietata la riproduzione, distribuzione o modifica senza autorizzazione
        scritta.
      </p>
    ),
  },
  {
    n: "9",
    title: "Modifiche ai Termini",
    body: (
      <p>
        ENERGEIDE si riserva il diritto di modificare in qualsiasi momento i
        presenti Termini. Le modifiche saranno pubblicate sul sito con
        indicazione della data dell'ultimo aggiornamento. L'uso continuato del
        sito dopo le modifiche costituisce accettazione delle stesse.
      </p>
    ),
  },
  {
    n: "10",
    title: "Legge Applicabile e Foro Competente",
    body: (
      <p>
        I presenti Termini sono regolati dalla legge italiana. Per ogni
        controversia relativa all'interpretazione, esecuzione o risoluzione
        del rapporto contrattuale è competente in via esclusiva il Foro di
        Avellino, salvo diversa inderogabile previsione di legge a favore del
        consumatore.
      </p>
    ),
  },
];

const TerminiCondizioni = () => (
  <>
    <Seo
      title="Termini e Condizioni"
      description="Termini e condizioni che regolano l'utilizzo del sito energeide.it e dei servizi forniti da ENERGEIDE S.r.l."
      path="/termini-e-condizioni"
    />
    <PageHero
      eyebrow="CONDIZIONI DI UTILIZZO"
      title="Termini e Condizioni"
      subtitle="Le condizioni generali che regolano l'utilizzo del sito e dei servizi offerti da ENERGEIDE S.r.l."
    />

    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#F4C542]/15 flex items-center justify-center">
            <ScrollText className="w-7 h-7 text-[#F4C542]" />
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
            <strong className="text-white">ENERGEIDE S.r.l.</strong>
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 text-gray-200">
              <MapPin className="w-4 h-4 text-[#0FB36B] shrink-0 mt-0.5" />
              <span>
                {SITE.addressLine1}
                <br />
                {SITE.addressLine2}
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
            to="/privacy-policy"
            className="text-sm font-montserrat font-semibold text-[#0A1F44] hover:text-[#F4C542] transition-colors underline underline-offset-4"
          >
            ← Leggi la Privacy Policy
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default TerminiCondizioni;
