import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  ArrowRight,
  Search,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Car,
  Home,
  Heart,
  Plane,
  Wheat,
  Shield,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const BLOG_PAGE_ID = 2700;

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
};

type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  wpHref: string;
  image?: string | null;
  text: string;
};

type BlogPageACF = {
  blog_hero_title?: string;
  blog_hero_desc?: string;
  blog_hero_btn?: string;
  blog_cta_title?: string;
  blog_cta_desc?: string;
  blog_phone?: string;
  blog_email_btn?: string;
  blog_list_title?: string;
  blog_list_desc?: string;
  blog_search_placeholder?: string;
};

const TOPICS = ["Wszystkie", "OC/AC", "Dom", "Życie", "Turystyka", "Rolne"] as const;
type Topic = (typeof TOPICS)[number];

const PAGE_SIZE = 9;

// --- HELPERS ---
const fixImgUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.includes("/wp-content/") && !url.includes("/wp/wp-content/")) {
    return url.replace("/wp-content/", "/wp/wp-content/");
  }
  return url;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const decodeHtml = (input: string) => {
  if (!input) return "";
  if (typeof document !== "undefined") {
    const el = document.createElement("textarea");
    el.innerHTML = input;
    return el.value;
  }
  return input.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
};

const formatDatePL = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
  } catch { return iso; }
};

const clampStyle = (lines: number): React.CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: lines.toString(),
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const parseFirstImageFromHtml = (html?: string) => {
  if (!html) return null;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const img = doc.querySelector("img[src]");
    return img?.getAttribute("src") ?? null;
  } catch { return null; }
};

export default function BlogPage() {
  const [featured, setFeatured] = useState<PostCard | null>(null);
  const [pagePosts, setPagePosts] = useState<PostCard[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic>("Wszystkie");

  const listSectionRef = useRef<HTMLElement>(null);
  const [texts, setTexts] = useState<BlogPageACF>({});
  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();

  const loading = loadingFeatured || loadingPage;

  const mapWp = (p: WpPost): PostCard => {
    const title = decodeHtml(p.title?.rendered ?? "");
    const excerpt = decodeHtml(stripHtml(p.excerpt?.rendered ?? ""));
    const text = decodeHtml(stripHtml(p.content?.rendered ?? ""));
    const rawImg = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || parseFirstImageFromHtml(p.content?.rendered);
    return { id: String(p.id), slug: p.slug, title, excerpt, dateISO: p.date, wpHref: p.link, image: fixImgUrl(rawImg), text };
  };

  const inferTopic = (p: PostCard): Exclude<Topic, "Wszystkie"> => {
    const t = `${p.title} ${p.excerpt}`.toLowerCase();
    if (/(roln|agro|dopłat)/.test(t)) return "Rolne";
    if (/(turyst|wakac|podróż)/.test(t)) return "Turystyka";
    if (/(dom|mieszkan|nieruch)/.test(t)) return "Dom";
    if (/(życie|zdrow|nnw)/.test(t)) return "Życie";
    return "OC/AC";
  };

  const topicIcon = (t: Exclude<Topic, "Wszystkie">) => {
    switch (t) {
      case "OC/AC": return Car;
      case "Dom": return Home;
      case "Życie": return Heart;
      case "Turystyka": return Plane;
      case "Rolne": return Wheat;
      default: return Shield;
    }
  };

  const Cover = ({ image, title, icon: Icon, featuredSize }: { image?: string | null; title: string; icon: any; featuredSize?: boolean }) => (
    <div className="w-full h-full relative overflow-hidden bg-[#2D7A5F]/5">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon className={featuredSize ? "w-12 h-12 text-[#2D7A5F]/20" : "w-8 h-8 text-[#2D7A5F]/20"} />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    fetchTexts(async () => {
      const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${BLOG_PAGE_ID}?_fields=acf&t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.acf) setTexts(json.acf);
      }
    });
  }, [fetchTexts]);

  useEffect(() => {
    const run = async () => {
      setLoadingFeatured(true);
      try {
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?per_page=1&_embed=true`);
        const data = await res.json();
        const total = res.headers.get("X-WP-Total");
        if (data?.[0]) setFeatured(mapWp(data[0]));
        if (total) setTotalPages(Math.ceil((Number(total) - 1) / PAGE_SIZE));
      } catch (e) { setErrorMsg("Błąd połączenia."); }
      finally { setLoadingFeatured(false); }
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoadingPage(true);
      try {
        const offset = 1 + (page - 1) * PAGE_SIZE;
        const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&offset=${offset}&_embed=true`);
        const data = await res.json();
        setPagePosts(data.map(mapWp));
      } catch (e) { setPagePosts([]); }
      finally { setLoadingPage(false); }
    };
    run();
  }, [page]);

  const filtered = useMemo(() => {
    let all = featured ? [featured, ...pagePosts] : pagePosts;
    return all.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase());
      const matchesTopic = topic === "Wszystkie" || inferTopic(p) === topic;
      return matchesQuery && matchesTopic;
    });
  }, [featured, pagePosts, query, topic]);

  // --- KLUCZOWA ZMIANA: RENDEROWANIE ---
  
  // Tytuł musi być zdefiniowany tutaj
  const dynamicTitle = topic === "Wszystkie" 
    ? "Blog i Porady Ubezpieczeniowe" 
    : `Porady: ${topic} | Wiedza Ekspercka`;

  return (
    <>
      <Helmet>
        <title>{dynamicTitle} | Opolskie Ubezpieczenia</title>
        <meta name="description" content="Artykuły i poradniki ekspertów ubezpieczeniowych z Nysy. Dowiedz się jak chronić swój majątek." />
      </Helmet>

      {/* Sprawdzamy ładowanie tekstów ACF (Parasolka) */}
      {loadingTexts ? (
        <PageLoader />
      ) : (
        <main className="bg-[#F5F1E8]">
          {/* HERO */}
          <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
            <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
                    <Newspaper className="w-9 h-9 text-white" />
                  </div>
                  <h1 className="text-4xl lg:text-6xl text-white mb-6">{texts.blog_hero_title}</h1>
                  <p className="text-lg text-white/90 max-w-3xl">{texts.blog_hero_desc}</p>
                </div>
                <div className="lg:col-span-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-white">
                    <h3 className="text-xl mb-4">{texts.blog_cta_title}</h3>
                    <a href={`tel:${texts.blog_phone}`} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-[#2D7A5F] rounded-xl font-bold">
                      <Phone className="w-5 h-5" /> {texts.blog_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LISTA */}
          <section className="py-12 lg:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <h2 className="text-3xl text-[#1A1A1A] mb-2">{texts.blog_list_title}</h2>
                <p className="text-[#6B6B6B]">{texts.blog_list_desc}</p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Szukaj..." className="outline-none" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(t => (
                    <button key={t} onClick={() => setTopic(t)} className={`px-4 py-1.5 rounded-full text-sm transition-colors ${topic === t ? 'bg-[#2D7A5F] text-white' : 'bg-white text-[#2D7A5F] border'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-[#2D7A5F]">Ładowanie wpisów...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(p => {
                  const Icon = topicIcon(inferTopic(p));
                  return (
                    <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#2D7A5F]/10">
                      <div className="aspect-video rounded-2xl mb-4 overflow-hidden">
                        <Cover image={p.image} title={p.title} icon={Icon} />
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#2D7A5F] transition-colors" style={clampStyle(2)}>{p.title}</h3>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed" style={clampStyle(3)}>{p.excerpt}</p>
                      <div className="mt-4 flex items-center text-[#2D7A5F] font-bold text-sm">
                        Czytaj więcej <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}
    </>
  );
}