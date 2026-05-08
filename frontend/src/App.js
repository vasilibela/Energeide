import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import Progetti from "./pages/Progetti";
import FAQ from "./pages/FAQ";
import Contatti from "./pages/Contatti";
import News from "./pages/News";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <ScrollToTop />
    <Header />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/servizi" element={<Servizi />} />
        <Route path="/progetti" element={<Progetti />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/news" element={<News />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
