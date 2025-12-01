import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Anna Kowalska",
    role: "Właścicielka gospodarstwa rolnego",
    content:
      "Pan Wojciech profesjonalnie doradzał przy wyborze ubezpieczenia dla naszego gospodarstwa. Dzięki niemu oszczędzamy kilkaset złotych rocznie, a mamy lepszą ochronę.",
    savings: "450 zł",
  },
  {
    name: "Marek Dąbrowski",
    role: "Przedsiębiorca, Nysa",
    content:
      "Współpraca z Opolskie Ubezpieczenia to sama przyjemność. Szybko, sprawnie i bez zbędnych formalności. Polecam każdemu!",
    savings: "380 zł",
  },
  {
    name: "Katarzyna Wiśniewska",
    role: "Klientka indywidualna",
    content:
      "Wreszcie ktoś, kto naprawdę słucha i dopasowuje ofertę do moich potrzeb. Profesjonalizm na najwyższym poziomie!",
    savings: "320 zł",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32 bg-[#F5F1E8] overflow-hidden">
      {/* delikatna dekoracja tylko na większych ekranach */}
      <div className="pointer-events-none hidden md:block absolute -top-24 -left-24 w-80 h-80 bg-[#2D7A5F]/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        {/* NAGŁÓWEK SEKCJI */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-5 sm:mb-6">
            <span className="text-[#2D7A5F] uppercase tracking-widest text-xs sm:text-sm bg-[#2D7A5F]/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full">
              Opinie klientów
            </span>
          </div>

          <h2 className="text-[#2D7A5F] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 sm:mb-5">
            Setki zadowolonych klientów
          </h2>

          <p className="text-[#2D7A5F]/70 text-sm sm:text-base lg:text-lg leading-relaxed">
            Zobacz, jak oceniają nas klienci oraz jakie oszczędności udało im się
            uzyskać dzięki dopasowanym ubezpieczeniom.
          </p>
        </div>

        {/* KARTY Z OPINIAMI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="
                group
                bg-white
                hover:bg-[#2D7A5F]
                rounded-2xl sm:rounded-3xl
                p-6 sm:p-7 lg:p-10
                shadow-xl hover:shadow-2xl
                transition-all duration-500
                hover:-translate-y-2
                relative overflow-hidden
              "
            >
              {/* dekoracyjne kółko w rogu */}
              <div
                className="
                  absolute -top-10 -right-10
                  w-24 h-24 sm:w-32 sm:h-32
                  bg-[#2D7A5F]/5 group-hover:bg-white/10
                  rounded-full
                  transition-colors
                "
              />

              <div className="relative space-y-4 sm:space-y-5">
                {/* ikona cudzysłowu */}
                <Quote
                  className="
                    w-8 h-8 sm:w-10 sm:h-10
                    text-[#2D7A5F]/20
                    group-hover:text-white/25
                    transition-colors
                  "
                />

                {/* treść opinii */}
                <p
                  className="
                    text-sm sm:text-base lg:text-lg
                    leading-relaxed
                    text-[#2D7A5F]/80
                    group-hover:text-white/90
                    transition-colors
                  "
                >
                  “{testimonial.content}”
                </p>

                {/* badge z oszczędnością */}
                <div
                  className="
                    inline-flex items-center gap-2
                    bg-[#2D7A5F]/10
                    group-hover:bg-white/20
                    px-3 py-1.5 sm:px-4 sm:py-2
                    rounded-full
                    transition-colors
                  "
                >
                  <span
                    className="
                      text-xs sm:text-sm
                      text-[#2D7A5F]
                      group-hover:text-white
                      transition-colors
                    "
                  >
                    Oszczędność:{" "}
                    <span className="font-semibold">
                      {testimonial.savings}
                    </span>{" "}
                    rocznie
                  </span>
                </div>

                {/* autor */}
                <div
                  className="
                    pt-4 sm:pt-5
                    border-t border-[#2D7A5F]/10
                    group-hover:border-white/20
                    transition-colors
                  "
                >
                  <div
                    className="
                      text-base sm:text-lg
                      text-[#2D7A5F]
                      group-hover:text-white
                      transition-colors
                    "
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="
                      text-xs sm:text-sm
                      text-[#2D7A5F]/60
                      group-hover:text-white/70
                      transition-colors
                    "
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 
          WORDPRESS – w tym miejscu w Gutenbergu wklej shortcode z wtyczki:
          [trustindex no-registration=google]
        */}
        {/*
          [trustindex no-registration=google]
        */}
      </div>
    </section>
  );
}
