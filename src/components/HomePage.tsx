import { HeroSection } from "../components/HeroSection";
import { ServicesShowcase } from "../components/ServicesShowcase";
import { ExperienceSection } from "../components/ExperienceSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CTASection } from "../components/CTASection";

export default function HomePage() {
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
