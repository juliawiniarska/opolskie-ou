import { Award, Users, Shield, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Specjalizacja w ubezpieczeniach rolnych i majątkowych",
    description: "Wieloletnie doświadczenie w obsłudze gospodarstw rolnych i dużych nieruchomości",
  },
  {
    icon: Users,
    title: "Porównanie ofert 20+ towarzystw ubezpieczeniowych",
    description: "Oszczędzasz czas i pieniądze – my robimy za Ciebie research rynku",
  },
  {
    icon: Shield,
    title: "Licencja KNF i pełne bezpieczeństwo",
    description: "Działamy zgodnie z przepisami i standardami nadzoru finansowego",
  },
  {
    icon: HeadphonesIcon,
    title: "Wsparcie od doboru polisy po likwidację szkody",
    description: "Jesteśmy z Tobą na każdym etapie – doradztwo, sprzedaż i pomoc w razie wypadku",
  },
];

export function WhyUsSection() {
  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#0A1628] mb-4">
            Dlaczego warto z nami współpracować?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-12 items-start">
          {/* Left: Description */}
          <div className="space-y-6">
            <p className="text-[#0A1628]/80 text-lg leading-relaxed">
              <span className="text-[#2D7A5F]">Opolskie Ubezpieczenia</span> to multiagencja 
              z wieloletnim doświadczeniem w branży ubezpieczeniowej. Posiadamy licencję Komisji 
              Nadzoru Finansowego i współpracujemy z ponad 20 wiodącymi towarzystwami 
              ubezpieczeniowymi w Polsce.
            </p>

            <p className="text-[#0A1628]/80 text-lg leading-relaxed">
              Naszą specjalnością są ubezpieczenia rolne, majątkowe oraz komunikacyjne. 
              Dzięki szerokiej ofercie i indywidualnemu podejściu do każdego klienta, 
              znajdujemy optymalne rozwiązania dopasowane do Twoich potrzeb i budżetu.
            </p>

            <p className="text-[#0A1628]/80 text-lg leading-relaxed">
              Nie musisz tracić czasu na samodzielne porównywanie ofert – robimy to za Ciebie 
              i prezentujemy najlepsze opcje. Obsługujemy klientów z całego województwa 
              opolskiego, oferując spotkania stacjonarne i zdalne.
            </p>
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-[#2D7A5F] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#2D7A5F]/10 rounded-lg p-3 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#2D7A5F]" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[#0A1628]">
                      {feature.title}
                    </h4>
                    <p className="text-[#0A1628]/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
