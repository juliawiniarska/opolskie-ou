import { Phone, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";


const ofertaItems = [
  { label: "Ubezpieczenia komunikacyjne", slug: "ubezpieczenia-komunikacyjne" },
  { label: "Ubezpieczenia osobowe", slug: "ubezpieczenia-osobowe" },
  { label: "Ubezpieczenia majątkowe", slug: "ubezpieczenia-majatkowe" },
  { label: "Ubezpieczenia turystyczne", slug: "ubezpieczenia-turystyczne" },
  { label: "Ubezpieczenia firmowe", slug: "ubezpieczenia-firmowe" },
  { label: "Ubezpieczenia rolne", slug: "ubezpieczenia-rolne" },
];

export function Header() {
  const [showOfertaMenu, setShowOfertaMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setShowOfertaMenu(false);
  };

  const closeTimeoutRef = useRef<number | null>(null);

const openOferta = () => {
  if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
  setShowOfertaMenu(true);
};

const scheduleCloseOferta = () => {
  if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
  closeTimeoutRef.current = window.setTimeout(() => {
    setShowOfertaMenu(false);
  }, 160); // krótko, żeby nie "migało"
};


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#2D7A5F]/15 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/#top" onClick={closeMobileMenu} className="flex items-center gap-3">
              <img
                src="/logo-opolskie-ubezpiecznia.png"
                alt="Opolskie Ubezpieczenia"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[15px]">
            <Link to="/" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Strona główna
            </Link>

            <div
  className="relative"
  onMouseEnter={openOferta}
  onMouseLeave={scheduleCloseOferta}
>
  <Link
    to="/#oferta"
    className="flex items-center gap-2 text-[#2D7A5F] hover:text-[#1F5A43] transition-colors"
    onClick={() => setShowOfertaMenu(false)}
  >
    <span>Oferta</span>
    <ChevronDown
      className={`w-4 h-4 transition-transform ${showOfertaMenu ? "rotate-180" : ""}`}
    />
  </Link>

  {showOfertaMenu && (
    <div
      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#2D7A5F]/10 overflow-hidden"
      onMouseEnter={openOferta}
      onMouseLeave={scheduleCloseOferta}
    >
      {/* “mostek” – niewidzialny pasek, żeby nie było przerwy hover */}
      <div className="absolute -top-2 left-0 right-0 h-2" />

      <div className="p-3">
        {ofertaItems.map((item) => (
          <Link
            key={item.slug}
            to={`/oferta/${item.slug}`}
            className="block px-5 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/5 rounded-xl transition-colors"
            onClick={() => setShowOfertaMenu(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )}
</div>


            {/* Te sekcje są na stronie głównej, więc używamy Link /#... */}
            <Link to="/o-nas" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
  O nas
</Link>
<Link to="/kalkulator" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
  Kalkulator ubezpieczeń
</Link>

            <Link to="/blog" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Blog
            </Link>
            <Link to="/realizacje-z-lotu-drona" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Realizacje z lotu drona
            </Link>
            <Link to="/kontakt" className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors">
              Kontakt
            </Link>
          </nav>

          {/* Desktop CTA */}
          <a
            href="tel:739079729"
            className="hidden md:inline-flex items-center gap-3 bg-[#2D7A5F] hover:bg-[#1F5A43] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all shadow-lg shadow-[#2D7A5F]/20 lg:ml-4"
          >
            <Phone className="w-5 h-5" />
            <span className="text-sm md:text-lg">739 079 729</span>
          </a>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="tel:739079729"
              className="inline-flex items-center justify-center rounded-full border border-[#2D7A5F]/30 bg-white/70 px-3 py-2 text-[#2D7A5F] text-sm shadow-sm"
              aria-label="Zadzwoń do nas"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-full border border-[#2D7A5F]/30 bg-white/80 p-2 shadow-sm"
              aria-label="Otwórz menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#2D7A5F]" />
              ) : (
                <Menu className="w-5 h-5 text-[#2D7A5F]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="mt-4 lg:hidden rounded-3xl border border-[#2D7A5F]/12 bg-white shadow-2xl overflow-hidden">
            <nav className="flex flex-col text-[15px] divide-y divide-[#2D7A5F]/8">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                Strona główna
              </Link>

              {/* Oferta (mobile): klik "Oferta" -> scroll do sekcji, chevron -> rozwija listę podstron */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setShowOfertaMenu((prev) => !prev)}
                  className="flex items-center justify-between px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
                >
                  <span>Oferta</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showOfertaMenu ? "rotate-180" : ""}`}
                  />
                </button>

                

                {showOfertaMenu && (
                  <div className="bg-[#F5F1E8]/70 pb-2">
                    

                    {/* linki do podstron szczegółów */}
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

              <Link
                to="/o-nas"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                O nas
              </Link>
              <Link
                to="/kalkulator"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                Kalkulator ubezpieczeń
              </Link>
              <Link
                to="/blog"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/realizacje-z-lotu-drona"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                Realizacje z lotu drona
              </Link>
              <Link
                to="/kontakt"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#2D7A5F] hover:bg-[#2D7A5F]/4 transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
