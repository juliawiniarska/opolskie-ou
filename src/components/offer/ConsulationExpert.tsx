import { MessageCircle, Phone, Mail, CheckCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";

interface ExpertProps {
  name?: string;
  role?: string;
  initials?: string;
  defaultSubject?: string;
}

export function ConsultationExpert({
  name = "Wojciech Kurzeja",
  role = "Ekspert ubezpieczeniowy",
  initials = "WK",
  defaultSubject = "Zapytanie o ofertę — Opolskie Ubezpieczenia",
}: ExpertProps) {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  const mailtoHref = useMemo(() => {
    const body = `Imię: ${form.name}\nKontakt: ${form.contact}\n\nWiadomość:\n${form.message}`;
    return `mailto:biuro@opolskieubezpieczenia.pl?subject=${encodeURIComponent(
      defaultSubject
    )}&body=${encodeURIComponent(body)}`;
  }, [form, defaultSubject]);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-[#2D7A5F]" />
              <span className="text-xs sm:text-sm text-[#2D7A5F] uppercase tracking-wide">
                Multiagencja Ubezpieczeniowa • NYSA
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] mb-5 sm:mb-6 leading-tight">
              Twoje bezpieczeństwo
              <br />
              to nasza misja
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-[#6B6B6B] mb-10 sm:mb-12 leading-relaxed">
              Kompleksowe ubezpieczenia dla Ciebie, Twojej rodziny i firmy. Porównujemy oferty i znajdujemy najlepsze rozwiązanie.
            </p>

            <div className="space-y-4 mb-10 sm:mb-12">
              {[
                "Porównujemy oferty z wielu towarzystw",
                "Pomoc w likwidacji szkody",
                "Indywidualne podejście do każdego klienta",
                "Ponad 12 lat doświadczenia",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#2D7A5F]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#2D7A5F]" />
                  </div>
                  <span className="text-[#1A1A1A]">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/#kalkulator"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D7A5F] hover:bg-[#1F5A43] text-white rounded-xl transition-all shadow-lg"
            >
              <span>Kalkulator online</span>
            </a>
          </div>

          {/* Right */}
          <div className="bg-white rounded-3xl p-7 sm:p-10 lg:p-12 shadow-2xl border border-[#2D7A5F]/10">
            <h3 className="text-xl sm:text-2xl text-[#1A1A1A] mb-2">
              Umów się na konsultację
            </h3>
            <p className="text-[#6B6B6B] mb-7 sm:mb-10">
              Skontaktuj się z naszym ekspertem i otrzymaj spersonalizowaną ofertę.
            </p>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8 sm:mb-10">
              <a
                href="tel:739079729"
                className="flex items-center gap-4 p-5 sm:p-6 bg-[#F5F1E8] hover:bg-[#2D7A5F]/10 rounded-xl transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Phone className="w-5 h-5 text-[#2D7A5F]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#6B6B6B]">Telefon</div>
                  <div className="text-lg text-[#2D7A5F]">739 079 729</div>
                </div>
              </a>

              <a
                href="mailto:biuro@opolskieubezpieczenia.pl"
                className="flex items-center gap-4 p-5 sm:p-6 bg-[#F5F1E8] hover:bg-[#2D7A5F]/10 rounded-xl transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Mail className="w-5 h-5 text-[#2D7A5F]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#6B6B6B]">Email</div>
                  <div className="text-lg text-[#2D7A5F] break-all">
                    biuro@opolskieubezpieczenia.pl
                  </div>
                </div>
              </a>
            </div>

            {/* Simple form -> mailto */}
            <div className="rounded-2xl bg-[#F5F1E8] p-5 sm:p-6">
              <div className="text-sm text-[#6B6B6B] mb-4">
                Napisz w 20 sekund — przygotujemy warianty.
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Imię"
                  className="w-full rounded-xl border border-[#2D7A5F]/15 bg-white px-4 py-3 text-[#1A1A1A] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#2D7A5F]/25"
                />
                <input
                  value={form.contact}
                  onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
                  placeholder="Telefon lub email"
                  className="w-full rounded-xl border border-[#2D7A5F]/15 bg-white px-4 py-3 text-[#1A1A1A] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#2D7A5F]/25"
                />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Wiadomość"
                  className="sm:col-span-2 min-h-[110px] w-full rounded-xl border border-[#2D7A5F]/15 bg-white px-4 py-3 text-[#1A1A1A] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#2D7A5F]/25"
                />

                <a
                  href={mailtoHref}
                  className="sm:col-span-2 inline-flex items-center justify-center gap-3 rounded-xl bg-[#2D7A5F] px-6 py-4 text-white hover:bg-[#1F5A43] transition-colors shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  Wyślij wiadomość
                </a>
              </div>
            </div>

            {/* Expert Profile */}
            <div className="pt-8 border-t border-[#2D7A5F]/10 mt-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#2D7A5F] to-[#1F5A43] rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="text-lg">{initials}</span>
                </div>
                <div>
                  <div className="text-[#1A1A1A]">{name}</div>
                  <div className="text-sm text-[#6B6B6B]">{role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
