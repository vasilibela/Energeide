// Mock data for Energeide clone - replace with API calls when backend is integrated

export const SITE = {
  brand: "ENERGEIDE",
  tagline: "RISPARMIO ENERGETICO",
  motto: "Il sole splende, il pannello rende",
  phone: "+39 350 931 2938",
  phoneRaw: "393509312938",
  email: "info@energeide.it",
  vat: "P.IVA: 02987000649",
  whatsappText: "Ciao! Vorrei ricevere informazioni sulle vostre soluzioni fotovoltaiche.",
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Chi Siamo", to: "/chi-siamo" },
  { label: "Servizi", to: "/servizi" },
  { label: "Progetti", to: "/progetti" },
  { label: "FAQ", to: "/faq" },
  { label: "Contatti", to: "/contatti" },
];

export const HERO_BADGES = [
  "Sopralluogo Gratuito",
  "Finanziamenti a Tasso Zero",
  "Installazione in 2 Giorni",
  "Garanzia 25 Anni",
];

export const STATS = [
  { value: "500+", label: "Impianti Installati", icon: "zap" },
  { value: "98%", label: "Clienti Soddisfatti", icon: "star" },
  { value: "\u20AC 2M", label: "Risparmiati dai Clienti", icon: "trending" },
  { value: "25 Anni", label: "Garanzia Premium", icon: "shield" },
];

export const PLANS = [
  {
    name: "Essential",
    subtitle: "Ideale per piccole abitazioni",
    kw: "6 kW",
    battery: "5 kWh",
    features: [
      "Inverter Ibrido",
      "Installazione Certificata",
      "Monitoraggio App",
      "Garanzia 15 Anni Prodotto",
      "Assistenza Tecnica",
    ],
    highlight: false,
    badge: null,
  },
  {
    name: "Premium",
    subtitle: "La scelta consigliata",
    kw: "7 kW",
    battery: "10 kWh",
    features: [
      "Moduli Top Tier",
      "Batteria Premium",
      "Inverter Ibrido Premium",
      "Installazione Premium",
      "Monitoraggio Real-Time",
      "Garanzia 20 Anni Prodotto",
      "Assistenza Prioritaria",
    ],
    highlight: true,
    badge: "CONSIGLIATO",
  },
  {
    name: "Elite",
    subtitle: "Massima autonomia energetica",
    kw: "9 kW",
    battery: "20 kWh",
    features: [
      "Moduli Elite Bifacciali",
      "Batteria Top Gamma",
      "Installazione VIP",
      "Garanzia 25 Anni Prodotto",
      "APE",
      "Anti Black-out",
      "Monitoraggio in Real-Time",
      "Assistenza Prioritaria",
    ],
    highlight: false,
    badge: "TOP PERFORMANCE",
  },
];

export const WHY_US = [
  {
    title: "Qualit\u00E0 Certificata",
    desc: "Componenti premium dai migliori produttori. Certificazioni e garanzie a lungo termine.",
    icon: "shield",
    color: "green",
  },
  {
    title: "Consulenza Dedicata",
    desc: "Ti seguiamo dall'analisi dei consumi alla realizzazione. Ogni progetto \u00E8 su misura.",
    icon: "users",
    color: "yellow",
  },
  {
    title: "ROI Garantito",
    desc: "Risparmio fino all'80% sulla bolletta. Investimento che si ripaga in 5-7 anni.",
    icon: "trending",
    color: "green",
  },
  {
    title: "Tutto Incluso",
    desc: "Pratiche ENEA, GSE, connessione alla rete, APE. Pensiamo a tutto noi.",
    icon: "zap",
    color: "yellow",
  },
];

