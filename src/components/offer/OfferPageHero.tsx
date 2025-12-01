import type { ReactNode } from "react";

interface OfferPageHeroProps {
  title: string;
  description: string;
  category: string;
  icon: ReactNode;

  // “Wróć” prowadzi do sekcji oferty na home:
  backTo?: string; // np. "/#oferta"
}

export function OfferPageHero({
  title,
  description,
  icon,
}: OfferPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
      {/* Decorative Geometric Elements (lżejsze na mobile) */}
      <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
      <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
      <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
      <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* Back */}
        

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT */}
          <div className="lg:col-span-8 max-w-4xl">
            {/* Category */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm text-white uppercase tracking-wide">
                {category}
              </span>
            </div> */}

            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
              <div className="text-white">{icon}</div>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
              {title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* RIGHT — mini karta kontaktowa w hero (to co opisałaś) */}
          <div className="lg:col-span-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
              <h3 className="text-white text-lg sm:text-xl mb-2">
                Umów konsultację
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Zadzwoń lub napisz — przygotujemy warianty i przejdziemy przez szczegóły.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:739079729"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-white text-[#2D7A5F] px-5 py-3 font-medium hover:bg-[#F5F1E8] transition-colors"
                >
                  Zadzwoń: 739 079 729
                </a>
                <a
                  href="mailto:biuro@opolskieubezpieczenia.pl"
                  className="w-full inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent text-white px-5 py-3 hover:bg-white/10 transition-colors"
                >
                  Napisz email
                </a>
              </div>

              <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                Odpowiemy i dobierzemy najlepszą opcję do budżetu i potrzeb.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
