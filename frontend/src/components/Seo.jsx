import React from "react";
import { Helmet } from "react-helmet-async";

const DEFAULTS = {
  siteName: "Energeide",
  baseUrl: "https://energeide.it",
  defaultTitle: "Energeide – Soluzioni Fotovoltaiche Chiavi in Mano",
  defaultDescription:
    "Energeide progetta e installa impianti fotovoltaici per privati e aziende. Soluzioni chiavi in mano, risparmio in bolletta e tecnologia ad alta efficienza.",
  defaultImage: "https://energeide.it/logo512.png",
};

/**
 * Componente SEO da usare in cima ad ogni pagina.
 * Imposta title, meta description, canonical, Open Graph e Twitter Card
 * specifici per la pagina, mantenendo i fallback definiti in index.html.
 */
const Seo = ({ title, description, path = "/", image, noIndex = false }) => {
  const fullTitle = title
    ? `${title} | ${DEFAULTS.siteName}`
    : DEFAULTS.defaultTitle;
  const desc = description || DEFAULTS.defaultDescription;
  const url = `${DEFAULTS.baseUrl}${path}`;
  const ogImage = image || DEFAULTS.defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
