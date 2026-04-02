import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Home,
  Banknote,
  RefreshCw,
  Car,
  Phone,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { OfferPageHero } from "./offer/OfferPageHero";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const CREDITS_PAGE_ID = 3196;
const GLOBAL_SETTINGS_ID = 2756;

// --- TYPY ---
type CreditMap = {
  id: number;
  slug: string;
  icon: LucideIcon;
  acfPrefix: string;
};

type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

const CREDIT_MAPPING: CreditMap[] = [
  { id: 1, slug: "kredyty-hipoteczne", icon: Home, acfPrefix: "kredyt_1" },
  { id: 2, slug: "kredyty-gotowkowe", icon: Banknote, acfPrefix: "kredyt_2" },
  { id: 3, slug: "kredyty-konsolidacyjne", icon: RefreshCw, acfPrefix: "kredyt_3" },
  { id: 4, slug: "kredyty-samochodowe", icon: Car, acfPrefix: "kredyt_4" },
];

function CreditsLandingPage({ texts, phone }: { texts: AcfData | null; phone: string }) {
  useEffect(() => {
    if (texts?.kredyty_meta_title) document.title = texts.kredyty_meta_title;
  }, [texts]);

  return (
    <main className="bg-[#F5F1E8]">
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="lg:max-w-4xl">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
              <Banknote className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
              {texts?.kredyty_hero_title}
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
              {texts?.kredyty_hero_desc}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">{texts?.kredyty_section_title}</h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">{texts?.kredyty_section_desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {CREDIT_MAPPING.map((credit) => {
              const title = texts?.[`${credit.acfPrefix}_title`];
              const desc = texts?.[`${credit.acfPrefix}_short_desc`];
              const Icon = credit.icon;
              return (
                <Link key={credit.slug} to={`/kredyty/${credit.slug}`} className="group bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10 hover:border-[#2D7A5F]/30 hover:shadow-xl transition-all">
                  <div className="flex items-start gap-5">
                    <div className="bg-[#2D7A5F]/10 rounded-2xl p-4 shrink-0 group-hover:bg-[#2D7A5F] group-hover:text-white text-[#2D7A5F] transition-colors">
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl sm:text-2xl text-[#1A1A1A] group-hover:text-[#2D7A5F] transition-colors">{title}</h3>
                      <p className="text-[#6B6B6B] leading-relaxed text-sm sm:text-base line-clamp-3">{desc}</p>
                      <span className="inline-flex items-center gap-2 text-[#2D7A5F] font-medium mt-2 group-hover:gap-3 transition-all text-sm">
                        Przejdź do szczegółów <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-[#2D7A5F] to-[#1F5A43] w-full py-16 sm:py-24">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 text-center text-white">
          <h3 className="text-2xl sm:text-3xl mb-4 font-normal">{texts?.kredyty_cta_title}</h3>
          <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8 font-normal">{texts?.kredyty_cta_desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-8 py-4 font-medium hover:bg-[#F5F1E8] transition-colors">
                <Phone className="w-4 h-4 mr-2" /> {phone}
              </a>
            )}
            <Link to="/kontakt" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-transparent px-8 py-4 hover:bg-white/10 transition-colors">
              Kontakt <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CreditsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [texts, setTexts] = useState<AcfData | null>(null);
  const [global, setGlobal] = useState<GlobalData>({});

  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobal } = usePageLoader();

  const isLoading = loadingTexts || loadingGlobal;

  const loadGlobalData = useCallback(() => {
    fetchGlobal(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`);
      if (res.ok) { const json = await res.json(); if (json.acf) setGlobal(json.acf); }
    });
  }, [fetchGlobal]);

  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${CREDITS_PAGE_ID}?_fields=acf&t=${Date.now()}`);
      if (res.ok) { const json = await res.json(); if (json.acf) setTexts(json.acf); }
    });
  }, [fetchTexts]);

  useEffect(() => {
    loadGlobalData();
  }, [loadGlobalData]);

  useEffect(() => {
    loadTextsData();
  }, [loadTextsData]);

  const phone = global.global_phone || "";

  useEffect(() => {
    if (!slug || !texts) return;
    const mapItem = CREDIT_MAPPING.find((c) => c.slug === slug);
    if (mapItem) {
      const metaTitle = texts[`${mapItem.acfPrefix}_meta_title`];
      if (metaTitle) {
        document.title = metaTitle;
      }
    }
  }, [slug, texts]);

  if (isLoading) return <PageLoader />;

  if (!slug) return <CreditsLandingPage texts={texts} phone={phone} />;

  const mapItem = CREDIT_MAPPING.find((c) => c.slug === slug);

  if (!mapItem) {
    return (
      <main className="bg-[#F5F1E8] pt-28 pb-16">
        <div className="max-w-[1800px] mx-auto px-4 text-center">
          <h1 className="text-2xl text-[#2D7A5F]">Nie znaleziono kredytu</h1>
          <Link to="/kredyty" className="block mt-4 text-gray-600 underline">Wróć do listy kredytów</Link>
        </div>
      </main>
    );
  }

  const prefix = mapItem.acfPrefix;
  const Icon = mapItem.icon;

  const title = texts?.[`${prefix}_title`];
  const category = texts?.[`${prefix}_category`];
  const description = texts?.[`${prefix}_desc`];

  const includesRaw = texts?.[`${prefix}_includes`];
  const includes = includesRaw ? includesRaw.split("\n").filter((l: string) => l.trim()) : [];

  const features = [
    { title: texts?.[`${prefix}_s1_title`], items: texts?.[`${prefix}_s1_items`] ? texts[`${prefix}_s1_items`]!.split("\n").filter((l: string) => l.trim()) : [] },
    { title: texts?.[`${prefix}_s2_title`], items: texts?.[`${prefix}_s2_items`] ? texts[`${prefix}_s2_items`]!.split("\n").filter((l: string) => l.trim()) : [] },
    { title: texts?.[`${prefix}_s3_title`], items: texts?.[`${prefix}_s3_items`] ? texts[`${prefix}_s3_items`]!.split("\n").filter((l: string) => l.trim()) : [] },
  ];

  const highlight = {
    title: texts?.[`${prefix}_tip_title`],
    description: texts?.[`${prefix}_tip_desc`],
  };

  return (
    <main className="bg-[#F5F1E8] min-h-screen">
      <OfferPageHero
        title={title || ""}
        description={description || ""}
        category={category || ""}
        icon={<Icon className="w-8 h-8" strokeWidth={1.5} />}
        backTo="/kredyty"
      />

      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-linear-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-7 sm:p-10 shadow-2xl text-white">
            <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">Co obejmuje ta oferta?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {includes.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1 group-hover:bg-white/30 transition-colors">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base sm:text-lg text-white/95">{item}</span>
                </div>
              ))}
            </div>

            {highlight?.title && (
              <div className="mt-8 sm:mt-10 pt-8 border-t border-white/20">
                <div className="bg-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-white shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg sm:text-xl mb-2">{highlight.title}</h3>
                      <p className="text-white/90 text-sm sm:text-base">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {features.some((f) => f.title) && (
            <div className="mt-10 sm:mt-14 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10 hover:shadow-xl transition-shadow">
                  <h3 className="text-lg sm:text-xl text-[#1A1A1A] mb-5 sm:mb-6">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="shrink-0 w-1.5 h-1.5 bg-[#2D7A5F] rounded-full mt-2" />
                        <span className="text-[#6B6B6B]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-linear-to-br from-[#2D7A5F] to-[#1F5A43] w-full py-16 sm:py-24">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl mb-5 font-normal">Oblicz swoją ratę i sprawdź zdolność</h2>
          <p className="text-white/85 text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
            Skorzystaj z naszego darmowego kalkulatora kredytowego, aby sprawdzić szacunkowe koszty i umówić się na bezpłatną konsultację online.
          </p>
          <div className="flex justify-center">
            <Link to="/kalkulator-kredytowy" className="inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-transparent px-8 py-4 hover:bg-white/10 transition-colors font-medium text-lg">
              Otwórz kalkulator kredytowy <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}