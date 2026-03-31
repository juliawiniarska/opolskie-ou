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
import VehicleRegistrationPage from "./components/VehicleRegistrationPage";

import BlogPage from "./components/BlogPage";
import BlogPostPage from "./components/BlogPostPage";
import DroneRealizationsPage from "./components/DroneRealizationsPage";
import ContactPage from "./components/ContactPage";
import PrivacyPolicyPage from "./components/PrivacypolicyPage";
import { CookieBanner } from "./components/CookieBanner";
import FAQPage from "./components/FAQPage";
import CreditsPage from "./components/CreditsPage";
import CreditCalculatorPage from "./components/CreditCalculatorPage";
import { GlobalProvider } from './GlobalContext';


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
    <GlobalProvider>
      <div className="min-h-screen bg-[#F5F1E8] flex flex-col overflow-x-hidden relative">
        <ScrollToHash />
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/oferta/:slug" element={<OfferDetailPage />} />
            <Route path="/o-nas" element={<AboutPage />} />
            <Route path="/kalkulator" element={<InsuranceCalculatorPage />} />
            <Route path="/rejestracja-pojazdow" element={<VehicleRegistrationPage />} />

            {/* LISTA */}
            <Route path="/porady-ubezpieczeniowe" element={<BlogPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* WPIS */}
            <Route path="/porady-ubezpieczeniowe/:slug" element={<BlogPostPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            <Route path="/realizacje-z-lotu-drona" element={<DroneRealizationsPage />} />
            <Route path="/kontakt" element={<ContactPage />} />

            <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/kredyty" element={<CreditsPage />} />
            <Route path="/kredyty/:slug" element={<CreditsPage />} />
            <Route path="/kalkulator-kredytowy" element={<CreditCalculatorPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Baner cookies dodany na końcu, aby był widoczny globalnie */}
        <CookieBanner />
      </div>
    </GlobalProvider>
  );
}