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
  // Facebook Page URL - usato per il Page Plugin embed
  facebookUrl: "https://www.facebook.com/profile.php?id=61575384451177",
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Chi Siamo", to: "/chi-siamo" },
  { label: "Servizi", to: "/servizi" },
  { label: "Progetti", to: "/progetti" },
  { label: "News", to: "/news" },
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
    a: "Un impianto fotovoltaico da 6 kW con accumulo da 5-10 kWh chiavi in mano parte indicativamente da 9.500 \u20AC IVA inclusa, comprensivo di pannelli monocristallini, inverter ibrido, batteria, installazione, pratiche ENEA/GSE e garanzie. Il prezzo finale dipende dal tipo di tetto, dall'accumulo scelto e dalle eventuali pompe di calore abbinate. Richiedi un preventivo gratuito per un calcolo personalizzato.",
  },
  {
    category: "Fotovoltaico",
    q: "Quanto posso risparmiare sulla bolletta?",
    a: "Con un sistema fotovoltaico con accumulo ben dimensionato puoi raggiungere fino all'80% di risparmio sulla bolletta elettrica. Abbinando una pompa di calore puoi arrivare al 95% di indipendenza energetica eliminando completamente il gas. Il risparmio medio dei nostri clienti supera i 1.000 \u20AC l'anno.",
  },
  {
    category: "Fotovoltaico",
    q: "In quanto tempo si ripaga l'investimento?",
    a: "Il tempo di ritorno dell'investimento (payback) di un impianto fotovoltaico con accumulo si attesta mediamente tra i 5 e i 7 anni, grazie al risparmio in bolletta, alle detrazioni fiscali e agli incentivi GSE. Considerando una vita utile di oltre 25 anni, l'impianto continua a produrre energia gratuita per circa 20 anni dopo essersi ripagato.",
  },
  {
    category: "Fotovoltaico",
    q: "Conviene passare a 9 kW con 15 kWh di accumulo?",
    a: "S\u00EC, se hai consumi elevati (oltre 5.000 kWh/anno), una famiglia numerosa, una pompa di calore o un'auto elettrica. Un impianto da 9 kW + 15 kWh produce fino a 13.500 kWh/anno e copre fino al 95% del fabbisogno, garantendo massima indipendenza dalla rete. \u00C8 la scelta ideale per chi vuole eliminare quasi del tutto la bolletta.",
  },
  {
    category: "Installazione",
    q: "Quanto tempo richiede l'installazione?",
    a: "L'installazione fisica dell'impianto viene completata mediamente in 2-3 giorni lavorativi. Dal sopralluogo alla messa in esercizio passano normalmente 30-45 giorni, considerando le pratiche burocratiche con e-distribuzione e GSE.",
  },
  {
    category: "Installazione",
    q: "Il mio tetto \u00E8 adatto per i pannelli solari?",
    a: "La maggior parte dei tetti italiani sono idonei. L'orientamento ideale \u00E8 a sud, ma anche est-ovest danno ottimi risultati. Valutiamo gratuitamente la pendenza, le ombreggiature, lo spazio disponibile e l'integrit\u00E0 strutturale durante il sopralluogo. Esistono soluzioni anche per tetti piani, in lamiera, in coppi o tegole.",
  },
  {
    category: "Installazione",
    q: "Servono permessi per installare i pannelli?",
    a: "Per la maggior parte degli impianti residenziali \u00E8 sufficiente la Comunicazione di Edilizia Libera in regime di Modello Unico, che presentiamo noi al gestore di rete. Per immobili in centro storico, vincolati o sottoposti a tutela paesaggistica gestiamo le autorizzazioni comunali e della Soprintendenza.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Quali incentivi sono disponibili?",
    a: "Sono attivi: la detrazione fiscale 50% in 10 anni sul fotovoltaico residenziale, lo Scambio sul Posto / Ritiro Dedicato GSE per la valorizzazione dell'energia immessa, l'IVA agevolata al 10% e, per le pompe di calore, l'Ecobonus fino al 65%. Ti aiutiamo a scegliere la combinazione pi\u00F9 vantaggiosa per il tuo caso.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Cosa sono le pratiche ENEA e GSE?",
    a: "ENEA \u00E8 l'agenzia che gestisce le comunicazioni obbligatorie per le detrazioni fiscali sugli interventi di efficienza energetica. GSE (Gestore dei Servizi Energetici) regola lo Scambio sul Posto, il Ritiro Dedicato e gli incentivi sull'energia rinnovabile. Ci occupiamo di entrambe le pratiche al posto tuo, garantendo tempi e correttezza.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Cos'\u00E8 l'APE e quando serve?",
    a: "L'APE (Attestato di Prestazione Energetica) certifica la classe energetica dell'immobile. \u00C8 obbligatorio per la vendita, l'affitto, le ristrutturazioni rilevanti e per accedere a determinati incentivi. Lo rilasciamo internamente tramite tecnici abilitati, integrandolo nei progetti di efficientamento.",
  },
  {
    category: "Pratiche e Incentivi",
    q: "Posso accedere a finanziamenti?",
    a: "S\u00EC, offriamo finanziamenti a tasso zero fino a 96 mesi tramite primarie societ\u00E0 finanziarie convenzionate. Puoi installare l'impianto senza anticipo e pagare con rate gi\u00E0 coperte dal risparmio in bolletta. Risposta della finanziaria entro 24-48 ore.",
  },
  {
    category: "Pompe di Calore",
    q: "Cosa sono le pompe di calore?",
    a: "Sono sistemi che riscaldano e raffrescano la casa producendo anche acqua calda sanitaria, alimentati ad energia elettrica e con un'efficienza COP fino a 5.0 (per ogni 1 kWh consumato producono fino a 5 kWh di calore). Abbinati al fotovoltaico permettono di eliminare il gas e ridurre drasticamente la bolletta.",
  },
  {
    category: "Pompe di Calore",
    q: "Posso eliminare la caldaia a gas?",
    a: "Assolutamente s\u00EC. Sostituendo la caldaia a gas con una pompa di calore aria-acqua e abbinandola al fotovoltaico, puoi eliminare la fornitura di gas con un risparmio annuo di 800-1.500 \u20AC. Con il giusto dimensionamento, riscaldamento, raffrescamento e acqua calda sono coperti al 100% da fonte rinnovabile.",
  },
  {
    category: "Tecnico",
    q: "I pannelli funzionano anche in inverno?",
    a: "S\u00EC. I pannelli monocristallini producono anche in inverno e con cielo nuvoloso, seppur a regimi pi\u00F9 ridotti. Le basse temperature in realt\u00E0 migliorano l'efficienza dei moduli. La produzione invernale tipica si attesta intorno al 30-40% di quella estiva ed \u00E8 sufficiente, con un buon accumulo, a coprire la maggior parte dei consumi.",
  },
  {
    category: "Tecnico",
    q: "Che manutenzione richiedono i pannelli?",
    a: "Pochissima. I pannelli monocristallini si autopuliscono con la pioggia e non hanno parti meccaniche in movimento. Consigliamo un controllo tecnico ogni 2 anni e una pulizia in zone particolarmente polverose. Il monitoraggio via app segnala automaticamente eventuali anomalie di produzione.",
  },
  {
    category: "Garanzie",
    q: "Che garanzie offrite?",
    a: "Offriamo garanzia prodotto fino a 25 anni sui moduli, 10-15 anni sull'inverter, 10 anni sulla batteria di accumulo e 10 anni sull'installazione. Inoltre garantiamo la produzione lineare per tutta la vita utile dell'impianto: i pannelli mantengono almeno l'85% della potenza nominale dopo 25 anni.",
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
