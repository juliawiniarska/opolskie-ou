import React, { useState, useEffect, useRef, useCallback } from "react";
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
  BookOpen,
  ShieldCheck,
  Globe,
  Clock,
  Briefcase
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PageLoader, usePageLoader } from "../GlobalContext";

/**
 * KONFIGURACJA ŚRODOWISKA WORDPRESS
 * Definicja domen, identyfikatorów stron oraz formularzy.
 */
const WP_DOMAIN = "https://www.opolskieubezpieczenia.pl";
const CONTACT_PAGE_ID = 2710;     // ID strony Kontaktowej w systemie WordPress
const GLOBAL_SETTINGS_ID = 2756;  // ID strony z ustawieniami globalnymi (ACF)
const WP_FORM_ID = "2675";        // ID formularza Contact Form 7

/**
 * DEFINICJE TYPÓW DANYCH
 * Mapowanie pól ACF (Advanced Custom Fields) pobieranych z API.
 */
type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

/**
 * SimpleContactForm Component
 * * Komponent odpowiedzialny za renderowanie formularza kontaktowego,
 * walidację po stronie klienta oraz asynchroniczną komunikację z WP REST API.
 * Obsługuje stany ładowania, sukcesu oraz błędu.
 */
function SimpleContactForm({ 
  initialSubject, 
  initialMessage 
}: { 
  initialSubject?: string; 
  initialMessage?: string; 
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  /**
   * Obsługa wysyłki formularza do Contact Form 7 API.
   * Funkcja mapuje pola formularza HTML na pola zdefiniowane w CF7.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Przygotowanie obiektu FormData dla silnika WordPress
    const wpFormData = new FormData();
    wpFormData.append('your-name', formData.get('name') as string);
    wpFormData.append('your-email', formData.get('email') as string);
    wpFormData.append('your-phone', formData.get('phone') as string);
    wpFormData.append('your-message', formData.get('message') as string);
    
    // Obsługa opcjonalnej zgody RODO (jeśli pole istnieje)
    if (formData.get('consent')) {
        wpFormData.append('your-consent', '1');
    }

    // Wymagany znacznik CF7 (unit tag)
    wpFormData.append('_wpcf7_unit_tag', 'contact_page_form');

    try {
      // 1. Próba wysyłki przez standardowy punkt końcowy API
      let url = `${WP_DOMAIN}/wp/wp-json/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback?t=${Date.now()}`;
      
      let response = await fetch(url, {
        method: "POST",
        body: wpFormData,
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      // 2. Fallback na trasę rest_route w razie problemów z permalinkami
      if (!response.ok || !isJson) {
        console.warn("API Endpoint fallback triggered...");
        url = `${WP_DOMAIN}/wp/?rest_route=/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback&t=${Date.now()}`;
        
        response = await fetch(url, {
          method: "POST",
          body: wpFormData,
        });
      }

      const finalContentType = response.headers.get("content-type");
      if (!finalContentType || !finalContentType.includes("application/json")) {
         const text = await response.text();
         console.error("Non-JSON Server Response:", text.slice(0, 200));
         throw new Error("Wystąpił problem z formatem odpowiedzi serwera.");
      }

      const json = await response.json();

      // Weryfikacja statusu zwróconego przez plugin CF7
      if (json.status === 'mail_sent') {
        setSuccess(true);
      } else {
        setError(true);
        if (json.status === 'validation_failed') {
          setErrorMsg("Proszę poprawnie wypełnić wymagane pola formularza.");
        } else {
          setErrorMsg(json.message || "Przesyłanie wiadomości nie powiodło się.");
        }
      }
    } catch (err: unknown) {
      console.error("Communication error:", err);
      setError(true);
      const errorMessage = err instanceof Error ? err.message : "Błąd sieci.";
      setErrorMsg(errorMessage.includes("fetch") ? "Brak połączenia z internetem." : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Widok po poprawnym wysłaniu wiadomości (Success State)
   */
  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#2D7A5F]/10 rounded-full flex items-center justify-center mb-6 text-[#2D7A5F] shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
          Dziękujemy za kontakt!
        </h3>
        <p className="text-[#6B6B6B] max-w-xs mx-auto leading-relaxed">
          Wiadomość została dostarczona do naszego zespołu. Odpowiemy niezwłocznie, zazwyczaj w ciągu jednego dnia roboczego.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 px-6 py-2 border-2 border-[#2D7A5F] text-[#2D7A5F] rounded-full font-medium hover:bg-[#2D7A5F] hover:text-white transition-all"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  /**
   * Widok domyślny formularza (Form State)
   */
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl text-[#1A1A1A] font-medium tracking-tight">Formularz kontaktowy</h3>
        <p className="text-[#6B6B6B] text-sm mt-2">
          Napisz do nas – nasi doradcy skontaktują się z Tobą w dogodnym terminie.
        </p>
        
        {initialSubject && (
           <div className="mt-4 px-4 py-2.5 bg-[#2D7A5F]/5 border-l-4 border-[#2D7A5F] rounded-r-lg text-sm text-[#2D7A5F] font-semibold animate-in slide-in-from-left-2">
             Temat: {initialSubject.replace("Zgłoszenie: ", "")}
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        {/* Kontener: Imię + Telefon */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold text-[#2D7A5F] uppercase tracking-wider ml-1">
              Twoje imię i nazwisko <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              id="name"
              placeholder="np. Jan Kowalski"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[#1A1A1A] focus:border-[#2D7A5F] focus:bg-white focus:ring-2 focus:ring-[#2D7A5F]/10 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-[#2D7A5F] uppercase tracking-wider ml-1">
              Numer telefonu
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="opcjonalnie"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[#1A1A1A] focus:border-[#2D7A5F] focus:bg-white focus:ring-2 focus:ring-[#2D7A5F]/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Adres E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Twój adres e-mail <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="twoj@email.pl"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[#1A1A1A] focus:border-[#2D7A5F] focus:bg-white focus:ring-2 focus:ring-[#2D7A5F]/10 outline-none transition-all"
          />
        </div>

        {/* Treść zapytania */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          <label htmlFor="message" className="text-xs font-bold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Jak możemy Ci pomóc?
          </label>
          <textarea
            required
            name="message"
            id="message"
            defaultValue={initialMessage}
            key={initialMessage} 
            placeholder="Opisz krótko sprawę, o którą chcesz zapytać..."
            className="w-full flex-1 min-h-[140px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[#1A1A1A] focus:border-[#2D7A5F] focus:bg-white focus:ring-2 focus:ring-[#2D7A5F]/10 outline-none transition-all resize-none"
          />
        </div>

        {/* Zgoda RODO */}
        <div className="flex items-start gap-3 pt-3">
          <div className="flex h-6 items-center">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-[#2D7A5F] focus:ring-[#2D7A5F] cursor-pointer accent-[#2D7A5F]"
            />
          </div>
          <div className="text-xs text-[#6B6B6B] leading-relaxed">
            <label htmlFor="consent" className="cursor-pointer select-none">
              Akceptuję warunki zawarte w{" "}
              <Link 
                to="/polityka-prywatnosci" 
                target="_blank"
                className="text-[#2D7A5F] font-bold hover:underline"
              >
                polityce prywatności
              </Link>
              {" "}i wyrażam zgodę na przetwarzanie danych. <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {/* Obsługa błędu UI */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Przycisk wysyłki */}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full flex items-center justify-center gap-3 rounded-xl bg-[#2D7A5F] px-6 py-4.5 font-bold text-white shadow-xl shadow-[#2D7A5F]/20 hover:bg-[#23634c] hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Przetwarzanie danych...
            </>
          ) : (
            <>
              Skontaktuj się z nami <Send className="w-5 h-5" />
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest mt-4">
          Wszystkie pola oznaczone gwiazdką (*) są obowiązkowe.
        </p>
      </form>
    </div>
  );
}

/**
 * Panel Component
 * Dekoracyjny kontener dla informacji kontaktowych.
 */
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
        "bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2D7A5F]/10 transform transition hover:scale-[1.005] " +
        className
      }
    >
      <div className="flex items-start gap-5">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/20 border border-[#2D7A5F]/20 flex items-center justify-center shadow-sm">
          <Icon className="w-7 h-7 text-[#2D7A5F]" />
        </div>

        <div className="min-w-0 w-full">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] leading-tight">
            {title}
          </h3>
          <div className="mt-4 text-[15px] sm:text-base text-[#4B4B4B] leading-relaxed break-words">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * QuickAction Component
 * Interaktywny przycisk szybkiego wyboru (Telefon/Mail).
 */
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
    "w-full flex items-center justify-between gap-4 rounded-2xl transition-all duration-300 " +
    "px-6 py-4.5 group";

  const solid =
    "bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] shadow-lg border border-transparent";
  const ghost =
    "bg-transparent hover:bg-white/10 text-white border border-white/20";

  return (
    <a
      href={href}
      title={title ?? label}
      className={`${base} ${variant === "solid" ? solid : ghost}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="w-5 h-5 shrink-0" />
        <span className="font-bold text-[15px] sm:text-base truncate tracking-tight">
          {label}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0 transform group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

/**
 * SocialSquare Component
 * Kwadratowy przycisk społecznościowy.
 */
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
        bg-gradient-to-br from-[#2D7A5F]/10 to-[#2D7A5F]/20 border border-[#2D7A5F]/15
        text-[#2D7A5F]
        hover:scale-105 hover:bg-[#2D7A5F]/25 transition-all
        shadow-sm
      "
    >
      <Icon className="w-7 h-7" />
    </a>
  );
}

/**
 * MediaPanel Component
 * Specjalny panel zawierający odnośniki social media oraz embed YouTube.
 */
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
        "bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2D7A5F]/10 " +
        className
      }
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 flex items-center justify-center shadow-sm">
          <Video className="w-7 h-7 text-[#2D7A5F]" />
        </div>
        <div className="min-w-0 w-full">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] leading-tight pt-1">
            Multimedia i Społeczność
          </h3>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/**
 * STRONA: KONTAKT
 * Komponent główny, agregujący wszystkie sekcje strony kontaktowej.
 */
export default function ContactPage() {
  const [texts, setTexts] = useState<AcfData>({});
  const [global, setGlobal] = useState<GlobalData>({});
  
  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();
  const { loading: loadingGlobal, fetchWithLoader: fetchGlobalReq } = usePageLoader();
  
  const isLoading = loadingTexts || loadingGlobal;
  const location = useLocation();
  const formScrollRef = useRef<HTMLDivElement>(null);

  /**
   * BACKUP SEO: Wymuszenie tytułu przez JS
   */
  useEffect(() => {
    document.title = "Kontakt – Profesjonalne Doradztwo Ubezpieczeniowe i Kredytowe Nysa | Opolskie Ubezpieczenia";
  }, []);

  // Odbiór danych przekazanych przez nawigację
  const state = location.state as { initialSubject?: string; initialMessage?: string } | null;

  /**
   * Obsługa autoscrolla po kliknięciu w pakiet na stronie głównej
   */
  useEffect(() => {
    if (state?.initialSubject && formScrollRef.current) {
      const timer = setTimeout(() => {
        formScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state]);

  /**
   * POBIERANIE TREŚCI STRONY (API WordPress)
   */
  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      try {
        const url = `${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${CONTACT_PAGE_ID}?_fields=acf&t=${Date.now()}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (err) {
        console.error("Content fetch failed:", err);
      }
    });
  }, [fetchTexts]);

  /**
   * POBIERANIE USTAWIEŃ GLOBALNYCH (API WordPress)
   */
  const loadGlobalData = useCallback(() => {
    fetchGlobalReq(async () => {
      try {
        const url = `${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (err) {
        console.error("Global settings fetch failed:", err);
      }
    });
  }, [fetchGlobalReq]);

  // Inicjalizacja pobierania danych
  useEffect(() => {
    loadTextsData();
    loadGlobalData();
  }, [loadTextsData, loadGlobalData]);

  // Destrukturyzacja danych globalnych
  const phone = global.global_phone || "";
  const email = global.global_email || "";
  const address = global.global_address || "ul. Kolejowa, Nysa";
  
  const socialFb = global.social_fb || "#";
  const socialIg = global.social_ig || "#";
  const socialYt = global.social_yt || "#";

  const mailto = `mailto:${email}`;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  /**
   * ZWROT COMPONENTU SEO (HELMET)
   */
  const seoContent = (
    <Helmet defer={false}>
      <title>Kontakt – Profesjonalne Doradztwo Ubezpieczeniowe i Kredytowe Nysa | Opolskie Ubezpieczenia</title>
      <meta name="description" content="Zapraszamy do kontaktu z biurem w Nysie. Oferujemy eksperckie doradztwo w zakresie ubezpieczeń i kredytów. Skontaktuj się telefonicznie, mailowo lub przez formularz." />
      <meta name="keywords" content="ubezpieczenia nysa, doradca kredytowy nysa, kontakt opolskie ubezpieczenia, wojciech kurzeja, kredyty hipoteczne nysa" />
      <link rel="canonical" href="https://www.opolskieubezpieczenia.pl/kontakt" />
    </Helmet>
  );

  // Loader globalny
  if (isLoading) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8] min-h-screen">
      {seoContent}

      {/* --- SEKCJA HERO --- */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-32 sm:pt-36 pb-16 sm:pb-20 lg:pb-24">
        {/* Dekoracyjne elementy tła */}
        <div className="pointer-events-none absolute top-10 right-[10%] w-32 h-32 border-8 border-white/5 rounded-full animate-pulse" />
        <div className="pointer-events-none absolute top-40 right-[25%] w-20 h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-[15%] w-48 h-48 border-8 border-white/5 rounded-full" />
        <div className="pointer-events-none absolute bottom-40 left-[5%] w-12 h-12 bg-white/5 rounded-full" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Lewa kolumna: Tekst */}
            <div className="lg:col-span-7 xl:col-span-8 max-w-4xl">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-xl">
                <MessageCircle className="w-7 h-7 text-white" strokeWidth={1.5} />
                <span className="text-white font-medium tracking-wide">Centrum Obsługi Klienta</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white font-bold leading-[1.1] mb-8 drop-shadow-sm">
                {texts.contact_hero_title || "Skontaktuj się z Ekspertem"}
              </h1>

              <p className="text-white/90 leading-relaxed max-w-2xl text-lg sm:text-xl font-light">
                {texts.contact_hero_desc || "Zapewniamy pełne wsparcie w doborze ubezpieczeń i procesach kredytowych. Zapraszamy do naszego biura w Nysie."}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/#oferta"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#2D7A5F] font-bold shadow-2xl hover:bg-[#F5F1E8] hover:scale-105 transition-all"
                >
                  {texts.contact_btn_offer || "Sprawdź ofertę"} <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href={texts.contact_map_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#23634c] text-white border border-white/10 shadow-xl hover:bg-[#1a4d3a] transition-all"
                >
                  {texts.contact_btn_map || "Wyznacz trasę"} <MapPin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Prawa kolumna: Szybkie akcje */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/0 rounded-[32px] blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />
                <div className="relative w-full bg-white/10 backdrop-blur-xl border border-white/25 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#2D7A5F]" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Szybki kontakt</span>
                  </div>

                  <div className="space-y-4">
                    <QuickAction
                      href={telHref}
                      Icon={Phone}
                      label={phone}
                      title={`Zadzwoń do nas: ${phone}`}
                      variant="solid"
                    />
                    <QuickAction
                      href={mailto}
                      Icon={Mail}
                      label={email}
                      title={`Napisz do nas: ${email}`}
                      variant="ghost"
                    />
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Pn - Pt: 8:00 - 16:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEKCJA GŁÓWNA (FORMULARZ + INFO) --- */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F1E8] relative">
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl text-[#1A1A1A] font-bold mb-6 tracking-tight">
              {texts.contact_form_title || "Napisz do nas wiadomość"}
            </h2>
            <div className="w-24 h-1.5 bg-[#2D7A5F] mx-auto mb-8 rounded-full" />
            <p className="text-lg sm:text-xl text-[#6B6B6B] leading-relaxed">
              {texts.contact_form_desc || "Masz pytania dotyczące polisy lub potrzebujesz analizy kredytowej? Skorzystaj z poniższego formularza."}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* BLOK: FORMULARZ */}
            <div className="lg:col-span-7">
              <div 
                ref={formScrollRef}
                className="bg-white rounded-[40px] p-8 sm:p-12 shadow-2xl border border-[#2D7A5F]/5 h-full transform transition duration-500 hover:shadow-[#2D7A5F]/5"
              >
                <SimpleContactForm 
                   initialSubject={state?.initialSubject}
                   initialMessage={state?.initialMessage}
                />
              </div>
            </div>

            {/* BLOK: INFORMACJE DODATKOWE */}
            <div className="lg:col-span-5">
              <div className="h-full flex flex-col gap-6 sm:gap-8">
                {/* Panel E-mail */}
                <Panel icon={Mail} title="Napisz do biura">
                  <p className="mb-4 text-sm text-gray-500 font-medium">Odpowiadamy na wszystkie zapytania drogą elektroniczną:</p>
                  <a
                    href={mailto}
                    className="inline-flex items-center gap-3 text-[#2D7A5F] font-bold hover:text-[#1a4d3a] no-underline group text-lg sm:text-xl"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {email}
                    <ExternalLink className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Panel>

                {/* Panel Adresowy */}
                <Panel icon={MapPin} title="Nasza lokalizacja">
                  <a
                    href={texts.contact_map_link || "#"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-[#2D7A5F] font-bold hover:underline mb-2 group"
                  >
                    <span>Multiagencja Opolskie-Ubezpieczenia</span>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:translate-y-[-2px] transition-transform" />
                  </a>
                  <div className="text-[#4B4B4B] font-medium leading-relaxed">
                    {address}
                    <br />
                    <span className="text-gray-400 text-sm font-normal">Nysa, Województwo Opolskie</span>
                  </div>
                </Panel>

                {/* Panel Social & Media */}
                <MediaPanel className="flex-1">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-sm text-[#2D7A5F] font-bold uppercase tracking-widest mb-6">
                        <Globe className="w-4 h-4" />
                        <span>Bądźmy w kontakcie</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-10">
                        <SocialSquare href={socialFb} label="Nasz profil Facebook" Icon={Facebook} />
                        <SocialSquare href={socialIg} label="Obserwuj na Instagramie" Icon={Instagram} />
                        <SocialSquare href={socialYt} label="Kanał YouTube" Icon={Youtube} />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-2 bg-[#2D7A5F]/10 rounded-3xl blur-lg scale-95 transition group-hover:scale-100" />
                      <div className="relative overflow-hidden rounded-2xl border-4 border-[#2D7A5F]/10 bg-black aspect-video shadow-2xl">
                        <iframe
                          src={texts.contact_yt_embed || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                          title="Opolskie Ubezpieczenia - Prezentacja Biura"
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </MediaPanel>
              </div>
            </div>
          </div>

          {/* --- MAPA GOOGLE --- */}
          <div className="mt-12 sm:mt-20">
            <div className="bg-white rounded-[40px] p-4 sm:p-6 shadow-2xl border border-[#2D7A5F]/10">
              <div className="overflow-hidden rounded-[32px] border border-gray-100">
                <iframe
                  src={texts.contact_map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2524.3168750849645!2d17.3340321!3d50.4728514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711cf298717887d%3A0xc07c570b5550a22!2sKolejowa%202%2C%2048-300%20Nysa!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl"}
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Biuro Nysa - Lokalizacja na mapie"
                />
              </div>
            </div>
          </div>

          {/* Sekcja footer kontaktu (Trust signals) */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <ShieldCheck className="w-10 h-10 text-[#2D7A5F] mb-3" />
              <span className="text-sm font-bold text-[#1A1A1A]">Pewna Ochrona</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Briefcase className="w-10 h-10 text-[#2D7A5F] mb-3" />
              <span className="text-sm font-bold text-[#1A1A1A]">Pełen Profesjonalizm</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <MapPin className="w-10 h-10 text-[#2D7A5F] mb-3" />
              <span className="text-sm font-bold text-[#1A1A1A]">Lokalne Biuro</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Send className="w-10 h-10 text-[#2D7A5F] mb-3" />
              <span className="text-sm font-bold text-[#1A1A1A]">Szybka Odpowiedź</span>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* Pusty div dla zachowania paddingu na dole strony */}
      <div className="pb-16" />
    </main>
  );
}