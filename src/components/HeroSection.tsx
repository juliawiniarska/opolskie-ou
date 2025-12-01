import { ArrowRight, Shield, } from "lucide-react";

export function HeroSection() {
  // const stats = [
  //   { icon: CheckCircle2, value: "2500+", label: "Zadowolonych klientów" },
  //   { icon: TrendingUp, value: "20+", label: "Firm ubezpieczeniowych" },
  //   { icon: Shield, value: "100%", label: "Bezpieczeństwo" },
  // ];

  return (
    <section
      id="hero"
      className="relative bg-[#FFF9F0] pt-24 pb-20 sm:pb-24 lg:pb-32 overflow-hidden"
    >
      {/* Delikatny gradient tła sekcji */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff_0,_#F5F1E8_45%,_#E8E1D4_100%)]" />

      {/* Plamy dekoracyjne */}
      <div className="pointer-events-none absolute top-[-80px] right-[-160px] w-[420px] h-[420px] lg:w-[700px] lg:h-[700px] bg-[#2D7A5F]/6 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-80px] w-[320px] h-[320px] lg:w-[520px] lg:h-[520px] bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      {/* Ilustracja jako tło na mobile / tablet – na całą sekcję, przyklejona do góry */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
  <img
    src="/aaaaaa.png"
    alt="Konsultacja ubezpieczeniowa"
    className="h-full w-full object-cover object-bottom opacity-30"
  />
</div>


      {/* Ilustracja po prawej – desktop */}
      <div className="pointer-events-none absolute inset-y-[-40px] right-0 hidden w-[100%] lg:block">
        <div className="relative h-full">
          <img
            src="aa.png"
            alt="Konsultacja ubezpieczeniowa"
            className="h-full w-full object-cover rounded-[4.5rem] opacity-50"
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] lg:max-w-[1800px] px-6 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* LEWA STRONA */}
          <div className="lg:col-span-7 space-y-8">
            {/* Nagłówek + opis */}
            <div className="space-y-5 sm:space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D7A5F]/15 bg-white/80 px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#2D7A5F] shadow-sm shadow-[#2D7A5F]/10">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2D7A5F]/10">
                  <Shield className="h-3.5 w-3.5 text-[#2D7A5F]" />
                </span>
                Multiagencja ubezpieczeniowa • Nysa
              </p>

              <h1 className="text-[#2D7A5F] text-[2.5rem] sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] leading-[1.05] font-bold tracking-tight">
                <span className="block">Twoje bezpieczeństwo</span>
                <span className="block text-[#1B5C45]">to nasza misja</span>
              </h1>

              <p className="max-w-2xl text-lg sm:text-xl text-[#2D7A5F]/70 leading-relaxed">
                Kompleksowe ubezpieczenia dla Ciebie, Twojej rodziny i firmy.
                Porównujemy 10+ ofert i znajdujemy najlepsze rozwiązanie.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4 sm:pt-6">
              <button className="group flex items-center gap-3 rounded-2xl bg-[#2D7A5F] px-8 sm:px-10 py-4 sm:py-5 text-white shadow-xl shadow-[#2D7A5F]/30 transition-all hover:bg-[#1F5A43] hover:shadow-2xl hover:shadow-[#2D7A5F]/40">
                <span className="text-base sm:text-lg">Kalkulator online</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Statystyki zaufania */}
            {/* <div className="pt-6 sm:pt-8">
              <div className="flex flex-wrap gap-6 sm:gap-10">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#2D7A5F]/10 p-3">
                      <stat.icon
                        className="h-6 w-6 text-[#2D7A5F]"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl text-[#2D7A5F]">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#2D7A5F]/60">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* PRAWA STRONA – karta konsultacji */}
          <div className="relative mt-8 lg:mt-0 lg:col-span-5 lg:flex lg:items-center lg:justify-end">
<div className="relative z-10 w-full rounded-3xl border border-[#2D7A5F]/10 bg-white p-7 sm:p-8 lg:p-10 shadow-2xl lg:max-w-[460px] lg:ml-auto lg:translate-y-6">
              <div className="space-y-6 ">
                <div className="space-y-3 ">
                  <h3 className="text-2xl sm:text-3xl text-[#2D7A5F]">
                    Umów się na konsultację
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-[#2D7A5F]/70">
                    Skontaktuj się z naszym ekspertem i otrzymaj
                    spersonalizowaną ofertę.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#F5F1E8] p-5 sm:p-6">
                    <div className="mb-2 text-sm text-[#2D7A5F]/60">
                      Telefon
                    </div>
                    <a
                      href="tel:739079729"
                      className="text-2xl sm:text-3xl text-[#2D7A5F] transition-colors hover:text-[#1F5A43]"
                    >
                      739 079 729
                    </a>
                  </div>

                  <div className="rounded-2xl bg-[#F5F1E8] p-5 sm:p-6">
                    <div className="mb-2 text-sm text-[#2D7A5F]/60">Email</div>
                    <a
                      href="mailto:biuro@opolskieubezpieczenia.pl"
                      className="break-all text-sm sm:text-base text-[#2D7A5F] transition-colors hover:text-[#1F5A43]"
                    >
                      biuro@opolskieubezpieczenia.pl
                    </a>
                  </div>
                </div>

                <div className="border-t border-[#2D7A5F]/10 pt-5 sm:pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D7A5F]/10 sm:h-16 sm:w-16">
                      <span className="text-xl sm:text-2xl text-[#2D7A5F]">
                        WK
                      </span>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg text-[#2D7A5F]">
                        Wojciech Kurzeja
                      </div>
                      <div className="text-sm text-[#2D7A5F]/60">
                        Ekspert ubezpieczeniowy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fala na dole sekcji */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-[70px] w-full"
        >
          <path
            d="M0,64L48,64C96,64,192,64,288,69.3C384,75,480,85,576,85.3C672,85,768,75,864,69.3C960,64,1056,64,1152,74.7C1248,85,1344,107,1392,117.3L1440,128L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="fill-[#F5F1E8]"
          />
        </svg>
      </div>
    </section>
  );
}