export const TESTIMONIALS = [
  {
    name: "Marco Esposito",
    location: "Napoli, Campania",
    role: "Proprietario Casa",
    date: "Gennaio 2026",
    text: "Ho installato 6 kW con accumulo da 10 kWh a settembre 2025. In 4 mesi ho gi\u00E0 risparmiato \u20AC520 sulla bolletta. L'installazione \u00E8 stata rapidissima, solo 2 giorni, e il team ha gestito tutte le pratiche ENEA senza che io muovessi un dito.",
  },
  {
    name: "Giulia Bianchi",
    location: "Milano, Lombardia",
    role: "Libera Professionista",
    date: "Dicembre 2025",
    text: "Dopo aver confrontato 5 preventivi diversi, ENERGEIDE mi ha convinto per la trasparenza e la qualit\u00E0 dei pannelli. L'impianto da 7 kW produce esattamente quello che avevano previsto. Bolletta azzerata all'80%!",
  },
  {
    name: "Roberto Mancini",
    location: "Roma, Lazio",
    role: "Ingegnere",
    date: "Novembre 2025",
    text: "Da ingegnere, ero molto esigente sui dettagli tecnici. ENERGEIDE ha risposto a ogni mia domanda con competenza. L'inverter ibrido e la batteria da 15 kWh sono di primissima qualit\u00E0. Sistema perfettamente dimensionato.",
  },
  {
    name: "Francesca Lombardi",
    location: "Torino, Piemonte",
    role: "Architetto",
    date: "Ottobre 2025",
    text: "Ho scelto ENERGEIDE per la villa di famiglia. Oltre ai pannelli, hanno installato una pompa di calore che ha eliminato completamente il gas. Finalmente zero bollette invernali! Consigliatissimo.",
  },
  {
    name: "Antonio Ricci",
    location: "Bologna, Emilia-Romagna",
    role: "Commerciante",
    date: "Settembre 2025",
    text: "Ho installato il sistema da 12 kW sul mio negozio. In 6 mesi ho recuperato quasi \u20AC2.000 di costi energetici. Il monitoraggio in app \u00E8 fantastico, vedo in tempo reale quanto produco e consumo.",
  },
  {
    name: "Laura Galli",
    location: "Firenze, Toscana",
    role: "Insegnante",
    date: "Agosto 2025",
    text: "Vivendo in centro storico avevo paura dei vincoli architettonici, ma ENERGEIDE ha gestito tutte le autorizzazioni comunali. Impianto installato senza problemi e perfettamente integrato. Un sogno!",
  },
];

export const SERVICES = [
  {
    title: "Impianti Fotovoltaici",
    desc: "Progettiamo e installiamo impianti fotovoltaici chiavi in mano da 3 kW a oltre 50 kW per privati e aziende, con moduli ad alta efficienza.",
    icon: "sun",
    image: "https://images.unsplash.com/photo-1771479755134-9c1e3143c110",
  },
  {
    title: "Sistemi di Accumulo",
    desc: "Batterie al litio di ultima generazione da 5 kWh a 20 kWh per massimizzare l'autoconsumo e garantire energia anche di notte.",
    icon: "battery",
    image: "https://images.unsplash.com/photo-1766507679659-30076abc8c95",
  },
  {
    title: "Pompe di Calore",
    desc: "Soluzioni a pompa di calore per riscaldamento, raffrescamento e acqua calda sanitaria. Elimina il gas e abbatti la bolletta.",
    icon: "thermometer",
    image: "https://images.unsplash.com/photo-1776860150305-108ed577d7d4",
  },
  {
    title: "Pratiche ENEA & GSE",
    desc: "Gestiamo per te tutta la burocrazia: pratiche ENEA, GSE, connessione alla rete e detrazioni fiscali. Tu non muovi un dito.",
    icon: "file-check",
    image: "https://images.unsplash.com/photo-1560618259-dff83f6cacbd",
  },
  {
    title: "APE - Attestato Energetico",
    desc: "Rilasciamo l'Attestato di Prestazione Energetica certificato da tecnici abilitati per ogni tipologia di immobile.",
    icon: "award",
    image: "https://images.unsplash.com/photo-1662340712175-349cd23a63d6",
  },
  {
    title: "Condizionatori",
    desc: "Climatizzatori inverter ad alta efficienza in classe A+++. Installazione professionale e assistenza post-vendita.",
    icon: "wind",
    image: "https://images.unsplash.com/photo-1766788466565-768128d89ce4",
  },
];

