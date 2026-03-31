import { useEffect, useRef, useState } from "react";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const HOME_PAGE_ID = 2688;

export function TestimonialsSection() {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [texts, setTexts] = useState<any>({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${HOME_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("Testimonials error:", e);
      }
    };
    fetchPage();
  }, []);

  useEffect(() => {
    // Sprawdzamy, czy kontener istnieje i czy skrypt nie został już dodany
    if (widgetContainerRef.current && !widgetContainerRef.current.querySelector("script[src*='trustindex']")) {
      const script = document.createElement("script");
      script.src = "https://cdn.trustindex.io/loader.js?485f04e622c45705212658e61ee";
      script.defer = true;
      script.async = true;
      widgetContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <section className="relative py-24 sm:py-28 lg:py-32 bg-[#F5F1E8] overflow-hidden">
      {/* delikatna dekoracja tylko na większych ekranach */}
      <div className="pointer-events-none hidden md:block absolute -top-24 -left-24 w-80 h-80 bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* NAGŁÓWEK SEKCJI */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-5 sm:mb-6">
            <span className="text-[#2D7A5F] uppercase tracking-widest text-xs sm:text-sm bg-[#2D7A5F]/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
              {texts.testim_badge || "Opinie klientów"}
            </span>
          </div>

          <h2 className="text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-5">
            {texts.testim_title || "Setki zadowolonych klientów"}
          </h2>

          <p className="text-[#2D7A5F]/70 text-sm sm:text-base lg:text-lg leading-relaxed">
            {texts.testim_desc || "Zobacz, jak oceniają nas klienci oraz jakie oszczędności udało im się uzyskać dzięki dopasowanym ubezpieczeniom."}
          </p>
        </div>

        {/* KONTENER NA WIDGET Z GOOGLE */}
        <div ref={widgetContainerRef} className="w-full min-h-[200px]">
            {/* Skrypt Trustindex wstrzyknie tutaj opinie */}
        </div>
        
        {/* Link do Google Maps dla wiarygodności */}
        <div className="mt-16 text-center">
            <a 
                href="https://www.google.com/maps/place/Multiagencja+Opolskie-Ubezpieczenia/@50.485783,16.1851855,9z/data=!4m10!1m2!2m1!1sOpolskie+Ubezpieczenia!3m6!1s0x4711c572599ab4ed:0xf0f770e9fbb664fb!8m2!3d50.4746679!4d17.336495!15sChZPcG9sc2tpZSBVYmV6cGllY3R6ZW5pYZIBFGluc3VyYW5jZV9hZ2VuY3lfbmV34AEA!16s%2Fg%2F11h0l_5s_7?entry=ttu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2D7A5F] font-semibold hover:underline"
            >
                {texts.testim_link_text || "Zobacz wszystkie opinie na Google"}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
        </div>

      </div>
    </section>
  );
}