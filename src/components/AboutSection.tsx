import { ArrowLeft, Phone, Mail, ShieldCheck, Handshake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function AboutPage() {
  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO (spójny z ofertami) */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        {/* dekoracje */}
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/#top" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Wróć</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT */}
            <div className="lg:col-span-8 max-w-4xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <ShieldCheck className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-5 sm:mb-8">
                O nas
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl">
                Poznaj Multiagencję Opolskie Ubezpieczenia — działamy lokalnie, doradzamy konkretnie
                i dobieramy ochronę tak, żeby realnie działała w życiu.
              </p>
            </div>

            {/* RIGHT — karta kontaktowa */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
                <h3 className="text-white text-lg sm:text-xl mb-2">Umów konsultację</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Zadzwoń lub napisz — przygotujemy warianty i przejdziemy przez szczegóły.
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:739079729"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-white text-[#2D7A5F] px-5 py-3 font-medium hover:bg-[#F5F1E8] transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" /> Zadzwoń: 739 079 729
                  </a>
                  <a
                    href="mailto:biuro@opolskieubezpieczenia.pl"
                    className="w-full inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent text-white px-5 py-3 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" /> Napisz email
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                  Odpowiemy i dobierzemy najlepszą opcję do budżetu i potrzeb.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 space-y-10 sm:space-y-14 lg:space-y-16">

          {/* BLOK 1: zdjęcie + historia */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* LEFT: image 1 */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-[#2D7A5F]/10">
                <ImageWithFallback
                  src="/about/onas-1.jpg"
                  alt="Biuro Opolskie Ubezpieczenia"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* RIGHT: text */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 lg:p-10 shadow-lg border border-[#2D7A5F]/10">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2D7A5F]/15 bg-[#F5F1E8] px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-[#2D7A5F]">
                Multiagencja • Opole / Nysa
              </p>

              <h2 className="mt-6 text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] leading-tight">
                Nazywam się Wojciech Kurzeja — prowadzę Multiagencję Opolskie Ubezpieczenia
              </h2>

              <div className="mt-6 space-y-4 text-[#6B6B6B] text-base sm:text-lg leading-relaxed">
                <p>
                  Nasza multiagencja powstała na bazie mojego doświadczenia w doradztwie agrotechnicznym,
                  które połączyłem z wiedzą ubezpieczeniową. Od lat wspieram rolników, przedsiębiorców
                  i rodziny w województwie opolskim, łącząc praktyczne spojrzenie na realne ryzyka
                  z profesjonalnym doborem ochrony.
                </p>
                <p>
                  Dzięki współpracy z gospodarstwami w regionie bardzo dobrze znam potrzeby rolników
                  i firm z sektora agrobiznesu — dlatego dobieramy rozwiązania, które faktycznie działają:
                  od ochrony upraw i maszyn, po ubezpieczenia komunikacyjne, majątkowe oraz na życie.
                </p>
                <p>
                  W codziennej pracy stawiam na zaufanie, przejrzystość i długofalową współpracę.
                  Klient jest dla mnie partnerem — zależy mi, żebyś rozumiał(a) warunki i miał(a) spokojną głowę.
                </p>
              </div>
            </div>
          </div>

          {/* BLOK 2: drugie zdjęcie po LEWEJ + lista po PRAWEJ */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* LEFT: image 2 (taka sama wysokość — też aspect 4/5) */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-[#2D7A5F]/10">
                <ImageWithFallback
                  src="/about/onas-2.jpg"
                  alt="Spotkania z klientami — Opolskie Ubezpieczenia"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* RIGHT: Jak pomagamy */}
            <div className="bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-7 sm:p-9 lg:p-10 shadow-2xl text-white flex flex-col">
              <div className="inline-flex items-center gap-2 text-white/80">
                <Handshake className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Jak pomagamy na co dzień</span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl leading-tight">
                Konkretnie, szybko i bez „gwiazdek”
              </h3>

              <ul className="mt-6 space-y-3 text-white/90 text-base sm:text-lg">
                {[
                  "Dobór polisy do potrzeb i budżetu",
                  "Porównanie zakresów i wyjaśnienie zapisów",
                  "Przygotowanie ofert i wariantów",
                  "Przypomnienia o kończącej się polisie",
                  "Wsparcie przy zgłoszeniu szkody",
                  "Kontakt telefoniczny i mailowy — szybko i konkretnie",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-7 border-t border-white/20 text-white/85 leading-relaxed">
                Najważniejsze: jeśli czegoś nie rozumiesz — tłumaczymy. Jeśli trzeba porównać kilka opcji —
                robimy to i pokazujemy różnice „po ludzku”.
              </div>
            </div>
          </div>

          {/* MISJA / WARTOŚCI / WIZJA */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">Nasza misja</h3>
              </div>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                Dostarczamy rozwiązania ubezpieczeniowe, które realnie chronią to, co najcenniejsze:
                zdrowie, majątek i bezpieczeństwo życiowe. Działamy profesjonalnie i indywidualnie,
                budując relacje oparte na zaufaniu i odpowiedzialności.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">Nasze wartości</h3>
              </div>
              <ul className="mt-4 space-y-3 text-[#6B6B6B] leading-relaxed">
                <li>— uczciwość: interes klienta zawsze na pierwszym miejscu,</li>
                <li>— rzetelność: polecamy rozwiązania sprawdzone i czytelne,</li>
                <li>— transparentność: jasno mówimy o warunkach i ograniczeniach.</li>
              </ul>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                Słuchamy. Doradzamy. Tłumaczymy — bo dobra współpraca zaczyna się od zrozumienia.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-lg border border-[#2D7A5F]/10">
              <div className="flex items-center gap-3 text-[#2D7A5F]">
                <Handshake className="w-5 h-5" />
                <h3 className="text-xl sm:text-2xl text-[#1A1A1A]">Nasza wizja</h3>
              </div>
              <p className="mt-4 text-[#6B6B6B] leading-relaxed">
                Chcemy być pierwszym wyborem wśród multiagencji w województwie opolskim —
                synonimem zaufania, skuteczności i nowoczesnego podejścia. Nie tylko odpowiadamy
                na potrzeby rynku: proponujemy elastyczne, dopasowane i zrozumiałe rozwiązania,
                które wspierają stabilność i rozwój naszych klientów.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl">
            <h3 className="text-2xl sm:text-3xl mb-3">Uzyskaj indywidualną ofertę ubezpieczeniową</h3>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-3xl">
              Skontaktuj się z nami, a przygotujemy propozycje dopasowane do Twoich potrzeb — bez stresu i bez domysłów.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:739079729"
                className="inline-flex items-center justify-center rounded-2xl bg-white text-[#2D7A5F] px-7 py-4 font-medium hover:bg-[#F5F1E8] transition-colors"
              >
                Zadzwoń: 739 079 729
              </a>
              <a
                href="mailto:biuro@opolskieubezpieczenia.pl"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-transparent px-7 py-4 hover:bg-white/10 transition-colors"
              >
                Napisz email
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
