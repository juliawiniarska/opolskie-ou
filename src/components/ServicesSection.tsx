import { ArrowRight, Car, Users, Home, Plane, Briefcase, Tractor } from "lucide-react";

const services = [
  {
    icon: Car,
    category: "Ubezpieczenia komunikacyjne",
    title: "Ochrona Twojego pojazdu",
    description: "OC, AC, NNW, assistance – kompleksowa ochrona dla każdego kierowcy. Porównujemy oferty i znajdujemy najlepsze warunki.",
  },
  {
    icon: Users,
    category: "Ubezpieczenia osobowe",
    title: "Bezpieczeństwo Ciebie i bliskich",
    description: "Ubezpieczenia na życie, zdrowotne i od następstw nieszczęśliwych wypadków. Zabezpiecz przyszłość swojej rodziny.",
  },
  {
    icon: Home,
    category: "Ubezpieczenia majątkowe",
    title: "Ochrona Twojego domu i majątku",
    description: "Ubezpieczenia domów, mieszkań i wartościowego mienia. Pełna ochrona przed nieprzewidzianymi zdarzeniami.",
  },
  {
    icon: Plane,
    category: "Ubezpieczenia turystyczne",
    title: "Bezpieczne podróże",
    description: "Kompleksowa ochrona podczas wyjazdów krajowych i zagranicznych. Koszty leczenia, bagaż, OC i assistance.",
  },
  {
    icon: Briefcase,
    category: "Ubezpieczenia firmowe",
    title: "Ochrona Twojego biznesu",
    description: "OC działalności, mienie firmowe, ubezpieczenia pracowników. Dopasowane rozwiązania dla każdej branży.",
  },
  {
    icon: Tractor,
    category: "Ubezpieczenia rolne",
    title: "Specjalizacja w sektorze rolnym",
    description: "Ubezpieczenia gospodarstw rolnych, maszyn i budynków. Wsparcie w programach dopłat i dotacji.",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#0A1628]">
            Nasze kompleksowe usługi ubezpieczeniowe
          </h2>
          <p className="text-[#0A1628]/70 text-lg max-w-2xl mx-auto">
            Oferujemy pełen zakres ubezpieczeń dla osób prywatnych, firm i gospodarstw rolnych
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.category}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:border-[#2D7A5F] transition-colors shadow-sm"
            >
              <div className="space-y-4">
                <service.icon className="w-10 h-10 text-[#2D7A5F]" strokeWidth={1.5} />
                
                <div className="space-y-2">
                  <p className="text-[#2D7A5F] text-sm uppercase tracking-wide">
                    {service.category}
                  </p>
                  <h3 className="text-[#0A1628]">
                    {service.title}
                  </h3>
                </div>

                <p className="text-[#0A1628]/70 leading-relaxed">
                  {service.description}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#2D7A5F] hover:gap-3 transition-all group"
                >
                  <span>Sprawdź ofertę</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
