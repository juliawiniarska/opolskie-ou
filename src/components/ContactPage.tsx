import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Video,
} from "lucide-react";

const WP_BASE = "https://www.opolskieubezpieczenia.pl";
const FORM_EMBED_URL = `${WP_BASE}/ou-embed/wpforms/?id=1031`;

const TEL = "+48739079729";
const TEL_LABEL = "739 079 729";
const MAIL_ADDR = "biuro@opolskieubezpieczenia.pl";
const MAPS_URL = "https://maps.app.goo.gl/jvvjV6U89XR2LcnL9";
const ADDRESS_LINE = "ul. Wiejska 8a, Jędrzychów 48-300 Nysa";

const FB_URL = "https://www.facebook.com/share/1C4NtbsaYY/?mibextid=wwXIfr";
const IG_URL =
  "https://www.instagram.com/opolskieubezpieczenia?igsh=MWR1ZDl1YnU4M3I4NA%3D%3Du0026utm_source=qr";
const YT_WATCH_URL = "https://www.youtube.com/watch?v=UBk4Xk2rwJk";
const YT_EMBED_URL = "https://www.youtube.com/embed/UBk4Xk2rwJk";

const GMAPS_IFRAME_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d649881.6953256665!2d16.18518553125001!3d50.48578300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711c572599ab4ed%3A0xf0f770e9fbb664fb!2sMultiagencja%20Opolskie-Ubezpieczenia!5e0!3m2!1spl!2spl!4v1748727232162!5m2!1spl!2spl";

