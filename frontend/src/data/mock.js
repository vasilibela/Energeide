// Mock data for Energeide clone - replace with API calls when backend is integrated

export const SITE = {
  brand: "ENERGEIDE",
  tagline: "RISPARMIO ENERGETICO",
  motto: "Il sole splende, il pannello rende",
  phone: "+39 350 931 2938",
  phoneRaw: "393509312938",
  email: "info@energeide.it",
  vat: "P.IVA: 02987000649",
  addressLine1: "Corso Vittorio Emanuele, 21",
  addressLine2: "Quadrelle (AV) 83020 \u2013 Italia",
  hoursWeekdays: "Lun \u2013 Ven: 9:00 \u2013 18:00",
  hoursSaturday: "Sab: 9:00 \u2013 13:00",
  whatsappText: "Ciao! Vorrei ricevere informazioni sulle vostre soluzioni fotovoltaiche.",
  // Social
  facebookUrl: "https://www.facebook.com/profile.php?id=61575384451177",
  instagramUrl:
    "https://www.instagram.com/energeide_srl?igsh=azA2ZGg3b3FqYzU1&utm_source=qr",
  trustpilotUrl: "https://it.trustpilot.com/review/energeide.it",
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Chi Siamo", to: "/chi-siamo" },
  { label: "Servizi", to: "/servizi" },
  { label: "Progetti", to: "/progetti" },
  { label: "Blog", to: "/news" },
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
  { value: "80%", label: "Risparmio in Bolletta", icon: "trending" },
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
    desc: "Progettiamo e installiamo impianti fotovoltaici residenziali e commerciali su misura. Pannelli monocristallini di ultima generazione, massima efficienza e resa garantita.",
    icon: "sun",
    image: "https://images.unsplash.com/photo-1771479755134-9c1e3143c110",
  },
  {
    title: "Sistemi di Accumulo",
    desc: "Batterie al litio di ultima generazione da 5 kWh a 20 kWh per immagazzinare l'energia e utilizzarla quando serve: la sera, di notte o nelle giornate nuvolose.",
    icon: "battery",
    image: "https://images.unsplash.com/photo-1766507679659-30076abc8c95",
  },
  {
    title: "Pompe di Calore",
    desc: "Elimina la caldaia a gas! Le pompe di calore riscaldano e raffrescano la tua casa con efficienza COP fino a 5.0, alimentate dal tuo impianto fotovoltaico.",
    icon: "thermometer",
    image: "https://images.unsplash.com/photo-1776860150305-108ed577d7d4",
  },
  {
    title: "Pratiche di Connessione",
    desc: "Gestiamo tutte le pratiche per la connessione del tuo impianto alla rete elettrica con e-distribuzione. Dall'inizio alla fine, senza stress.",
    icon: "file-check",
    image: "https://images.unsplash.com/photo-1560618259-dff83f6cacbd",
  },
  {
    title: "Pratiche ENEA",
    desc: "Ci occupiamo della comunicazione all'ENEA per le detrazioni fiscali. Nessun rischio di errori o ritardi: tutto gestito da tecnici abilitati.",
    icon: "file-check",
    image: "https://images.unsplash.com/photo-1662340712175-349cd23a63d6",
  },
  {
    title: "Rapporti col GSE",
    desc: "Gestiamo i rapporti con il Gestore dei Servizi Energetici per lo Scambio sul Posto, il Ritiro Dedicato e gli incentivi disponibili.",
    icon: "file-check",
    image: "https://images.unsplash.com/photo-1560618259-dff83f6cacbd",
  },
  {
    title: "APE - Attestato Energetico",
    desc: "Rilasciamo l'Attestato di Prestazione Energetica certificato da tecnici abilitati per vendita, affitto e interventi di ristrutturazione.",
    icon: "award",
    image: "https://images.unsplash.com/photo-1662340712175-349cd23a63d6",
  },
  {
    title: "Condizionatori",
    desc: "Climatizzatori inverter ad alta efficienza in classe A+++. Comfort in estate, risparmio tutto l'anno. Installazione professionale e assistenza post-vendita.",
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

export const FAQ_CATEGORIES = [
  "Tutti",
  "Fotovoltaico",
  "Installazione",
  "Pratiche e Incentivi",
  "Pompe di Calore",
  "Tecnico",
  "Garanzie",
];

export const FAQS = [
  {
    category: "Fotovoltaico",
    q: "Quanto costa un impianto fotovoltaico da 6 kW?",
    a: "Un impianto da 6 kW con 10 kWh di accumulo parte da 8.900\u20AC chiavi in mano, IVA inclusa. Il prezzo varia in base alla qualit\u00E0 dei componenti e ai servizi aggiuntivi. Offriamo tre soluzioni: Essential, Premium ed Elite.",
  },
  {
    category: "Fotovoltaico",
    q: "Quanto posso risparmiare sulla bolletta?",
    a: "In media i nostri clienti risparmiano tra il 60% e l'80% sulla bolletta elettrica. Con un impianto da 6 kW e accumulo da 10 kWh, il risparmio annuale \u00E8 di circa 600-1.400\u20AC a seconda dei consumi e della soluzione scelta.",
  },
  {
    category: "Fotovoltaico",
    q: "In quanto tempo si ripaga l'investimento?",
    a: "Grazie agli incentivi fiscali e al risparmio in bolletta, un impianto fotovoltaico si ripaga mediamente in 5-7 anni. Con una durata di 25-30 anni, avrai oltre 20 anni di energia quasi gratuita.",
  },
  {
    category: "Fotovoltaico",
    q: "Conviene passare a 9 kW con 15 kWh di accumulo?",
    a: "Se hai consumi elevati (pi\u00F9 di 5.000 kWh/anno), una famiglia numerosa, pompe di calore o un'auto elettrica, la soluzione da 9 kW + 15 kWh offre maggiore autonomia e un risparmio ancora pi\u00F9 significativo. Contattaci per una valutazione personalizzata.",
  },
  {
    category: "Installazione",
    q: "Quanto tempo richiede l'installazione?",
    a: "L'installazione fisica richiede 2-3 giorni lavorativi. I tempi totali, incluse le pratiche burocratiche e l'allacciamento alla rete, variano da 4 a 8 settimane.",
  },
  {
    category: "Installazione",
    q: "Il mio tetto \u00E8 adatto per i pannelli solari?",
    a: "La maggior parte dei tetti \u00E8 idonea. Offriamo un sopralluogo gratuito per valutare orientamento, inclinazione, ombre e struttura portante. Lavoriamo su tetti piani, inclinati e anche su tettoie.",
  },
  {
    category: "Installazione",
    q: "Servono permessi per installare i pannelli?",
    a: "Per impianti residenziali standard \u00E8 sufficiente una comunicazione al Comune (spesso in edilizia libera). Ci occupiamo noi di tutte le pratiche burocratiche, incluse quelle con il GSE.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Quali incentivi sono disponibili?",
    a: "\u00C8 disponibile la detrazione fiscale del 50% in 10 anni per ristrutturazioni edilizie. Per aziende esistono ulteriori agevolazioni. Ti aiutiamo a identificare tutti gli incentivi a cui hai diritto e gestiamo le pratiche ENEA.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Cosa sono le pratiche ENEA e GSE?",
    a: "La pratica ENEA \u00E8 la comunicazione obbligatoria per ottenere le detrazioni fiscali. Il rapporto con il GSE serve per lo scambio sul posto dell'energia. Ci occupiamo di tutto noi, senza costi aggiuntivi.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Cos'\u00E8 l'APE e quando serve?",
    a: "L'Attestato di Prestazione Energetica (APE) \u00E8 un documento che certifica la classe energetica dell'immobile. \u00C8 obbligatorio per vendita, affitto e per accedere ad alcuni incentivi. Lo rilasciamo noi.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Posso accedere a finanziamenti?",
    a: "S\u00EC, abbiamo convenzioni con primari istituti bancari per finanziamenti a tasso agevolato. Puoi dilazionare il pagamento in comode rate mensili, spesso coperte dal risparmio in bolletta.",
  },
  {
    category: "Pompe di Calore",
    q: "Cosa sono le pompe di calore?",
    a: "Le pompe di calore sono sistemi che riscaldano e raffrescano la casa usando l'energia dell'aria esterna. Hanno un'efficienza 3-5 volte superiore alle caldaie a gas e possono essere alimentate dal fotovoltaico, eliminando completamente la bolletta del gas.",
  },
  {
    category: "Pompe di Calore",
    q: "Posso eliminare la caldaia a gas?",
    a: "S\u00EC, con un impianto fotovoltaico abbinato a una pompa di calore puoi eliminare completamente la caldaia a gas. La pompa di calore riscalda in inverno, raffresca in estate e produce acqua calda, tutto alimentato dall'energia solare.",
  },
  {
    category: "Tecnico",
    q: "I pannelli funzionano anche in inverno?",
    a: "S\u00EC, i pannelli producono energia anche in inverno e con cielo nuvoloso, seppur in quantit\u00E0 ridotta. La produzione annuale \u00E8 ottimizzata per garantire il risparmio previsto.",
  },
  {
    category: "Tecnico",
    q: "Che manutenzione richiedono i pannelli?",
    a: "I pannelli richiedono pochissima manutenzione: una pulizia annuale e un controllo tecnico ogni 2-3 anni. Offriamo piani di manutenzione programmata inclusi nelle soluzioni Premium ed Elite.",
  },
  {
    category: "Garanzie",
    q: "Che garanzie offrite?",
    a: "Offriamo garanzia sui pannelli fino a 25 anni (produttore), sull'inverter 10-15 anni, sulle batterie fino a 15 anni, e sulla manodopera 10 anni. Ogni componente \u00E8 certificato e di primaria marca.",
  },
];

export const TEAM_VALUES = [
  {
    title: "Eliminare il Gas",
    desc: "La nostra missione principale: aiutare le famiglie italiane a eliminare completamente la dipendenza dal gas, passando a soluzioni elettriche efficienti.",
    icon: "flame",
  },
  {
    title: "Massimo Risparmio",
    desc: "Analizziamo i tuoi consumi energetici per trovare la soluzione che ti fa risparmiare il pi\u00F9 possibile, riducendo il fabbisogno al minimo.",
    icon: "piggy",
  },
  {
    title: "Sostenibilit\u00E0",
    desc: "Ogni impianto che installiamo \u00E8 un passo verso un futuro pi\u00F9 verde. Riduciamo le emissioni di CO2 e proteggiamo l'ambiente.",
    icon: "leaf",
  },
  {
    title: "Consulenza Personale",
    desc: "Non siamo venditori: siamo consulenti. Ti ascoltiamo, capiamo le tue esigenze e ti guidiamo verso la scelta migliore per te.",
    icon: "users",
  },
];
