import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Car, Heart, Home, Plane, Briefcase, Tractor } from "lucide-react";

import { OfferPageHero } from "./offer/OfferPageHero";
import { OfferDetails } from "./offer/OfferDetails";
import { QuickActions } from "./offer/QuickActions";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const OFFERS_PAGE_ID = 2690; // To samo ID co wyżej

type OfferMap = {
  id: number;
  slug: string;
  icon: ReactNode;
  defaultTitle: string;
  defaultCategory: string;
  defaultDesc: string;
  defaultImage: string;
};

// Mapa powiązań: Slug -> ID w ACF
const OFFER_MAPPING: OfferMap[] = [
  { id: 1, slug: "ubezpieczenia-komunikacyjne", icon: <Car className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia komunikacyjne", defaultCategory: "Ubezpieczenia komunikacyjne", defaultDesc: "Kompleksowa ochrona Twojego pojazdu — prowadź spokojnie i miej wsparcie wtedy, gdy naprawdę jest potrzebne. Dobieramy zakres, porównujemy warianty i pomagamy w formalnościach oraz po szkodzie.", defaultImage: "/komunikacyjne.png" },
  { id: 2, slug: "ubezpieczenia-osobowe", icon: <Heart className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia osobowe", defaultCategory: "Ubezpieczenia osobowe", defaultDesc: "Kompleksowa ochrona życia i zdrowia — wybierz bezpieczeństwo dla siebie i bliskich. Dobieramy polisę do Twojej sytuacji (rodzina, praca, zobowiązania), porównujemy oferty wielu towarzystw i pomagamy w formalnościach.", defaultImage: "/osobowe.png" },
  { id: 3, slug: "ubezpieczenia-majatkowe", icon: <Home className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia majątkowe", defaultCategory: "Ubezpieczenia majątkowe", defaultDesc: "Kompleksowa ochrona Twojego mienia — domu, mieszkania i wyposażenia. Dobieramy zakres do realnej wartości, pomagamy rozszerzyć ochronę o OC w życiu prywatnym i przeprowadzamy przez formalności oraz zgłoszenie szkody.", defaultImage: "/majatkowe.png" },
  { id: 4, slug: "ubezpieczenia-turystyczne", icon: <Plane className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia turystyczne", defaultCategory: "Ubezpieczenia turystyczne", defaultDesc: "Kompleksowa ochrona w podróży — dobieramy polisę do kraju, celu i stylu wyjazdu. Porównujemy oferty wielu towarzystw i kompletujemy zakres tak, żebyś w razie problemu miał(a) realne wsparcie, a nie tylko „ładną nazwę” na papierze.", defaultImage: "/turystyczne.png" },
  { id: 5, slug: "ubezpieczenia-firmowe", icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia firmowe", defaultCategory: "Ubezpieczenia firmowe", defaultDesc: "Kompleksowa ochrona Twojego biznesu — dobieramy polisy do profilu działalności, wartości majątku i ryzyk branżowych. Porównujemy wiele towarzystw i prowadzimy od wyceny po zgłoszenie szkody.", defaultImage: "/firmowe.png" },
  { id: 6, slug: "ubezpieczenia-rolne", icon: <Tractor className="w-8 h-8" strokeWidth={1.5} />, defaultTitle: "Ubezpieczenia rolne", defaultCategory: "Ubezpieczenia rolne", defaultDesc: "Ubezpieczenia dla rolników — chroń gospodarstwo i pracuj bez stresu. Dobieramy ochronę upraw, maszyn i budynków, pomagamy w formalnościach i sprawdzamy możliwości dopłat, żeby składka była realnie niższa.", defaultImage: "/rolne.png" },
];

export default function OfferDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [texts, setTexts] = useState<any>({});
const [, setLoading] = useState(true);
  // Pobieranie danych z WP
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${OFFERS_PAGE_ID}?_fields=acf`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchPage();
  }, []);

  // Znajdź konfigurację dla obecnego sluga
  const mapItem = useMemo(() => OFFER_MAPPING.find((o) => o.slug === slug), [slug]);

  // Jeśli nie ma takiego sluga lub dane się ładują (można dodać loader)
  if (!mapItem) {
    return (
      <main className="bg-[#F5F1E8] pt-28 pb-16">
        <div className="max-w-[1800px] mx-auto px-4 text-center">
          <h1 className="text-2xl text-[#2D7A5F]">Nie znaleziono oferty</h1>
          <a href="/#oferta" className="block mt-4 text-gray-600 underline">Wróć do oferty</a>
        </div>
      </main>
    );
  }

  // --- BUDOWANIE DANYCH ---
  // Używamy danych z ACF jeśli są, jak nie to defaulty (zabezpieczenie)
  const id = mapItem.id;
  
  const title = texts[`offer_${id}_title`] || mapItem.defaultTitle;
  // Category bierzemy z tytułu lub subtitle, żeby nie mnożyć pól, albo na sztywno
  const category = mapItem.defaultCategory; 
  const description = texts[`offer_${id}_long_desc`] || mapItem.defaultDesc;
  const imageSrc = texts[`offer_${id}_img`] || mapItem.defaultImage;
  const imageAlt = title;

  // Listy (split po nowej linii)
  const includesRaw = texts[`offer_${id}_includes`];
  const includes = includesRaw ? includesRaw.split('\n').filter((l:any) => l.trim()) : ["Brak danych"];

  const features = [
    {
      title: "Co dokładnie ogarnia polisa?",
      items: texts[`offer_${id}_feat1`] ? texts[`offer_${id}_feat1`].split('\n').filter((l:any) => l.trim()) : []
    },
    {
      title: "Dla kogo?",
      items: texts[`offer_${id}_feat2`] ? texts[`offer_${id}_feat2`].split('\n').filter((l:any) => l.trim()) : []
    },
    {
      title: "Dlaczego warto u nas?",
      items: texts[`offer_${id}_feat3`] ? texts[`offer_${id}_feat3`].split('\n').filter((l:any) => l.trim()) : []
    }
  ];

  const highlight = {
    title: "Wskazówka",
    description: texts[`offer_${id}_highlight`] || "Skontaktuj się z nami po szczegóły."
  };

  // Ustawienie Title strony
  document.title = `${title} — Opolskie Ubezpieczenia`;

  return (
    <main className="bg-[#F5F1E8]">
      <OfferPageHero
        title={title}
        description={description}
        category={category}
        icon={mapItem.icon}
        backTo="/#oferta"
      />

      <OfferDetails
        includes={includes}
        features={features}
        highlight={highlight}
        sideImageSrc={imageSrc}
        sideImageAlt={imageAlt}
      />

      <QuickActions />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 pb-10">
        {/* Shortcody */}
      </div>
    </main>
  );
}