export const PROJECTS = [
  {
    title: "Villa Residenziale - Avellino",
    type: "Residenziale",
    power: "9 kW",
    storage: "15 kWh",
    year: "2026",
    image: "https://images.unsplash.com/photo-1771479755134-9c1e3143c110",
  },
  {
    title: "Casa Indipendente - Salerno",
    type: "Residenziale",
    power: "6 kW",
    storage: "10 kWh",
    year: "2025",
    image: "https://images.unsplash.com/photo-1776182869767-2ede57640c8a",
  },
  {
    title: "Complesso Residenziale - Benevento",
    type: "Residenziale",
    power: "12 kW",
    storage: "20 kWh",
    year: "2025",
    image: "https://images.pexels.com/photos/9875683/pexels-photo-9875683.jpeg",
  },
  {
    title: "Villa Bifamiliare - Caserta",
    type: "Residenziale",
    power: "7 kW",
    storage: "10 kWh",
    year: "2025",
    image: "https://images.pexels.com/photos/9875685/pexels-photo-9875685.jpeg",
  },
  {
    title: "Negozio Commerciale - Napoli",
    type: "Commerciale",
    power: "15 kW",
    storage: "20 kWh",
    year: "2025",
    image: "https://images.unsplash.com/photo-1705579603327-a2ac14ec2f3f",
  },
  {
    title: "Capannone Industriale - Avellino",
    type: "Industriale",
    power: "50 kW",
    storage: "30 kWh",
    year: "2024",
    image: "https://images.unsplash.com/photo-1660330589505-9a433a742a7b",
  },
];

export const FAQS = [
  {
    q: "Quanto costa un impianto fotovoltaico chiavi in mano?",
    a: "Il prezzo dipende dalla potenza dell'impianto e dal sistema di accumulo. I nostri pacchetti partono da soluzioni Essential da 6 kW fino al pacchetto Elite da 9 kW con batteria da 20 kWh. Tutti includono installazione, pratiche e garanzie. Richiedi un preventivo gratuito per un calcolo personalizzato.",
  },
  {
    q: "In quanto tempo si installa l'impianto?",
    a: "L'installazione viene completata mediamente in 2-3 giorni lavorativi. Dal sopralluogo alla messa in esercizio passano normalmente 30-45 giorni, considerando le pratiche burocratiche con GSE ed e-distribuzione.",
  },
  {
    q: "Esistono finanziamenti a tasso zero?",
    a: "S\u00EC, offriamo finanziamenti a tasso zero fino a 96 mesi tramite primarie societ\u00E0 finanziarie convenzionate. Puoi installare l'impianto senza anticipo e pagare con rate gi\u00E0 coperte dal risparmio in bolletta.",
  },
  {
    q: "Quanto risparmio sulla bolletta?",
    a: "Con un sistema fotovoltaico con accumulo ben dimensionato puoi raggiungere fino all'80% di risparmio sulla bolletta elettrica. In casi di abbinamento con pompa di calore arrivi anche al 95% di indipendenza energetica.",
  },
  {
    q: "Quali garanzie offrite?",
    a: "Offriamo garanzia prodotto fino a 25 anni sui moduli, 10-15 anni sull'inverter, 10 anni sulla batteria e 10 anni sull'installazione. Inoltre garantiamo la produzione lineare per tutta la vita utile dell'impianto.",
  },
  {
    q: "Vi occupate delle pratiche burocratiche?",
    a: "Assolutamente s\u00EC. Gestiamo per te le pratiche ENEA per le detrazioni fiscali, la connessione alla rete con e-distribuzione, l'attivazione del Ritiro Dedicato con GSE e l'eventuale APE. Tu non devi muovere un dito.",
  },
  {
    q: "Come funziona il monitoraggio dell'impianto?",
    a: "Ogni impianto include un sistema di monitoraggio via app e portale web. Puoi controllare in tempo reale la produzione, il consumo, il livello di carica della batteria e l'autoconsumo, anche da smartphone.",
  },
  {
    q: "Posso installare anche una pompa di calore?",
    a: "Certamente. Le pompe di calore si abbinano perfettamente al fotovoltaico per riscaldamento, raffrescamento e acqua calda sanitaria. Eliminando il gas, ottieni una casa 100% elettrica e indipendente.",
  },
];

export const TEAM_VALUES = [
  {
    title: "Trasparenza",
    desc: "Preventivi chiari, senza costi nascosti. Spieghiamo ogni voce e ogni componente del tuo impianto.",
    icon: "eye",
  },
  {
    title: "Qualit\u00E0",
    desc: "Lavoriamo solo con i migliori brand del settore. Componenti certificati e installazioni a regola d'arte.",
    icon: "award",
  },
  {
    title: "Assistenza",
    desc: "Non ti lasciamo solo dopo l'installazione. Supporto tecnico continuo per tutta la vita dell'impianto.",
    icon: "headphones",
  },
];
