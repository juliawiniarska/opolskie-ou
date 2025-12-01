import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Calculator,
  FileText,
} from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setActiveIndex((prev) => (prev === index ? null : index));
    }
  };

  return (
    <section className="relative py-24 sm:py-28 lg:py-32 bg-[#2D7A5F] text-white overflow-hidden">
      {/* Decorative elements – tylko na większych ekranach */}
      <div className="pointer-events-none hidden md:block absolute top-0 right-0 w-[420px] h-[420px] lg:w-[600px] lg:h-[600px] bg-white/5 rounded-full blur-3xl" />
      <div className="pointer-events-none hidden md:block absolute bottom-0 left-0 w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] bg-white/5 rounded-full blur-3xl" />

      {/* Geometric shapes – desktop / tablet */}
      <div className="pointer-events-none hidden md:block absolute top-40 right-24 lg:right-60 w-28 h-28 lg:w-40 lg:h-40 border-4 border-white/10 rounded-3xl rotate-12" />
      <div className="pointer-events-none hidden md:block absolute bottom-32 left-10 lg:left-40 w-24 h-24 lg:w-32 lg:h-32 bg-white/5 rounded-2xl -rotate-12" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* Main CTA */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-5 sm:mb-6">
            <span className="text-white uppercase tracking-widest text-xs sm:text-sm bg-white/20 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
              Skontaktuj się
            </span>
          </div>
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 sm:mb-6 max-w-3xl lg:max-w-4xl mx-auto">
            Otrzymaj darmową wycenę
          </h2>
          <p className="text-white/80 text-sm sm:text-base lg:text-xl leading-relaxed max-w-3xl mx-auto">
            Porozmawiajmy o Twoich potrzebach. Znajdziemy najlepsze rozwiązanie.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* Phone Card */}
          {(() => {
            const isActive = activeIndex === 0;
            return (
              <a
                href="tel:739079729"
                onClick={() => handleCardClick(0)}
                className={`
                  group
                  rounded-2xl sm:rounded-3xl
                  p-6 sm:p-7 lg:p-10
                  backdrop-blur-sm
                  border-2
                  transition-all duration-300
                  hover:scale-105
                  ${
                    isActive
                      ? "bg-white border-white scale-105"
                      : "bg-white/10 border-white/20 hover:bg-white hover:border-white"
                  }
                `}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div
                    className={`
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-colors
                      ${
                        isActive
                          ? "bg-[#2D7A5F]"
                          : "bg-white/20 group-hover:bg-[#2D7A5F]"
                      }
                    `}
                  >
                    <Phone
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10
                        ${
                          isActive
                            ? "text-white"
                            : "text-white"
                        }
                      `}
                    />
                  </div>
                  <div>
                    <div
                      className={`
                        text-xs sm:text-sm mb-1 sm:mb-2 transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]/70"
                            : "text-white/70 group-hover:text-[#2D7A5F]/70"
                        }
                      `}
                    >
                      Zadzwoń teraz
                    </div>
                    <div
                      className={`
                        text-2xl sm:text-3xl mb-3 sm:mb-4 transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      739 079 729
                    </div>
                    <div
                      className={`
                        flex items-center gap-2 text-sm sm:text-base transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      <span>Połącz się</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })()}

          {/* Email Card */}
          {(() => {
            const isActive = activeIndex === 1;
            return (
              <a
                href="mailto:biuro@opolskieubezpieczenia.pl"
                onClick={() => handleCardClick(1)}
                className={`
                  group
                  rounded-2xl sm:rounded-3xl
                  p-6 sm:p-7 lg:p-10
                  backdrop-blur-sm
                  border-2
                  transition-all duration-300
                  hover:scale-105
                  ${
                    isActive
                      ? "bg-white border-white scale-105"
                      : "bg-white/10 border-white/20 hover:bg-white hover:border-white"
                  }
                `}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div
                    className={`
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-colors
                      ${
                        isActive
                          ? "bg-[#2D7A5F]"
                          : "bg-white/20 group-hover:bg-[#2D7A5F]"
                      }
                    `}
                  >
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <div
                      className={`
                        text-xs sm:text-sm mb-1 sm:mb-2 transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]/70"
                            : "text-white/70 group-hover:text-[#2D7A5F]/70"
                        }
                      `}
                    >
                      Napisz email
                    </div>
                    <div
                      className={`
                        text-sm sm:text-lg mb-3 sm:mb-4 break-all transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      biuro@opolskieubezpieczenia.pl
                    </div>
                    <div
                      className={`
                        flex items-center gap-2 text-sm sm:text-base transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      <span>Wyślij wiadomość</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })()}

          {/* Calculator Card */}
          {(() => {
            const isActive = activeIndex === 2;
            return (
              <a
                href="#kalkulator"
                onClick={() => handleCardClick(2)}
                className={`
                  group
                  rounded-2xl sm:rounded-3xl
                  p-6 sm:p-7 lg:p-10
                  backdrop-blur-sm
                  border-2
                  transition-all duration-300
                  hover:scale-105
                  ${
                    isActive
                      ? "bg-white border-white scale-105"
                      : "bg-white/10 border-white/20 hover:bg-white hover:border-white"
                  }
                `}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div
                    className={`
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-colors
                      ${
                        isActive
                          ? "bg-[#2D7A5F]"
                          : "bg-white/20 group-hover:bg-[#2D7A5F]"
                      }
                    `}
                  >
                    <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <div
                      className={`
                        text-xs sm:text-sm mb-1 sm:mb-2 transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]/70"
                            : "text-white/70 group-hover:text-[#2D7A5F]/70"
                        }
                      `}
                    >
                      Online
                    </div>
                    <div
                      className={`
                        text-xl sm:text-2xl mb-3 sm:mb-4 transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      Kalkulator ubezpieczeń
                    </div>
                    <div
                      className={`
                        flex items-center gap-2 text-sm sm:text-base transition-colors
                        ${
                          isActive
                            ? "text-[#2D7A5F]"
                            : "text-white group-hover:text-[#2D7A5F]"
                        }
                      `}
                    >
                      <span>Oblicz składkę</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })()}
        </div>

        {/* Bottom info */}
        <div className="pt-8 sm:pt-10 lg:pt-12 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:justify-center gap-6 md:gap-12">
            <div className="flex items-start md:items-center gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 mt-0.5" />
              <div>
                <div className="text-white/70 text-xs sm:text-sm">
                  Nasze biuro
                </div>
                <div className="text-white text-base sm:text-lg">
                  Nysa, województwo opolskie
                </div>
              </div>
            </div>

            <div className="hidden md:block h-10 w-px bg-white/20" />

            <div className="flex items-start md:items-center gap-3 sm:gap-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 mt-0.5" />
              <div>
                <div className="text-white/70 text-xs sm:text-sm">Ekspert</div>
                <div className="text-white text-base sm:text-lg">
                  Wojciech Kurzeja
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