function Panel({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 " +
        className
      }
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#2D7A5F]" />
        </div>

        <div className="min-w-0 w-full">
          <h3 className="text-xl sm:text-2xl text-[#1A1A1A] leading-tight">
            {title}
          </h3>
          <div className="mt-3 text-[15px] sm:text-base text-[#4B4B4B] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  Icon,
  label,
  variant = "solid",
  title,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "solid" | "ghost";
  title?: string;
}) {
  // 🔧 Kompaktowe na mobile, większe dopiero od sm
  const base =
    "w-full flex items-center gap-3 rounded-2xl transition-all min-w-0 " +
    "px-4 sm:px-5 py-3 sm:py-3.5";

  const solid =
    "bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] shadow-lg shadow-black/5";
  const ghost =
    "bg-transparent hover:bg-white/10 text-white border border-white/30";

  return (
    <a
      href={href}
      title={title ?? label}
      aria-label={title ?? label}
      className={`${base} ${variant === "solid" ? solid : ghost}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="min-w-0 flex-1 truncate font-medium text-[15px] sm:text-base">
        {label}
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 opacity-90" />
    </a>
  );
}

function SocialSquare({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="
        inline-flex items-center justify-center
        w-16 h-16 rounded-2xl
        bg-[#2D7A5F]/10 border border-[#2D7A5F]/15
        text-[#2D7A5F]
        hover:bg-[#2D7A5F]/15 transition
      "
    >
      <Icon className="w-7 h-7" />
    </a>
  );
}

/** Panel TYLKO dla "Aktualności i nagrania" */
function MediaPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 " +
        className
      }
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 flex items-center justify-center">
          <Video className="w-6 h-6 text-[#2D7A5F]" />
        </div>

        <div className="min-w-0 w-full">
          <h3 className="text-xl sm:text-2xl text-[#1A1A1A] leading-tight">
            Aktualności i nagrania
          </h3>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const [formLoaded, setFormLoaded] = useState(false);
  const mailto = useMemo(() => `mailto:${MAIL_ADDR}`, []);
  const telHref = useMemo(() => `tel:${TEL}`, []);

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
                <MessageCircle className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8">
                Kontakt
              </h1>

              <p className="text-white/85 leading-relaxed max-w-3xl text-base sm:text-lg">
                Masz pytania? Napisz lub zadzwoń — pomożemy dobrać najlepsze
                ubezpieczenie i przeprowadzimy przez formalności.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/oferta"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#2D7A5F] shadow-sm hover:bg-[#F5F1E8] transition"
                >
                  Zobacz ofertę <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/25 hover:bg-white/15 transition"
                >
                  Otwórz mapę <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Prawy box — RESPONSYWNY I KOMPAKTOWY */}
            <div className="lg:col-span-4">
              <div className="w-full max-w-[520px] lg:max-w-none mx-auto lg:mx-0 lg:h-full lg:flex lg:items-center">
                <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
                  {/* mniej “nadmuchany” padding + sensowne nagłówki (bez pustych elementów) */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
                    </h3>
                    <p className="text-white/80 text-sm sm:text-[15px] leading-relaxed mt-1">
                    </p>

                    <div className="mt-4 space-y-2.5 sm:space-y-3">
                      <QuickAction
                        href={telHref}
                        Icon={Phone}
                        label={TEL_LABEL}
                        title={`Zadzwoń: ${TEL_LABEL}`}
                        variant="solid"
                      />
                      <QuickAction
                        href={mailto}
                        Icon={Mail}
                        label={MAIL_ADDR}
                        title={`Napisz: ${MAIL_ADDR}`}
                        variant="ghost"
                      />
                    </div>
                  </div>

                  {/* subtelny separator wizualny (opcjonalnie, ale ładnie „zamyka” kafelek) */}
                  
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
          <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
              Masz pytania? Skontaktuj się z nami!
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">
              Chętnie odpowiemy na Twoje pytania i pomożemy w wyborze najlepszych
              ubezpieczeń. Jesteśmy tutaj, aby wspierać Cię na każdym etapie.
            </p>
          </div>

          {/* FORM + INFO */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* FORM */}
            <div className="lg:col-span-7 h-full">
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-[#2D7A5F]/10 overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <div className="text-sm text-[#6B6B6B]">Formularz kontaktowy</div>

                
                </div>

                <div className="relative flex-1 min-h-[820px]">
                  {!formLoaded && (
                    <div className="absolute inset-0 rounded-2xl bg-[#2D7A5F]/5 border border-[#2D7A5F]/10 animate-pulse" />
                  )}

                  <iframe
                    src={FORM_EMBED_URL}
                    title="Formularz kontaktowy"
                    className="absolute inset-0 w-full h-full rounded-2xl border border-[#2D7A5F]/10 bg-white"
                    loading="lazy"
                    onLoad={() => setFormLoaded(true)}
                  />
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="lg:col-span-5 h-full">
              <div className="h-full flex flex-col gap-4">
                <Panel icon={Mail} title="E-mail">
                  <a
                    href={mailto}
                    className="inline-flex items-center gap-2 text-[#2D7A5F] font-medium hover:opacity-80 no-underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {MAIL_ADDR}
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </a>
                </Panel>

                <Panel icon={MapPin} title="Adres">
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-[#2D7A5F] font-medium hover:opacity-80 no-underline"
                  >
                    Multiagencja Opolskie-Ubezpieczenia
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </a>
                  <div className="mt-2 text-[#4B4B4B]">{ADDRESS_LINE}</div>
                </Panel>

                <MediaPanel className="flex-1 min-h-0">
                  <div className="h-full flex flex-col min-h-0">
                    <div className="mt-6 flex items-center justify-center gap-4 w-full">
                      <SocialSquare href={FB_URL} label="Facebook" Icon={Facebook} />
                      <SocialSquare href={IG_URL} label="Instagram" Icon={Instagram} />
                      <SocialSquare href={YT_WATCH_URL} label="YouTube" Icon={Youtube} />
                    </div>

                    <div className="flex-1 min-h-0 flex items-center justify-center pt-7">
                      <div className="w-full">
                        <div className="mx-auto w-[96%] overflow-hidden rounded-2xl border border-[#2D7A5F]/10 bg-black">
                          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                              src={YT_EMBED_URL}
                              title="YouTube video"
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </MediaPanel>
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="mt-10 bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10 overflow-hidden">
            <iframe
              src={GMAPS_IFRAME_SRC}
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Multiagencja Opolskie-Ubezpieczenia"
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
