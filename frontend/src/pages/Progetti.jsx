import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sun,
  Battery,
  Calendar,
  MapPin,
  Loader2,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { PageHero } from "./ChiSiamo";
import Seo from "../components/Seo";
import ProjectsMap from "../components/ProjectsMap";

const FILTERS = ["Tutti", "Residenziale", "Commerciale", "Industriale"];

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || import.meta?.env?.REACT_APP_BACKEND_URL;

const Progetti = () => {
  const [active, setActive] = useState("Tutti");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BACKEND_URL}/api/projects${refresh ? "?refresh=1" : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProjects(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      console.error("Errore caricamento progetti", err);
      setError("Impossibile caricare i progetti al momento. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    active === "Tutti"
      ? projects
      : projects.filter((p) => (p.type || "").toLowerCase() === active.toLowerCase());

  return (
    <>
      <Seo
        title="Progetti realizzati"
        description="Scopri gli impianti fotovoltaici realizzati da Energeide per famiglie, attività commerciali e aziende in tutta Italia. Casi reali con dati di potenza e risparmio."
        path="/progetti"
      />
      <PageHero
        eyebrow="PROGETTI"
        title="I nostri lavori, la tua ispirazione"
        subtitle="Scopri alcuni degli impianti che abbiamo realizzato per famiglie, attività commerciali e aziende in tutta Italia."
      />

      <ProjectsMap />

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
            <button
              type="button"
              onClick={() => fetchProjects(true)}
              disabled={loading}
              title="Ricarica i progetti dal Google Sheet"
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#0A1F44] flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <RefreshCcw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {loading && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#F4C542] mb-3" />
              <p>Caricamento progetti in corso...</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((p) => (
                <article
                  key={p.id || p.title}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="eager"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Sun className="w-16 h-16" />
                      </div>
                    )}
                    {p.type && (
                      <div className="absolute top-3 left-3 bg-[#F4C542] text-[#0A1F44] text-xs font-montserrat font-bold px-3 py-1 rounded-full">
                        {p.type}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-montserrat font-semibold text-[#0A1F44] mb-2 leading-snug">
                      {p.title}
                    </h3>
                    {p.location && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{p.location}</span>
                      </p>
                    )}
                    {p.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {p.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs mt-auto pt-2">
                      {p.power && (
                        <span className="inline-flex items-center gap-1.5 text-[#0A1F44] bg-[#F4C542]/15 px-2.5 py-1 rounded-md font-semibold">
                          <Sun className="w-3.5 h-3.5 text-[#F4C542]" />
                          {p.power}
                        </span>
                      )}
                      {p.storage && (
                        <span className="inline-flex items-center gap-1.5 text-[#0A1F44] bg-[#0FB36B]/15 px-2.5 py-1 rounded-md font-semibold">
                          <Battery className="w-3.5 h-3.5 text-[#0FB36B]" />
                          {p.storage}
                        </span>
                      )}
                      {p.year && (
                        <span className="inline-flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {p.year}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              {projects.length === 0
                ? "Nessun progetto disponibile al momento."
                : "Nessun progetto in questa categoria al momento."}
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
