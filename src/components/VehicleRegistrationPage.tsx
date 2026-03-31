import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Phone,
  Mail,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const REGISTRATION_PAGE_ID = 3040;
const GLOBAL_SETTINGS_ID = 2756;
const CONTACT_URL = "/kontakt";

// --- STYLE PAKIETÓW (KOLORYSTYKA Z ULOTKI) ---
const PACKAGE_STYLES: Record<string, { 
    textColor: string;      // Kolor tekstu (cena, nazwa)
    borderColor: string;    // Kolor ramki
    badgeBg: string;        // Tło nazwy pakietu
    cornerGradient: string; // Gradient w rogu
    hoverBg: string;        // Kolor tła przycisku po najechaniu
}> = {
  bronze: {
    textColor: "text-[#CD7F32]",
    borderColor: "border-[#CD7F32]/20",
    badgeBg: "bg-[#CD7F32]/10",
    cornerGradient: "from-[#CD7F32]/20 to-transparent",
    hoverBg: "hover:bg-[#CD7F32]"
  },
  silver: {
    textColor: "text-[#757575]", 
    borderColor: "border-[#9E9E9E]/20",
    badgeBg: "bg-[#9E9E9E]/10",
    cornerGradient: "from-[#9E9E9E]/20 to-transparent",
    hoverBg: "hover:bg-[#757575]"
  },
  gold: {
    textColor: "text-[#D4AF37]",
    borderColor: "border-[#FFD700]/30",
    badgeBg: "bg-[#FFD700]/15",
    cornerGradient: "from-[#FFD700]/25 to-transparent",
    hoverBg: "hover:bg-[#D4AF37]"
  },
  platinum: {
    textColor: "text-[#2C2C2C]",
    borderColor: "border-[#2C2C2C]/20",
    badgeBg: "bg-[#2C2C2C]/10",
    cornerGradient: "from-[#2C2C2C]/15 to-transparent",
    hoverBg: "hover:bg-[#2C2C2C]"
  }
};

// --- GŁÓWNY KOMPONENT ---

