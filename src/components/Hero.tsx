import { Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="relative bg-[#0A1628] text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="relative max-w-[1400px] mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left: Main messaging */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-[#2D7A5F] tracking-wider text-sm uppercase">
                Multiagencja ubezpieczeniowa · Nysa
              </span>
            </div>

            <h1 className="text-white leading-tight">
              Kompleksowe ubezpieczenia dla kierowców, rolników, firm i rodzin
            </h1>

            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Porównujemy oferty wiodących towarzystw ubezpieczeniowych i pomagamy 
              wybrać optymalną polisę dopasowaną do Twoich potrzeb. Z nami masz pewność, 
              że jesteś dobrze zabezpieczony.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                className="bg-[#2D7A5F] hover:bg-[#235A48] text-white px-8 py-6 rounded-md shadow-sm transition-colors"
              >
                Zobacz ofertę
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-[#2D7A5F] text-[#2D7A5F] hover:bg-[#2D7A5F]/10 px-8 py-6 rounded-md transition-colors"
              >
                Umów darmową konsultację
              </Button>
            </div>
          </div>

          {/* Right: Contact card */}
          <div className="flex justify-end">
            <div className="bg-[#152238] border border-[#1f3354] rounded-xl p-8 shadow-lg w-full max-w-md">
              <div className="space-y-6">
                <p className="text-white/60 text-sm uppercase tracking-wide">
                  Masz pytania?
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#2D7A5F]" />
                    <a href="tel:739079729" className="text-white text-2xl hover:text-[#2D7A5F] transition-colors">
                      739 079 729
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#2D7A5F]" />
                    <a href="mailto:biuro@opolskieubezpieczenia.pl" className="text-white/90 hover:text-[#2D7A5F] transition-colors break-all">
                      biuro@opolskieubezpieczenia.pl
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1f3354]">
                  <p className="text-white/60 text-sm">
                    Twój specjalista – <span className="text-white">Wojciech Kurzeja</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
