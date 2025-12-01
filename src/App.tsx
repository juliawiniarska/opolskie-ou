// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToHash } from "./components/ScrollToHash";

import { HeroSection } from "./components/HeroSection";
import { ServicesShowcase } from "./components/ServicesShowcase";
import { ExperienceSection } from "./components/ExperienceSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CTASection } from "./components/CTASection";

import InsuranceCalculatorPage from "./components/InsuranceCalculatorPage";
import OfferDetailPage from "./components/OfferDetailPage";
import AboutPage from "./components/AboutPage";

import BlogPage from "./components/BlogPage";
import BlogPostPage from "./components/BlogPostPage"; // ✅ DODAJ
import DroneRealizationsPage from "./components/DroneRealizationsPage";
import ContactPage from "./components/ContactPage";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesShowcase />
      <ExperienceSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col overflow-x-hidden">
      <ScrollToHash />
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/oferta/:slug" element={<OfferDetailPage />} />
          <Route path="/o-nas" element={<AboutPage />} />
          <Route path="/kalkulator" element={<InsuranceCalculatorPage />} />

          {/* LISTA */}
          <Route path="/porady-ubezpieczeniowe" element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* WPIS */}
          <Route path="/porady-ubezpieczeniowe/:slug" element={<BlogPostPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          {/* (opcjonalnie) fallback 404 */}
          {/* <Route path="*" element={<div className="px-6 py-16 text-center">Nie znaleziono strony</div>} /> */}
        <Route path="/realizacje-z-lotu-drona" element={<DroneRealizationsPage />} />
        <Route path="/kontakt" element={<ContactPage />} />


        </Routes>
      </main>

      <Footer />
    </div>
  );
}
