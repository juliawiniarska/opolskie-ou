import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Car, Heart, Home, Plane, Briefcase, Tractor } from "lucide-react";

import { OfferPageHero } from "./offer/OfferPageHero";
import { OfferDetails } from "./offer/OfferDetails";
import { ConsultationExpert } from "./offer/ConsulationExpert";
import { QuickActions } from "./offer/QuickActions";

type OfferConfig = {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon: ReactNode;

  // NEW: per-oferta obrazek do prawej kolumny w OfferDetails
  imageSrc: string;
  imageAlt: string;

  includes: string[];
  features?: { title: string; items: string[] }[];
  highlight?: { title: string; description: string };
};

const OFFERS: OfferConfig[] = [
  {
  slug: "ubezpieczenia-komunikacyjne",
  category: "Ubezpieczenia komunikacyjne",
  title: "Ubezpieczenia komunikacyjne",
  description:
    "Kompleksowa ochrona Twojego pojazdu — prowadź spokojnie i miej wsparcie wtedy, gdy naprawdę jest potrzebne. Dobieramy zakres, porównujemy warianty i pomagamy w formalnościach oraz po szkodzie.",
  icon: <Car className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/komunikacyjne.png",
  imageAlt: "Ubezpieczenia komunikacyjne",

  includes: [
    "OC — obowiązkowa ochrona, która zabezpiecza Cię finansowo, gdy spowodujesz szkodę innym",
    "AC — ochrona auta przy uszkodzeniu, zniszczeniu lub kradzieży (także przy Twojej winie)",
    "NNW — świadczenie dla kierowcy i pasażerów w razie nieszczęśliwego wypadku",
    "Assistance — holowanie, auto zastępcze, naprawa na miejscu, nocleg (kraj i zagranica)",
    "Ubezpieczenie szyb — naprawa lub wymiana szyb bez stresu i zbędnych formalności",
    "Dopasowanie zakresu do leasingu / wynajmu długoterminowego i indywidualnych potrzeb",
  ],

  features: [
    {
      title: "Co dokładnie ogarnia polisa?",
      items: [
        "OC: naprawa szkód, koszty leczenia i odszkodowania dla poszkodowanych",
        "AC: kolizje, wandalizm, zdarzenia losowe (np. grad), kradzież",
        "NNW: wypłata świadczenia przy trwałym uszczerbku na zdrowiu",
        "Assistance: szybka pomoc w awarii i wypadku, także poza Polską",
      ],
    },
    {
      title: "Dla kogo?",
      items: [
        "Kierowcy aut osobowych, ciężarowych i motocykli",
        "Firmy posiadające flotę",
        "Leasing i wynajem długoterminowy",
      ],
    },
    {
      title: "Dlaczego warto u nas?",
      items: [
        "Indywidualne doradztwo i proste tłumaczenie zapisów umowy",
        "Szybka obsługa i jasne porównanie wariantów",
        "Pomoc w formalnościach i wsparcie przy likwidacji szkody",
      ],
    },
  ],

  highlight: {
    title: "Wskazówka",
    description:
      "Największe różnice zwykle są w AC i Assistance — porównaj limity holowania, udział własny, zakres naprawy na miejscu oraz najważniejsze wyłączenia.",
  },
},

{
  slug: "ubezpieczenia-osobowe",
  category: "Ubezpieczenia osobowe",
  title: "Ubezpieczenia osobowe",
  description:
    "Kompleksowa ochrona życia i zdrowia — wybierz bezpieczeństwo dla siebie i bliskich. Dobieramy polisę do Twojej sytuacji (rodzina, praca, zobowiązania), porównujemy oferty wielu towarzystw i pomagamy w formalnościach.",
  icon: <Heart className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/osobowe.png",
  imageAlt: "Ubezpieczenia osobowe",

  includes: [
    "Ubezpieczenie na życie — wsparcie finansowe dla bliskich w najtrudniejszych momentach oraz pomoc przy zobowiązaniach",
    "Ubezpieczenie zdrowotne — szybki dostęp do prywatnej opieki, specjalistów i diagnostyki bez kolejek",
    "Ochrona bliskich i zobowiązań — zabezpieczenie rodziny oraz spłaty kredytu w razie utraty życia lub zdrowia",
    "Ubezpieczenia grupowe — atrakcyjne warunki ochrony dla pracowników i ich rodzin, z możliwością rozszerzeń",
    "NNW i dodatki do stylu życia — rozwiązania dla osób aktywnych oraz pracujących w zawodach podwyższonego ryzyka",
    "Pakiet szyty na miarę — możliwość połączenia życia, zdrowia, NNW i assistance w jednej składce",
  ],

  features: [
    {
      title: "Co dokładnie ogarnia polisa?",
      items: [
        "Życie: zabezpieczenie finansowe rodziny w razie śmierci ubezpieczonego",
        "Zdrowie: szybkie konsultacje, badania i diagnostyka prywatnie",
        "Zobowiązania: wsparcie przy spłacie kredytu lub innych kosztów stałych",
        "Grupowe: ochrona pracowników i możliwość dopasowania rozszerzeń",
      ],
    },
    {
      title: "Dla kogo?",
      items: [
        "Osoby prywatne, które chcą zabezpieczyć życie i zdrowie swoje oraz bliskich",
        "Rodziny z dziećmi — polisy rodzinne, pakiety zdrowotne, świadczenia szpitalne",
        "Pracownicy wykonujący zawody ryzykowne",
        "Właściciele firm dbający o ochronę pracowników",
        "Osoby aktywne fizycznie — NNW, rehabilitacja i rozszerzenia pod sport",
      ],
    },
    {
      title: "Dlaczego warto u nas?",
      items: [
        "Uczciwe doradztwo — dobieramy polisę do Twojej sytuacji, a nie do tabelki",
        "Porównanie ofert wielu towarzystw — nie jesteśmy związani z jednym ubezpieczycielem",
        "Pomoc w formalnościach — od wniosku po zgłoszenie szkody",
        "Pakiety łączone — spójna ochrona w jednej składce i bez chaosu w dokumentach",
      ],
    },
  ],

  highlight: {
    title: "Wskazówka",
    description:
      "Przy osobowych najwięcej różnic jest w wyłączeniach, karencjach, limitach i definicjach zdarzeń — porównaj też sumy ubezpieczenia oraz zakres ochrony przy chorobach i hospitalizacji.",
  },
},

{
  slug: "ubezpieczenia-majatkowe",
  category: "Ubezpieczenia majątkowe",
  title: "Ubezpieczenia majątkowe",
  description:
    "Kompleksowa ochrona Twojego mienia — domu, mieszkania i wyposażenia. Dobieramy zakres do realnej wartości, pomagamy rozszerzyć ochronę o OC w życiu prywatnym i przeprowadzamy przez formalności oraz zgłoszenie szkody.",
  icon: <Home className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/majatkowe.png",
  imageAlt: "Ubezpieczenia majątkowe",

  includes: [
    "Ubezpieczenie domu — ochrona przed pożarem, zalaniem, kradzieżą i innymi zdarzeniami losowymi",
    "Ubezpieczenie mieszkania — zabezpieczenie lokalu i wyposażenia, także na czas nieobecności",
    "Ubezpieczenie domu w budowie — ochrona inwestycji w trakcie prac (w tym materiałów) przed zdarzeniami i wandalizmem",
    "Ubezpieczenie domku letniskowego — pełna ochrona sezonowego miejsca wypoczynku wraz z wyposażeniem",
    "Mienie ruchome — sprzęt RTV/AGD, meble i rzeczy osobiste w ramach dopasowanego wariantu",
    "OC w życiu prywatnym — rozszerzenie, które chroni finansowo w razie szkody wyrządzonej innym",
  ],

  features: [
    {
      title: "Co dokładnie ogarnia polisa?",
      items: [
        "Szkody losowe: pożar, zalanie i inne zdarzenia zgodne z zakresem",
        "Kradzież i włamanie: ochrona budynku i wyposażenia (w zależności od wariantu)",
        "Dom w budowie: ryzyka na etapie inwestycji, w tym kradzież materiałów i wandalizm",
        "Domek letniskowy: ochrona sezonowa także poza sezonem, żeby nie martwić się o straty",
      ],
    },
    {
      title: "Dla kogo?",
      items: [
        "Właściciele domów jednorodzinnych i mieszkań",
        "Najemcy lokali — ubezpieczenie mienia i OC najemcy",
        "Osoby prywatne chcące zabezpieczyć majątek przed stratami",
        "Przedsiębiorcy — właściciele lokali usługowych, biur i warsztatów",
      ],
    },
    {
      title: "Dlaczego warto u nas?",
      items: [
        "Rzetelne doradztwo — dopasowanie ochrony do wartości majątku",
        "Porównanie polis wielu towarzystw — wybierasz najlepszą opcję",
        "Pomoc w formalnościach — od wyceny, przez wniosek, po zgłoszenie szkody",
        "Pakiety ochrony — łączenie domu, OC i mienia ruchomego w spójną całość",
      ],
    },
  ],

  highlight: {
    title: "Wskazówka",
    description:
      "Przy majątkowych kluczowe są sumy ubezpieczenia (wartość odtworzeniowa), zakres ryzyk oraz wymagania dot. zabezpieczeń — sprawdź też limity dla mienia ruchomego i wyłączenia (np. zalania/podtopienia) w OWU.",
  },
},

  {
  slug: "ubezpieczenia-turystyczne",
  category: "Ubezpieczenia turystyczne",
  title: "Ubezpieczenia turystyczne",
  description:
    "Kompleksowa ochrona w podróży — dobieramy polisę do kraju, celu i stylu wyjazdu. Porównujemy oferty wielu towarzystw i kompletujemy zakres tak, żebyś w razie problemu miał(a) realne wsparcie, a nie tylko „ładną nazwę” na papierze.",
  icon: <Plane className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/turystyczne.png",
  imageAlt: "Ubezpieczenia turystyczne",
  includes: [
    "Koszty leczenia za granicą — wizyty lekarskie, hospitalizacja, leki i transport medyczny w razie choroby lub wypadku",
    "Assistance w podróży — całodobowa pomoc: organizacja leczenia, wsparcie przy kradzieży dokumentów lub zagubieniu bagażu",
    "Ubezpieczenie bagażu — ochrona na wypadek utraty, kradzieży lub uszkodzenia podczas podróży",
    "OC w życiu prywatnym za granicą — ochrona finansowa, gdy nieumyślnie wyrządzisz szkodę osobie trzeciej (np. w hotelu, na stoku, podczas aktywności)",
    "Dopasowanie do aktywności i planu wyjazdu — także dla osób aktywnych (np. narty, trekking, wspinaczka)",
    "Pomoc w formalnościach — doradztwo, dokumenty i wsparcie przy szkodzie",
  ],
  features: [
    {
      title: "Co obejmuje w praktyce?",
      items: [
        "Pokrycie nagłych kosztów leczenia i pomocy medycznej za granicą",
        "Wsparcie assistance 24/7, gdy liczy się czas i szybka organizacja pomocy",
        "Ochronę bagażu i dokumentów w typowych podróżnych sytuacjach",
        "OC za szkody wyrządzone innym podczas pobytu poza Polską",
      ],
    },
    {
      title: "Dla kogo?",
      items: [
        "Osób wyjeżdżających na wakacje — w kraju i za granicą",
        "Aktywnych podróżników i osób uprawiających sport na urlopie",
        "Klientów biur podróży oraz osób organizujących wyjazd samodzielnie",
      ],
    },
    {
      title: "Dlaczego warto przez nas?",
      items: [
        "Dostosowujemy ochronę do miejsca, celu i charakteru podróży",
        "Porównujemy oferty wielu towarzystw i wybieramy najlepszą cenowo oraz zakresowo",
        "Możemy zbudować kompletny pakiet: leczenie + assistance + OC + bagaż",
      ],
    },
  ],
  highlight: {
    title: "Wskazówka",
    description:
      "Przed zakupem sprawdź sumę kosztów leczenia, limity w assistance i wyłączenia. Jeśli planujesz sport, masz choroby przewlekłe lub chcesz dodatkowe klauzule — dopasuj polisę pod to od razu, a nie „na lotnisku w stresie”.",
  },
},

{
  slug: "ubezpieczenia-firmowe",
  category: "Ubezpieczenia firmowe",
  title: "Ubezpieczenia firmowe",
  description:
    "Kompleksowa ochrona Twojego biznesu — dobieramy polisy do profilu działalności, wartości majątku i ryzyk branżowych. Porównujemy wiele towarzystw i prowadzimy od wyceny po zgłoszenie szkody.",
  icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/firmowe.png",
  imageAlt: "Ubezpieczenia firmowe",
  includes: [
    "Ubezpieczenie majątku firmy — ochrona budynków, wyposażenia i sprzętu m.in. przed pożarem, zalaniem, kradzieżą i zdarzeniami losowymi",
    "OC działalności gospodarczej — zabezpieczenie przed roszczeniami za szkody wyrządzone osobom trzecim w trakcie wykonywania usług",
    "OC zawodowe — ochrona w razie błędów zawodowych, pomyłek lub zaniedbań (szczególnie w branżach doradczych, projektowych i medycznych)",
    "Ubezpieczenie kontraktowe — ochrona interesów finansowych w razie niewywiązania się z umowy, jako zabezpieczenie dla kontrahentów",
    "Ubezpieczenia finansowe — wsparcie płynności i ochrona przed skutkami braku płatności; wzmocnienie zdolności kredytowej i leasingowej",
    "Ubezpieczenia transportowe — ochrona ładunków w kraju i za granicą (kradzież, zaginięcie lub uszkodzenie towaru w transporcie)",
  ],
  features: [
    {
      title: "Dla kogo?",
      items: [
        "Jednoosobowe działalności gospodarcze",
        "Firmy produkcyjne, handlowe i usługowe",
        "Pracodawcy zatrudniający zespół",
        "Model B2B i B2C — gdy potrzebujesz ochrony kontraktowej i finansowej",
      ],
    },
    {
      title: "Co zabezpieczamy najczęściej?",
      items: [
        "Majątek firmy: lokal, magazyn, sprzęt, wyposażenie",
        "Odpowiedzialność: OC działalności i OC zawodowe",
        "Kontrakty: zabezpieczenia realizacji umów i współpracy z kontrahentami",
        "Finanse i transport: płynność oraz towar w drodze",
      ],
    },
    {
      title: "Jak pracujemy?",
      items: [
        "Analiza ryzyk i dopasowanie ochrony do branży",
        "Porównanie ofert wielu towarzystw — wybierasz najlepszy wariant pod cenę i zakres",
        "Wsparcie w dokumentach i przy szkodzie: od wyceny po kontakt z TU",
      ],
    },
  ],
  highlight: {
    title: "Wskazówka",
    description:
      "W firmowych najwięcej „robi różnicę” dobrze ustawiona suma ubezpieczenia oraz zakres OC. Zaczynamy od ryzyk i realnej wartości majątku — dopiero potem dobieramy wariant, żeby nie przepłacić i nie zostać z luką w ochronie.",
  },
},

{
  slug: "ubezpieczenia-rolne",
  category: "Ubezpieczenia rolne",
  title: "Ubezpieczenia rolne",
  description:
    "Ubezpieczenia dla rolników — chroń gospodarstwo i pracuj bez stresu. Dobieramy ochronę upraw, maszyn i budynków, pomagamy w formalnościach i sprawdzamy możliwości dopłat, żeby składka była realnie niższa.",
  icon: <Tractor className="w-8 h-8" strokeWidth={1.5} />,
  imageSrc: "/rolne.png",
  imageAlt: "Ubezpieczenia rolne",
  includes: [
    "Ubezpieczenie upraw rolnych — ochrona plonów m.in. przed gradem, przymrozkami, suszą, powodzią i deszczem nawalnym",
    "Ubezpieczenie maszyn rolniczych — ochrona ciągników, kombajnów, przyczep i sprzętu (kradzież, awarie, uszkodzenia mechaniczne)",
    "Ubezpieczenie budynków rolnych — zabezpieczenie budynków gospodarczych i magazynów przed pożarem, wichurą, zalaniem i innymi zdarzeniami losowymi",
    "OC rolnika — ochrona przed roszczeniami osób trzecich (np. zdarzenia z udziałem zwierząt lub maszyn rolniczych)",
    "Dopasowanie do profilu gospodarstwa — zboża, warzywa, owoce, sady oraz hodowla",
    "Pomoc w formalnościach — podpowiemy co jest obowiązkowe, co opłacalne i czy możesz skorzystać z dopłat",
  ],
  features: [
    {
      title: "Co obejmuje ochrona?",
      items: [
        "Plony i ryzyka pogodowe, które potrafią zniszczyć sezon",
        "Maszyny i sprzęt — żeby utrzymać ciągłość pracy mimo awarii",
        "Budynki gospodarcze i magazyny — pod kluczowe zdarzenia losowe",
        "Odpowiedzialność cywilną rolnika — realna ochrona przed kosztownymi roszczeniami",
      ],
    },
    {
      title: "Dla kogo?",
      items: [
        "Rolników",
        "Właścicieli maszyn i budynków rolniczych",
        "Producentów zbóż, warzyw, owoców i sadowników",
        "Hodowców bydła, trzody i drobiu",
      ],
    },
    {
      title: "Dlaczego warto u nas?",
      items: [
        "Znamy realne ryzyka w rolnictwie i dobieramy ochronę praktycznie, nie „z katalogu”",
        "Pomagamy w dopasowaniu i ogarnięciu dokumentów",
        "Sprawdzamy dopłaty i możliwości obniżenia składki",
      ],
    },
  ],
  highlight: {
    title: "Wskazówka",
    description:
      "W rolnych kluczowe jest dopasowanie ryzyk do regionu i profilu gospodarstwa (susza, grad, przymrozki). Warto też od razu sprawdzić dopłaty oraz to, które polisy są obowiązkowe — wtedy ustawiamy najlepszy zakres bez przepłacania.",
  },
},

];

