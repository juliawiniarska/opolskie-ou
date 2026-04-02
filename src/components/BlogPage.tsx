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

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const decodeHtml = (input: string) => {
  if (!input) return "";
  if (typeof document !== "undefined") {
    const el = document.createElement("textarea");
    el.innerHTML = input;
    return el.value;
  }
  return input
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

const formatDatePL = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
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
    const img =
      doc.querySelector("img[src]") ||
      doc.querySelector("img[data-src]") ||
      doc.querySelector("img[data-lazy-src]");

    const src =
      img?.getAttribute("src") ||
      img?.getAttribute("data-src") ||
      img?.getAttribute("data-lazy-src");

    return src ?? null;
  } catch {
    return null;
  }
};

export default function BlogPage() {
  const [featured, setFeatured] = useState<PostCard | null>(null);
  const [pagePosts, setPagePosts] = useState<PostCard[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const loading = loadingFeatured || loadingPage;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic>("Wszystkie");

  const listSectionRef = useRef<HTMLElement>(null);
  const [texts, setTexts] = useState<BlogPageACF>({});
  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();

  const inferTopic = (p: Pick<PostCard, "title" | "excerpt" | "text">): Exclude<Topic, "Wszystkie"> => {
    const t = `${p.title} ${p.excerpt} ${p.text}`.toLowerCase();
    if (/(upraw|roln|gospodar|kombajn|agro|dopłat|doplat)/.test(t)) return "Rolne";
    if (/(turyst|wyjazd|wakac|podróż|podroz|travel)/.test(t)) return "Turystyka";
    if (/(mieszkan|dom|nieruch|lokal|mury|wyposaż|wyposaz|zalanie|pożar|pozar)/.test(t)) return "Dom";
    if (/(życie|zycie|zdrow|nnw|hospital|lek|chorob)/.test(t)) return "Życie";
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

  const Cover = ({
    image,
    title,
    icon: Icon,
    featuredSize = false,
  }: {
    image?: string | null;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    featuredSize?: boolean;
  }) => {
    if (image) {
      return <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />;
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2D7A5F]/20 via-[#2D7A5F]/5 to-white flex items-center justify-center">
        <div className={featuredSize ? "w-20 h-20 rounded-3xl bg-[#2D7A5F] text-white flex items-center justify-center shadow-sm" : "w-14 h-14 rounded-2xl bg-[#2D7A5F] text-white flex items-center justify-center shadow-sm"}>
          <Icon className={featuredSize ? "w-10 h-10" : "w-7 h-7"} />
        </div>
      </div>
    );
  };

  const mapWp = (p: WpPost): PostCard => {
    const title = decodeHtml(p.title?.rendered ?? "");
    const excerpt = decodeHtml(stripHtml(p.excerpt?.rendered ?? ""));
    const text = decodeHtml(stripHtml(p.content?.rendered ?? ""));
    const rawFeaturedImg = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
    const featuredImg = fixImgUrl(rawFeaturedImg);
    const rawInContent = parseFirstImageFromHtml(p.content?.rendered);
    const inContent = fixImgUrl(rawInContent);
    const image = featuredImg || inContent || null;
    return { id: String(p.id), slug: p.slug, title, excerpt, dateISO: p.date, wpHref: p.link, image, text };
  };

  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      const url = `${WP_BASE}/wp-json/wp/v2/pages/${BLOG_PAGE_ID}?_fields=acf&t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.acf) setTexts(json.acf);
      }
    });
  }, [fetchTexts]);

  useEffect(() => { loadTextsData(); }, [loadTextsData]);

  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingFeatured(true);
      setErrorMsg(null);
      try {
        const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=1&page=1&_embed=true&t=${Date.now()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Błąd serwera WordPress");
        const totalStr = res.headers.get("X-WP-Total");
        const total = totalStr ? Number(totalStr) : null;
        const data = (await res.json()) as WpPost[];
        const first = data?.[0] ? mapWp(data[0]) : null;
        if (aborted) return;
        setFeatured(first);
        if (total) {
          const pages = Math.ceil((total - 1) / PAGE_SIZE);
          setTotalPages(pages || 1);
        }
      } catch {
        if (!aborted) {
          setFeatured(null);
          setErrorMsg("Wystąpił problem z połączeniem z serwerem.");
        }
      } finally {
        if (!aborted) setLoadingFeatured(false);
      }
    };
    run();
    return () => { aborted = true; };
  }, []);

  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingPage(true);
      try {
        const offset = 1 + (page - 1) * PAGE_SIZE;
        const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&offset=${offset}&_embed=true&t=${Date.now()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = (await res.json()) as WpPost[];
        if (aborted) return;
        setPagePosts(data.map(mapWp));
      } catch {
        if (!aborted) {
          setPagePosts([]);
          setErrorMsg("Nie udało się załadować kolejnych wpisów.");
        }
      } finally {
        if (!aborted) setLoadingPage(false);
      }
    };
    run();
    return () => { aborted = true; };
  }, [page]);

  useEffect(() => {
    if (page > 1 && listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  useEffect(() => { 
    setPage(1); 
    setErrorMsg(null);
  }, [topic, query]);

  const filteredGrid = useMemo(() => {
    const q = query.trim().toLowerCase();
    let all = [...pagePosts];
    if (featured && !all.find(p => p.id === featured.id)) all = [featured, ...all];
    return all.filter(p => {
      const hay = `${p.title} ${p.excerpt} ${p.text}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesTopic = topic === "Wszystkie" || inferTopic(p) === topic;
      return matchesQuery && matchesTopic;
    });
  }, [featured, pagePosts, query, topic]);

  const isFiltering = topic !== "Wszystkie" || query.trim() !== "";
  const showFeaturedBlock = !!featured && !isFiltering;
  const postsToRender = showFeaturedBlock ? filteredGrid.filter(p => p.id !== featured?.id) : filteredGrid;

  // --- LOGIKA SEO (HELMET) ---
  const helmetContent = (
    <Helmet>
      <title>{topic === "Wszystkie" ? "Porady i Wiedza Ubezpieczeniowa" : `Porady: ${topic}`} | Opolskie Ubezpieczenia</title>
      <meta name="description" content="Eksperckie artykuły o ubezpieczeniach i kredytach. Dowiedz się, jak świadomie chronić majątek i zarządzać finansami. Sprawdź porady naszych doradców z Nysy." />
    </Helmet>
  );

  // Zwracamy Helmet + Loader jeśli trwa ładowanie tekstów z ACF
  if (loadingTexts) {
    return (
      <>
        {helmetContent}
        <PageLoader />
      </>
    );
  }

  return (
    <>
      {helmetContent}
      <main className="bg-[#F5F1E8]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
          <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
          <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
          <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
          
          <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-8 max-w-4xl">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                  <Newspaper className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8">{texts.blog_hero_title}</h1>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-3xl whitespace-pre-wrap">{texts.blog_hero_desc}</p>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl w-full">
                  <h3 className="text-white text-xl sm:text-2xl mb-3">{texts.blog_cta_title}</h3>
                  <p className="text-white/80 leading-relaxed mb-7 sm:mb-8">{texts.blog_cta_desc}</p>
                  <div className="space-y-3 sm:space-y-4">
                    <a href={`tel:${(texts.blog_phone || "").replace(/\s/g, "")}`} className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group">
                      <Phone className="w-5 h-5" /><span className="font-medium">{texts.blog_phone}</span><ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </a>
                    <Link to="/kontakt" className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl transition-all">
                      <Mail className="w-5 h-5" /><span>{texts.blog_email_btn}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LISTA */}
        <section ref={listSectionRef} className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="mb-10 sm:mb-14 lg:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
                  <Newspaper className="w-4 h-4 text-[#2D7A5F]" />
                  <span className="text-sm text-[#2D7A5F] uppercase tracking-wide">Przeglądaj wpisy</span>
                </div>
                <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-3">{texts.blog_list_title}</h2>
                <p className="text-base sm:text-lg text-[#6B6B6B]">{texts.blog_list_desc}</p>

                {errorMsg && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="w-full md:w-[420px]">
                <div className="bg-white border border-[#2D7A5F]/10 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#2D7A5F]/60" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={texts.blog_search_placeholder} className="w-full bg-transparent outline-none text-[#1A1A1A]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button key={t} onClick={() => setTopic(t)} className={t === topic ? "px-4 py-2 rounded-full bg-[#2D7A5F] text-white text-sm shadow-sm" : "px-4 py-2 rounded-full bg-white border border-[#2D7A5F]/10 text-[#2D7A5F] text-sm hover:bg-[#2D7A5F]/5"}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 h-80 shadow-lg border border-[#2D7A5F]/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {showFeaturedBlock && featured && (
                  <Link to={`/blog/${featured.slug}`} className="group block bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all mb-8 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="relative w-full lg:w-[46%] overflow-hidden rounded-2xl aspect-[16/9]">
                        <Cover image={featured.image} title={featured.title} icon={topicIcon(inferTopic(featured))} featuredSize />
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] text-[#2D7A5F] uppercase tracking-wide border">
                          {inferTopic(featured)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[#6B6B6B] mb-3">{formatDatePL(featured.dateISO)}</div>
                        <h3 className="text-2xl sm:text-3xl text-[#1A1A1A] mb-3 leading-tight" style={clampStyle(2)}>{featured.title}</h3>
                        <p className="text-[#6B6B6B] mb-5 leading-relaxed" style={clampStyle(3)}>{featured.excerpt}</p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D7A5F] text-white shadow-sm transition-transform group-hover:scale-[1.02]">
                          <span>Czytaj wpis</span><ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {postsToRender.map((p) => {
                    const t = inferTopic(p);
                    return (
                      <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-white rounded-3xl p-6 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all flex flex-col hover:-translate-y-1">
                        <div className="relative mb-4 overflow-hidden rounded-2xl aspect-[16/9] bg-[#2D7A5F]/5">
                          <Cover image={p.image} title={p.title} icon={topicIcon(t)} />
                          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] text-[#2D7A5F] uppercase tracking-wide">
                            {t}
                          </div>
                        </div>
                        <h3 className="text-xl text-[#1A1A1A] mb-2 font-medium leading-tight group-hover:text-[#2D7A5F]" style={clampStyle(2)}>{p.title}</h3>
                        <p className="text-sm text-[#6B6B6B] mb-4 flex-1 leading-relaxed" style={clampStyle(3)}>{p.excerpt}</p>
                        <div className="pt-3 border-t border-[#2D7A5F]/10 flex items-center justify-between text-[#2D7A5F] font-medium">
                          <span>Czytaj więcej</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {postsToRender.length === 0 && <div className="text-center py-20 text-[#6B6B6B]">Brak wpisów spełniających kryteria.</div>}

                {!isFiltering && totalPages && totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-3 rounded-xl bg-white border border-[#2D7A5F]/10 disabled:opacity-30 shadow-sm"><ChevronLeft className="w-5 h-5 text-[#2D7A5F]" /></button>
                    <span className="text-sm text-[#2D7A5F] font-medium bg-white px-4 py-2 rounded-xl border border-[#2D7A5F]/10">Strona {page} z {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-3 rounded-xl bg-white border border-[#2D7A5F]/10 disabled:opacity-30 shadow-sm"><ChevronRight className="w-5 h-5 text-[#2D7A5F]" /></button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}