import { useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Car, Heart, Home, Plane, Briefcase, Tractor } from "lucide-react";

import { OfferPageHero } from "./offer/OfferPageHero";
import { OfferDetails } from "./offer/OfferDetails";
import { QuickActions } from "./offer/QuickActions";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const OFFERS_PAGE_ID = 2690; 

type OfferMap = {
  id: number;
  slug: string;
  icon: ReactNode;
};

type AcfData = Record<string, any>;

// Mapa powiązań: Tylko dane techniczne. Teksty płyną z WordPressa (ACF).
const OFFER_MAPPING: OfferMap[] = [
  { id: 1, slug: "ubezpieczenia-komunikacyjne", icon: <Car className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 2, slug: "ubezpieczenia-osobowe", icon: <Heart className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 3, slug: "ubezpieczenia-majatkowe", icon: <Home className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 4, slug: "ubezpieczenia-turystyczne", icon: <Plane className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 5, slug: "ubezpieczenia-firmowe", icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 6, slug: "ubezpieczenia-rolne", icon: <Tractor className="w-8 h-8" strokeWidth={1.5} /> },
];

export default function OfferDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [texts, setTexts] = useState<AcfData>({});
  
  const { loading, fetchWithLoader } = usePageLoader();

  // Pobieranie danych z WP
  const loadOfferData = useCallback(() => {
    fetchWithLoader(async () => {
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${OFFERS_PAGE_ID}?_fields=acf&t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.acf) setTexts(json.acf);
        }
      } catch (e) {
        console.error("Błąd pobierania danych oferty:", e);
      }
    });
  }, [fetchWithLoader]);

  useEffect(() => {
    loadOfferData();
  }, [loadOfferData]);

  // Znajdź konfigurację dla obecnego sluga
  const mapItem = useMemo(() => OFFER_MAPPING.find((o) => o.slug === slug), [slug]);

  // Jeśli nie ma takiego sluga
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

  // --- BUDOWANIE DANYCH Z ACF (Bez fallbacków tekstowych) ---
  const id = mapItem.id;
  
  const title = texts[`offer_${id}_title`];
  const category = texts[`offer_${id}_subtitle`]; // Zakładam, że kategoria to podtytuł z ACF
  const description = texts[`offer_${id}_long_desc`];
  const imageSrc = texts[`offer_${id}_img`];
  const imageAlt = title;

  // Listy (split po nowej linii, brak fallbacka "Brak danych")
  const includesRaw = texts[`offer_${id}_includes`];
  const includes = includesRaw ? includesRaw.split('\n').filter((l: string) => l.trim()) : [];

  const features = [
    {
      title: "Co dokładnie ogarnia polisa?",
      items: texts[`offer_${id}_feat1`] ? texts[`offer_${id}_feat1`].split('\n').filter((l: string) => l.trim()) : []
    },
    {
      title: "Dla kogo?",
      items: texts[`offer_${id}_feat2`] ? texts[`offer_${id}_feat2`].split('\n').filter((l: string) => l.trim()) : []
    },
    {
      title: "Dlaczego warto u nas?",
      items: texts[`offer_${id}_feat3`] ? texts[`offer_${id}_feat3`].split('\n').filter((l: string) => l.trim()) : []
    }
  ];

  const highlight = {
    title: "Wskazówka",
    description: texts[`offer_${id}_highlight`]
  };

  // Ustawienie Title strony
  useEffect(() => {
    if (title) {
        document.title = `${title} — Opolskie Ubezpieczenia`;
    }
  }, [title]);

  if (loading) return <PageLoader />;

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