export default function OfferDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const offer = useMemo(() => OFFERS.find((o) => o.slug === slug), [slug]);

  useEffect(() => {
    document.title = offer
      ? `${offer.title} — Opolskie Ubezpieczenia`
      : "Opolskie Ubezpieczenia";
    return () => {
      document.title = "Opolskie Ubezpieczenia";
    };
  }, [offer]);

  if (!offer) {
    return (
      <main className="bg-[#F5F1E8] pt-28 pb-16">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white rounded-3xl p-10 border border-[#2D7A5F]/10 shadow-lg">
            <h1 className="text-2xl text-[#2D7A5F] mb-3">Nie znaleziono oferty</h1>
            <p className="text-[#2D7A5F]/70">Sprawdź link lub wróć do strony głównej.</p>
            <a
              href="/#oferta"
              className="inline-flex mt-6 rounded-2xl bg-[#2D7A5F] px-7 py-4 text-white hover:bg-[#1F5A43] transition-colors"
            >
              Wróć do oferty
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F5F1E8]">
      <OfferPageHero
        title={offer.title}
        description={offer.description}
        category={offer.category}
        icon={offer.icon}
        backTo="/#oferta"
      />

      <OfferDetails
        includes={offer.includes}
        features={offer.features}
        highlight={offer.highlight}
        sideImageSrc={offer.imageSrc}
        sideImageAlt={offer.imageAlt}
      />

      <QuickActions />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 pb-10">
        {/* [logocarousel id="2390"] */}
        {/* [trustindex no-registration=google] */}
      </div>
    </main>
  );
}
