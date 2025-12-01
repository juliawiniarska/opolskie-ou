import { Check, AlertCircle } from "lucide-react";

interface OfferDetailsProps {
  includes: string[];
  features?: {
    title: string;
    items: string[];
  }[];
  highlight?: {
    title: string;
    description: string;
  };

  sideImageSrc?: string;
  sideImageAlt?: string;

  // opcjonalnie: jak chcesz sama regulować wysokość tej pary (desktop)
  pairHeightClassName?: string; // np. "lg:h-[480px]" albo "lg:h-[560px]"
}

export function OfferDetails({
  includes,
  features,
  highlight,
  sideImageSrc = "/offers/oferta-placeholder.jpg",
  sideImageAlt = "Oferta ubezpieczenia",
  pairHeightClassName = "lg:min-h-[640px]", // ✅ było: lg:h-[520px]
}: OfferDetailsProps) {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 lg:items-stretch">
          {/* LEFT: Main Coverage Card */}
          <div className={`lg:col-span-2 ${pairHeightClassName}`}>
            <div className="h-full bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-7 sm:p-10 lg:p-10 shadow-2xl text-white flex flex-col">
              <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">
                Co obejmuje ta oferta?
              </h2>

              {/* lista: trzyma się w granicach wspólnej wysokości */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                {includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1 group-hover:bg-white/30 transition-colors">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base sm:text-lg text-white/95">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {highlight && (
                <div className="mt-8 sm:mt-10 pt-8 sm:pt-8 border-t border-white/20">
                  <div className="bg-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg sm:text-xl mb-2">
                          {highlight.title}
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Image Card */}
          {/* RIGHT: Image Card (4:5) */}
<div className={`${pairHeightClassName}`}>
 <div className="h-full bg-white rounded-3xl p-2 sm:p-3 shadow-lg border border-[#2D7A5F]/10 flex">
    {/* ramka 4:5 + wycentrowanie */}
<div className="w-full max-w-[480px] mx-auto self-center">
 <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl bg-white ring-1 ring-[#2D7A5F]/10">
        <img
          src={sideImageSrc}
          alt={sideImageAlt}
className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</div>

        </div>

        {/* Additional Features */}
        {features && features.length > 0 && (
          <div className="mt-10 sm:mt-14 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg sm:text-xl text-[#1A1A1A] mb-5 sm:mb-6">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#2D7A5F] rounded-full mt-2" />
                      <span className="text-[#6B6B6B]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
