import React from "react";
import {
  Phone,
  Mail,
  Calculator,
  Car,
  Home,
  Plane,
  Heart,
  ExternalLink,
  Shield,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Bike,
  CheckCircle,
} from "lucide-react";

const CUK_CODE = "28da35012d1947390118";
const CUK_UTM = `utm_source=linkdoradca&utm_medium=referral&kod=${CUK_CODE}`;

function withCukRef(url: string) {
  return url.includes("?") ? `${url}&${CUK_UTM}` : `${url}?${CUK_UTM}`;
}

type CalcCard = {
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  bullets: string[];
  category: string;
};

const calculators: CalcCard[] = [
  {
    title: "Kalkulator OC i AC",
    description: "Oblicz składkę na ubezpieczenie samochodu i porównaj warianty.",
    href: withCukRef("https://cuk.pl/samochod/kalkulator_oc_i_ac"),
    Icon: Car,
    category: "Komunikacyjne",
    bullets: [
      "Przygotuj dane kierowcy i auta",
      "Porównuj AC: udział własny i wyłączenia",
      "Sprawdź limity w Assistance",
    ],
  },
  {
    title: "Kalkulator domu i mieszkania",
    description: "Sprawdź, ile kosztuje ochrona nieruchomości, wyposażenia i dodatków.",
    href: withCukRef("https://cuk.pl/kalkulator-ubezpieczenia-mieszkania-i-domu"),
    Icon: Home,
    category: "Majątkowe",
    bullets: [
      "Wybierz zakres: mury / ruchomości / OC",
      "Dobierz ryzyka: zalanie, ogień, kradzież…",
      "Ustal realne sumy ubezpieczenia",
    ],
  },
  {
    title: "Kalkulator ubezpieczenia turystycznego",
    description:
      "Poznaj cenę polisy na wakacje i wyjazdy służbowe (KL, NNW, OC i dodatki).",
    href: withCukRef("https://cuk.pl/kalkulator-ubezpieczen-turystycznych"),
    Icon: Plane,
    category: "Turystyczne",
    bullets: [
      "Daty, kierunek i liczba osób",
      "Dobierz dodatki (sport / praca / sprzęt)",
      "Sprawdź koszty leczenia i transportu",
    ],
  },
  {
    title: "Kalkulator ubezpieczeń na życie",
    description:
      "Dowiedz się, ile zapłacisz za ochronę siebie i bliskich — różne warianty i dodatki.",
    href: withCukRef("https://cuk.pl/na-zycie/kalkulator-ubezpieczenia-na-zycie"),
    Icon: Heart,
    category: "Osobowe",
    bullets: [
      "Ustal priorytet: zdrowie / rodzina / kredyt",
      "Sprawdź karencje, limity i wyłączenia",
      "Dobierz rozszerzenia (hospitalizacja, NNW)",
    ],
  },
  {
    title: "Kalkulator ubezpieczenia motocykla",
    description:
      "Porównaj oferty ochrony dla swojego jednośladu i sprawdź składkę OC.",
    href: withCukRef("https://cuk.pl/motocykl/kalkulator_oc"),
    Icon: Bike,
    category: "Komunikacyjne",
    bullets: [
      "Wpisz dane motocykla i kierowcy",
      "Porównuj zakres i warunki",
      "Zwróć uwagę na zniżki/historię szkód",
    ],
  },
  {
    title: "Kalkulator ubezpieczeń rowerowych",
    description:
      "Sprawdź koszt zabezpieczenia roweru przed kradzieżą i uszkodzeniem.",
    href: withCukRef("https://cuk.pl/ubezpieczenie-roweru/kalkulator"),
    Icon: ShieldCheck,
    category: "Majątkowe",
    bullets: [
      "Wybierz wariant ochrony (kradzież/uszkodzenie)",
      "Zwróć uwagę na miejsce przechowywania",
      "Sprawdź limity i wymagania zabezpieczeń",
    ],
  },
  {
    title: "Kalkulator „Bezpieczni w drodze”",
    description:
      "Wybierz optymalną ochronę na każdą podróż — szybka wycena i warianty.",
    href: withCukRef("https://cuk.pl/bezpieczni-w-drodze/kalkulator"),
    Icon: Shield,
    category: "Turystyczne",
    bullets: [
      "Wybierz wariant dopasowany do podróży",
      "Sprawdź zakres świadczeń i limity",
      "Porównaj różnice w opcjach dodatkowych",
    ],
  },
  {
    title: "Kalkulator NNW Szkolne",
    description: "Oblicz składkę na ubezpieczenie NNW dla uczniów.",
    href: withCukRef("https://cuk.pl/nnw-szkolne/kalkulator"),
    Icon: GraduationCap,
    category: "Osobowe",
    bullets: [
      "Dobierz sumę ubezpieczenia i zakres",
      "Sprawdź świadczenia i wyłączenia",
      "Zweryfikuj ochronę w czasie zajęć i poza nimi",
    ],
  },
];

