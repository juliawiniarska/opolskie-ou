import React, { useEffect, useState } from "react";
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

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";

// 1. ID strony "[EDYCJA] Kalkulator" (treści tej strony)
const PAGE_ID = 2698;

// 2. ID strony "[USTAWIENIA] Globalne"
const GLOBAL_SETTINGS_ID = 2756; 

const CUK_CODE = "28da35012d1947390118";
const CUK_UTM = `utm_source=linkdoradca&utm_medium=referral&kod=${CUK_CODE}`;

function withCukRef(url: string) {
  if (!url) return "#";
  return url.includes("?") ? `${url}&${CUK_UTM}` : `${url}?${CUK_UTM}`;
}

// Typy danych
type CalcCardDef = {
  id: number;
  defaultTitle: string;
  defaultDesc: string;
  defaultHref: string;
  Icon: React.ComponentType<{ className?: string }>;
  defaultBullets: string[];
  category: string;
};

// ZMIANA: Dodano global_address
type GlobalACF = {
  global_phone?: string;
  global_email?: string;
  global_address?: string;
};

type CalcPageACF = {
  // Hero & General
  calc_hero_title?: string;
  calc_hero_desc?: string;
  calc_contact_title?: string;
  calc_contact_desc?: string;
  calc_phone?: string;
  calc_email_btn?: string;
  calc_contact_footer?: string;
  calc_list_badge?: string;
  calc_list_title?: string;
  calc_list_desc?: string;
  calc_tip_title?: string;
  calc_tip_desc?: string;
  
  // Dynamiczne pola dla kafelków (np. calc_1_title, calc_1_bullets)
  [key: string]: any; 
};

const calculatorsIds: CalcCardDef[] = [
  {
    id: 1,
    defaultTitle: "Kalkulator OC i AC",
    defaultDesc: "Oblicz składkę na ubezpieczenie samochodu i porównaj warianty.",
    defaultHref: "https://cuk.pl/samochod/kalkulator_oc_i_ac",
    Icon: Car,
    category: "Komunikacyjne",
    defaultBullets: [
      "Przygotuj dane kierowcy i auta",
      "Porównuj AC: udział własny i wyłączenia",
      "Sprawdź limity w Assistance",
    ],
  },
  {
    id: 2,
    defaultTitle: "Kalkulator domu i mieszkania",
    defaultDesc: "Sprawdź, ile kosztuje ochrona nieruchomości, wyposażenia i dodatków.",
    defaultHref: "https://cuk.pl/kalkulator-ubezpieczenia-mieszkania-i-domu",
    Icon: Home,
    category: "Majątkowe",
    defaultBullets: [
      "Wybierz zakres: mury / ruchomości / OC",
      "Dobierz ryzyka: zalanie, ogień, kradzież…",
      "Ustal realne sumy ubezpieczenia",
    ],
  },
  {
    id: 3,
    defaultTitle: "Kalkulator ubezpieczenia turystycznego",
    defaultDesc: "Poznaj cenę polisy na wakacje i wyjazdy służbowe (KL, NNW, OC i dodatki).",
    defaultHref: "https://cuk.pl/kalkulator-ubezpieczen-turystycznych",
    Icon: Plane,
    category: "Turystyczne",
    defaultBullets: [
      "Daty, kierunek i liczba osób",
      "Dobierz dodatki (sport / praca / sprzęt)",
      "Sprawdź koszty leczenia i transportu",
    ],
  },
  {
    id: 4,
    defaultTitle: "Kalkulator ubezpieczeń na życie",
    defaultDesc: "Dowiedz się, ile zapłacisz za ochronę siebie i bliskich — różne warianty i dodatki.",
    defaultHref: "https://cuk.pl/na-zycie/kalkulator-ubezpieczenia-na-zycie",
    Icon: Heart,
    category: "Osobowe",
    defaultBullets: [
      "Ustal priorytet: zdrowie / rodzina / kredyt",
      "Sprawdź karencje, limity i wyłączenia",
      "Dobierz rozszerzenia (hospitalizacja, NNW)",
    ],
  },
  {
    id: 5,
    defaultTitle: "Kalkulator ubezpieczenia motocykla",
    defaultDesc: "Porównaj oferty ochrony dla swojego jednośladu i sprawdź składkę OC.",
    defaultHref: "https://cuk.pl/motocykl/kalkulator_oc",
    Icon: Bike,
    category: "Komunikacyjne",
    defaultBullets: [
      "Wpisz dane motocykla i kierowcy",
      "Porównuj zakres i warunki",
      "Zwróć uwagę na zniżki/historię szkód",
    ],
  },
  {
    id: 6,
    defaultTitle: "Kalkulator ubezpieczeń rowerowych",
    defaultDesc: "Sprawdź koszt zabezpieczenia roweru przed kradzieżą i uszkodzeniem.",
    defaultHref: "https://cuk.pl/ubezpieczenie-roweru/kalkulator",
    Icon: ShieldCheck,
    category: "Majątkowe",
    defaultBullets: [
      "Wybierz wariant ochrony (kradzież/uszkodzenie)",
      "Zwróć uwagę na miejsce przechowywania",
      "Sprawdź limity i wymagania zabezpieczeń",
    ],
  },
  {
    id: 7,
    defaultTitle: "Kalkulator „Bezpieczni w drodze”",
    defaultDesc: "Wybierz optymalną ochronę na każdą podróż — szybka wycena i warianty.",
    defaultHref: "https://cuk.pl/bezpieczni-w-drodze/kalkulator",
    Icon: Shield,
    category: "Turystyczne",
    defaultBullets: [
      "Wybierz wariant dopasowany do podróży",
      "Sprawdź zakres świadczeń i limity",
      "Porównaj różnice w opcjach dodatkowych",
    ],
  },
  {
    id: 8,
    defaultTitle: "Kalkulator NNW Szkolne",
    defaultDesc: "Oblicz składkę na ubezpieczenie NNW dla uczniów.",
    defaultHref: "https://cuk.pl/nnw-szkolne/kalkulator",
    Icon: GraduationCap,
    category: "Osobowe",
    defaultBullets: [
      "Dobierz sumę ubezpieczenia i zakres",
      "Sprawdź świadczenia i wyłączenia",
      "Zweryfikuj ochronę w czasie zajęć i poza nimi",
    ],
  },
];

