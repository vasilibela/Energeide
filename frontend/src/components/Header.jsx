import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { NAV, SITE } from "../data/mock";
import Logo from "./Logo";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo />
            <span className="font-montserrat font-extrabold text-[#0A1F44] tracking-tight text-lg sm:text-xl">
              ENERGEIDE
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative font-montserrat text-[15px] transition-colors py-1 ${
                    isActive
                      ? "text-[#0A1F44] font-semibold"
                      : "text-[#475569] hover:text-[#0A1F44]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#F4C542] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center gap-2 text-[#0A1F44] hover:text-[#0FB36B] transition-colors"
            >
              <span className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="font-montserrat text-sm font-semibold">
                {SITE.phone}
              </span>
            </a>
            <Link
              to="/contatti"
              className="font-montserrat font-bold text-sm bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-5 py-2.5 transition-colors shadow-md shadow-[#F4C542]/20"
            >
              Richiedi Preventivo
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-[#0A1F44]"
            onClick={() => setOpen((s) => !s)}
            aria-label="Apri menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md font-montserrat text-[15px] ${
                    isActive
                      ? "bg-[#F4C542]/15 text-[#0A1F44] font-semibold"
                      : "text-[#475569] hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center gap-2 px-3 py-3 text-[#0A1F44]"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">{SITE.phone}</span>
            </a>
            <Link
              to="/contatti"
              className="block text-center font-montserrat font-bold bg-[#F4C542] hover:bg-[#e6b838] text-[#0A1F44] rounded-md px-5 py-3 mt-2"
            >
              Richiedi Preventivo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
