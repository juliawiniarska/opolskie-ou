import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  Heart,
  Home,
  Plane,
  Briefcase,
  Tractor,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const OFFERS_PAGE_ID = 2690; // <--- WPISZ TU ID STRONY "[EDYCJA] Oferty"
const GLOBAL_SETTINGS_ID = 2756; // <--- ID strony Globalnej

type Offer = {
  id: number; // 1-6
  slug: string;
  icon: LucideIcon;
  // Domyślne wartości (gdyby API nie działało)
  defaultTitle: string;
  defaultSubtitle: string;
  defaultDesc: string;
  defaultFeatures: string[];
};

// Struktura "szkieletu" - ikony i slugi są stałe
const offersStructure: Offer[] = [
  {
    id: 1,
    slug: "ubezpieczenia-komunikacyjne",
    icon: Car,
    defaultTitle: "Ubezpieczenia komunikacyjne",
    defaultSubtitle: "OC, AC, NNW, Assistance",
    defaultDesc: "Kompleksowa ochrona Twojego pojazdu.",
    defaultFeatures: ["Porównanie ofert 20+ firm", "Rabaty dla bezpiecznych kierowców", "Pomoc w razie kolizji"],
  },
  {
    id: 2,
    slug: "ubezpieczenia-osobowe",
    icon: Heart,
    defaultTitle: "Ubezpieczenia osobowe",
    defaultSubtitle: "Życie, zdrowie, bezpieczeństwo",
    defaultDesc: "Zabezpieczenie dla Ciebie i rodziny.",
    defaultFeatures: ["Ubezpieczenie na życie", "Pakiety zdrowotne", "Ochrona NNW"],
  },
  {
    id: 3,
    slug: "ubezpieczenia-majatkowe",
    icon: Home,
    defaultTitle: "Ubezpieczenia majątkowe",
    defaultSubtitle: "Dom, mieszkanie",
    defaultDesc: "Ochrona Twojego majątku.",
    defaultFeatures: ["Ubezpieczenie budynku", "Ochrona wyposażenia", "Assistance domowy"],
  },
  {
    id: 4,
    slug: "ubezpieczenia-turystyczne",
    icon: Plane,
    defaultTitle: "Ubezpieczenia turystyczne",
    defaultSubtitle: "Wyjazdy, wakacje, podróże",
    defaultDesc: "Bezpieczne podróże po świecie.",
    defaultFeatures: ["Koszty leczenia za granicą", "Ubezpieczenie bagażu", "OC w podróży"],
  },
  {
    id: 5,
    slug: "ubezpieczenia-firmowe",
    icon: Briefcase,
    defaultTitle: "Ubezpieczenia firmowe",
    defaultSubtitle: "Ochrona Twojego biznesu",
    defaultDesc: "Kompleksowa ochrona firmy.",
    defaultFeatures: ["OC działalności", "Mienie firmowe", "Ubezpieczenia pracowników"],
  },
  {
    id: 6,
    slug: "ubezpieczenia-rolne",
    icon: Tractor,
    defaultTitle: "Ubezpieczenia rolne",
    defaultSubtitle: "Ochrona Twojego gospodarstwa",
    defaultDesc: "Specjalizacja w sektorze rolnym.",
    defaultFeatures: ["Ubezpieczenie upraw", "Ochrona budynków", "Maszyny i sprzęt"],
  },
];

