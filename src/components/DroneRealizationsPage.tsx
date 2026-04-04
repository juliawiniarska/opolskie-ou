import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Mail,
  Phone,
  Camera,
  Video,
  Wheat,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const DRONE_PAGE_ID = 2708;
const GLOBAL_SETTINGS_ID = 2756;

const CONTACT_URL = "https://www.opolskieubezpieczenia.pl/kontakt/";
const INSTAGRAM_SCRIPT_URL =
  "https://cdn.trustindex.io/loader-feed.js?a055963611ea6261358618116af";

type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

function FeatureCard({
  category,
  title,
  description,
  Icon,
  actions,
}: {
  category?: string;
  title?: string;
  description?: string;
  Icon: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

      <div className="relative mb-4 h-6 flex items-center">
        <span className="inline-block text-[11px] text-[#2D7A5F] px-3 py-1 bg-[#2D7A5F]/10 rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>

      <div className="relative mb-4 h-14 flex items-center">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-[#2D7A5F]" />
        </div>
      </div>

      <h3 className="text-xl sm:text-[22px] text-[#1A1A1A] mb-2 leading-tight min-h-[56px] sm:min-h-[64px]">
        {title}
      </h3>

      <p className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed flex-1">
        {description}
      </p>

      {actions ? (
        <div className="mt-6 pt-4 border-t border-[#2D7A5F]/10">{actions}</div>
      ) : null}
    </div>
  );
}

export default function DroneRealizationsPage() {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  const [texts, setTexts] = useState<AcfData>({});
  const [global, setGlobal] = useState<GlobalData>({});

  // Skeleton chowamy gdy Trustindex wstrzyknie cokolwiek do kontenera
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  const { loading, fetchWithLoader } = usePageLoader();

  const loadTextsData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${DRONE_PAGE_ID}?_fields=acf`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("DronePage fetch error:", e);
      }
    });
  }, [fetchWithLoader]);

  const loadGlobalData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("Global settings error:", e);
      }
    });
  }, [fetchWithLoader]);

  useEffect(() => {
    loadTextsData();
    loadGlobalData();
    window.scrollTo(0, 0);
  }, [loadTextsData, loadGlobalData]);

  const phone = global.global_phone || "";

  // --- ŁADOWANIE SKRYPTU TRUSTINDEX ---
  // Zachowana oryginalna logika (script do kontenera) + dodany MutationObserver na skeleton
  useEffect(() => {
    if (loading || !widgetContainerRef.current) return;

    // Nie dodawaj skryptu drugi raz
    if (widgetContainerRef.current.querySelector("script[src*='trustindex']")) return;

    const container = widgetContainerRef.current;

    // Obserwuj kontener — gdy Trustindex wstrzyknie treść, chowamy skeleton
    const domObserver = new MutationObserver(() => {
      const hasContent = Array.from(container.childNodes).some(
        (node) => node.nodeName !== "SCRIPT"
      );
      if (hasContent) {
        setIsWidgetLoaded(true);
        domObserver.disconnect();
      }
    });
    domObserver.observe(container, { childList: true, subtree: true });

    // Fallback: po 10s chowamy skeleton niezależnie od wyniku
    const timeout = setTimeout(() => {
      setIsWidgetLoaded(true);
      domObserver.disconnect();
    }, 10000);

    // Oryginalna logika — skrypt do kontenera, tak jak działało
    const script = document.createElement("script");
    script.src = INSTAGRAM_SCRIPT_URL;
    script.defer = true;
    script.async = true;
    container.appendChild(script);

    return () => {
      clearTimeout(timeout);
      domObserver.disconnect();
    };
  }, [loading]);

  // --- LOGIKA SEO ---
  const pageTitle =
    texts?.drone_meta_title ||
    "Nagrania dronem Nysa – Zdjęcia z powietrza | Opolskie Ubezpieczenia";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const helmetContent = (
    <Helmet defer={false}>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={
          texts?.drone_hero_desc ||
          "Profesjonalne inspekcje dronem w Nysie i okolicach. Fotografia, nagrania z powietrza i szacowanie szkód rolniczych z drona."
        }
      />
    </Helmet>
  );

  if (loading) return <>{helmetContent}<PageLoader /></>;

  return (
    <>
      {helmetContent}
      <main className="bg-[#F5F1E8]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-12 sm:pb-14 lg:pb-16">
          <div className="pointer-events-none absolute top-14 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
          <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
          <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />

          <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              <div className="lg:col-span-8 max-w-4xl">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                  <Camera className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>

                <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                  {texts.drone_hero_title}
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-3xl">
                  {texts.drone_hero_desc}
                </p>
              </div>

              <div className="lg:col-span-4 lg:flex lg:items-center">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl w-full">
                  <h3 className="text-white text-xl sm:text-2xl mb-3">
                    {texts.drone_contact_title}
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-7 sm:mb-8">
                    {texts.drone_contact_desc}
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    {phone && (
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">{phone}</span>
                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}

                    <a
                      href={CONTACT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Skontaktuj się z nami</span>
                    </a>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                    Odpowiemy szybko i dopasujemy wariant do Twojej sytuacji.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <FeatureCard
                  category={texts.drone_feat_1_cat}
                  title={texts.drone_feat_1_title}
                  Icon={Wheat}
                  description={texts.drone_feat_1_desc}
                />

                <FeatureCard
                  category={texts.drone_feat_2_cat}
                  title={texts.drone_feat_2_title}
                  Icon={ShieldCheck}
                  description={texts.drone_feat_2_desc}
                />

                <FeatureCard
                  category={texts.drone_feat_3_cat}
                  title={texts.drone_feat_3_title}
                  Icon={Video}
                  description={texts.drone_feat_3_desc}
                />
              </div>

              {/* SEKCJA FEED Z INSTAGRAMA */}
              <div className="mt-10 bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-[#2D7A5F]/10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#2D7A5F]" />
                  </div>

                  <div className="min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
                      <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">
                        {texts.drone_insta_title}
                      </h3>
                    </div>

                    {/* Skeleton — widoczny dopóki widget się nie załaduje */}
                    {!isWidgetLoaded && (
                      <div className="mt-6 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="aspect-square bg-gray-200/60 rounded-2xl animate-pulse" />
                        <div className="aspect-square bg-gray-200/60 rounded-2xl animate-pulse" />
                        <div className="aspect-square bg-gray-200/60 rounded-2xl animate-pulse hidden md:block" />
                        <div className="aspect-square bg-gray-200/60 rounded-2xl animate-pulse hidden md:block" />
                      </div>
                    )}

                    {/* Kontener widgetu — ZAWSZE w DOM, Trustindex sam go wypełni */}
                    <div
                      className="mt-6 w-full flex justify-center overflow-hidden"
                      ref={widgetContainerRef}
                    />
                  </div>
                </div>
              </div>

              {/* dolne CTA */}
              <div className="mt-10 bg-[#2D7A5F] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="relative text-center">
                  <h2 className="text-2xl sm:text-3xl text-white">
                    {texts.drone_cta_title}
                  </h2>
                  <p className="mt-3 text-white/85">{texts.drone_cta_desc}</p>

                  <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                    <a
                      href={CONTACT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-7 py-4 font-medium hover:bg-[#F5F1E8] transition"
                    >
                      Zamów darmową wycenę <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                    {phone && (
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-white/10 text-white border border-white/25 px-7 py-4 hover:bg-white/15 transition"
                      >
                        Zadzwoń: {phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}