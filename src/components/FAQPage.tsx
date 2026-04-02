import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  Search,
  ArrowRight,
  ShieldCheck,
  Car,
  Home,
  Tractor,
  Briefcase,
  Plane,
  Heart,
  FileText,
} from "lucide-react";

import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA WORDPRESS ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const FAQ_PAGE_ID = 3084; // ← Uzupełnij ID strony FAQ w WordPressie
const GLOBAL_SETTINGS_ID = 2756;

// --- TYPY ---
interface FAQItem {
  pytanie: string;
  odpowiedz: string;
}

interface FAQCategoryConfig {
  id: string;
  icon: React.ElementType;
  label: string;
  acfPrefix: string; // np. "faq_kat1"
}

type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

// --- STAŁE KATEGORIE (ikony + etykiety w kodzie, treści z ACF) ---
const CATEGORY_CONFIG: FAQCategoryConfig[] = [
  { id: "ogolne",        icon: ShieldCheck, label: "Ogólne",                  acfPrefix: "faq_kat1" },
  { id: "komunikacyjne", icon: Car,         label: "Komunikacyjne",           acfPrefix: "faq_kat2" },
  { id: "majatkowe",     icon: Home,        label: "Majątkowe",               acfPrefix: "faq_kat3" },
  { id: "rolne",         icon: Tractor,     label: "Rolne",                   acfPrefix: "faq_kat4" },
  { id: "firmowe",       icon: Briefcase,   label: "Firmowe",                 acfPrefix: "faq_kat5" },
  { id: "turystyczne",   icon: Plane,       label: "Turystyczne",             acfPrefix: "faq_kat6" },
  { id: "osobowe",       icon: Heart,       label: "Na życie i NNW",          acfPrefix: "faq_kat7" },
  { id: "formalnosci",   icon: FileText,    label: "Formalności i rejestracja", acfPrefix: "faq_kat8" },
];

const NUM_QUESTIONS = 10;

// --- PARSOWANIE ACF → pytania ---
function parseQuestions(acf: AcfData, prefix: string): FAQItem[] {
  const items: FAQItem[] = [];
  for (let q = 1; q <= NUM_QUESTIONS; q++) {
    const pytanie = acf[`${prefix}_p${q}`];
    const odpowiedz = acf[`${prefix}_o${q}`];
    if (pytanie?.trim() && odpowiedz?.trim()) {
      items.push({ pytanie: pytanie.trim(), odpowiedz: odpowiedz.trim() });
    }
  }
  return items;
}

