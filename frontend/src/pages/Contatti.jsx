import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Check,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import { SITE } from "../data/mock";
import { PageHero } from "./ChiSiamo";

const Contatti = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Premium",
    message: "",
    privacy: false,
  });
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.privacy) return;
    // Frontend mock submission - persist to localStorage
    const all = JSON.parse(
      localStorage.getItem("energeide_leads") || "[]"
    );
    all.push({ ...form, ts: new Date().toISOString() });
    localStorage.setItem("energeide_leads", JSON.stringify(all));
    setSent(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      plan: "Premium",
      message: "",
      privacy: false,
    });
    setTimeout(() => setSent(false), 5000);
  };

  const wa = `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(
    SITE.whatsappText
  )}`;

  return (
    <>
      <PageHero
        eyebrow="CONTATTI"
        title="Richiedi un preventivo gratuito"
        subtitle="Compila il form: ti ricontattiamo entro 24 ore con un'analisi personalizzata e un preventivo dettagliato."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0A1F44] text-white rounded-2xl p-7">
              <h3 className="text-xl font-montserrat font-bold mb-5">
                Parla con noi
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F4C542]/15 text-[#F4C542] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Telefono
                    </p>
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="font-montserrat font-semibold hover:text-[#F4C542]"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#0FB36B]/15 text-[#0FB36B] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="font-montserrat font-semibold hover:text-[#F4C542] break-all"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F4C542]/15 text-[#F4C542] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Sede
                    </p>
                    <p className="font-montserrat font-semibold">
                      Provincia di Avellino, Campania
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#0FB36B]/15 text-[#0FB36B] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Orari
                    </p>
                    <p className="font-montserrat font-semibold">
                      Lun – Sab · 09:00 – 19:00
                    </p>
                  </div>
                </li>
              </ul>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-md h-11 font-montserrat font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Scrivici su WhatsApp
              </a>
            </div>
            <div className="rounded-2xl border border-gray-100 p-6 bg-gray-50">
              <ul className="space-y-2.5 text-sm">
                {[
                  "Sopralluogo gratuito senza impegno",
                  "Preventivo personalizzato in 24 ore",
                  "Finanziamento a tasso zero disponibile",
                  "Installazione in 2-3 giorni",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0FB36B] mt-0.5" />
                    <span className="text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-montserrat font-bold text-[#0A1F44] mb-1">
                Compila il form
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tutti i campi con * sono obbligatori
              </p>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5">
                      Nome e Cognome *
                    </label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      type="text"
                      className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/30 outline-none transition"
                      placeholder="Mario Rossi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5">
                      Telefono *
                    </label>
                    <input
                      required
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      type="tel"
                      className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/30 outline-none transition"
                      placeholder="+39 333 1234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5">
                    Email *
                  </label>
                  <input
                    required
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/30 outline-none transition"
                    placeholder="mario.rossi@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5">
                    Soluzione di interesse
                  </label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={onChange}
                    className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/30 outline-none transition bg-white"
                  >
                    <option>Essential 6 kW</option>
                    <option>Premium 7 kW</option>
                    <option>Elite 9 kW</option>
                    <option>Pompa di calore</option>
                    <option>Condizionatori</option>
                    <option>Altro / non sono sicuro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0A1F44] mb-1.5">
                    Messaggio
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/30 outline-none transition resize-none"
                    placeholder="Raccontaci la tua esigenza, l'indirizzo dell'immobile e il consumo annuo se lo conosci..."
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={form.privacy}
                    onChange={onChange}
                    className="mt-1 w-4 h-4 accent-[#F4C542]"
                    required
                  />
                  <span>
                    Acconsento al trattamento dei dati personali secondo la{" "}
                    <a href="#" className="text-[#0FB36B] underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md h-11 px-7 font-montserrat font-bold text-sm shadow-md shadow-[#F4C542]/20 transition-colors"
                >
                  Invia Richiesta
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                {sent && (
                  <p className="text-sm text-[#0FB36B] flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Richiesta inviata! Ti ricontatteremo entro 24 ore.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A1F44] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold mb-4">
            Preferisci una chiamata?
          </h2>
          <p className="text-gray-300 mb-7">
            I nostri consulenti sono a tua disposizione dal lunedì al sabato.
          </p>
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-6 h-11 font-montserrat font-bold text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {SITE.phone}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
};

export default Contatti;
