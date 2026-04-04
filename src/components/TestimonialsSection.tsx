import { useEffect, useRef, useState, useCallback } from "react";
import { usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const HOME_PAGE_ID = 2688;

type AcfData = Record<string, string | undefined>;

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);       // obserwowany przez IntersectionObserver
  const widgetContainerRef = useRef<HTMLDivElement>(null); // tu trafia skrypt

  const [texts, setTexts] = useState<AcfData>({});
  const [isVisible, setIsVisible] = useState(false);  // czy sekcja weszła w viewport
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false); // czy widget już wyrenderował treść

  const { fetchWithLoader } = usePageLoader();

  const loadTestData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?_fields=acf`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("Testimonials error:", e);
      }
    });
  }, [fetchWithLoader]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  // --- KROK 1: Obserwuj sekcję — odpal dopiero gdy użytkownik do niej dotrze ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // zacznij ładować 300px przed wejściem w viewport
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // --- KROK 2: Gdy sekcja widoczna — załaduj skrypt i obserwuj kiedy widget gotowy ---
  useEffect(() => {
    if (!isVisible || !widgetContainerRef.current) return;
    if (widgetContainerRef.current.querySelector("script[src*='trustindex']")) return;

    const container = widgetContainerRef.current;

    // Czekaj na treść wstrzykniętą przez Trustindex — wtedy chowamy skeleton
    const domObserver = new MutationObserver(() => {
      const hasContent = Array.from(container.childNodes).some(
        (node) => node.nodeName !== "SCRIPT"
      );
      if (hasContent) {
        setIsWidgetLoaded(true);
        domObserver.disconnect();
      }
    });
    domObserver.observe(container, { childList: true, subtree: true });

    // Fallback: po 10s skeleton znika tak czy inaczej
    const timeout = setTimeout(() => {
      setIsWidgetLoaded(true);
      domObserver.disconnect();
    }, 10000);

    // Oryginalna działająca logika — skrypt do kontenera
    const script = document.createElement("script");
    script.src = "https://cdn.trustindex.io/loader.js?485f04e622c45705212658e61ee";
    script.defer = true;
    script.async = true;
    container.appendChild(script);

    return () => {
      clearTimeout(timeout);
      domObserver.disconnect();
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-28 lg:py-32 bg-[#F5F1E8] overflow-hidden"
    >
      <div className="pointer-events-none hidden md:block absolute -top-24 -left-24 w-80 h-80 bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* NAGŁÓWEK SEKCJI */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
          {texts.testim_badge && (
            <div className="inline-block mb-5 sm:mb-6">
              <span className="text-[#2D7A5F] uppercase tracking-widest text-xs sm:text-sm bg-[#2D7A5F]/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
                {texts.testim_badge}
              </span>
            </div>
          )}

          <h2 className="text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-5">
            {texts.testim_title}
          </h2>

          <p className="text-[#2D7A5F]/70 text-sm sm:text-base lg:text-lg leading-relaxed">
            {texts.testim_desc}
          </p>
        </div>

        {/* SKELETON — tylko gdy sekcja weszła w viewport ALE widget jeszcze nie gotowy */}
        {isVisible && !isWidgetLoaded && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#2D7A5F]/10 animate-pulse"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2 mb-5">
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                  <div className="h-3 bg-gray-200 rounded-full w-4/6" />
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-gray-200 rounded-full w-2/4" />
                    <div className="h-2.5 bg-gray-200 rounded-full w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KONTENER WIDGETU — zawsze w DOM żeby skrypt miał gdzie trafić */}
        <div ref={widgetContainerRef} className="w-full" />

        {/* Link do Google Maps */}
        {texts.testim_link_text && (
          <div className="mt-16 text-center">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2D7A5F] font-semibold hover:underline"
            >
              {texts.testim_link_text}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}