export default function OfertaPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [texts, setTexts] = useState<any>({});
  const [global, setGlobal] = useState<any>({});

  // Mobile detection
  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < 768);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Fetch Page Data
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${OFFERS_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) { console.error(e); }
    };
    fetchPage();
  }, []);

  // Fetch Global Data
  useEffect(() => {
    const fetchGlobal = async () => {
      if (GLOBAL_SETTINGS_ID === 2756) return;
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) { console.error(e); }
    };
    fetchGlobal();
  }, []);

  const getPhone = () => global.global_phone || "739 079 729";

  return (
    <main className="bg-[#F5F1E8]">
      <section className="relative overflow-hidden pt-24 pb-16 sm:pb-20 lg:pb-24">
        {/* tło */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff_0,_#F5F1E8_45%,_#E8E1D4_100%)]" />
        <div className="pointer-events-none absolute top-[-120px] right-[-160px] w-[420px] h-[420px] lg:w-[700px] lg:h-[700px] bg-[#2D7A5F]/6 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-160px] left-[-180px] w-[360px] h-[360px] lg:w-[560px] lg:h-[560px] bg-[#2D7A5F]/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* nagłówek */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#2D7A5F]/15 bg-white/80 px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#2D7A5F] shadow-sm shadow-[#2D7A5F]/10">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2D7A5F]/10">
                <Shield className="h-3.5 w-3.5 text-[#2D7A5F]" />
              </span>
              {texts.offer_hero_badge || "Oferta ubezpieczeń"}
            </p>

            <h1 className="mt-6 text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
              {texts.offer_hero_title || "Wszystko czego potrzebujesz w jednym miejscu"}
            </h1>
            <p className="mt-5 text-[#2D7A5F]/70 text-base sm:text-lg lg:text-xl leading-relaxed">
              {texts.offer_hero_desc || "Wybierz kategorię i przejdź do szczegółów. Porównujemy oferty i dobieramy polisę do Twoich potrzeb."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${getPhone().replace(/\s/g, "")}`}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#2D7A5F] px-8 py-4 text-white shadow-xl shadow-[#2D7A5F]/25 transition-all hover:bg-[#1F5A43]"
              >
                Zadzwoń: {getPhone()}
              </a>
              <a
                href="/#kalkulator"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-[#2D7A5F] bg-white px-8 py-4 text-[#2D7A5F] shadow-lg hover:bg-[#2D7A5F]/5 transition-colors"
              >
                {texts.offer_btn_calc || "Kalkulator online"}
              </a>
            </div>
          </div>

          {/* grid */}
          <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {offersStructure.map((o, index) => {
              const Icon = o.icon;
              const isActiveMobile = isMobile && activeIndex === index;

              // Pobieranie danych z ACF
              const title = texts[`offer_${o.id}_title`] || o.defaultTitle;
              const subtitle = texts[`offer_${o.id}_subtitle`] || o.defaultSubtitle;
              const desc = texts[`offer_${o.id}_short_desc`] || o.defaultDesc;
              const rawFeat = texts[`offer_${o.id}_list_features`];
              const features = rawFeat 
                ? rawFeat.split('\n').filter((l: string) => l.trim() !== '') 
                : o.defaultFeatures;

              return (
                <Link
                  key={o.slug}
                  to={`/oferta/${o.slug}`}
                  onClick={(e) => {
                    if (isMobile && activeIndex !== index) {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  className={`
                    group rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10
                    transition-all duration-500 shadow-xl hover:shadow-2xl
                    hover:-translate-y-2 border border-[#2D7A5F]/10 relative overflow-hidden
                    ${isActiveMobile ? "bg-[#2D7A5F] -translate-y-2 shadow-2xl" : "bg-white hover:bg-[#2D7A5F]"}
                  `}
                >
                  <div
                    className={`
                      absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full
                      -translate-y-16 sm:-translate-y-20 translate-x-16 sm:translate-x-20 transition-colors
                      ${isActiveMobile ? "bg-white/10" : "bg-[#2D7A5F]/5 group-hover:bg-white/10"}
                    `}
                  />

                  <div className="relative space-y-5 sm:space-y-6">
                    <div
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-colors
                        ${isActiveMobile ? "bg-white/20" : "bg-[#2D7A5F]/10 group-hover:bg-white/20"}
                      `}
                    >
                      <Icon
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 transition-colors
                          ${isActiveMobile ? "text-white" : "text-[#2D7A5F] group-hover:text-white"}
                        `}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="space-y-2.5 sm:space-y-3">
                      <div
                        className={`
                          text-xs sm:text-sm uppercase tracking-wider transition-colors
                          ${isActiveMobile ? "text-white/70" : "text-[#2D7A5F]/60 group-hover:text-white/70"}
                        `}
                      >
                        {subtitle}
                      </div>
                      <h3
                        className={`
                          text-xl sm:text-2xl leading-tight transition-colors
                          ${isActiveMobile ? "text-white" : "text-[#2D7A5F] group-hover:text-white"}
                        `}
                      >
                        {title}
                      </h3>
                      <p
                        className={`
                          text-sm sm:text-base leading-relaxed transition-colors
                          ${isActiveMobile ? "text-white/90" : "text-[#2D7A5F]/70 group-hover:text-white/90"}
                        `}
                      >
                        {desc}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2">
                      {features.map((f: string, i: number) => (
                        <li
                          key={i}
                          className={`
                            flex items-center gap-3 text-sm transition-colors
                            ${isActiveMobile ? "text-white/90" : "text-[#2D7A5F]/80 group-hover:text-white/90"}
                          `}
                        >
                          <span
                            className={`
                              w-1.5 h-1.5 rounded-full
                              ${isActiveMobile ? "bg-white" : "bg-[#2D7A5F] group-hover:bg-white"}
                            `}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`
                        inline-flex items-center gap-3 pt-2 transition-colors
                        ${isActiveMobile ? "text-white" : "text-[#2D7A5F] group-hover:text-white"}
                      `}
                    >
                      <span className="text-sm sm:text-base">Zobacz szczegóły</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-14 lg:mt-16">
            {/* Shortcodes */}
          </div>
        </div>
      </section>
    </main>
  );
}