export default function VehicleRegistrationPage() {
  const [texts, setTexts] = useState<any>({});
  const [global, setGlobal] = useState<any>({});
  const navigate = useNavigate();

  // 1. Pobieranie treści strony
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${REGISTRATION_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("Registration page fetch error:", e);
      }
    };
    fetchPage();
  }, []);

  // 2. Pobieranie danych globalnych
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("Global settings error:", e);
      }
    };
    fetchGlobal();
  }, []);

  const phone = global.global_phone || "739 079 729";

  // Funkcja nawigacji do kontaktu
  const handleSelectPackage = (packageName: string, packagePrice: string) => {
    navigate(CONTACT_URL, {
      state: {
        initialSubject: `Zgłoszenie: ${packageName}`,
        initialMessage: `Dzień dobry,\n\nJestem zainteresowany/a usługą: ${packageName} (${packagePrice}).\nProszę o kontakt w celu omówienia dokumentów.\n\nPozdrawiam`
      }
    });
  };

  // DEFINICJA PAKIETÓW (Treści domyślne / Backup)
  const packages = [
    {
      id: "bronze",
      name: "Pakiet BRONZE",
      title: "Rejestracja pojazdu w Polsce",
      price: "179 zł",
      priceSuffix: "brutto + opłaty urzędowe",
      features: [
        "Dostarczasz dokumenty do naszego biura w Nysie.",
        "Przygotowujemy kompletny wniosek.",
        "Reprezentujemy Cię w wydziale komunikacji.",
        "Odbieramy tablice i dowód rejestracyjny.",
        "Nie stoisz w kolejkach - masz pewność poprawności."
      ]
    },
    {
      id: "silver",
      name: "Pakiet SILVER",
      title: "Rejestracja z doręczeniem dokumentów",
      price: "249 zł",
      priceSuffix: "brutto + opłaty urzędowe",
      features: [
        "Dokumenty przekazujesz osobiście lub umawiamy ich odbiór na terenie Nysy i powiatu nyskiego.",
        "Po zakończeniu rejestracji dostarczamy tablice i dowód rejestracyjny pod wskazany adres.",
        "Minimum formalności po Twojej stronie - maksimum wygody."
      ]
    },
    {
      id: "gold",
      name: "Pakiet GOLD",
      title: "Rejestracja pojazdu z zagranicy",
      price: "349 zł",
      priceSuffix: "brutto + opłaty urzędowe i tłumaczenia",
      features: [
        "Kompleksowa obsługa rejestracji pojazdów importowanych.",
        "Koordynujemy profesjonalne tłumaczenia dokumentów.",
        "Pomagamy w rozliczeniu akcyzy.",
        "Prowadzimy cały proces administracyjny od przekazania dokumentów aż do odbioru tablic.",
        "Masz jednego opiekuna sprawy i pełną kontrolę."
      ]
    },
    {
      id: "platinum",
      name: "Pakiet PLATINUM",
      title: "Rejestracja „pod klucz”",
      price: "od 399 zł",
      priceSuffix: "brutto + opłaty urzędowe",
      features: [
        "Odbieramy dokumenty na terenie Nysy i okolic.",
        "Przejmujemy pełną obsługę formalności oraz kontakt z urzędami.",
        "Priorytetowa realizacja.",
        "Dostarczamy tablice i dowód pod wskazany adres.",
        "Ty nie tracisz czasu, my zajmujemy się wszystkim."
      ]
    }
  ];

  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        {/* Dekoracje tła - zestaw 1:1 z AboutPage */}
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEWA STRONA: Tekst główny (8 kolumn) */}
            <div className="lg:col-span-8 max-w-4xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <Car className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              {/* Tytuł dopasowany wielkością do reszty podstron */}
              <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                {texts.reg_hero_title || "Kompleksowa obsługa rejestracji pojazdów"}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mb-8">
                {texts.reg_hero_desc || "Pełne wsparcie formalne. Rejestracja, tłumaczenia, ubezpieczenia i finansowanie w jednym miejscu. Nie stój w kolejkach – zrobimy to za Ciebie."}
              </p>
              
            </div>

            {/* PRAWA STRONA: Karta Kontaktowa (4 kolumny, styl AboutPage) */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
                <h3 className="text-white text-lg sm:text-xl mb-2">
                  {texts.reg_contact_title || "Wyceń usługę"}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {texts.reg_contact_desc || "Skontaktuj się z nami, aby ustalić szczegóły rejestracji Twojego pojazdu."}
                </p>

                <div className="space-y-3">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{phone}</span>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>

                  <Link
                    to={CONTACT_URL}
                    className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Napisz do nas</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CENNIK / PAKIETY - ZMODYFIKOWANE KOLORY I IKONY */}
      <section className="pb-10 pt-16 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
                {texts.reg_packages_title || "Wybierz pakiet dla siebie"}
            </h2>
            <p className="text-[#6B6B6B]">
                {texts.reg_packages_desc || "Dopasuj zakres usług do swoich potrzeb. Od podstawowej rejestracji po kompleksową obsługę aut z zagranicy."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              // Pobieranie danych z ACF (z backupem do zmiennych pkg)
              const title = texts[`reg_${pkg.id}_title`] || pkg.title;
              const price = texts[`reg_${pkg.id}_price`] || pkg.price;
              const suffix = texts[`reg_${pkg.id}_suffix`] || pkg.priceSuffix;
              
              const featuresRaw = texts[`reg_${pkg.id}_features`];
              const featuresList = featuresRaw 
                ? featuresRaw.split('\n').filter((l: string) => l.trim() !== '')
                : pkg.features;

              // Styl dla danego pakietu
              const style = PACKAGE_STYLES[pkg.id] || PACKAGE_STYLES.bronze;

              return (
                <div 
                  key={pkg.id} 
                  className={`group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border ${style.borderColor} hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col`}
                >
                  {/* Dekoracja w rogu (gradient) */}
                  <div className={`pointer-events-none absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${style.cornerGradient} rounded-bl-[60px] opacity-80`} />

                  {/* Kategoria / Nazwa pakietu (Badge) */}
                  <div className="relative mb-6 flex items-center">
                    <span className={`inline-block text-[11px] px-3 py-1.5 rounded-lg uppercase tracking-wider font-medium ${style.badgeBg} ${style.textColor}`}>
                      {pkg.name}
                    </span>
                  </div>

                  {/* Tytuł (BEZ DUŻEJ IKONY) */}
                  <h3 className="text-[22px] text-[#1A1A1A] mb-3 leading-tight min-h-[3.5rem] relative z-10">
                    {title}
                  </h3>

                  {/* Cena (KOLOROWA, BEZ BOLD) */}
                  <div className="mb-6 relative z-10">
                    <span className={`text-3xl font-medium ${style.textColor}`}>{price}</span>
                    <div className="text-xs text-[#6B6B6B] mt-1">{suffix}</div>
                  </div>

                  {/* Lista cech */}
                  <div className="flex-1 mb-8 relative z-10">
                    <ul className="space-y-3">
                      {featuresList.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                          <div className={`w-4 h-4 rounded-full ${style.badgeBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <CheckCircle className={`w-3 h-3 ${style.textColor}`} />
                          </div>
                          <span className="leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Przycisk */}
                  <div className="mt-auto relative z-10">
                    <button 
                      onClick={() => handleSelectPackage(pkg.name, price)}
                      className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border font-medium text-sm transition-all duration-300 ${style.borderColor} ${style.textColor} ${style.hoverBg} hover:text-white`}
                    >
                      Wybieram ten pakiet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEKCJA "DLACZEGO WARTO?" */}
      <section className="py-14 bg-[#F5F1E8] relative">
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#2D7A5F]/10">
              
             <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl text-[#1A1A1A] font-medium">
                   {texts.reg_why_title || "Dlaczego warto zlecić nam rejestrację?"}
                </h2>
             </div>

             <div className="grid md:grid-cols-3 gap-10 items-start">
                
                {/* 1. Oszczędzasz czas */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                   <div className="w-12 h-12 rounded-xl bg-[#2D7A5F]/10 flex items-center justify-center mb-4 text-[#2D7A5F]">
                      <Clock className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg text-[#1A1A1A] mb-3">
                     {texts.reg_why_1_title || "Oszczędzasz czas"}
                   </h3>
                   <p className="text-[#6B6B6B] leading-relaxed text-[15px]">
                     {texts.reg_why_1_desc || "Nie stoisz w urzędowych kolejkach. My zajmujemy się całą biurokracją, a Ty odbierasz gotowe tablice."}
                   </p>
                </div>

                {/* 2. Pewność wniosku */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                   <div className="w-12 h-12 rounded-xl bg-[#2D7A5F]/10 flex items-center justify-center mb-4 text-[#2D7A5F]">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg text-[#1A1A1A] mb-3">
                     {texts.reg_why_2_title || "Pewność wniosku"}
                   </h3>
                   <p className="text-[#6B6B6B] leading-relaxed text-[15px]">
                     {texts.reg_why_2_desc || "Gwarantujemy, że wszystkie dokumenty zostaną wypełnione poprawnie i zgodnie z aktualnymi przepisami."}
                   </p>
                </div>

                {/* 3. Obsługa Nysy */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                   <div className="w-12 h-12 rounded-xl bg-[#2D7A5F]/10 flex items-center justify-center mb-4 text-[#2D7A5F]">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg text-[#1A1A1A] mb-3">
                     {texts.reg_why_3_title || "Obsługa Nysy i okolic"}
                   </h3>
                   <p className="text-[#6B6B6B] leading-relaxed text-[15px]">
                     {texts.reg_why_3_desc || "Działamy lokalnie. Możemy odebrać dokumenty od Ciebie i dostarczyć dowód pod wskazany adres."}
                   </p>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* CTA NA DOLE */}
      <section className="pb-20 pt-0 px-4">
        <div className="max-w-[1200px] mx-auto bg-[#2D7A5F] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="pointer-events-none absolute -left-10 -bottom-10 w-40 h-40 border-4 border-white/10 rounded-full" />
           <div className="relative z-10">
             <h2 className="text-2xl sm:text-3xl mb-4">
               {texts.reg_cta_title || "Masz pytania dotyczące dokumentów?"}
             </h2>
             <p className="text-white/80 max-w-2xl mx-auto mb-8">
               {texts.reg_cta_desc || "Skontaktuj się z nami, a wyjaśnimy cały proces rejestracji, sprawdzimy Twoje dokumenty i pomożemy dobrać odpowiedni pakiet."}
             </p>
             <div className="flex flex-wrap justify-center gap-4">
                <a 
                   href={`tel:${phone.replace(/\s/g, "")}`}
                   className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#2D7A5F] font-semibold hover:bg-[#F5F1E8] transition-colors"
                >
                  <Phone className="w-5 h-5" /> {phone}
                </a>
                <Link
                   to={CONTACT_URL}
                   className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/30 bg-transparent hover:bg-white/10 transition-colors"
                >
                   Kontakt
                </Link>
             </div>
           </div>
        </div>
      </section>
    </main>
  );
}