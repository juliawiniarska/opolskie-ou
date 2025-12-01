import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // jeśli jest hash: przewiń do elementu
    if (hash) {
      const id = hash.replace("#", "");
      // mały timeout pomaga przy renderze po routingu
      window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return;
    }

    // jeśli zmiana strony bez hash — leć na górę
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}
