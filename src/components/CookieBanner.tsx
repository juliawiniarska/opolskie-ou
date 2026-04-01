import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, ShieldCheck } from "lucide-react";
// Importujemy hook loadera
import { usePageLoader } from "../GlobalContext";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  // Pobieramy stan ładowania z globalnego kontekstu
  const { loading } = usePageLoader();

  const CONSENT_EXPIRY_DAYS = 180; 

  const initConsentMode = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { window.dataLayer.push(args); }
    window.gtag = gtag;

    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'wait_for_update': 500
    });
  };

  const updateGoogleConsent = (granted: boolean) => {
    if (typeof window.gtag === 'function') {
      const status = granted ? 'granted' : 'denied';
      window.gtag('consent', 'update', {
        'ad_storage': status,
        'ad_user_data': status,
        'ad_personalization': status,
        'analytics_storage': status
      });
    }
  };

  useEffect(() => {
    initConsentMode();

    const storedConsent = localStorage.getItem("cookieConsent");
    
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        const now = new Date();
        const expiryTime = new Date(parsedConsent.expiry);

        if (now < expiryTime) {
          if (parsedConsent.type === "all") {
            updateGoogleConsent(true);
          }
          return; 
        } else {
          localStorage.removeItem("cookieConsent");
          showBanner();
        }
      } catch (e) {
        localStorage.removeItem("cookieConsent");
        showBanner();
      }
    } else {
      showBanner();
    }
  }, []);

  const showBanner = () => {
    // Zostawiamy 1s opóźnienia, ale renderowanie i tak zablokuje loader
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const setConsent = (type: "all" | "necessary") => {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const consentData = {
      type: type,
      timestamp: now.toISOString(),
      expiry: expiryDate.toISOString()
    };

    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    setIsVisible(false);

    if (type === "all") {
      updateGoogleConsent(true);
    } else {
      updateGoogleConsent(false);
    }
  };

  // KLUCZOWA ZMIANA:
  // Jeśli isVisible jest false LUB strona wciąż się ładuje (loading === true), nie pokazuj nic.
  if (!isVisible || loading) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none flex justify-center items-end">
      <div className="
        pointer-events-auto
        w-full max-w-5xl 
        bg-white 
        rounded-[32px] 
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        border border-[#2D7A5F]/10 
        p-5 sm:p-6 md:p-8
        flex flex-col lg:flex-row gap-6 lg:items-center justify-between
        animate-in slide-in-from-bottom-10 fade-in duration-700
      ">
        
        <div className="flex items-start gap-5">
          <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl bg-[#2D7A5F]/10 items-center justify-center text-[#2D7A5F]">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
              <span className="sm:hidden text-[#2D7A5F]"><Cookie className="w-5 h-5" /></span>
              Szanujemy Twoją prywatność
            </h3>
            <p className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-2xl">
              Używamy plików cookies, aby zapewnić poprawne działanie strony (ciasteczka niezbędne) oraz, za Twoją zgodą, do celów analitycznych i marketingowych. Gdy wybierzesz „Tylko niezbędne”, nie będziemy śledzić Twojego ruchu. Więcej w{" "}
              <Link 
                to="/polityka-prywatnosci" 
                className="text-[#2D7A5F] font-semibold hover:underline decoration-[#2D7A5F]/30 underline-offset-4 transition-all"
              >
                Polityce prywatności
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 lg:pl-8 lg:border-l lg:border-[#2D7A5F]/10 relative">
           <button 
             onClick={() => setConsent("necessary")}
             className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-[#2D7A5F] transition-colors md:hidden"
             aria-label="Zamknij"
           >
             <X className="w-6 h-6" />
           </button>

          <button
            onClick={() => setConsent("necessary")}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#2D7A5F]/20 text-[#2D7A5F] bg-transparent font-semibold text-sm sm:text-base hover:bg-[#2D7A5F]/5 hover:border-[#2D7A5F]/40 transition-all duration-300 whitespace-nowrap"
          >
            Tylko niezbędne
          </button>

          <button
            onClick={() => setConsent("all")}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#2D7A5F] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#2D7A5F]/20 hover:bg-[#23634c] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            Akceptuję wszystkie
          </button>
        </div>

      </div>
    </div>
  );
}