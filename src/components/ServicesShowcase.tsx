import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { offers } from "../data/offers";

const insurers = [
  { name: "PZU", logo: "/logos/pzu.png" },
  { name: "Agro Ubezpieczenia", logo: "/insurers/agro.png" },
  { name: "Allianz", logo: "/insurers/allianz.png" },
  { name: "Benefia", logo: "/insurers/benefia.png" },
  { name: "Compensa", logo: "/insurers/compensa.png" },
  { name: "ERGO Hestia", logo: "/insurers/ergo-hestia.png" },
  { name: "Generali", logo: "/insurers/generali.png" },
  { name: "InterRisk", logo: "/insurers/interrisk.png" },
  { name: "Wiener", logo: "/insurers/wiener.png" },
  { name: "Link4", logo: "/insurers/link4.png" },
  { name: "Warta", logo: "/insurers/warta.png" },
  { name: "Uniqa", logo: "/insurers/uniqa.png" },
  { name: "Proama", logo: "/insurers/proama.png" },
];

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [logoStart, setLogoStart] = useState(0);

  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < 768);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLogoStart((prev) => (prev + 1) % insurers.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const visibleCount = 5;
  const visibleInsurers = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, i) => insurers[(logoStart + i) % insurers.length]);
  }, [logoStart]);

  const handlePrev = () => setLogoStart((prev) => (prev - 1 + insurers.length) % insurers.length);
  const handleNext = () => setLogoStart((prev) => (prev + 1) % insurers.length);

  return (
    <section id="oferta" className="py-24 sm:py-28 lg:py-32 bg-[#F5F1E8] relative">
      <div className="hidden md:block absolute top-20 -right-40 w-72 h-72 lg:w-96 lg:h-96 bg-[#2D7A5F]/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute -bottom-40 -left-40 w-72 h-72 lg:w-96 lg:h-96 bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center mb-14 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-5 sm:mb-6">
            <span className="text-[#2D7A5F] uppercase tracking-widest text-xs sm:text-sm bg-[#2D7A5F]/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
              Kompleksowa oferta
            </span>
          </div>
          <h2 className="text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 sm:mb-6">
            Wybierz rodzaj ubezpieczenia
          </h2>
          <p className="text-[#2D7A5F]/70 text-base sm:text-lg lg:text-xl leading-relaxed">
            Kliknij kafelek, aby przejść do szczegółów i zobaczyć przykładowy zakres ochrony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((service, index) => {
            const Icon = service.icon;
            const isActiveMobile = isMobile && activeIndex === index;

            return (
              <Link
                key={service.slug}
                to={`/oferta/${service.slug}`}
                onClick={(e) => {
                  // mobile: 1 tap = „hover”, 2 tap = przejście
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
                      {service.subtitle}
                    </div>
                    <h3
                      className={`
                        text-xl sm:text-2xl leading-tight transition-colors
                        ${isActiveMobile ? "text-white" : "text-[#2D7A5F] group-hover:text-white"}
                      `}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`
                        text-sm sm:text-base leading-relaxed transition-colors
                        ${isActiveMobile ? "text-white/90" : "text-[#2D7A5F]/70 group-hover:text-white/90"}
                      `}
                    >
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-3 sm:pt-4">
                    {service.features.map((feature) => (
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

        {/* Logo carousel (zostaje jak masz) */}
        <div className="mt-12 md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {insurers.map((insurer) => (
              <div key={insurer.name} className="basis-1/3 min-w-[33%] flex-shrink-0 flex justify-center">
                <div className="h-20 w-full max-w-[120px] rounded-2xl bg-white border border-[#2D7A5F]/10 flex items-center justify-center">
                  <img src={insurer.logo} alt={insurer.name} className="max-h-10 w-auto object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 hidden md:block">
          <div className="rounded-3xl bg-[#2D7A5F]/5 px-6 py-6 lg:px-8 lg:py-7">
            <div className="flex items-center justify-center gap-6 lg:gap-8">
              {visibleInsurers.map((insurer) => (
                <div key={insurer.name} className="flex-1 max-w-[180px] flex justify-center">
                  <div className="h-24 lg:h-28 w-full rounded-3xl bg-white border border-[#2D7A5F]/10 flex items-center justify-center">
                    <img src={insurer.logo} alt={insurer.name} className="max-h-16 w-auto object-contain" />
                  </div>
                </div>
              ))}
            </div>

            {/* USUWAMY kropki — zostawiamy same strzałki POD spodem */}
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
      </div>
    </section>
  );
}
