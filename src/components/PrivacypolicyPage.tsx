import { useEffect, useState, useCallback } from "react";
import { 
  ShieldCheck, 
  FileText,
  Fingerprint
} from "lucide-react";
import type { LucideIcon } from "lucide-react"; 

import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const PRIVACY_PAGE_ID = 2713; 
const GLOBAL_SETTINGS_ID = 2756;

type AcfData = Record<string, any>;
type GlobalData = Record<string, string | undefined>;

// Komponent pomocniczy dla spójnego stylu punktów
function PolicyPoint({ number, children }: { number?: string | number, children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 py-3 border-b border-[#2D7A5F]/5 last:border-0">
      {number && (
        <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2D7A5F]/10 flex items-center justify-center text-[#2D7A5F] font-bold text-sm">
          {number}
        </span>
      )}
      <div className="text-[#4B4B4B] text-[15px] leading-relaxed pt-1 flex-1 min-w-0 break-words hyphens-none">
        {children}
      </div>
    </div>
  );
}

// Komponent dla sekcji nagłówkowych
function PolicySection({ title, icon: Icon, children }: { title: string, icon: LucideIcon, children: React.ReactNode }) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#2D7A5F] flex items-center justify-center text-white shadow-lg shadow-[#2D7A5F]/20 shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">{title}</h2>
      </div>
      <div className="bg-[#F5F1E8]/50 p-4 sm:p-8 rounded-[32px] border-l-4 border-[#2D7A5F] space-y-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [texts, setTexts] = useState<AcfData>({});
  const [global, setGlobal] = useState<GlobalData>({});

  const { loading: loadingPage, fetchWithLoader: fetchPage } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobalReq } = usePageLoader();

  const isLoading = loadingPage || loadingGlobal;

  // 1. Pobieranie treści strony
  const loadPageData = useCallback(() => {
    fetchPage(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${PRIVACY_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("PrivacyPage fetch error:", e);
      }
    });
  }, [fetchPage]);

  // 2. Pobieranie danych globalnych
  const loadGlobalData = useCallback(() => {
    fetchGlobalReq(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("Global settings error:", e);
      }
    });
  }, [fetchGlobalReq]);

  useEffect(() => {
    loadPageData();
    loadGlobalData();
    window.scrollTo(0, 0);
  }, [loadPageData, loadGlobalData]);

  // --- DANE DYNAMICZNE ---
  const COMPANY_NAME = global.global_company_full || "";

  // --- HELPERY DO PARSOWANIA ACF ---
  const getList = (text?: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  };

  const getKeyValueList = (text?: string) => {
    const lines = getList(text);
    if (!lines) return [];
    return lines.map(line => {
      const parts = line.split(':');
      if (parts.length > 1) {
        return { t: parts[0].trim(), c: parts.slice(1).join(':').trim() };
      }
      return { t: '', c: line };
    });
  };

  // HELPER NAPRAWIAJĄCY HTML Z WORDPRESSA
  const renderHTML = (htmlString: string) => {
    if (!htmlString) return { __html: "" };
    
    // 1. Zamienia className na class
    let fixedHtml = htmlString.replace(/className=/g, 'class=');
    
    // 2. Naprawia samozamykające się divy (które psuły układ tekstu)
    // <div ... /> zamienia na <div ...></div>
    fixedHtml = fixedHtml.replace(/<div([^>]*)\/>/g, '<div$1></div>');
    fixedHtml = fixedHtml.replace(/<span([^>]*)\/>/g, '<span$1></span>');

    return { __html: fixedHtml };
  };

  if (isLoading) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 font-bold break-words">
              {texts.privacy_hero_title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              {texts.privacy_hero_desc}
            </p>
          </div>
        </div>
      </section>

      {/* GŁÓWNY KAFELEK */}
      <section className="py-8 sm:py-20 lg:py-24 bg-[#F5F1E8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#2D7A5F]/5 p-6 sm:p-12 lg:p-20 border border-[#2D7A5F]/10">
            
            {/* I. POLITYKA COOKIES */}
            <PolicySection 
              title={texts.privacy_sec1_title} 
              icon={FileText}
            >
              {texts.privacy_sec1_html ? (
                <div className="prose prose-green max-w-none text-[#4B4B4B]" dangerouslySetInnerHTML={renderHTML(texts.privacy_sec1_html)} />
              ) : (
                getList(texts.privacy_sec1_list).map((text: string, idx: number) => (
                  <PolicyPoint key={idx} number={idx + 1}>
                    <div dangerouslySetInnerHTML={renderHTML(text)} />
                  </PolicyPoint>
                ))
              )}
            </PolicySection>

            {/* II. POLITYKA PRYWATNOŚCI */}
            <PolicySection 
              title={texts.privacy_sec2_title} 
              icon={ShieldCheck}
            >
              {getList(texts.privacy_sec2_list).map((text: string, idx: number) => (
                <PolicyPoint key={idx} number={idx + 1}>
                  <div dangerouslySetInnerHTML={renderHTML(text)} />
                </PolicyPoint>
              ))}
            </PolicySection>

            {/* OBOWIĄZEK INFORMACYJNY */}
            <PolicySection 
              title={texts.privacy_sec3_title} 
              icon={Fingerprint}
            >
              {getKeyValueList(texts.privacy_sec3_list).map((item: any, idx: number) => (
                <PolicyPoint key={idx} number={idx + 1}>
                  {item.t && <strong className="block text-[#1A1A1A] mb-1">{item.t}</strong>}
                  <div dangerouslySetInnerHTML={renderHTML(item.c)} />
                </PolicyPoint>
              ))}
            </PolicySection>

            {/* STOPKA DOKUMENTU */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <p className="text-[#1A1A1A] font-extrabold text-sm uppercase tracking-widest">
                  {COMPANY_NAME}
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  {texts.privacy_footer_date}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}