import { Star, Quote } from "lucide-react";

const reviews = [
  {
    author: "Anna K.",
    text: "Profesjonalna obsługa i świetne doradztwo. Pan Wojciech pomógł mi znaleźć idealne ubezpieczenie dla gospodarstwa.",
    rating: 5,
  },
  {
    author: "Marek D.",
    text: "Porównanie ofert kilkunastu firm i oszczędność kilkuset złotych rocznie. Polecam każdemu!",
    rating: 5,
  },
  {
    author: "Katarzyna W.",
    text: "Szybki kontakt, wszystko załatwione zdalnie. Wreszcie ubezpieczenia bez stresu i biurokracji.",
    rating: 5,
  },
];

const partners = [
  "PZU", "Warta", "Ergo Hestia", "Allianz", "Generali", "Compensa", "Link4", "Uniqa"
];

export function TrustSection() {
  return (
    <section className="bg-[#0A1628] text-white py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left: Reviews */}
          <div className="space-y-8">
            <h2 className="text-white leading-tight">
              Zaufali nam klienci z całego województwa opolskiego
            </h2>

            {/* Google Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#2D7A5F] text-[#2D7A5F]" />
                ))}
              </div>
              <span className="text-white/90">5.0 / 5.0 na Google</span>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-[#152238] border border-[#1f3354] rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-[#2D7A5F] flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-white/90 leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-white/60 text-sm">
                        — {review.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Partners */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-1 w-16 bg-[#2D7A5F]" />
              <h3 className="text-white text-2xl">
                Współpracujemy z wiodącymi towarzystwami ubezpieczeniowymi
              </h3>
              <p className="text-white/70 leading-relaxed">
                Porównujemy oferty ponad 20 renomowanych ubezpieczycieli, 
                aby znaleźć dla Ciebie najlepsze warunki i ceny.
              </p>
            </div>

            {/* Partner Logos Grid */}
            <div className="grid grid-cols-4 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 flex items-center justify-center aspect-square"
                >
                  <span className="text-white/60 text-center text-sm">
                    {partner}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-sm">
              ...i wiele innych renomowanych firm ubezpieczeniowych
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
