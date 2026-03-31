// src/GlobalContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { UmbrellaLoader } from "./components/ui/UmbrellaLoader";

// ── Dostosuj do swojego projektu ───────────────────────────────────────────
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const GLOBAL_SETTINGS_ID = 2756;
// ──────────────────────────────────────────────────────────────────────────

interface GlobalData {
  info: any;
  content: any;
}

const GlobalContext = createContext<GlobalData | null>(null);

// ── Overlay z loaderem — używaj: if (loading) return <PageLoader /> ────────
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#F5F1E8] flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle,rgba(45,122,95,0.07)_0%,rgba(45,122,95,0)_65%)] rounded-full pointer-events-none" />
      <UmbrellaLoader />
      
    </div>
  );
}

// ── Hook do użycia w każdym komponencie strony ─────────────────────────────
// Przykład użycia w komponencie:
//
//   const { loading, fetchWithLoader } = usePageLoader();
//   useEffect(() => {
//     fetchWithLoader(async () => {
//       const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/123?_fields=acf`);
//       setTexts((await res.json()).acf);
//     });
//   }, []);
//   if (loading) return <PageLoader />;
//
export function usePageLoader() {
  const [loading, setLoading] = useState(true);

  const fetchWithLoader = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchWithLoader };
}

// ── Globalny provider — ładuje dane wspólne dla całej aplikacji ────────────
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GlobalData | null>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/wp-json/wp/v2/pages/${GLOBAL_SETTINGS_ID}?_fields=acf`
        );
        const json = res.ok ? await res.json() : {};
        const acf = json.acf ?? {};
        setData({ info: acf, content: acf });
      } catch (error) {
        console.error("Błąd pobierania danych globalnych z WP:", error);
        setData({ info: {}, content: {} });
      }
    };
    fetchGlobalData();
  }, []);

  if (!data) {
    return <PageLoader />;
  }

  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext musi być użyty wewnątrz GlobalProvider");
  return context;
};