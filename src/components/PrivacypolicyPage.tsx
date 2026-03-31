import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  FileText,
  Fingerprint
} from "lucide-react";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const PRIVACY_PAGE_ID = 2713; 
const GLOBAL_SETTINGS_ID = 2756;

// --- DOMYŚLNE TREŚCI (ZAPASOWE 1:1 Z ORYGINAŁU) ---
const DEFAULT_COMPANY = "Safe Way Wojciech Kurzeja";
const DEFAULT_NIP = "7532477717";
const DEFAULT_ADDRESS = "ul. Adama Mickiewicza 14, 48-304 Nysa";
const DEFAULT_EMAIL = "biuro@opolskieubezpieczenia.pl";

const DEFAULT_SEC2_LIST = [
  "Polityka prywatności wyjaśnia zasady przetwarzania, gromadzenia, ochrony i wykorzystywania informacji o Użytkownikach odwiedzających nasz Serwis.",
  "Safe Way Wojciech Kurzeja zbiera i przetwarza dane osobowe zgodnie z właściwymi przepisami, w tym w szczególności z RODO.",
  "Dane osobowe to wszelkie informacje o zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej.",
  "Serwis nie zbiera w sposób automatyczny danych osobowych. Przetwarzamy dane (imię, nazwisko, e-mail) wyłącznie, gdy Użytkownik skontaktuje się przez formularz lub kalkulator.",
  `Administratorem danych jest Safe Way Wojciech Kurzeja, ${DEFAULT_ADDRESS}. NIP: ${DEFAULT_NIP}.`,
  "W sprawach związanych z przetwarzaniem danych osobowych można kontaktować się z Administratorem drogą elektroniczną lub pisemnie.",
  "Dane zbieramy przez: formularze, kalkulatory, telefon, e-mail oraz pliki cookie.",
  "Cele przetwarzania: działanie strony, kontakt, oferty ubezpieczenia, analiza ruchu (Google Analytics) oraz marketing.",
  "Prawa Użytkownika: dostęp do danych, sprostowanie, ograniczenie przetwarzania, usunięcie, cofnięcie zgody, sprzeciw, skarga do Prezesa UODO.",
  "Marketing może obejmować profilowanie (dobór korzystniejszej oferty) przy użyciu algorytmów za zgodą Użytkownika.",
  "Podanie danych jest dobrowolne, ale konieczne do korzystania z Serwisu lub zawarcia umowy.",
  "Dane są przechowywane do czasu istnienia uzasadnionego interesu lub wygaśnięcia zgody.",
  "Odbiorcami danych mogą być firmy współpracujące: zakłady ubezpieczeń, operatorzy płatności, wsparcie IT.",
  "Safe Way Wojciech Kurzeja nie ponosi odpowiedzialności za błędy w danych przekazanych przez Użytkownika.",
  "Przywiązujemy ogromną wagę do zachowania i poszanowania prywatności naszych klientów.",
  "Zobowiązujemy się do zachowania poufności przekazanych danych.",
  "Informacje zawarte w Serwisie nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego.",
  "Zastrzega się możliwość wprowadzenia zmian w niniejszej polityce."
];

const DEFAULT_SEC3_LIST = [
  { t: "Administrator", c: `Safe Way Wojciech Kurzeja, ${DEFAULT_ADDRESS}, NIP: ${DEFAULT_NIP}, e-mail: ${DEFAULT_EMAIL}.` },
  { t: "Inspektor Ochrony Danych", c: "Administrator nie powołał Inspektora Ochrony Danych. Kontakt bezpośredni z Administratorem." },
  { t: "Zakres danych", c: "Imię, nazwisko, adres, telefon, e-mail, PESEL (jeśli wymagane prawem lub niezbędne do umowy)." },
  { t: "Źródło danych", c: "Bezpośrednio od osoby lub pośrednio od zakładów ubezpieczeń i kontrahentów." },
  { t: "Cele przetwarzania", c: "Zawarcie i realizacja umowy, oferty, korespondencja, obowiązki prawne, reklamacje, marketing." },
  { t: "Podstawy prawne", c: "Art. 6 ust. 1 lit. a, b, c, f RODO oraz przepisy branżowe (ubezpieczeniowe, rachunkowe)." },
  { t: "Przechowywanie", c: "Przez okres trwania umowy oraz do czasu przedawnienia roszczeń lub wygaśnięcia obowiązków ustawowych." },
  { t: "Odbiorcy", c: "Zakłady ubezpieczeń, księgowość, obsługa prawna, IT, podmioty uprawnione ustawowo." },
  { t: "Przekazywanie poza EOG", c: "Administrator nie planuje przekazywania danych poza Europejski Obszar Gospodarczy." },
  { t: "Prawa osoby", c: "Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, cofnięcie zgody, sprzeciw, skarga do Prezesa UODO." },
  { t: "Automatyzacja", c: "Brak zautomatyzowanego podejmowania decyzji w rozumieniu art. 22 RODO (chyba że za wyraźną zgodą)." },
  { t: "Informacja końcowa", c: "Podanie danych jest dobrowolne, ale niezbędne do realizacji usług ubezpieczeniowych." }
];