// fallback clamp (gdyby Tailwind line-clamp nie był włączony)
const clampStyle = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines as any,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export default function InsuranceCalculatorPage() {
  return (
    <main className="bg-[#F5F1E8]">
      {/* ✅ HERO — ZOSTAWIONE 1:1 JAK U CIEBIE */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        {/* dekoracje */}
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* breadcrumbs */}
          

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <Calculator className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8">
                Kalkulatory ubezpieczeń online
              </h1>

<p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-3xl">
  Wybierz kalkulator i sprawdź wycenę w kilka minut. Działamy online dla klientów z całej Polski,
  a stacjonarnie pomagamy w Nysie i w województwie opolskim. Porównasz oferty 20+ towarzystw i
  zobaczysz realne koszty polisy jeszcze przed zakupem.
</p>




            
            </div>

            {/* RIGHT — kontakt */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl lg:sticky lg:top-28">
                <h3 className="text-white text-xl sm:text-2xl mb-3">Potrzebujesz pomocy?</h3>
                <p className="text-white/80 leading-relaxed mb-7 sm:mb-8">
                  Zadzwoń lub napisz — przygotujemy warianty i przejdziemy przez szczegóły.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="tel:739079729"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">739 079 729</span>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="mailto:biuro@opolskieubezpieczenia.pl"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Napisz email</span>
                  </a>
                </div>

                <div className="mt-7 sm:mt-8 pt-6 border-t border-white/20">
                  <p className="text-xs text-white/60 leading-relaxed">
                    Kalkulatory otwierają się w nowej karcie. Po wypełnieniu formularza możesz wrócić tutaj i
                    skontaktować się z nami w sprawie najlepszej oferty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ OD TEGO MOMENTU: 1:1 FIGMA (sekcja + karty + tip) */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
        <div className="pointer-events-none absolute top-32 right-1/3 w-16 h-16 bg-[#2D7A5F]/5 rotate-45" />
        <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

        {/* Figma container + Twoje responsywne paddingi */}
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 lg:mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
              <Calculator className="w-4 h-4 text-[#2D7A5F]" />
              <span className="text-sm text-[#2D7A5F] uppercase tracking-wide">
                Dostępne Kalkulatory
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
              Wybierz rodzaj ubezpieczenia
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">
              Każdy kalkulator prowadzi Cię krok po kroku i pokazuje realną cenę polisy
            </p>
          </div>

          {/* Calculators Grid — 1:1 FIGMA */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {calculators.map(({ title, description, href, Icon, bullets, category }) => (
              <a
  key={title}
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col"
>
  {/* Decorative corner element */}
  <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

  {/* Category badge */}
  <div className="relative mb-4 h-6 flex items-center">
    <span className="inline-block text-[11px] text-[#2D7A5F] px-3 py-1 bg-[#2D7A5F]/10 rounded-full uppercase tracking-wide">
      {category}
    </span>
  </div>

  {/* Icon */}
  <div className="relative mb-4 h-14 flex items-center">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-[#2D7A5F]" />
    </div>
  </div>

  {/* Title */}
  <h3
    className="text-xl sm:text-[22px] text-[#1A1A1A] mb-2 leading-tight h-14 line-clamp-2"
    style={clampStyle(2)}
  >
    {title}
  </h3>

  {/* Description */}
  <p
    className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed mb-4 h-16 line-clamp-3"
    style={clampStyle(3)}
  >
    {description}
  </p>

  {/* Divider */}
  <div className="h-px bg-gradient-to-r from-[#2D7A5F]/20 via-[#2D7A5F]/10 to-transparent mb-4" />

  {/* Tips */}
  <div className="mb-4 flex-1">
    <p className="text-[11px] uppercase tracking-wider text-[#2D7A5F]/60 mb-3">
      Co przygotować / Na co patrzeć
    </p>
    <ul className="space-y-2">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
          <div className="w-4 h-4 rounded-full bg-[#2D7A5F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="w-3 h-3 text-[#2D7A5F]" />
          </div>
          <span className="leading-relaxed line-clamp-2" style={clampStyle(2)}>
            {bullet}
          </span>
        </li>
      ))}
    </ul>
  </div>

  {/* CTA */}
  <div className="flex items-center justify-between pt-3 border-t border-[#2D7A5F]/10 mt-auto">
    <span className="text-[#2D7A5F] group-hover:translate-x-1 transition-transform text-sm sm:text-base">
      Otwórz kalkulator
    </span>
    <div className="flex items-center gap-2">
      <ArrowRight className="w-4 h-4 text-[#2D7A5F] group-hover:translate-x-1 transition-transform" />
      <ExternalLink className="w-4 h-4 text-[#2D7A5F]/40" />
    </div>
  </div>
</a>

            ))}
          </div>

          {/* Bottom Tip Card — 1:1 FIGMA */}
          <div className="mt-10 sm:mt-12 bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#2D7A5F]/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#2D7A5F]" />
              </div>
              <div>
                <h3 className="text-xl text-[#1A1A1A] mb-3">Wskazówka eksperta</h3>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Porównuj nie tylko cenę, ale i zakres: limity, udział własny i wyłączenia.
                  W OC/AC różnice często wychodzą dopiero w szczegółach, a w turystycznym kluczowe
                  są koszty leczenia oraz transport medyczny. Jeśli masz wątpliwości — zadzwoń,
                  pomożemy wybrać najlepszy wariant.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
