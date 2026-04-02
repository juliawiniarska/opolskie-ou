import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
// Ustawienia Globalne (Telefon, Email, Adres, Sociale, Stopka)
const GLOBAL_SETTINGS_ID = 2756; 

type GlobalData = Record<string, string | undefined>;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [global, setGlobal] = useState<GlobalData>({});

  const { loading, fetchWithLoader } = usePageLoader();

  const loadGlobalData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setGlobal(json.acf);
        }
      } catch (e) {
        console.error("Footer global settings error:", e);
      }
    });
  }, [fetchWithLoader]);

  useEffect(() => {
    loadGlobalData();
  }, [loadGlobalData]);

  // Zmienne bez fallbacków
  const logo = global.footer_logo;
  const desc = global.footer_desc;
  
  const phone = global.global_phone || "";
  const email = global.global_email || "";
  const address = global.global_address;

  const fbLink = global.social_fb;
  const igLink = global.social_ig;
  const ytLink = global.social_yt;

  if (loading) return <PageLoader />;

  return (
    <footer className="bg-[#F5F1E8] text-[#2D7A5F] border-t border-[#2D7A5F]/10">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
        {/* GÓRNA CZĘŚĆ */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-12 md:gap-80 mb-10">
          {/* BRAND + SOCIAL */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            {/* LOGO + NAZWA OBOK SIEBIE */}
            <div className="flex items-center gap-4">
              {logo && (
                <img
                  src={logo}
                  alt="Opolskie Ubezpieczenia"
                  className="h-12 sm:h-16 w-auto"
                />
              )}
              <span className="text-lg sm:text-xl font-semibold text-[#2D7A5F]">
                Opolskie Ubezpieczenia
              </span>
            </div>

            <p className="text-[#2D7A5F]/70 text-sm sm:text-base leading-relaxed max-w-md whitespace-pre-wrap">
              {desc}
            </p>

            <div className="flex items-center gap-3">
              {fbLink && (
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
                >
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
              {igLink && (
                <a
                  href={igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
              {ytLink && (
                <a
                  href={ytLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
                >
                  <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              )}
            </div>
          </div>

          {/* KONTAKT */}
          <div className="space-y-6 w-full max-w-sm">
            {phone && (
              <div className="flex items-center gap-4">
                <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                  <Phone className="w-5 h-5 text-[#2D7A5F]" />
                </div>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors text-lg"
                >
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="flex items-center gap-4">
                <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                  <Mail className="w-5 h-5 text-[#2D7A5F]" />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors break-all text-lg"
                >
                  {email}
                </a>
              </div>
            )}

            {address && (
              <div className="flex items-center gap-4">
                <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5 text-[#2D7A5F]" />
                </div>
                <div className="text-[#2D7A5F] text-lg whitespace-pre-line">
                  {address}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DOLNY PASEK */}
        <div className="pt-8 border-t border-[#2D7A5F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-[#2D7A5F]/60 text-center sm:text-left">
            © {currentYear} Opolskie Ubezpieczenia. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/polityka-prywatnosci"
              className="text-[#2D7A5F]/60 hover:text-[#2D7A5F] transition-colors"
            >
              Polityka prywatności
            </Link>
            <Link to="/faq" className="text-[#2D7A5F]/60 hover:text-[#2D7A5F] transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}