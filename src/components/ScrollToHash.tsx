import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Zwykła zmiana strony (bez #) – idziemy na samą górę
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const id = hash.replace("#", "");

    // Funkcja szukająca elementu i scrollująca
    const scrollToElement = () => {
      const element = document.getElementById(id);
      
      if (element) {
        // Obliczamy pozycję z uwzględnieniem headera (ok. 100px)
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        return true; // Znaleziono i przewinięto
      }
      return false; // Jeszcze nie ma elementu (loader się kręci)
    };

    // 1. Próbujemy przewinąć od razu
    if (scrollToElement()) return;

    // 2. Jeśli elementu jeszcze nie ma, szukamy go co 100ms
    const interval = setInterval(() => {
      if (scrollToElement()) {
        clearInterval(interval); // Znalazł i przewinął – wyłączamy szukanie
      }
    }, 100);

    // 3. Zabezpieczenie: przestajemy szukać po 5 sekundach (żeby nie obciążać przeglądarki)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    // Czyszczenie po odmontowaniu komponentu
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, hash]);

  return null;
}