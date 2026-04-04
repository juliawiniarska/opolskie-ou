import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { offers } from "../data/offers";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const OFFERS_PAGE_ID = 2690; 
const HOME_PAGE_ID = 2688; 

type AcfData = Record<string, string | undefined>;

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [logoStart, setLogoStart] = useState(0);
  
  const [texts, setTexts] = useState<AcfData>({});
  const [homeTexts, setHomeTexts] = useState<AcfData>({});
  
  const { loading: loadingOffers, fetchWithLoader: fetchOffers } = usePageLoader();
  const { loading: loadingHome, fetchWithLoader: fetchHome } = usePageLoader();

  const isLoading = loadingOffers || loadingHome;

  const loadOffersData = useCallback(() => {
    fetchOffers(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${OFFERS_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("Błąd pobierania ofert z WP", e);
      }
    });
  }, [fetchOffers]);

  const loadHomeData = useCallback(() => {
    fetchHome(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setHomeTexts(json.acf);
        }
      } catch (e) {
        console.error("Błąd pobierania logotypów z WP", e);
      }
    });
  }, [fetchHome]);

  useEffect(() => {
    loadOffersData();
    loadHomeData();
  }, [loadOffersData, loadHomeData]);

  // Dynamiczne budowanie listy logotypów
  const dynamicInsurers = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 13; i++) {
      const logoUrl = homeTexts[`insurer_${i}_logo`];
      if (logoUrl && typeof logoUrl === 'string' && logoUrl.trim() !== '') {
        list.push({
          name: `Ubezpieczyciel ${i}`,
          logo: logoUrl.trim()
        });
      }
    }
    return list;
  }, [homeTexts]);

  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < 768);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (dynamicInsurers.length === 0) return;
    const id = setInterval(() => {
      setLogoStart((prev) => (prev + 1) % dynamicInsurers.length);
    }, 3500);
    return () => clearInterval(id);
  }, [dynamicInsurers.length]);

  const visibleCount = 5;
  const visibleInsurers = useMemo(() => {
    if (dynamicInsurers.length === 0) return [];
    return Array.from({ length: Math.min(visibleCount, dynamicInsurers.length) }, (_, i) => 
      dynamicInsurers[(logoStart + i) % dynamicInsurers.length]
    );
  }, [logoStart, dynamicInsurers]);

  const handlePrev = () => {
    if (dynamicInsurers.length === 0) return;
    setLogoStart((prev) => (prev - 1 + dynamicInsurers.length) % dynamicInsurers.length);
  };
  
  const handleNext = () => {
    if (dynamicInsurers.length === 0) return;
    setLogoStart((prev) => (prev + 1) % dynamicInsurers.length);
  };

  if (isLoading) return <PageLoader />;

  return (
    <section id="oferta" className="py-24 sm:py-28 lg:py-32 bg-[#F5F1E8] relative">
      <div className="hidden md:block absolute top-20 -right-40 w-72 h-72 lg:w-96 lg:h-96 bg-[#2D7A5F]/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute -bottom-40 -left-40 w-72 h-72 lg:w-96 lg:h-96 bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center mb-14 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-5 sm:mb-6">
            <span className="text-[#2D7A5F] uppercase tracking-widest text-xs sm:text-sm bg-[#2D7A5F]/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
              {texts.offer_hero_badge}
            </span>
          </div>
          <h2 className="text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 sm:mb-6">
            {texts.offer_hero_title}
          </h2>
          <p className="text-[#2D7A5F]/70 text-base sm:text-lg lg:text-xl leading-relaxed">
            {texts.offer_hero_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((service, index) => {
            const Icon = service.icon;
            const isActiveMobile = isMobile && activeIndex === index;
            const acfId = index + 1;

            const title = texts[`offer_${acfId}_title`];
            const subtitle = texts[`offer_${acfId}_subtitle`];
            const description = texts[`offer_${acfId}_short_desc`];

            const rawFeatures = texts[`offer_${acfId}_list_features`];
            const features = rawFeatures 
                ? rawFeatures.split('\n').filter((l: string) => l.trim() !== '') 
                : [];

            return (
              <Link
                key={service.slug}
                to={`/oferta/${service.slug}`}
                onClick={(e) => {
                  if (isMobile && activeIndex !== index) {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className={`
                  group rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10
                  transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2
                  border border-[#2D7A5F]/10 relative overflow-hidden cursor-pointer
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
                      {description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-3 sm:pt-4">
                    {features.map((feature: string) => (
                      <li
                        key={feature}
                        className={`
                          flex items-center gap-3 text-sm transition-colors
                          ${isActiveMobile ? "text-white/90" : "text-[#2D7A5F]/80 group-hover:text-white/90"}
                        `}
                      >
                        <span className={`${isActiveMobile ? "bg-white" : "bg-[#2D7A5F] group-hover:bg-white"} w-1.5 h-1.5 rounded-full`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`
                      inline-flex items-center gap-3 pt-4 transition-colors
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

        {/* Karuzela logo (mobile) */}
        {dynamicInsurers.length > 0 && (
          <div className="mt-12 md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {dynamicInsurers.map((insurer, idx) => (
                <div key={idx} className="basis-1/3 min-w-[33%] flex-shrink-0 flex justify-center">
                  <div className="h-20 w-full max-w-[120px] rounded-2xl bg-white border border-[#2D7A5F]/10 flex items-center justify-center p-2">
                    <img src={insurer.logo} alt={insurer.name} className="max-h-10 w-auto object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Karuzela logo (desktop) */}
        {dynamicInsurers.length > 0 && (
          <div className="mt-16 hidden md:block">
            <div className="rounded-3xl bg-[#2D7A5F]/5 px-6 py-6 lg:px-8 lg:py-7">
              <div className="flex items-center justify-center gap-6 lg:gap-8">
                {visibleInsurers.map((insurer, idx) => (
                  <div key={idx} className="flex-1 max-w-[1800px] flex justify-center">
                    <div className="h-24 lg:h-28 w-full rounded-3xl bg-white border border-[#2D7A5F]/10 flex items-center justify-center p-3">
                      <img src={insurer.logo} alt={insurer.name} className="max-h-16 w-auto object-contain" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="h-9 w-9 rounded-full border border-[#2D7A5F]/20 flex items-center justify-center bg-white hover:bg-[#2D7A5F]/5 transition-colors"
                  aria-label="Poprzednie logotypy"
                >
                  <ChevronLeft className="w-4 h-4 text-[#2D7A5F]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-9 w-9 rounded-full border border-[#2D7A5F]/20 flex items-center justify-center bg-white hover:bg-[#2D7A5F]/5 transition-colors"
                  aria-label="Następne logotypy"
                >
                  <ChevronRight className="w-4 h-4 text-[#2D7A5F]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}