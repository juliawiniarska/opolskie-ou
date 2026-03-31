import { Phone, Mail, ShieldCheck, Handshake, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const ABOUT_PAGE_ID = 2692; // ID strony "O NAS"
const GLOBAL_SETTINGS_ID = 2756; // ID ustawień globalnych

export default function AboutPage() {
  const [texts, setTexts] = useState<any>({});
  const [global, setGlobal] = useState<any>({});

  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobal } = usePageLoader();

  const isLoading = loadingTexts || loadingGlobal;

  // 1. Pobieranie treści strony O NAS
  useEffect(() => {
    fetchTexts(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${ABOUT_PAGE_ID}?_fields=acf`);
      if (res.ok) {
        const json = await res.json();
        if (json.acf) setTexts(json.acf);
      }
    });
  }, []);

  // 2. Pobieranie danych globalnych
  useEffect(() => {
    fetchGlobal(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
      if (res.ok) {
        const json = await res.json();
        if (json.acf) setGlobal(json.acf);
      }
    });
  }, []);

  const phone = global.global_phone || "";
  const email = global.global_email || "";

  // Helper do list: zwraca null jeśli puste (dla operatora ||)
  const getList = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim() !== '');
  };

  // Helper do akapitów: ZAWSZE zwraca tablicę (pustą lub z treścią)
  // To naprawia błąd "Object is possibly null"
  const getParagraphs = (text: string) => {
    if (!text) return [];
    return text.split(/\n\s*\n/).filter(p => p.trim() !== '');
  };

  // Wyciągamy akapity do zmiennej dla czytelności i bezpieczeństwa typów
  const b1Paragraphs = getParagraphs(texts?.about_b1_text);

  if (isLoading) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT */}
            <div className="lg:col-span-8 max-w-4xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <ShieldCheck className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                {texts?.about_hero_title}
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
                {texts?.about_hero_desc}
              </p>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
                <h3 className="text-white text-lg sm:text-xl mb-2">
                  {texts?.about_contact_title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  {texts?.about_contact_desc}
                </p>

                <div className="space-y-3">
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-white text-[#2D7A5F] px-5 py-3 font-medium hover:bg-[#F5F1E8] transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" /> Zadzwoń: {phone}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="w-full inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent text-white px-5 py-3 hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Napisz email
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                  Odpowiemy i dobierzemy najlepszą opcję do budżetu i potrzeb.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 space-y-10 sm:space-y-14 lg:space-y-16">

          {/* BLOK 1 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-[#2D7A5F]/10">
                <ImageWithFallback
                  src={texts?.about_b1_image || "/onas1.png"}
                  alt="Biuro Opolskie Ubezpieczenia"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-9 lg:p-10 shadow-lg border border-[#2D7A5F]/10">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D7A5F]/15 bg-[#F5F1E8] px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#2D7A5F]">
                {texts?.about_b1_badge}
              </p>

              <h2 className="mt-6 text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] leading-tight">
                {texts?.about_b1_title}
              </h2>

              <div className="mt-6 space-y-4 text-[#6B6B6B] text-base sm:text-lg leading-relaxed">
                {b1Paragraphs.length > 0 && (
                  b1Paragraphs.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* BLOK 2 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-7 sm:p-9 lg:p-10 shadow-2xl text-white flex flex-col order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 text-white/80">
                <Handshake className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">
                  {texts?.about_b2_badge}
                </span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl leading-tight">
                {texts?.about_b2_title}
              </h3>

              <ul className="mt-6 space-y-3 text-white/90 text-base sm:text-lg">
                {(getList(texts?.about_b2_list) || []).map((t: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-7 border-t border-white/20 text-white/85 leading-relaxed">
                {texts?.about_b2_footer}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-[#2D7A5F]/10">
                <ImageWithFallback
                  src={texts?.about_b2_image || "/onas2.png"}
                  alt="Spotkania z klientami — Opolskie Ubezpieczenia"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* KARTY */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">
                  {texts?.about_card_1_title}
                </h3>
              </div>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                {texts?.about_card_1_desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">
                  {texts?.about_card_2_title}
                </h3>
              </div>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                {texts?.about_card_2_desc_1}
              </p>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                {texts?.about_card_2_desc_2}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <Handshake className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">
                  {texts?.about_card_3_title}
                </h3>
              </div>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                {texts?.about_card_3_desc}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl text-center">
            <h3 className="text-2xl sm:text-3xl mb-3">
              {texts?.about_cta_title}
            </h3>
            
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              {texts?.about_cta_desc}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-7 py-4 font-medium hover:bg-[#F5F1E8] transition-colors"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-transparent px-7 py-4 hover:bg-white/10 transition-colors"
                >
                  Napisz email
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}