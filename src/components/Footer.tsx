import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F1E8] text-[#2D7A5F] border-t border-[#2D7A5F]/10">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
        {/* GÓRNA CZĘŚĆ */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-12 md:gap-80 mb-10">
          {/* BRAND + SOCIAL */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            {/* LOGO + NAZWA OBOK SIEBIE */}
            <div className="flex items-center gap-4">
              <img
                src="/logo-opolskie-ubezpiecznia.png"
                alt="Opolskie Ubezpieczenia"
                className="h-12 sm:h-16 w-auto"
              />
              <span className="text-lg sm:text-xl font-semibold text-[#2D7A5F]">
                Opolskie Ubezpieczenia
              </span>
            </div>

            <p className="text-[#2D7A5F]/70 text-sm sm:text-base leading-relaxed max-w-md">
              Multiagencja ubezpieczeniowa z ponad 12-letnim doświadczeniem.
              Specjalizujemy się w ubezpieczeniach rolnych, majątkowych
              i komunikacyjnych.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2D7A5F]/10 hover:bg-[#2D7A5F] text-[#2D7A5F] hover:text-white rounded-2xl flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* KONTAKT */}
          <div className="space-y-6 w-full max-w-sm">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                <Phone className="w-5 h-5 text-[#2D7A5F]" />
              </div>
              <a
                href="tel:739079729"
                className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors text-lg"
              >
                739 079 729
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                <Mail className="w-5 h-5 text-[#2D7A5F]" />
              </div>
              <a
                href="mailto:biuro@opolskieubezpieczenia.pl"
                className="text-[#2D7A5F] hover:text-[#1F5A43] transition-colors break-all text-lg"
              >
                biuro@opolskieubezpieczenia.pl
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#2D7A5F]/10 p-3 rounded-xl shrink-0">
                <MapPin className="w-5 h-5 text-[#2D7A5F]" />
              </div>
              <div className="text-[#2D7A5F] text-lg">
                Nysa, woj. opolskie
              </div>
            </div>
          </div>
        </div>

        {/* DOLNY PASEK */}
        <div className="pt-8 border-t border-[#2D7A5F]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-[#2D7A5F]/60 text-center sm:text-left">
            © {currentYear} Opolskie Ubezpieczenia. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="text-[#2D7A5F]/60 hover:text-[#2D7A5F] transition-colors"
            >
              Polityka prywatności
            </a>
            <a
              href="#"
              className="text-[#2D7A5F]/60 hover:text-[#2D7A5F] transition-colors"
            >
              Regulamin
            </a>
            <span className="text-[#2D7A5F]/60">Licencja KNF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
