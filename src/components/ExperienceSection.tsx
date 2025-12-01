import { Award, FileCheck, Users, Headphones } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const benefits = [
  {
    icon: Award,
    title: "Licencja KNF i pełne bezpieczeństwo",
    description: "Działamy zgodnie z najwyższymi standardami",
  },
  {
    icon: FileCheck,
    title: "Porównanie 10+ towarzystw",
    description: "Znajdziemy najlepszą ofertę dla Ciebie",
  },
  {
    icon: Users,
    title: "Eksperci z doświadczeniem",
    description: "Ponad 12 lat w branży ubezpieczeniowej",
  },
  {
    icon: Headphones,
    title: "Wsparcie na każdym etapie",
    description: "Od wyboru polisy po likwidację szkody",
  },
];

export function ExperienceSection() {
  return (
<section className="relative py-16 sm:py-24 lg:py-32 bg-[#F5F1E8] overflow-hidden">
      {/* Diagonal split background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Desktop – dokładnie ten sam kształt co wcześniej */}
        <div
          className="hidden lg:block absolute inset-0 bg-[#2D7A5F]"
          style={{
            clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0 85%)",
          }}
        />

        {/* Mobile / tablet – niższe dolne ścięcie + brak dziwnej kreski */}
        <div
          className="block lg:hidden absolute inset-0 bg-[#2D7A5F]"
          style={{
            clipPath: "polygon(0 30%, 100% 10%, 100% 100%, 0 90%)",
          }}
        />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* LEFT – IMAGE + CHMURKI */}
          <div className="relative max-w-xl mx-auto lg:mx-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/img o nas.jpg"
                alt="Wojciech Kurzeja - Ekspert ubezpieczeniowy"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>

     {/* 12+ lat – dolna chmurka, środek na rogu zdjęcia (mobile) */}
<div
  className="
    absolute
    bottom-0 left-10
    translate-x-[-50%] translate-y-[50%]
    sm:translate-x-0 sm:translate-y-0
    sm:-bottom-8 sm:-left-8
    bg-[#F5F1E8]
    rounded-2xl sm:rounded-3xl
    px-4 py-3 sm:px-8 sm:py-6
    shadow-2xl border border-[#2D7A5F]/10
  "
>
  <div className="text-2xl sm:text-4xl md:text-5xl text-[#2D7A5F] mb-1 sm:mb-2">
    12+
  </div>
  <div className="text-[#2D7A5F]/70 text-xs sm:text-lg">
    Lat na rynku
  </div>
</div>

{/* 2500+ klientów – górna chmurka, środek na rogu zdjęcia (mobile) */}
<div
  className="
    absolute
    top-0 right-10
    translate-x-[50%] translate-y-[-50%]
    sm:translate-x-0 sm:translate-y-0
    sm:-top-8 sm:-right-8
    bg-white
    rounded-2xl sm:rounded-3xl
    px-4 py-3 sm:px-8 sm:py-6
    shadow-2xl border border-[#2D7A5F]/10
  "
>
  <div className="text-2xl sm:text-4xl md:text-5xl text-[#2D7A5F] mb-1 sm:mb-2">
    2500+
  </div>
  <div className="text-[#2D7A5F]/70 text-xs sm:text-lg">
    Klientów
  </div>
</div>

          </div>

          {/* RIGHT – CONTENT */}
          <div className="space-y-8 lg:space-y-10 text-white mt-12 lg:mt-0">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block">
                <span className="uppercase tracking-widest text-xs sm:text-sm bg-white/20 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
                  O nas
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Zaufanie zbudowane na doświadczeniu
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
                Opolskie Ubezpieczenia to multiagencja z wieloletnim
                doświadczeniem. Nasz założyciel,{" "}
                <span className="text-[#F5F1E8]">Wojciech Kurzeja</span>,
                specjalizuje się w ubezpieczeniach rolnych i majątkowych,
                pomagając setkom gospodarstw i rodzin zabezpieczyć przyszłość.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-5 sm:p-6 transition-all group border border-white/20"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <benefit.icon
                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h4 className="text-white text-base sm:text-lg mb-1 sm:mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 sm:pt-6">
              <button className="bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all shadow-xl text-base sm:text-lg">
                Dowiedz się więcej
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
