import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Phone,
  Camera,
  Video,
  Wheat,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Play,
} from "lucide-react";

const WP_BASE = "https://www.opolskieubezpieczenia.pl";
const CONTACT_URL = `${WP_BASE}/kontakt/`;
const INSTAGRAM_URL = "https://www.instagram.com/opolskieubezpieczenia/";

// Feed zadziała dopiero po dodaniu endpointu na WP (plugin + token)
const IG_ENDPOINT = `${WP_BASE}/wp-json/ou/v1/instagram?limit=9`;

type IGItem = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
};

function FeatureCard({
  category,
  title,
  description,
  Icon,
  actions,
}: {
  category: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

      {/* badge */}
      <div className="relative mb-4 h-6 flex items-center">
        <span className="inline-block text-[11px] text-[#2D7A5F] px-3 py-1 bg-[#2D7A5F]/10 rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* icon */}
      <div className="relative mb-4 h-14 flex items-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-[#2D7A5F]" />
        </div>
      </div>

     {/* title (bez clamp – rośnie dynamicznie) */}
<h3 className="text-xl sm:text-[22px] text-[#1A1A1A] mb-2 leading-tight min-h-[56px] sm:min-h-[64px]">
  {title}
</h3>

{/* desc (też bez clamp – rośnie dynamicznie) */}
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
  const [igItems, setIgItems] = useState<IGItem[]>([]);
  const [igLoading, setIgLoading] = useState(true);

  useEffect(() => {
    let aborted = false;

    const run = async () => {
      setIgLoading(true);
      try {
        const res = await fetch(IG_ENDPOINT);
        if (!res.ok) throw new Error("no endpoint");
        const data = (await res.json()) as { items?: IGItem[] };
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!aborted) setIgItems(items);
      } catch {
        if (!aborted) setIgItems([]); // fallback: placeholdery
      } finally {
        if (!aborted) setIgLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, []);

  return (
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

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8">
                Realizacje z lotu drona
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-3xl">
                Prawdziwe ujęcia z gospodarstw i firm. Dron pomaga dokumentować stan upraw,
                monitorować ryzyka i szybciej przeprowadzać proces po szkodzie.
              </p>

              <div className="flex flex-wrap gap-3">
                

                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/25 hover:bg-white/15 transition"
                >
                  Poproś o wycenę <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:flex lg:items-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl w-full">
                <h3 className="text-white text-xl sm:text-2xl mb-3">Wyceń polisę online</h3>
                <p className="text-white/80 leading-relaxed mb-7 sm:mb-8">
                  20+ towarzystw w jednym miejscu. Szybka wycena, lokalna obsługa i pomoc w formalnościach.
                  <br />
                  <span className="inline-block mt-2 text-white/70">
                    Twój specjalista – Wojciech Kurzeja
                  </span>
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="tel:+48739079729"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">739 079 729</span>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>

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
        <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
        <div className="pointer-events-none absolute top-32 right-1/3 w-16 h-16 bg-[#2D7A5F]/5 rotate-45" />
        <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* 3 kafle – wszystko w nich */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                category="Rolnictwo & technologia"
                title="Dlaczego dron w rolnictwie?"
                Icon={Wheat}
                description="Rolnictwo coraz częściej korzysta z nowoczesnych technologii. Dron to nie tylko efektowne ujęcia z powietrza – to praktyczne narzędzie, które pomaga dokumentować stan upraw, monitorować pola i maszyny oraz szybciej reagować na szkody spowodowane pogodą czy innymi zagrożeniami. Dzięki temu rolnik zyskuje realną wiedzę i kontrolę nad gospodarstwem."
              />

              <FeatureCard
                category="Bezpieczniej i konkretniej"
                title="Jak wspieramy Twoje ubezpieczenia"
                Icon={ShieldCheck}
                description="Dokładne zdjęcia i nagrania z drona pozwalają lepiej ocenić ryzyka, które mogą wystąpić w gospodarstwie czy firmie. To bezpośrednio przekłada się na dobór odpowiedniej polisy i wysokość składki. Dzięki analizie z lotu ptaka pomagamy Ci uniknąć niedoszacowania wartości upraw lub maszyn, a w razie szkody – udokumentować sytuację i sprawniej przejść przez proces odszkodowawczy."
              />

              <FeatureCard
                category="Portfolio"
                title="Zobacz nasze realizacje z lotu ptaka"
                Icon={Video}
                description="Nic nie przemawia lepiej niż obraz. Poniżej znajdziesz przykłady naszych nagrań i zdjęć wykonanych z drona w gospodarstwach rolnych i firmach."
                actions={
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-[#2D7A5F] text-white px-6 py-3 font-medium hover:opacity-95 transition w-full"
                    >
                      Otwórz Instagram <ExternalLink className="w-4 h-4 ml-2" />
                    </a>

                    <a
                      href={CONTACT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-white border border-[#2D7A5F]/15 text-[#2D7A5F] px-6 py-3 hover:bg-[#2D7A5F]/5 transition w-full"
                    >
                      Zapytaj o współpracę <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                }
              />
            </div>

            {/* feed – bez dodatkowych “okienek tekstowych” pod spodem */}
            <div className="mt-10 bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#2D7A5F]" />
                </div>

                <div className="min-w-0 w-full">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">Najnowsze ujęcia</h3>

                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2D7A5F]/10 text-[#2D7A5F] px-4 py-2 hover:bg-[#2D7A5F]/15 transition"
                    >
                      Zobacz wszystkie <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                    {igLoading
                      ? Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={`sk-${i}`}
                            className="aspect-square rounded-2xl bg-[#2D7A5F]/8 border border-[#2D7A5F]/12 animate-pulse"
                          />
                        ))
                      : igItems.length > 0
                      ? igItems.map((item) => {
                          const src =
                            item.media_type === "VIDEO"
                              ? item.thumbnail_url || item.media_url
                              : item.media_url;

                          return (
                            <a
                              key={item.id}
                              href={item.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#2D7A5F]/12 bg-[#2D7A5F]/5"
                              title={item.caption || "Instagram post"}
                            >
                              {src ? (
                                <img
                                  src={src}
                                  alt={item.caption ? item.caption.slice(0, 80) : "Instagram"}
                                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#2D7A5F]/60">
                                  <Sparkles className="w-6 h-6" />
                                </div>
                              )}

                              {item.media_type === "VIDEO" ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              ) : null}
                            </a>
                          );
                        })
                      : Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={`ph-${i}`}
                            className="aspect-square rounded-2xl bg-[#2D7A5F]/8 border border-[#2D7A5F]/12"
                            aria-label="Placeholder realizacji"
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>

            {/* dolne CTA */}
            <div className="mt-10 bg-[#2D7A5F] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 border-4 border-white/10 rounded-full" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 w-52 h-52 border-4 border-white/10 rounded-full" />

              <div className="relative text-center">
                <h2 className="text-2xl sm:text-3xl text-white">
                  Uzyskaj indywidualną ofertę ubezpieczeniową
                </h2>
                <p className="mt-3 text-white/85">
                  <strong>
                    Skontaktuj się z nami już dziś, aby zapewnić sobie i swoim bliskim maksimum bezpieczeństwa.
                  </strong>
                </p>

                <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                  <a
                    href={CONTACT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-7 py-4 font-medium hover:bg-[#F5F1E8] transition"
                  >
                    Zamów darmową wycenę <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="tel:+48739079729"
                    className="inline-flex items-center justify-center rounded-2xl bg-white/10 text-white border border-white/25 px-7 py-4 hover:bg-white/15 transition"
                  >
                    Zadzwoń: 739 079 729
                  </a>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>
    </main>
  );
}
