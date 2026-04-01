import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  ArrowRight,
  BarChart3,
  Home,
  SlidersHorizontal,
  Calendar,
  MessageCircle,
  TrendingUp,
  X,
  CheckCircle,
} from "lucide-react";

import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const CALC_PAGE_ID = 3199; 
const GLOBAL_SETTINGS_ID = 2756;

const LENDI_SCRIPT_SRC = "https://embed.lendi.pl/widget.js";

// --- WIDŻETY ---
const LENDI_WIDGETS = [
  {
    id: "kalkulator-rat",
    icon: BarChart3,
    category: "Porównanie",
    actionLabel: "Otwórz kalkulator",
    acfTitleField: "kalkkred_w1_title",
    acfDescField: "kalkkred_w1_desc",
    bullets: ["Porównanie ofert z kilkunastu banków", "Realne stawki i warunki", "Możliwość umówienia spotkania"],
    height: 2350,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&secondaryColor=%23172C57&dark=false&agentId=24337&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="LightComparerWidget" data-height="2350"></div>`,
  },
  {
    id: "kredyt-hipoteczny",
    icon: Home,
    category: "Hipoteczne",
    actionLabel: "Wypełnij formularz",
    acfTitleField: "kalkkred_w2_title",
    acfDescField: "kalkkred_w2_desc",
    bullets: ["Analiza zdolności kredytowej", "Oferty dopasowane do sytuacji", "Bezpłatna konsultacja"],
    height: 700,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&secondaryColor%5Balpha%5D=1&secondaryColor%5Bhex%5D=%23FF0000&secondaryColor%5Bhexa%5D=%23FF0000FF&secondaryColor%5Bhsla%5D%5Bh%5D=0&secondaryColor%5Bhsla%5D%5Bs%5D=1&secondaryColor%5Bhsla%5D%5Bl%5D=0.5&secondaryColor%5Bhsla%5D%5Ba%5D=1&secondaryColor%5Bhsva%5D%5Bh%5D=0&secondaryColor%5Bhsva%5D%5Bs%5D=1&secondaryColor%5Bhsva%5D%5Bv%5D=1&secondaryColor%5Bhsva%5D%5Ba%5D=1&secondaryColor%5Bhue%5D=0&secondaryColor%5Brgba%5D%5Br%5D=255&secondaryColor%5Brgba%5D%5Bg%5D=0&secondaryColor%5Brgba%5D%5Bb%5D=0&secondaryColor%5Brgba%5D%5Ba%5D=1&dark=false&agentId=24337&description=W%20razie%20pyta%C5%84%20lub%20w%C4%85tpliwo%C5%9Bci%20zach%C4%99cam%20do%20skorzystania%20z%20bezp%C5%82atnej%20konsultacji%20w%20moim%20%E2%98%95%20biurze%20lub%20%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20online.&mode=0&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="MortgageFormWidget" data-height="700"></div>`,
  },
  {
    id: "porownywarka-hipotecznych",
    icon: SlidersHorizontal,
    category: "Hipoteczne",
    actionLabel: "Porównaj oferty",
    acfTitleField: "kalkkred_w3_title",
    acfDescField: "kalkkred_w3_desc",
    bullets: ["Szybkie porównanie warunków", "Najlepsze oferty z rynku", "Wyniki w kilka minut"],
    height: 560,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&secondaryColor=%23172C57&dark=false&agentId=24337&description=W%20razie%20pyta%C5%84%20lub%20w%C4%85tpliwo%C5%9Bci%20zach%C4%99cam%20do%20skorzystania%20z%20bezp%C5%82atnej%20konsultacji%20w%20moim%20%E2%98%95%20biurze%20lub%20%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20online.&mode=0&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="MortgageComparerFormWidget" data-height="560"></div>`,
  },
  {
    id: "wybor-raty",
    icon: Calendar,
    category: "Narzędzia",
    actionLabel: "Oblicz ratę",
    acfTitleField: "kalkkred_w4_title",
    acfDescField: "kalkkred_w4_desc",
    bullets: ["Szybka kalkulacja raty", "Dopasowanie okresu spłaty", "Przejrzysty wynik"],
    height: 290,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&dark=false&agentId=24337&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="BaseInstallmentPicker" data-height="290"></div>`,
  },
  {
    id: "umow-konsultacje",
    icon: MessageCircle,
    category: "Kontakt",
    actionLabel: "Umów spotkanie",
    acfTitleField: "kalkkred_w5_title",
    acfDescField: "kalkkred_w5_desc",
    bullets: ["Spotkanie online lub stacjonarnie", "Bezpłatna analiza sytuacji", "Bez zobowiązań"],
    height: 700,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&secondaryColor%5Balpha%5D=1&secondaryColor%5Bhex%5D=%23FF0000&secondaryColor%5Bhexa%5D=%23FF0000FF&secondaryColor%5Bhsla%5D%5Bh%5D=0&secondaryColor%5Bhsla%5D%5Bs%5D=1&secondaryColor%5Bhsla%5D%5Bl%5D=0.5&secondaryColor%5Bhsla%5D%5Ba%5D=1&secondaryColor%5Bhsva%5D%5Bh%5D=0&secondaryColor%5Bhsva%5D%5Bs%5D=1&secondaryColor%5Bhsva%5D%5Bv%5D=1&secondaryColor%5Bhsva%5D%5Ba%5D=1&secondaryColor%5Bhue%5D=0&secondaryColor%5Brgba%5D%5Br%5D=255&secondaryColor%5Brgba%5D%5Bg%5D=0&secondaryColor%5Brgba%5D%5Bb%5D=0&secondaryColor%5Brgba%5D%5Ba%5D=1&dark=false&agentId=24337&description=W%20razie%20pyta%C5%84%20lub%20w%C4%85tpliwo%C5%9Bci%20zach%C4%99cam%20do%20skorzystania%20z%20bezp%C5%82atnej%20konsultacji%20w%20moim%20%E2%98%95%20biurze%20lub%20%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20online.&mode=0&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="MortgageFormWidget" data-height="700"></div>`,
  },
  {
    id: "zdolnosc-oferty",
    icon: TrendingUp,
    category: "Analiza",
    actionLabel: "Sprawdź zdolność",
    acfTitleField: "kalkkred_w6_title",
    acfDescField: "kalkkred_w6_desc",
    bullets: ["Analiza zdolności w kilka minut", "Oferty z wielu banków", "Konkretne kwoty i warunki"],
    height: 1900,
    html: `<div class="lendi-widget" data-query="&primaryColor=%230A68EB&secondaryColor=%23172C57&dark=false&agentId=24337&description=W%20razie%20pyta%C5%84%20lub%20w%C4%85tpliwo%C5%9Bci%20zach%C4%99cam%20do%20skorzystania%20z%20bezp%C5%82atnej%20konsultacji%20w%20moim%20%E2%98%95%20biurze%20lub%20%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20online.&mode=0&utm_owner=24337&utm_fp_source_id=1491&utm_fp_partner_id=1808" data-widget-name="CreditWorthinessOffersWidget" data-height="1900"></div>`,
  },
];

type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

// --- Widżet z mechanizmem czyszczenia (CLEANUP) ---
function LendiWidgetEmbed({ widgetHtml, height }: { widgetHtml: string; height: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Wstrzykujemy HTML
    const container = containerRef.current;
    container.innerHTML = widgetHtml;

    // Tworzymy tag skryptu
    const script = document.createElement("script");
    script.src = LENDI_SCRIPT_SRC;
    script.async = true;
    script.id = "lendi-runtime-script";
    document.body.appendChild(script);

    // FUNKCJA CZYSZCZĄCA (Uruchamia się przy zamknięciu modalu)
    return () => {
      container.innerHTML = ""; // Czyścimy HTML widżetu
      const existingScript = document.getElementById("lendi-runtime-script");
      if (existingScript) {
        document.body.removeChild(existingScript); // Usuwamy skrypt z Body
      }
      // Opcjonalne: czyszczenie globalnych zmiennych Lendi, jeśli istnieją
      if ((window as any).LendiWidget) delete (window as any).LendiWidget;
    };
  }, [widgetHtml]);

  return (
    <div className="relative">
      <div ref={containerRef} style={{ minHeight: `${height}px` }} className="w-full" />
    </div>
  );
}

// --- Modal (Podniesiony wyżej) ---
function WidgetModal({ widget, acf, onClose }: { widget: (typeof LENDI_WIDGETS)[number]; acf: AcfData | null; onClose: () => void }) {
  const title = acf?.[widget.acfTitleField];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    // Zmniejszony padding top (pt-4) dla lepszego wyglądu
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-4 sm:pt-6 px-4 pb-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal zajmuje teraz więcej miejsca w pionie (max-h-[calc(100vh-2rem)]) */}
      <div className="relative w-full max-w-5xl max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl border border-[#2D7A5F]/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[#2D7A5F]/10 bg-[#F5F1E8] shrink-0">
          <h3 className="text-lg sm:text-xl text-[#1A1A1A] font-medium">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#2D7A5F]/10 flex items-center justify-center hover:bg-[#2D7A5F]/5 transition-colors cursor-pointer">
            <X className="w-6 h-6 text-[#2D7A5F]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
          <LendiWidgetEmbed widgetHtml={widget.html} height={widget.height} />
        </div>
      </div>
    </div>
  );
}

const clampStyle = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines.toString(),
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

// --- GŁÓWNY KOMPONENT ---
export default function CreditCalculatorPage() {
  const [acf, setAcf] = useState<AcfData | null>(null);
  const [global, setGlobal] = useState<GlobalData>({});
  const [openWidgetId, setOpenWidgetId] = useState<string | null>(null);

  const { loading: loadingAcf, fetchWithLoader: fetchAcf } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobal } = usePageLoader();

  const isLoading = loadingAcf || loadingGlobal;

  const loadGlobalData = useCallback(() => {
    fetchGlobal(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
      if (res.ok) { const json = await res.json(); if (json.acf) setGlobal(json.acf); }
    });
  }, [fetchGlobal]);

  const loadAcfData = useCallback(() => {
    if (!CALC_PAGE_ID) return;
    fetchAcf(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${CALC_PAGE_ID}?_fields=acf`);
      if (res.ok) { const json = await res.json(); if (json.acf) setAcf(json.acf); }
    });
  }, [fetchAcf]);

  useEffect(() => {
    loadGlobalData();
    loadAcfData();
  }, [loadGlobalData, loadAcfData]);

  const phone = global.global_phone || "";
  const openWidget = LENDI_WIDGETS.find((w) => w.id === openWidgetId) || null;

  useEffect(() => {
    if (acf?.kalkkred_meta_title) document.title = acf.kalkkred_meta_title;
  }, [acf]);

  if (isLoading) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
              <Calculator className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8 font-bold">
              {acf?.kalkkred_hero_title}
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
              {acf?.kalkkred_hero_desc}
            </p>
          </div>
        </div>
      </section>

      {/* SEKCA KART */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
              <Calculator className="w-4 h-4 text-[#2D7A5F]" />
              <span className="text-sm text-[#2D7A5F] uppercase tracking-wide font-medium">
                {acf?.kalkkred_badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4 font-bold">
              {acf?.kalkkred_section_title}
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">
              {acf?.kalkkred_section_desc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {LENDI_WIDGETS.map((widget) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  onClick={() => setOpenWidgetId(widget.id)}
                  className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col text-left cursor-pointer"
                >
                  <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />
                  <div className="relative mb-4 h-6 flex items-center">
                    <span className="inline-block text-[11px] text-[#2D7A5F] px-3 py-1 bg-[#2D7A5F]/10 rounded-full uppercase tracking-wide font-medium">{widget.category}</span>
                  </div>
                  <div className="relative mb-4 h-14 flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#2D7A5F]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-[#2D7A5F]" />
                    </div>
                  </div>
                  <h3 className="text-xl text-[#1A1A1A] mb-2 font-bold h-14 line-clamp-2">{acf?.[widget.acfTitleField]}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4 h-16 line-clamp-3">{acf?.[widget.acfDescField]}</p>
                  <div className="h-px bg-[#2D7A5F]/10 mb-4" />
                  <div className="mb-4 flex-1">
                    <ul className="space-y-2">
                      {widget.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                          <div className="w-4 h-4 rounded-full bg-[#2D7A5F]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-[#2D7A5F]" />
                          </div>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#2D7A5F]/10 mt-auto text-[#2D7A5F] font-semibold">
                    <span>{widget.actionLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 bg-[#F5F1E8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="bg-[#2D7A5F] rounded-[40px] p-8 sm:p-12 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl mb-4 font-bold">{acf?.kalkkred_cta_title}</h3>
              <p className="text-white/85 mb-8 max-w-2xl mx-auto">{acf?.kalkkred_cta_desc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="bg-white text-[#2D7A5F] px-8 py-4 rounded-2xl font-bold hover:bg-[#F5F1E8] transition-all">{phone}</a>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL (Czyszczący procesy przy zamknięciu) */}
      {openWidget && <WidgetModal widget={openWidget} acf={acf} onClose={() => setOpenWidgetId(null)} />}
    </main>
  );
}