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
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PageLoader, usePageLoader } from "../GlobalContext";

/**
 * @file ContactPage.tsx
 * @description Główny komponent strony kontaktowej Multiagencji Opolskie Ubezpieczenia.
 * Komponent integruje dane z WordPress CMS (ACF), obsługuje formularz kontaktowy
 * poprzez wtyczkę Contact Form 7 oraz implementuje logikę SEO (Helmet + document.title).
 * * @version 1.1.0
 * @author Gemini AI Agent (Custom Build)
 */

/**
 * --- KONFIGURACJA ŚRODOWISKA WORDPRESS ---
 * Poniższe stałe definiują adresy URL oraz identyfikatory stron w panelu WP.
 */
const WP_DOMAIN = "https://www.opolskieubezpieczenia.pl";
const CONTACT_PAGE_ID = 2710;   // Identyfikator podstrony Kontakt
const GLOBAL_SETTINGS_ID = 2756; // Identyfikator globalnych ustawień ACF
const WP_FORM_ID = "2675";      // Identyfikator formularza w Contact Form 7

/**
 * --- DEFINICJE TYPÓW (TYPESCRIPT) ---
 */
type AcfData = Record<string, string | undefined>;
type GlobalData = Record<string, string | undefined>;

/**
 * Komponent SimpleContactForm
 * * Obsługuje logikę formularza wysyłanego do WordPressa.
 * Zawiera walidację po stronie serwera CF7 oraz obsługę stanów UI.
 * * @param {string} initialSubject - Temat wiadomości przekazany z innej podstrony.
 * @param {string} initialMessage - Treść wiadomości przekazana z innej podstrony.
 */
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

  /**
   * Obsługa zdarzenia wysyłki formularza.
   * Buduje obiekt FormData kompatybilny z polami polskiego formularza CF7.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Mapowanie pól pod klucze zdefiniowane w Twoim WordPressie (Contact Form 7)
    const wpFormData = new FormData();
    wpFormData.append('your-name', formData.get('name') as string);
    wpFormData.append('your-email', formData.get('email') as string);
    wpFormData.append('your-phone', formData.get('phone') as string);
    wpFormData.append('your-message', formData.get('message') as string);
    
    // Obsługa zgody na przetwarzanie danych osobowych (RODO)
    if (formData.get('consent')) {
        wpFormData.append('your-consent', '1');
    }

    // Unikalny tag jednostki dla formularza - wymagany przez silnik CF7 API
    wpFormData.append('_wpcf7_unit_tag', 'rte');

    try {
      // Próba wysyłki przez główny endpoint REST API
      let url = `${WP_DOMAIN}/wp/wp-json/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback?t=${Date.now()}`;
      
      let response = await fetch(url, {
        method: "POST",
        body: wpFormData,
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      // Fallback: jeśli standardowy URL zawiedzie, próbujemy metody rest_route
      if (!response.ok || !isJson) {
        url = `${WP_DOMAIN}/wp/?rest_route=/contact-form-7/v1/contact-forms/${WP_FORM_ID}/feedback&t=${Date.now()}`;
        
        response = await fetch(url, {
          method: "POST",
          body: wpFormData,
        });
      }

      // Sprawdzenie czy serwer nie zwrócił błędu PHP (HTML zamiast JSON)
      const finalContentType = response.headers.get("content-type");
      if (!finalContentType || !finalContentType.includes("application/json")) {
         const text = await response.text();
         console.error("Non-JSON Server Error:", text.slice(0, 200));
         throw new Error("Serwer nie zwrócił potwierdzenia w formacie JSON.");
      }

      const json = await response.json();

      // Weryfikacja statusu logicznego mail_sent z wtyczki CF7
      if (json.status === 'mail_sent') {
        setSuccess(true);
      } else {
        setError(true);
        if (json.status === 'validation_failed') {
          setErrorMsg("Wypełnij wymagane pola i zaakceptuj politykę prywatności.");
        } else {
          setErrorMsg(json.message || "Błąd podczas przesyłania wiadomości.");
        }
      }
    } catch (err: unknown) {
      console.error("Communication error:", err);
      setError(true);
      setErrorMsg("Błąd połączenia. Spróbuj ponownie za chwilę.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renderowanie widoku po pomyślnym wysłaniu wiadomości.
   */
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
          Dziękujemy za kontakt. Nasz doradca skontaktuje się z Tobą najszybciej jak to możliwe.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 text-[#2D7A5F] font-medium hover:underline focus:outline-none"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  /**
   * Renderowanie głównego formularza HTML.
   */
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl text-[#1A1A1A] font-medium">Napisz do nas</h3>
        <p className="text-[#6B6B6B] text-sm mt-2">
          Twoje zgłoszenie trafi bezpośrednio do doradcy w Nysie.
        </p>
        
        {/* Informacja o wybranym temacie (np. z pakietu ubezpieczenia) */}
        {initialSubject && (
           <div className="mt-3 px-3 py-2 bg-[#2D7A5F]/10 rounded-lg text-sm text-[#2D7A5F] font-medium animate-in fade-in slide-in-from-top-2">
             Dotyczy: {initialSubject.replace("Zgłoszenie: ", "")}
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        {/* Imię i Telefon w jednym wierszu na dużych ekranach */}
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
              placeholder="Wpisz swoje dane"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] focus:border-[#2D7A5F] focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
              Telefon kontaktowy
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="+48..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] focus:border-[#2D7A5F] focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
            />
          </div>
        </div>

        {/* Pole E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Adres e-mail <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="twoj@adres.pl"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] focus:border-[#2D7A5F] focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all"
          />
        </div>

        {/* Treść wiadomości - elastyczna wysokość */}
        <div className="space-y-1.5 flex-1 flex flex-col">
          <label htmlFor="message" className="text-xs font-semibold text-[#2D7A5F] uppercase tracking-wider ml-1">
            Opisz swoją sprawę
          </label>
          <textarea
            required
            name="message"
            id="message"
            defaultValue={initialMessage}
            key={initialMessage} 
            placeholder="Napisz, jakiej polisy szukasz lub co chcesz zmienić w obecnym ubezpieczeniu..."
            className="w-full flex-1 min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[#1A1A1A] focus:border-[#2D7A5F] focus:ring-1 focus:ring-[#2D7A5F] outline-none transition-all resize-none"
          />
        </div>

        {/* Akceptacja RODO */}
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
              Zapoznałem/am się z treścią{" "}
              <Link 
                to="/polityka-prywatnosci" 
                target="_blank"
                className="text-[#2D7A5F] font-semibold hover:underline"
              >
                polityki prywatności
              </Link>
              {" "}i akceptuję jej warunki. <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {/* Wyświetlanie błędów walidacji lub serwera */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Przycisk akcji */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#2D7A5F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#2D7A5F]/25 hover:bg-[#23634c] hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            <>
              Wyślij zgłoszenie <Send className="w-4 h-4" />
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-gray-400 mt-2 uppercase tracking-widest">
          Szyfrowane połączenie SSL • Ochrona danych osobowych
        </p>
      </form>
    </div>
  );
}

/**
 * --- KOMPONENTY UI: Panele informacyjne ---
 */

/**
 * Komponent Panel
 * Dekoracyjny kontener dla bloków informacyjnych (Mail, Adres itp.)
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
        "bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-[#2D7A5F]/10 transform transition hover:scale-[1.01] " +
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

/**
 * Komponent QuickAction
 * Przyciski szybkiego kontaktu wyświetlane w sekcji Hero.
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
      <span className="min-w-0 flex-1 font-medium text-[15px] sm:text-base truncate">
        {label}
      </span>
      <ArrowRight className="w-4 h-4 shrink-0 opacity-90" />
    </a>
  );
}

/**
 * Komponent SocialSquare
 * Ikony mediów społecznościowych.
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
        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
        bg-[#2D7A5F]/10 border border-[#2D7A5F]/15
        text-[#2D7A5F]
        hover:bg-[#2D7A5F]/15 transition transform hover:scale-110
      "
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
}

/**
 * Komponent MediaPanel
 * Specjalny panel zawierający odtwarzacz wideo oraz linki social media.
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
            Aktualności i wideo
          </h3>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * --- GŁÓWNY KOMPONENT STRONY KONTAKTOWEJ ---
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
   * --- LOGIKA SEO I TYTUŁU ---
   * Manualne wymuszenie tytułu przez document.title (zabezpieczenie przed nawigacją back).
   */
  useEffect(() => {
    document.title = "Kontakt – Doradztwo Ubezpieczeniowe i Kredytowe Nysa | Opolskie Ubezpieczenia";
  }, []);

  // Odbieranie stanu przekazanego przez funkcję navigate
  const state = location.state as { initialSubject?: string; initialMessage?: string } | null;

  /**
   * Automatyczny scroll do formularza, jeśli użytkownik przyszedł ze strony głównej
   * wybierając konkretny pakiet ubezpieczenia.
   */
  useEffect(() => {
    if (state?.initialSubject && formScrollRef.current) {
      setTimeout(() => {
        formScrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [state]);

  /**
   * Pobieranie treści podstrony KONTAKT (ID 2710) z WP REST API.
   */
  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      try {
        const res = await fetch(`${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${CONTACT_PAGE_ID}?_fields=acf&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (err) {
        console.error("Contact data fetch error:", err);
      }
    });
  }, [fetchTexts]);

  /**
   * Pobieranie ustawień GLOBALNYCH (telefon, mail, social media) z WP REST API.
   */
  const loadGlobalData = useCallback(() => {
    fetchGlobalReq(async () => {
      try {
        const res = await fetch(`${WP_DOMAIN}/wp/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (err) {
        console.error("Global settings fetch error:", err);
      }
    });
  }, [fetchGlobalReq]);

  // Uruchomienie zapytań do API po zamontowaniu komponentu
  useEffect(() => {
    loadTextsData();
    loadGlobalData();
  }, [loadTextsData, loadGlobalData]);

  // Przygotowanie linków kontaktowych
  const phone = global.global_phone || "";
  const email = global.global_email || "";
  const address = global.global_address;
  
  const socialFb = global.social_fb || "#";
  const socialIg = global.social_ig || "#";
  const socialYt = global.social_yt || "#";

  const mailto = `mailto:${email}`;
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  /**
   * Definicja zawartości meta-tagów dla SEO.
   */
  const helmetContent = (
    <Helmet defer={false}>
      <title>Kontakt – Doradztwo Ubezpieczeniowe i Kredytowe Nysa | Opolskie Ubezpieczenia</title>
      <meta name="description" content="Skontaktuj się z biurem Opolskie Ubezpieczenia w Nysie. Oferujemy bezpłatną analizę polis i doradztwo kredytowe. Napisz, zadzwoń lub odwiedź nas osobiście." />
      <meta name="keywords" content="kontakt ubezpieczenia nysa, doradca kredytowy kontakt, ubezpieczenia komunikacyjne nysa, wojciech kurzeja kontakt" />
      <link rel="canonical" href="https://www.opolskieubezpieczenia.pl/kontakt" />
    </Helmet>
  );

  // Wyświetlanie pełnoekranowego loadera podczas pobierania danych
  if (isLoading) return <>{helmetContent}<PageLoader /></>;

  return (
    <>
      {helmetContent}
      <main className="bg-[#F5F1E8]">
        
        {/* --- SEKCJA HERO --- */}
        <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-12 sm:pb-14 lg:pb-16">
          {/* Elementy dekoracyjne tła */}
          <div className="pointer-events-none absolute top-14 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full animate-pulse" />
          <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
          <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full opacity-50" />

          <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
              {/* Opis sekcji Hero */}
              <div className="lg:col-span-8 max-w-4xl">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                  <MessageCircle className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8 font-bold">
                  {texts.contact_hero_title || "Skontaktuj się z nami"}
                </h1>

                <p className="text-white/85 leading-relaxed max-w-3xl text-base sm:text-lg font-medium">
                  {texts.contact_hero_desc}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/#oferta"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#2D7A5F] shadow-xl hover:bg-[#F5F1E8] transition font-bold"
                  >
                    {texts.contact_btn_offer} <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={texts.contact_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/25 hover:bg-white/15 transition font-bold"
                  >
                    {texts.contact_btn_map} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Szybkie akcje po prawej stronie (Desktop) */}
              <div className="lg:col-span-4 flex items-center">
                <div className="w-full max-w-[500px] lg:max-w-none mx-auto">
                  <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-6">
                    <div className="space-y-4">
                      <QuickAction
                        href={telHref}
                        Icon={Phone}
                        label={phone}
                        title={`Zadzwoń do biura: ${phone}`}
                        variant="solid"
                      />
                      <QuickAction
                        href={mailto}
                        Icon={Mail}
                        label={email}
                        title={`Napisz e-mail: ${email}`}
                        variant="ghost"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCJA GŁÓWNA: FORMULARZ + INFO --- */}
        <section className="py-10 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
          {/* Delikatne tło dekoracyjne */}
          <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
          <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
            {/* Nagłówek sekcji formularza */}
            <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4 font-bold">
                {texts.contact_form_title}
              </h2>
              <p className="text-base sm:text-lg text-[#6B6B6B]">
                {texts.contact_form_desc}
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* LEWA KOLUMNA: Formularz kontaktowy */}
              <div className="lg:col-span-7 h-full">
                <div 
                  ref={formScrollRef}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2D7A5F]/10 h-full"
                >
                  <SimpleContactForm 
                     initialSubject={state?.initialSubject}
                     initialMessage={state?.initialMessage}
                  />
                </div>
              </div>

              {/* PRAWA KOLUMNA: Panele informacyjne */}
              <div className="lg:col-span-5 h-full">
                <div className="h-full flex flex-col gap-4">
                  {/* Panel E-mail */}
                  <Panel icon={Mail} title="Adres e-mail">
                    <p className="mb-3 text-sm text-gray-500 font-medium">Oficjalna korespondencja:</p>
                    <a
                      href={mailto}
                      className="inline-flex items-center gap-2 text-[#2D7A5F] font-bold hover:opacity-80 transition no-underline break-all text-base sm:text-lg"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {email}
                      <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
                    </a>
                  </Panel>

                  {/* Panel Adresowy */}
                  <Panel icon={MapPin} title="Lokalizacja biura">
                    <a
                      href={texts.contact_map_link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-[#2D7A5F] font-bold hover:underline no-underline"
                    >
                      Nysa, ul. Kolejowa 15
                      <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
                    </a>
                    <div className="mt-2 text-[#4B4B4B] whitespace-pre-line leading-relaxed font-medium">
                      {address}
                    </div>
                  </Panel>

                  {/* Panel Media Społecznościowe + YouTube */}
                  <MediaPanel className="flex-1 min-h-0">
                    <div className="h-full flex flex-col min-h-0">
                      <div className="min-w-0 w-full mb-4">
                        <h3 className="text-xl sm:text-2xl text-[#1A1A1A] leading-tight font-semibold">
                          {texts.contact_media_title || "Nasze media"}
                        </h3>
                      </div>
                      
                      {/* Kwadratowe ikony Social Media */}
                      <div className="mt-2 flex items-center justify-center gap-4 w-full">
                        <SocialSquare href={socialFb} label="Odwiedź nasz Facebook" Icon={Facebook} />
                        <SocialSquare href={socialIg} label="Śledź nas na Instagramie" Icon={Instagram} />
                        <SocialSquare href={socialYt} label="Nasz kanał na YouTube" Icon={Youtube} />
                      </div>

                      {/* Embed odtwarzacza YouTube z WordPress ACF */}
                      <div className="flex-1 min-h-0 flex items-center justify-center pt-8 pb-4">
                        <div className="w-full">
                          <div className="mx-auto w-[98%] overflow-hidden rounded-2xl border border-[#2D7A5F]/15 bg-black shadow-2xl">
                            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                src={texts.contact_yt_embed}
                                title="Prezentacja Multiagencji Opolskie Ubezpieczenia"
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

            {/* --- SEKCJA: MAPA GOOGLE --- */}
            <div className="mt-12 bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-[#2D7A5F]/10 overflow-hidden group">
              <div className="overflow-hidden rounded-2xl grayscale-[0.2] group-hover:grayscale-0 transition duration-700">
                <iframe
                  src={texts.contact_map_embed}
                  width="100%"
                  height="480"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Interaktywna mapa dojazdu do biura w Nysie"
                  className="rounded-2xl"
                />
              </div>
            </div>

            {/* Stopka sekcji kontaktowej - Informacje dodatkowe */}
            <div className="mt-16 text-center text-[#6B6B6B] text-sm">
               <div className="flex items-center justify-center gap-6 flex-wrap opacity-60">
                 <span className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-[#2D7A5F]" /> Autoryzowany Agent</span>
                 <span className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-[#2D7A5F]" /> Ponad 20 towarzystw</span>
                 <span className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-[#2D7A5F]" /> Biuro w centrum Nysy</span>
               </div>
            </div>
          </div>
        </section>

        {/* --- DEKORACYJNY ODSTĘP DOLNY --- */}
        <section className="pb-20 bg-[#F5F1E8]">
           <div className="max-w-[1400px] mx-auto px-4 text-center">
              <div className="w-16 h-1.5 bg-[#2D7A5F]/10 mx-auto rounded-full" />
           </div>
        </section>

      </main>
    </>
  );
}