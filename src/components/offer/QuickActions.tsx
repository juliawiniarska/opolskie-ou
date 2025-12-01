import { Phone, Mail, Calculator, FileText } from "lucide-react";

export function QuickActions() {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] text-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <a
            href="tel:739079729"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 sm:p-8 transition-all group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl mb-1.5 sm:mb-2">Zadzwoń teraz</h3>
            <p className="text-white/80 text-sm mb-3 sm:mb-4">
              Porozmawiaj z ekspertem
            </p>
            <div className="text-white/90">739 079 729</div>
          </a>

          <a
            href="mailto:biuro@opolskieubezpieczenia.pl"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 sm:p-8 transition-all group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl mb-1.5 sm:mb-2">Napisz do nas</h3>
            <p className="text-white/80 text-sm mb-3 sm:mb-4">
              Otrzymaj ofertę email
            </p>
            <div className="text-white/90 text-sm">biuro@opolskieubezpieczenia.pl</div>
          </a>

          <a
            href="/kalkulator"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 sm:p-8 transition-all group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl mb-1.5 sm:mb-2">Kalkulator</h3>
            <p className="text-white/80 text-sm mb-3 sm:mb-4">
              Oblicz składkę online
            </p>
            <div className="text-white/90 text-sm">Szybka wycena</div>
          </a>

          <a
            href="/#oferta"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-6 sm:p-8 transition-all group"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl mb-1.5 sm:mb-2">Pełna oferta</h3>
            <p className="text-white/80 text-sm mb-3 sm:mb-4">
              Zobacz wszystkie usługi
            </p>
            <div className="text-white/90 text-sm">6 kategorii</div>
          </a>
        </div>
      </div>
    </section>
  );
}
