import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";

// --- KONFIGURACJA WORDPRESS ---
const WP_DOMAIN = "https://www.opolskieubezpieczenia.pl";
const CONTACT_PAGE_ID = 2710; // Strona Kontakt
const GLOBAL_SETTINGS_ID = 2756; // Ustawienia Globalne
const WP_FORM_ID = "2675"; // ID Formularza w CF7

// --- KOMPONENT FORMULARZA ---
function SimpleContactForm({ 
  initialSubject, 
  initialMessage 
}: { 
  initialSubject?: string; 
  initialMessage?: string; 
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Mapowanie danych pod Twój formularz CF7
    const wpFormData = new FormData();
    wpFormData.append('your-name', formData.get('name') as string);
    wpFormData.append('your-email', formData.get('email') as string);
    wpFormData.append('your-phone', formData.get('phone') as string);
    
    // USUNIĘTO PRZEKAZYWANIE TEMATU (bo nie ma go w Twoim formularzu)
    // Treść wiadomości
    wpFormData.append('your-message', formData.get('message') as string);
    
    // Zgoda RODO
    if (formData.get('consent')) {
        wpFormData.append('your-consent', '1');
    }

    // Wymagane przez CF7 API
    wpFormData.append('_wpcf7_unit_tag', 'rte');

    try {
      let url = `${WP_DOMAIN}/wp/wp-json/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback`;
      
      let response = await fetch(url, {
        method: "POST",
        body: wpFormData,
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok || !isJson) {
        console.warn("Standardowa ścieżka API nie zadziałała, próbuję metody alternatywnej...");
        url = `${WP_DOMAIN}/wp/?rest_route=/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback`;
        
        response = await fetch(url, {
          method: "POST",
          body: wpFormData,
        });
      }

      const finalContentType = response.headers.get("content-type");
      if (!finalContentType || !finalContentType.includes("application/json")) {
         const text = await response.text();
         console.error("Błąd serwera (HTML):", text.slice(0, 150));
         throw new Error("Serwer zwrócił stronę HTML zamiast potwierdzenia.");
      }

      const json = await response.json();

      if (json.status === 'mail_sent') {
        setSuccess(true);
      } else {
        console.error("WP Error Response:", json);
        setError(true);
        
        if (json.status === 'validation_failed') {
          setErrorMsg("Proszę wypełnić wszystkie wymagane pola i zaakceptować politykę prywatności.");
        } else {
          setErrorMsg(json.message || "Wystąpił błąd po stronie serwera.");
        }
      }
    } catch (err: any) {
      console.error("Network/Fetch Error:", err);
      setError(true);
      
      if (String(err).includes("Failed to fetch")) {
        setErrorMsg("Błąd połączenia. Spróbuj ponownie później.");
      } else {
        setErrorMsg(err.message || "Błąd połączenia. Spróbuj ponownie później.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-[#2D7A5F]/10 rounded-full flex items-center justify-center mb-6 text-[#2D7A5F]">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
          Wiadomość wysłana!
        </h3>
        <p className="text-[#6B6B6B] max-w-xs mx-auto">
          Dziękujemy za kontakt. Odpiszemy najszybciej jak to możliwe (zazwyczaj w ciągu 24h).
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 text-[#2D7A5F] font-medium hover:underline"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl text-[#1A1A1A] font-medium">Napisz do nas</h3>
        <p className="text-[#6B6B6B] text-sm mt-2">
          Wypełnij formularz, a my zajmiemy się resztą.
        </p>
        
        {/* Informacja wizualna dla klienta (nie wysyłana do bazy) */}
        {initialSubject && (
           <div className="mt-3 px-3 py-2 bg-[#2D7A5F]/10 rounded-lg text-sm text-[#2D7A5F] font-medium animate-in fade-in slide-in-from-top-2">
             Wybrano: {initialSubject.replace("Zgłoszenie: ", "")}
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
              Imię i nazwisko <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#2D7A5F] focus:bg-white focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#2D7A5F] focus:bg-white focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Adres e-mail <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#2D7A5F] focus:bg-white focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col">
          <label htmlFor="message" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Treść wiadomości
          </label>
          <textarea
            required
            name="message"
            id="message"
            // Tutaj wpisuje się automatyczna wiadomość z pakietu
            defaultValue={initialMessage}
            key={initialMessage} 
            placeholder="W czym możemy pomóc? Opisz sprawę..."
            className="w-full flex-1 min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#2D7A5F] focus:bg-white focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-start gap-3 pt-2">
          <div className="flex h-6 items-center">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-[#2D7A5F] focus:ring-[#2D7A5F] cursor-pointer accent-[#2D7A5F]"
            />
          </div>
          <div className="text-xs text-[#6B6B6B] leading-snug">
            <label htmlFor="consent" className="cursor-pointer select-none">
              Zapoznałem/am się z{" "}
              <Link 
                to="/polityka-prywatnosci" 
                target="_blank"
                className="text-[#2D7A5F] font-semibold hover:underline"
              >
                polityką prywatności
              </Link>
              {" "}i akceptuję jej treść. <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 break-words">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#2D7A5F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#2D7A5F]/25 hover:bg-[#23634c] hover:shadow-xl hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              Wyślij wiadomość <Send className="w-4 h-4" />
            </>
          )}
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-2">
          Twoje dane są bezpieczne i posłużą tylko do kontaktu.
        </p>
      </form>
    </div>
  );
}

// --- STANDARDOWE KOMPONENTY (BEZ ZMIAN) ---

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
        "bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-[#2D7A5F]/10 " +
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
          <div className="mt-3 text-[15px] sm:text-base text-[#4B4B4B] leading-relaxed break-words">
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
      <span className="min-w-0 flex-1 font-medium text-[15px] sm:text-base break-words whitespace-normal leading-tight">
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
        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
        bg-[#2D7A5F]/10 border border-[#2D7A5F]/15
        text-[#2D7A5F]
        hover:bg-[#2D7A5F]/15 transition
      "
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
}

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
        "bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-[#2D7A5F]/10 " +
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

// --- GŁÓWNY KOMPONENT STRONY ---
export default function ContactPage() {
  const [texts, setTexts] = useState<any>({});
  const [global, setGlobal] = useState<any>({});
  
  // LOGIKA ODBIERANIA DANYCH Z PAKIETU I SCROLLOWANIA
  const location = useLocation();
  const formScrollRef = useRef<HTMLDivElement>(null);

  // Odbieramy dane przekazane przez navigate() w state
  const state = location.state as { initialSubject?: string; initialMessage?: string } | null;

  // Efekt scrollowania do formularza
  useEffect(() => {
    if (state?.initialSubject && formScrollRef.current) {
      setTimeout(() => {
        formScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [state]);

  // 1. Pobieranie treści strony KONTAKT (ID 2710)
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${CONTACT_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("ContactPage fetch error:", e);
      }
    };
    fetchPage();
  }, []);

  // 2. Pobieranie ustawień GLOBALNYCH (ID 2756)
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const res = await fetch(`${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
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

  // Dane kontaktowe z globala
  const phone = global.global_phone || "739 079 729";
  const email = global.global_email || "biuro@opolskieubezpieczenia.pl";
  const address = global.global_address || "ul. Adama Mickiewicza lok. 14, 48-304 Nysa";
  
  const socialFb = global.social_fb || "https://www.facebook.com/share/1C4NtbsaYY/?mibextid=wwXIfr";
  const socialIg = global.social_ig || "https://www.instagram.com/opolskieubezpieczenia?igsh=MWR1ZDl1YnU4M3I4NA%3D%3Du0026utm_source=qr";
  const socialYt = global.social_yt || "https://www.youtube.com/watch?v=UBk4Xk2rwJk";

  const mailto = `mailto:${email}`;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

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
                {texts.contact_hero_title || "Kontakt"}
              </h1>

              <p className="text-white/85 leading-relaxed max-w-3xl text-base sm:text-lg">
                {texts.contact_hero_desc || "Masz pytania? Napisz lub zadzwoń — pomożemy dobrać najlepsze ubezpieczenie i przeprowadzimy przez formalności."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/oferta"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#2D7A5F] shadow-sm hover:bg-[#F5F1E8] transition"
                >
                  {texts.contact_btn_offer || "Zobacz ofertę"} <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={texts.contact_map_link || "https://maps.app.goo.gl/jvvjV6U89XR2LcnL9"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/25 hover:bg-white/15 transition"
                >
                  {texts.contact_btn_map || "Otwórz mapę"} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Prawy box — RESPONSYWNY I KOMPAKTOWY */}
            <div className="lg:col-span-4">
              <div className="w-full max-w-[520px] lg:max-w-none mx-auto lg:mx-0 lg:h-full lg:flex lg:items-center">
                <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
                  <div className="p-4 sm:p-5">
                    <div className="mt-4 space-y-2.5 sm:space-y-3">
                      <QuickAction
                        href={telHref}
                        Icon={Phone}
                        label={phone}
                        title={`Zadzwoń: ${phone}`}
                        variant="solid"
                      />
                      <QuickAction
                        href={mailto}
                        Icon={Mail}
                        label={email}
                        title={`Napisz: ${email}`}
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
        <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
        <div className="pointer-events-none absolute top-32 right-1/3 w-16 h-16 bg-[#2D7A5F]/5 rotate-45" />
        <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">
              {texts.contact_form_title || "Masz pytania? Skontaktuj się z nami!"}
            </h2>
            <p className="text-base sm:text-lg text-[#6B6B6B]">
              {texts.contact_form_desc || "Chętnie odpowiemy na Twoje pytania i pomożemy w wyborze najlepszych ubezpieczeń. Jesteśmy tutaj, aby wspierać Cię na każdym etapie."}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* FORM */}
            <div className="lg:col-span-7 h-full">
              <div 
                ref={formScrollRef}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#2D7A5F]/10 h-full"
              >
                <SimpleContactForm 
                   initialSubject={state?.initialSubject}
                   initialMessage={state?.initialMessage}
                />
              </div>
            </div>

            {/* INFO - PRAWY PANEL */}
            <div className="lg:col-span-5 h-full">
              <div className="h-full flex flex-col gap-4">
                <Panel icon={Mail} title="E-mail">
                  <a
                    href={mailto}
                    className="inline-flex items-center gap-2 text-[#2D7A5F] font-medium hover:opacity-80 no-underline whitespace-nowrap text-[min(16px,3.8vw)] sm:text-base"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {email}
                    <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
                  </a>
                </Panel>

                <Panel icon={MapPin} title="Adres">
                  <a
                    href={texts.contact_map_link || "https://maps.app.goo.gl/jvvjV6U89XR2LcnL9"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-[#2D7A5F] font-medium hover:opacity-80 no-underline"
                  >
                    Multiagencja Opolskie-Ubezpieczenia
                    <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
                  </a>
                  <div className="mt-2 text-[#4B4B4B] whitespace-pre-line">
                    {address}
                  </div>
                </Panel>

                <MediaPanel className="flex-1 min-h-0">
                  <div className="h-full flex flex-col min-h-0">
                    <div className="min-w-0 w-full mb-4">
                      <h3 className="text-xl sm:text-2xl text-[#1A1A1A] leading-tight">
                        {texts.contact_media_title || "Aktualności i nagrania"}
                      </h3>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-center gap-4 w-full">
                      <SocialSquare href={socialFb} label="Facebook" Icon={Facebook} />
                      <SocialSquare href={socialIg} label="Instagram" Icon={Instagram} />
                      <SocialSquare href={socialYt} label="YouTube" Icon={Youtube} />
                    </div>

                    <div className="flex-1 min-h-0 flex items-center justify-center pt-7 pb-4">
                      <div className="w-full">
                        <div className="mx-auto w-[96%] overflow-hidden rounded-2xl border border-[#2D7A5F]/10 bg-black">
                          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                              src={texts.contact_yt_embed || "https://www.youtube.com/embed/UBk4Xk2rwJk"}
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
              src={texts.contact_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d649881.6953256665!2d16.18518553125001!3d50.48578300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711c572599ab4ed%3A0xf0f770e9fbb664fb!2sMultiagencja%20Opolskie-Ubezpieczenia!5e0!3m2!1spl!2spl!4v1748727232162!5m2!1spl!2spl"}
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