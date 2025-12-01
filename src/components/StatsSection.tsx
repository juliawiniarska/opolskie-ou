import { Award, Users, TrendingUp, Clock, Shield, Star } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "12+",
    label: "Lat doświadczenia",
    description: "w branży ubezpieczeniowej",
  },
  {
    icon: Users,
    value: "2500+",
    label: "Zadowolonych klientów",
    description: "z całego regionu",
  },
  {
    icon: TrendingUp,
    value: "20+",
    label: "Towarzystw ubezp.",
    description: "w naszej ofercie",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Bezpieczeństwo",
    description: "Licencja KNF",
  },
  {
    icon: Star,
    value: "5.0",
    label: "Ocena Google",
    description: "150+ opinii",
  },
  {
    icon: Clock,
    value: "24h",
    label: "Czas odpowiedzi",
    description: "na zapytania",
  },
];

export function StatsSection() {
  return (
    <section className="relative py-24 bg-white">
      {/* Diagonal background */}
      <div className="absolute inset-0 bg-[#F5F1E8] transform -skew-y-2 origin-top-left" />
      
      <div className="relative max-w-[1800px] mx-auto px-16">
        <div className="grid grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white hover:bg-[#2D7A5F] rounded-3xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl border border-[#2D7A5F]/10 hover:border-[#2D7A5F]"
            >
              <div className="space-y-4">
                <div className="bg-[#2D7A5F]/10 group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors">
                  <stat.icon className="w-8 h-8 text-[#2D7A5F] group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl text-[#2D7A5F] group-hover:text-white transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-lg text-[#2D7A5F] group-hover:text-white/90 transition-colors">
                    {stat.label}
                  </div>
                  <p className="text-[#2D7A5F]/60 group-hover:text-white/70 text-sm transition-colors">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
