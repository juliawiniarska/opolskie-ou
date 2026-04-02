import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { UmbrellaLoader } from "./components/ui/UmbrellaLoader";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const GLOBAL_SETTINGS_ID = 2756;

interface GlobalData {
  info: any;
  content: any;
  loading: boolean; // Dodajemy loading do kontekstu
  fetchWithLoader: (fn: () => Promise<void>) => Promise<void>; // Dodajemy funkcję do kontekstu
}

const GlobalContext = createContext<GlobalData | null>(null);

// --- Overlay z loaderem ---
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#F5F1E8] flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle,rgba(45,122,95,0.07)_0%,rgba(45,122,95,0)_65%)] rounded-full pointer-events-none" />
      <UmbrellaLoader />
    </div>
  );
}

// --- Hook używa teraz stanu z Contextu, a nie lokalnego ---
export function usePageLoader() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("usePageLoader musi być użyty wewnątrz GlobalProvider");
  
  return {
    loading: context.loading,
    fetchWithLoader: context.fetchWithLoader
  };
}

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<{ info: any; content: any } | null>(null);
  // Licznik aktywnych zadań - dzięki temu loader nie zniknie, dopóki wszystko się nie załaduje
  const [activeTasks, setActiveTasks] = useState(0);

  // Funkcja, która zarządza licznikiem zadań
  const fetchWithLoader = useCallback(async (fn: () => Promise<void>) => {
    setActiveTasks((prev) => prev + 1);
    try {
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      setActiveTasks((prev) => Math.max(0, prev - 1));
    }
  }, []);

  // Ładujemy dane globalne przy starcie
  useEffect(() => {
    const fetchGlobalData = async () => {
      // Globalne dane też traktujemy jako zadanie dla loadera
      setActiveTasks((prev) => prev + 1);
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf&t=${Date.now()}`
        );
        const json = res.ok ? await res.json() : {};
        const acf = json.acf ?? {};
        setData({ info: acf, content: acf });
      } catch (error) {
        console.error("Błąd pobierania danych globalnych:", error);
        setData({ info: {}, content: {} });
      } finally {
        setActiveTasks((prev) => Math.max(0, prev - 1));
      }
    };
    fetchGlobalData();
  }, []);

  const loading = activeTasks > 0 || !data;

  // Przekazujemy wszystko do Providera
  const value = {
    info: data?.info,
    content: data?.content,
    loading,
    fetchWithLoader
  };

  return (
    <GlobalContext.Provider value={value}>
      {/* Loader wyświetlamy TUTAJ, globalnie, nad całą aplikacją */}
      {loading && <PageLoader />}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext musi być użyty wewnątrz GlobalProvider");
  return context;
};