// Komponent pomocniczy dla spójnego stylu punktów
function PolicyPoint({ number, children }: { number?: string | number, children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 py-3 border-b border-[#2D7A5F]/5 last:border-0">
      {number && (
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#2D7A5F]/10 flex items-center justify-center text-[#2D7A5F] font-bold text-sm">
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
function PolicySection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#2D7A5F] flex items-center justify-center text-white shadow-lg shadow-[#2D7A5F]/20 flex-shrink-0">
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
  const [texts, setTexts] = useState<any>({});
  const [global, setGlobal] = useState<any>({});

  // 1. Pobieranie treści strony
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${PRIVACY_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("PrivacyPage fetch error:", e);
      }
    };
    fetchPage();
  }, []);

  // 2. Pobieranie danych globalnych
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Polityka Prywatności | Opolskie Ubezpieczenia";
  }, []);

  // --- DANE DYNAMICZNE Z GLOBALNYCH (lub fallback) ---
  const COMPANY_NAME = global.global_company_full || DEFAULT_COMPANY;
  // Adres z globala może mieć entery, zamieniamy je na przecinki do tekstu ciągłego
  const ADDRESS = global.global_address ? global.global_address.replace(/\n/g, ", ") : DEFAULT_ADDRESS;
  const NIP = global.global_nip || DEFAULT_NIP;

  // --- HELPERY DO PARSOWANIA ACF ---
  
  // Dzieli tekst po nowej linii
  const getList = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim() !== '');
  };

  // Dzieli tekst "Klucz: Wartość"
  const getKeyValueList = (text: string) => {
    const lines = getList(text);
    if (!lines) return null;
    return lines.map(line => {
      const parts = line.split(':');
      if (parts.length > 1) {
        return { t: parts[0].trim(), c: parts.slice(1).join(':').trim() };
      }
      return { t: '', c: line };
    });
  };

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
              {texts.privacy_hero_title || "Polityka Prywatności i Cookies"}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
              {texts.privacy_hero_desc || "Pełna treść dokumentacji prawnej dotyczącej ochrony danych osobowych oraz plików cookies serwisu opolskieubezpieczenia.pl."}
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
              title={texts.privacy_sec1_title || "I. Polityka cookies"} 
              icon={FileText}
            >
              {/* Jeśli jest treść HTML w ACF, wyświetl ją */}
              {texts.privacy_sec1_html ? (
                <div dangerouslySetInnerHTML={{ __html: texts.privacy_sec1_html }} />
              ) : (
                /* W przeciwnym razie wyświetl oryginalne punkty (FALLBACK) */
                <>
                  <PolicyPoint number="1">Serwis www.opolskieubezpieczenia.pl - nie zbiera w sposób automatyczny żadnych informacji, z wyjątkiem informacji zawartych w plikach cookie.</PolicyPoint>
                  <PolicyPoint number="2">Pliki cookie (tzw. "ciasteczka") stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do korzystania ze stron internetowych Serwisu. Cookies zazwyczaj zawierają nazwę strony internetowej, z której pochodzą, czas przechowywania ich na urządzeniu końcowym oraz unikalny sztuczny numer (identyfikator) nadawany przez dostawcę pliku Użytkownikowi.</PolicyPoint>
                  <PolicyPoint number="3">Podmiotem odpowiedzialnym za zamieszczenie na urządzeniu końcowym Użytkownika Serwisu plików cookie oraz uzyskującym do nich dostęp jest operator Serwisu {COMPANY_NAME}, {ADDRESS}. NIP: {NIP}.</PolicyPoint>
                  <PolicyPoint number="4">
                    Pliki cookie wykorzystywane są w celu:
                    <ul className="mt-3 space-y-2 pl-4 border-l border-[#2D7A5F]/20">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#2D7A5F] mt-2 flex-shrink-0" /> <span className="break-words">prawidłowego funkcjonowania stron internetowych;</span></li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#2D7A5F] mt-2 flex-shrink-0" /> <span className="break-words">dostosowania zawartości stron internetowych Serwisu do preferencji Użytkownika oraz optymalizacji korzystania ze stron internetowych;</span></li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#2D7A5F] mt-2 flex-shrink-0" /> <span className="break-words">tworzenia statystyk, które pomagają zrozumieć sposób korzystania z serwisu;</span></li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#2D7A5F] mt-2 flex-shrink-0" /> <span className="break-words">marketingu i remarketingu przy wsparciu partnerów (Synerise, Google Ads, Facebook Pixel).</span></li>
                    </ul>
                  </PolicyPoint>
                  <PolicyPoint number="5">W ramach serwisu stosowane są pliki cookie przekazujące dane do innych podmiotów: Facebook, Instagram, Google Ads, Google Analytics.</PolicyPoint>
                  <PolicyPoint number="6">W ramach Serwisu stosowane są przede wszystkim pliki cookie "sesyjne" (session cookies). Są one plikami tymczasowymi przechowywanymi do czasu opuszczenia strony lub wyłączenia przeglądarki.</PolicyPoint>
                  <PolicyPoint number="7">
                    W ramach Serwisu stosowane są również następujące rodzaje plików cookie:
                    <ul className="mt-3 space-y-3 pl-4 border-l border-[#2D7A5F]/20 text-sm">
                      <li><strong>Funkcjonalne pliki cookie</strong> – umożliwiające korzystanie z usług dostępnych w ramach Serwisu, w tym formularzy, wyszukiwarek i kalkulatorów.</li>
                      <li><strong>Analityczne pliki cookie</strong> – umożliwiające zbieranie informacji o sposobie korzystania ze stron (Google Analytics).</li>
                      <li><strong>Marketingowe pliki cookie</strong> – służące do kierowania reklam na podstawie aktywności (Instagram, Google Ads, Facebook Pixel).</li>
                    </ul>
                  </PolicyPoint>
                  <PolicyPoint number="8">Użytkownicy Serwisu mogą nie wyrazić zgody na działanie plików cookie określonych kategorii lub dokonać w każdym czasie zmiany ustawień przeglądarki internetowej dotyczących plików cookie.</PolicyPoint>
                  <PolicyPoint number="9">Operator Serwisu informuje, że ograniczenia stosowania plików cookie mogą wpłynąć na niektóre funkcjonalności dostępne na stronach internetowych Serwisu.</PolicyPoint>
                </>
              )}
            </PolicySection>

            {/* II. POLITYKA PRYWATNOŚCI */}
            <PolicySection 
              title={texts.privacy_sec2_title || "II. Polityka prywatności"} 
              icon={ShieldCheck}
            >
              {/* Jeśli lista w ACF, mapuj ją. Jeśli nie, mapuj domyślną. */}
              {(getList(texts.privacy_sec2_list) || DEFAULT_SEC2_LIST).map((text: string, idx: number) => (
                <PolicyPoint key={idx} number={idx + 1}>{text}</PolicyPoint>
              ))}
            </PolicySection>

            {/* OBOWIĄZEK INFORMACYJNY */}
            <PolicySection 
              title={texts.privacy_sec3_title || "Obowiązek informacyjny"} 
              icon={Fingerprint}
            >
              {(getKeyValueList(texts.privacy_sec3_list) || DEFAULT_SEC3_LIST).map((item: any, idx: number) => (
                <PolicyPoint key={idx} number={idx + 1}>
                  {item.t && <strong className="block text-[#1A1A1A] mb-1">{item.t}</strong>}
                  {item.c}
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
                  {texts.privacy_footer_date || "Nysa, 29 grudnia 2025 r."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}