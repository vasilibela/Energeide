import React, { useEffect, useState, useMemo } from "react";
import { MapPin as MapPinIcon, Loader2, Sun, Calendar } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Centro Italia (Roma) + zoom che mostra tutta la penisola
const ITALY_CENTER = [42.5, 12.5];
const ITALY_ZOOM = 6;

// Icona pin custom in stile Energeide (giallo + outline scuro)
const energeideIcon = L.divIcon({
  className: "energeide-pin",
  html: `
    <div style="
      position: relative;
      width: 30px;
      height: 40px;
    ">
      <svg viewBox="0 0 30 40" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 0 C6.7 0 0 6.7 0 15 c0 11 15 25 15 25 s15-14 15-25 c0-8.3-6.7-15-15-15z"
          fill="#F4C542"
          stroke="#0A1F44"
          stroke-width="2"
        />
        <circle cx="15" cy="15" r="6" fill="#0A1F44"/>
        <circle cx="15" cy="15" r="2.5" fill="#F4C542"/>
      </svg>
    </div>
  `,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -36],
});

const MapLegend = ({ count }) => (
  <div
    data-testid="map-legend"
    className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 flex items-center gap-2 text-xs font-montserrat"
  >
    <span className="w-2.5 h-2.5 rounded-full bg-[#F4C542] border-2 border-[#0A1F44]" />
    <span className="text-[#0A1F44] font-semibold">
      {count} {count === 1 ? "installazione" : "installazioni"}
    </span>
  </div>
);

const ProjectsMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/projects/locations`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => {
        if (!cancelled) setLocations(json?.data || []);
      })
      .catch(() => {
        if (!cancelled) setLocations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const center = useMemo(() => {
    if (locations.length === 0) return ITALY_CENTER;
    const avgLat =
      locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const avgLng =
      locations.reduce((s, l) => s + l.lng, 0) / locations.length;
    return [avgLat, avgLng];
  }, [locations]);

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F4C542]/15 rounded-full px-4 py-1.5 mb-4">
            <MapPinIcon className="w-4 h-4 text-[#F4C542]" />
            <span className="text-xs text-[#F4C542] font-montserrat font-semibold tracking-wider">
              DOVE LAVORIAMO
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#0A1F44] font-montserrat font-bold mb-3">
            I nostri impianti sulla mappa
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Ogni pin è un'installazione reale. Clicca su un pin per scoprire i
            dettagli del progetto.
          </p>
        </div>

        <div
          data-testid="projects-map-container"
          className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white"
          style={{ height: "520px" }}
        >
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white z-[500]">
              <Loader2 className="w-8 h-8 animate-spin text-[#F4C542] mb-3" />
              <p className="text-sm">Caricamento mappa…</p>
            </div>
          ) : null}

          <MapContainer
            center={center}
            zoom={ITALY_ZOOM}
            minZoom={5}
            maxZoom={16}
            scrollWheelZoom={false}
            zoomControl={false}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            {locations.map((loc) => (
              <Marker
                key={loc.id || `${loc.lat}-${loc.lng}`}
                position={[loc.lat, loc.lng]}
                icon={energeideIcon}
              >
                <Popup>
                  <div className="font-montserrat min-w-[200px]">
                    <p className="text-sm font-bold text-[#0A1F44] leading-snug mb-2">
                      {loc.title}
                    </p>
                    {loc.location && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                        <MapPinIcon className="w-3 h-3 text-[#0FB36B]" />
                        {loc.location}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {loc.power ? (
                        <span className="inline-flex items-center gap-1 bg-[#F4C542]/20 text-[#0A1F44] px-2 py-0.5 rounded font-semibold">
                          <Sun className="w-3 h-3" />
                          {loc.power}
                        </span>
                      ) : null}
                      {loc.year ? (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3" />
                          {loc.year}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {!loading && locations.length > 0 ? (
            <MapLegend count={locations.length} />
          ) : null}

          {!loading && locations.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white/85 z-[500]">
              <MapPinIcon className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm">Nessuna installazione disponibile al momento.</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ProjectsMap;
