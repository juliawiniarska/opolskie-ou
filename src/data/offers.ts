import type { LucideIcon } from "lucide-react";
import { Car, Heart, Home, Plane, Briefcase, Tractor } from "lucide-react";

export type Offer = {
  slug: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
};


export const offers: Offer[] = [
  {
    slug: "ubezpieczenia-komunikacyjne",
    icon: Car,
    title: "Ubezpieczenia komunikacyjne",
    subtitle: "OC, AC, NNW, Assistance",
    description: "Kompleksowa ochrona Twojego pojazdu.",
    features: ["Porównanie ofert 20+ firm", "Rabaty dla bezpiecznych kierowców", "Pomoc w razie kolizji"],
    imageSrc: "/komunikacyjne.png",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
  {
    slug: "ubezpieczenia-osobowe",
    icon: Heart,
    title: "Ubezpieczenia osobowe",
    subtitle: "Życie, zdrowie, bezpieczeństwo",
    description: "Zabezpieczenie dla Ciebie i rodziny.",
    features: ["Ubezpieczenie na życie", "Pakiety zdrowotne", "Ochrona NNW"],
    imageSrc: "/offers/komunikacyjne.jpg",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
  {
    slug: "ubezpieczenia-majatkowe",
    icon: Home,
    title: "Ubezpieczenia majątkowe",
    subtitle: "Dom, mieszkanie",
    description: "Ochrona Twojego majątku.",
    features: ["Ubezpieczenie budynku", "Ochrona wyposażenia", "Assistance domowy"],
    imageSrc: "/offers/komunikacyjne.jpg",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
  {
    slug: "ubezpieczenia-turystyczne",
    icon: Plane,
    title: "Ubezpieczenia turystyczne",
    subtitle: "Wyjazdy, wakacje, podróże",
    description: "Bezpieczne podróże po świecie.",
    features: ["Koszty leczenia za granicą", "Ubezpieczenie bagażu", "OC w podróży"],
    imageSrc: "/offers/komunikacyjne.jpg",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
  {
    slug: "ubezpieczenia-firmowe",
    icon: Briefcase,
    title: "Ubezpieczenia firmowe",
    subtitle: "Ochrona Twojego biznesu",
    description: "Kompleksowa ochrona firmy.",
    features: ["OC działalności", "Mienie firmowe", "Ubezpieczenia pracowników"],
    imageSrc: "/offers/komunikacyjne.jpg",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
  {
    slug: "ubezpieczenia-rolne",
    icon: Tractor,
    title: "Ubezpieczenia rolne",
    subtitle: "Ochrona Twojego gospodarstwa",
    description: "Specjalizacja w sektorze rolnym.",
    features: ["Ubezpieczenie upraw", "Ochrona budynków", "Maszyny i sprzęt"],
    imageSrc: "/offers/komunikacyjne.jpg",
  imageAlt: "Ubezpieczenia komunikacyjne – samochód",
  },
];
