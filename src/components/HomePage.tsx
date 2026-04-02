import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { HeroSection } from "../components/HeroSection";
import { ServicesShowcase } from "../components/ServicesShowcase";
import { ExperienceSection } from "../components/ExperienceSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CTASection } from "../components/CTASection";

export default function HomePage() {
  // GŁÓWNE DANE SEO DLA STRONY STARTOWEJ
  const pageTitle = "Ubezpieczenia i kredyty Nysa – Multiagencja | Opolskie Ubezpieczenia";
  const pageDescription = "Najlepsze ubezpieczenia i doradztwo kredytowe w Nysie. Porównaj oferty wielu towarzystw i banków w jednym miejscu. Zadbaj o swoją przyszłość z ekspertami.";

  // Ręczne wymuszenie tytułu dla pewności przy nawigacji React Routera
  useEffect(() => {
    document.title = pageTitle;
  }, []);

  return (
    <>
      <Helmet defer={false}>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* Opcjonalnie: tagi Open Graph, żeby link ładnie wyglądał na Facebooku */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <ServicesShowcase />
      <ExperienceSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}