import { Phone, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const GLOBAL_SETTINGS_ID = 2756;

type GlobalData = Record<string, string | undefined>;

const ofertaItems = [
  { label: "Ubezpieczenia komunikacyjne", slug: "ubezpieczenia-komunikacyjne" },
  { label: "Ubezpieczenia osobowe", slug: "ubezpieczenia-osobowe" },
  { label: "Ubezpieczenia majątkowe", slug: "ubezpieczenia-majatkowe" },
  { label: "Ubezpieczenia turystyczne", slug: "ubezpieczenia-turystyczne" },
  { label: "Ubezpieczenia firmowe", slug: "ubezpieczenia-firmowe" },
  { label: "Ubezpieczenia rolne", slug: "ubezpieczenia-rolne" },
];

const kredytyItems = [
  { label: "Kredyty hipoteczne", slug: "kredyty-hipoteczne" },
  { label: "Kredyty gotówkowe", slug: "kredyty-gotowkowe" },
  { label: "Kredyty konsolidacyjne", slug: "kredyty-konsolidacyjne" },
  { label: "Kredyty samochodowe", slug: "kredyty-samochodowe" },
];

const kalkulatoryItems = [
  { label: "Kalkulator ubezpieczeń", to: "/kalkulator" },
  { label: "Kalkulator kredytowy", to: "/kalkulator-kredytowy" },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const onLeave = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setOpen(false), 160);
  };

  const close = () => setOpen(false);

  return { open, onEnter, onLeave, close };
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [global, setGlobal] = useState<GlobalData>({});

  const { fetchWithLoader } = usePageLoader();

  const [mobileOferta, setMobileOferta] = useState(false);
  const [mobileKredyty, setMobileKredyty] = useState(false);
  const [mobileKalkulatory, setMobileKalkulatory] = useState(false);

  const oferta = useDropdown();
  const kredyty = useDropdown();
  const kalkulatory = useDropdown();

  const loadGlobalData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("Header global settings error:", e);
      }
    });
  }, [fetchWithLoader]);

  useEffect(() => {
    loadGlobalData();
  }, [loadGlobalData]);

  const logoUrl = global.header_logo || "/logo-opolskie-ubezpiecznia.png";
  const phone = global.global_phone || "";
  const phoneLink = `tel:${phone.replace(/\s/g, "")}`;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileOferta(false);
    setMobileKredyty(false);
    setMobileKalkulatory(false);
  };

  const DesktopDropdown = ({
    label,
    linkTo,
    hook,
    children,
  }: {
    label: string;
    linkTo: string;
    hook: ReturnType<typeof useDropdown>;
    children: React.ReactNode;
  }) => (
    <div className="relative" onMouseEnter={hook.onEnter} onMouseLeave={hook.onLeave}>
      <Link
        to={linkTo}
        className="flex items-center gap-1.5 text-[#2D7A5F] hover:text-[#1F5A43] transition-colors"
        onClick={hook.close}
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${hook.open ? "rotate-180" : ""}`} />
      </Link>

      {hook.open && (
        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#2D7A5F]/10 overflow-hidden"
          onMouseEnter={hook.onEnter}
          onMouseLeave={hook.onLeave}
        >
          <div className="absolute -top-2 left-0 right-0 h-2" />
          <div className="p-3">{children}</div>
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#2D7A5F]/15 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/#top" onClick={closeMobileMenu} className="flex items-center gap-3">
              <img src={logoUrl} alt="Opolskie Ubezpieczenia" className="h-10 sm:h-12 md:h-14 w-auto" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-8 text-[15px]">
            <DesktopDropdown label="Oferta" linkTo="/#oferta" hook={oferta}>
              {ofertaItems.map((item) => (
                <Link
                  key={item.slug}
                  to={`/oferta/${item.slug}`}
                  className="block px-5 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/5 rounded-xl transition-colors"
                  onClick={oferta.close}
                >
                  {item.label}
                </Link>
              ))}
            </DesktopDropdown>

            <DesktopDropdown label="Kredyty" linkTo="/kredyty" hook={kredyty}>
              {kredytyItems.map((item) => (
                <Link
                  key={item.slug}
                  to={`/kredyty/${item.slug}`}
                  className="block px-5 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/5 rounded-xl transition-colors"
                  onClick={kredyty.close}
                >
                  {item.label}
                </Link>
              ))}
            </DesktopDropdown>

            <DesktopDropdown label="Kalkulatory" linkTo="/kalkulator" hook={kalkulatory}>
              {kalkulatoryItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-5 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/5 rounded-xl transition-colors"
                  onClick={kalkulatory.close}
                >
                  {item.label}
                </Link>
              ))}
            </DesktopDropdown>

            <Link to="/o-nas" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              O nas
            </Link>
            <Link to="/blog" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Blog
            </Link>
            <Link to="/realizacje-z-lotu-drona" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Realizacje z lotu drona
            </Link>
            <Link to="/rejestracja-pojazdow" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Rejestracja pojazdów
            </Link>
            <Link to="/kontakt" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Kontakt
            </Link>
          </nav>

          {phone && (
            <a
              href={phoneLink}
              className="hidden lg:inline-flex items-center gap-3 bg-[#2D7A5F] hover:bg-[#1F5A43] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-[#2D7A5F]/20 lg:ml-4"
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm md:text-lg">{phone}</span>
            </a>
          )}

          <div className="flex items-center gap-3 lg:hidden">
            {phone && (
              <a
                href={phoneLink}
                className="inline-flex items-center justify-center rounded-full border border-[#2D7A5F]/30 bg-white/70 px-3 py-2 text-[#2D7A5F] text-sm shadow-sm"
                aria-label="Zadzwoń do nas"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="inline-flex items-center justify-center rounded-full border border-[#2D7A5F]/30 bg-white/80 p-2 shadow-sm"
              aria-label="Otwórz menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2D7A5F]" /> : <Menu className="w-5 h-5 text-[#2D7A5F]" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 lg:hidden rounded-3xl border border-[#2D7A5F]/12 bg-white shadow-2xl overflow-hidden">
            <nav className="flex flex-col text-[15px] divide-y divide-[#2D7A5F]/8">
              
              {/* Oferta - Mobile (Cały wiersz rozwija) */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileOferta((p) => !p)}
                  className="flex items-center justify-between px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
                >
                  <span>Oferta</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileOferta ? "rotate-180" : ""}`} />
                </button>
                {mobileOferta && (
                  <div className="bg-[#F5F1E8]/70 pb-2">
                    {ofertaItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/oferta/${item.slug}`}
                        onClick={closeMobileMenu}
                        className="block pl-8 pr-4 py-2.5 text-sm text-[#2D7A5F] hover:bg-[#2D7A5F]/8 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Kredyty - Mobile (Tylko tu jest podział na Link i Przycisk) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                  <Link to="/kredyty" onClick={closeMobileMenu} className="flex-1 px-4 py-3">
                    Kredyty
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileKredyty((p) => !p)}
                    className="px-4 py-3 border-l border-[#2D7A5F]/10"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileKredyty ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {mobileKredyty && (
                  <div className="bg-[#F5F1E8]/70 pb-2">
                    {kredytyItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/kredyty/${item.slug}`}
                        onClick={closeMobileMenu}
                        className="block pl-8 pr-4 py-2.5 text-sm text-[#2D7A5F] hover:bg-[#2D7A5F]/8 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Kalkulatory - Mobile (Cały wiersz rozwija) */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileKalkulatory((p) => !p)}
                  className="flex items-center justify-between px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
                >
                  <span>Kalkulatory</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileKalkulatory ? "rotate-180" : ""}`} />
                </button>
                {mobileKalkulatory && (
                  <div className="bg-[#F5F1E8]/70 pb-2">
                    {kalkulatoryItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMobileMenu}
                        className="block pl-8 pr-4 py-2.5 text-sm text-[#2D7A5F] hover:bg-[#2D7A5F]/8 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/o-nas" onClick={closeMobileMenu} className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                O nas
              </Link>
              <Link to="/blog" onClick={closeMobileMenu} className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                Blog
              </Link>
              <Link to="/realizacje-z-lotu-drona" onClick={closeMobileMenu} className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                Realizacje z lotu drona
              </Link>
              <Link to="/rejestracja-pojazdow" onClick={closeMobileMenu} className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                Rejestracja pojazdów
              </Link>
              <Link to="/kontakt" onClick={closeMobileMenu} className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors">
                Kontakt
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}