// --- KOMPONENT AKORDEONU ---
function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl border transition-all duration-300
        ${isOpen ? "border-[#2D7A5F]/30 shadow-md" : "border-[#2D7A5F]/10 shadow-sm hover:border-[#2D7A5F]/20"}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-[#1A1A1A] text-base sm:text-lg font-medium leading-snug pr-2">
          {item.pytanie}
        </span>
        <div
          className={`
            shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300
            ${isOpen ? "bg-[#2D7A5F] text-white rotate-180" : "bg-[#2D7A5F]/10 text-[#2D7A5F]"}
          `}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
          <div className="border-t border-[#2D7A5F]/10 pt-4">
            <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {item.odpowiedz}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- GŁÓWNY KOMPONENT ---
export default function FAQPage() {
  const [global, setGlobal] = useState<GlobalData>({});
  const [acf, setAcf] = useState<AcfData | null>(null);

  const { loading: loadingAcf, fetchWithLoader: fetchAcf } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobalReq } = usePageLoader();

  const isLoading = loadingAcf || loadingGlobal;

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Ustawienia globalne
  const loadGlobalData = useCallback(() => {
    fetchGlobalReq(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("FAQ global error:", e);
      }
    });
  }, [fetchGlobalReq]);

  // 2. Treści FAQ z ACF
  const loadAcfData = useCallback(() => {
    if (!FAQ_PAGE_ID) return;
    fetchAcf(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${FAQ_PAGE_ID}?_fields=acf&t=${Date.now()}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setAcf(json.acf);
        }
      } catch (e) {
        console.error("FAQ fetch error:", e);
      }
    });
  }, [fetchAcf]);

  useEffect(() => {
    loadGlobalData();
  }, [loadGlobalData]);

  useEffect(() => {
    loadAcfData();
  }, [loadAcfData]);

  const phone = global.global_phone || "";
  const email = global.global_email || "";

  // Kategorie z pytaniami (filtrujemy te co mają ≥1 pytanie)
  const categoriesWithData = acf
    ? CATEGORY_CONFIG.map((cat) => ({
        ...cat,
        pytania: parseQuestions(acf, cat.acfPrefix),
      })).filter((cat) => cat.pytania.length > 0)
    : [];

  const hasData = categoriesWithData.length > 0;
  const activeCat = categoriesWithData[activeCategoryIdx] || null;

  // --- Wyszukiwanie ---
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredItems = (() => {
    if (!searchQuery.trim()) {
      return activeCat?.pytania || [];
    }
    const q = normalize(searchQuery);
    return categoriesWithData.flatMap((cat) =>
      cat.pytania.filter(
        (item) =>
          normalize(item.pytanie).includes(q) ||
          normalize(item.odpowiedz).includes(q)
      )
    );
  })();

  // --- SEO: JSON-LD ---
  useEffect(() => {
    if (acf?.faq_meta_title) {
      document.title = acf.faq_meta_title;
    }

    const allItems = categoriesWithData.flatMap((c) => c.pytania);
    if (allItems.length === 0) return;

    const existingScript = document.getElementById("faq-structured-data");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "faq-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allItems.map((item) => ({
        "@type": "Question",
        name: item.pytanie,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.odpowiedz,
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("faq-structured-data");
      if (el) el.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acf]);

  // --- LOADING ---
  if (isLoading) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8]">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="lg:max-w-4xl">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
              <HelpCircle className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>

            {acf?.faq_hero_title && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                {acf.faq_hero_title}
              </h1>
            )}

            {acf?.faq_hero_desc && (
              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
                {acf.faq_hero_desc}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ───────── CONTENT ───────── */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* Nagłówek sekcji */}
          {(acf?.faq_section_title || acf?.faq_section_desc) && (
            <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
              {acf.faq_section_title && (
                <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
                  {acf.faq_section_title}
                </h2>
              )}
              {acf.faq_section_desc && (
                <p className="text-base sm:text-lg text-[#6B6B6B]">
                  {acf.faq_section_desc}
                </p>
              )}
            </div>
          )}

          {hasData ? (
            <>
              {/* Wyszukiwarka */}
              <div className="max-w-xl mx-auto mb-8 sm:mb-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D7A5F]/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOpenIndex(null);
                    }}
                    placeholder={acf?.faq_search_placeholder}
                    className="w-full rounded-2xl border border-[#2D7A5F]/15 bg-white pl-12 pr-4 py-3.5 sm:py-4 text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:border-[#2D7A5F] focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Filtry kategorii z ikonami */}
              {!searchQuery.trim() && categoriesWithData.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
                  {categoriesWithData.map((cat, idx) => {
                    const Icon = cat.icon;
                    const isActive = activeCategoryIdx === idx;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategoryIdx(idx);
                          setOpenIndex(0);
                        }}
                        className={`
                          inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium
                          transition-all duration-200 cursor-pointer
                          ${
                            isActive
                              ? "bg-[#2D7A5F] text-white shadow-md"
                              : "bg-white text-[#1A1A1A] border border-[#2D7A5F]/10 hover:border-[#2D7A5F]/30 hover:bg-[#2D7A5F]/5"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Info przy wyszukiwaniu */}
              {searchQuery.trim() && (
                <div className="max-w-3xl mx-auto mb-6 text-center">
                  <p className="text-[#6B6B6B] text-sm">
                    {filteredItems.length > 0
                      ? `Znaleziono: ${filteredItems.length}`
                      : "Brak wyników — spróbuj innego zapytania lub skontaktuj się z nami."}
                  </p>
                </div>
              )}

              {/* Akordeon */}
              <div className="max-w-3xl mx-auto">
                <div className="space-y-3">
                  {filteredItems.map((item, index) => (
                    <AccordionItem
                      key={`${activeCategoryIdx}-${searchQuery}-${index}`}
                      item={item}
                      isOpen={openIndex === index}
                      onToggle={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-xl mx-auto text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-[#2D7A5F]/20" />
              <p className="text-[#6B6B6B] text-lg">
                {acf?.faq_empty_text}
              </p>
              {(phone || email) && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D7A5F] text-white px-6 py-3 font-medium hover:bg-[#1F5A43] transition-colors"
                    >
                      <Phone className="w-4 h-4" /> {phone}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2D7A5F]/20 text-[#2D7A5F] px-6 py-3 font-medium hover:bg-[#2D7A5F]/5 transition-colors"
                    >
                      <Mail className="w-4 h-4" /> {email}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {(acf?.faq_cta_title || acf?.faq_cta_desc) && (
            <div className="mt-14 sm:mt-20 bg-linear-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl text-center">
              {acf.faq_cta_title && (
                <h3 className="text-2xl sm:text-3xl mb-3">{acf.faq_cta_title}</h3>
              )}
              {acf.faq_cta_desc && (
                <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                  {acf.faq_cta_desc}
                </p>
              )}

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-7 py-4 font-medium hover:bg-[#F5F1E8] transition-colors"
                  >
                    {phone}
                  </a>
                )}
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-transparent px-7 py-4 hover:bg-white/10 transition-colors"
                >
                  {acf?.faq_cta_btn} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}