const clampStyle = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines as any,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export default function InsuranceCalculatorPage() {
  const [texts, setTexts] = useState<CalcPageACF>({});
  const [global, setGlobal] = useState<GlobalACF>({});

  // 1. Pobieranie danych STRONY
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const url = `${WP_BASE}/wp-json/wp/v2/pages/${PAGE_ID}?_fields=acf`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (json.acf) setTexts(json.acf);
      } catch (e) {
        console.error("Błąd pobierania treści strony", e);
      }
    };
    fetchPage();
  }, []);

  // 2. Pobieranie danych GLOBALNYCH
  useEffect(() => {
    const fetchGlobal = async () => {
      if (GLOBAL_SETTINGS_ID === 2756) return; 

      try {
        const url = `${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (json.acf) setGlobal(json.acf);
      } catch (e) {
        console.error("Błąd pobierania ustawień globalnych", e);
      }
    };
    fetchGlobal();
  }, []);

  // Helpers
  const getPhone = () => global.global_phone || "739 079 729";
  const getEmail = () => global.global_email || "biuro@opolskieubezpieczenia.pl";

  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO */}
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        {/* Dekoracje tła - identyczne jak w AboutPage */}
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT - Układ 8 kolumn (jak w O Nas) */}
            <div className="lg:col-span-8 max-w-4xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <Calculator className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                {texts.calc_hero_title || "Kalkulatory ubezpieczeń online"}
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl whitespace-pre-wrap">
                {texts.calc_hero_desc || "Wybierz kalkulator i sprawdź wycenę w kilka minut. Działamy online dla klientów z całej Polski, a stacjonarnie pomagamy w Nysie i w województwie opolskim. Porównasz oferty 20+ towarzystw i zobaczysz realne koszty polisy jeszcze przed zakupem."}
              </p>
            </div>

            {/* RIGHT - Układ 4 kolumny (jak w O Nas) */}
            <div className="lg:col-span-4">
              {/* Usunięto sticky, paddingi i style przycisków dopasowane 1:1 do AboutPage */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
                <h3 className="text-white text-lg sm:text-xl mb-2">
                  {texts.calc_contact_title || "Potrzebujesz pomocy?"}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {texts.calc_contact_desc || "Zadzwoń lub napisz — przygotujemy warianty i przejdziemy przez szczegóły."}
                </p>

                <div className="space-y-3">
                  <a
                    href={`tel:${getPhone().replace(/\s/g, "")}`}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-white text-[#2D7A5F] px-5 py-3 font-medium hover:bg-[#F5F1E8] transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" /> {getPhone()}
                  </a>

                  <a
                    href={`mailto:${getEmail()}`}
                    className="w-full inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent text-white px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" /> {texts.calc_email_btn || "Napisz email"}
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                   {texts.calc_contact_footer || "Kalkulatory otwierają się w nowej karcie. Po wypełnieniu formularza możesz wrócić tutaj i skontaktować się z nami w sprawie najlepszej oferty."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKCJA KAFELKÓW */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
        <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
        <div className="pointer-events-none absolute top-32 right-1/3 w-16 h-16 bg-[#2D7A5F]/5 rotate-45" />
        <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-10 sm:mb-14 lg:mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
              <Calculator className="w-4 h-4 text-[#2D7A5F]" />
              <span className="text-sm text-[#2D7A5F] uppercase tracking-wide">
                {texts.calc_list_badge || "Dostępne Kalkulatory"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
              {texts.calc_list_title || "Wybierz rodzaj ubezpieczenia"}
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">
              {texts.calc_list_desc || "Każdy kalkulator prowadzi Cię krok po kroku i pokazuje realną cenę polisy"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {calculatorsIds.map(({ id, defaultTitle, defaultDesc, defaultHref, Icon, defaultBullets, category }) => {
              
              // Pobieranie danych z ACF (jeśli są, jeśli nie - default)
              const title = texts[`calc_${id}_title`] || defaultTitle;
              const description = texts[`calc_${id}_desc`] || defaultDesc;
              const rawHref = texts[`calc_${id}_url`] || defaultHref;
              const href = withCukRef(rawHref);

              // Bullet points: jeśli z ACF, dzielimy po nowej linii
              const rawBullets = texts[`calc_${id}_bullets`];
              const bullets = rawBullets 
                ? rawBullets.split('\n').filter((line: string) => line.trim() !== '') 
                : defaultBullets;

              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col"
                >
                  <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

                  <div className="relative mb-4 h-6 flex items-center">
                    <span className="inline-block text-[11px] text-[#2D7A5F] px-3 py-1 bg-[#2D7A5F]/10 rounded-full uppercase tracking-wide">
                      {category}
                    </span>
                  </div>

                  <div className="relative mb-4 h-14 flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-[#2D7A5F]" />
                    </div>
                  </div>

                  <h3
                    className="text-xl sm:text-[22px] text-[#1A1A1A] mb-2 leading-tight h-14 line-clamp-2"
                    style={clampStyle(2)}
                  >
                    {title}
                  </h3>

                  <p
                    className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed mb-4 h-16 line-clamp-3"
                    style={clampStyle(3)}
                  >
                    {description}
                  </p>

                  <div className="h-px bg-gradient-to-r from-[#2D7A5F]/20 via-[#2D7A5F]/10 to-transparent mb-4" />

                  <div className="mb-4 flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#2D7A5F]/60 mb-3">
                      Co przygotować / Na co patrzeć
                    </p>
                    <ul className="space-y-2">
                      {bullets.map((bullet: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
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
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12 bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#2D7A5F]/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#2D7A5F]" />
              </div>
              <div>
                <h3 className="text-xl text-[#1A1A1A] mb-3">
                  {texts.calc_tip_title || "Wskazówka eksperta"}
                </h3>
                <p className="text-[#6B6B6B] leading-relaxed">
                  {texts.calc_tip_desc || "Porównuj nie tylko cenę, ale i zakres: limity, udział własny i wyłączenia. W OC/AC różnice często wychodzą dopiero w szczegółach, a w turystycznym kluczowe są koszty leczenia oraz transport medyczny. Jeśli masz wątpliwości — zadzwoń, pomożemy wybrać najlepszy wariant."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}