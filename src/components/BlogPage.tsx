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

import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
// TUTAJ WPISAŁEM TWOJE ID STRONY Z WORDPRESSA:
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

// Typ dla pól edytowalnych z ACF
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

// --- helpers ---

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
  // Stan dla postów
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

  // NOWE: Referencja do kontenera z listą wpisów (żeby scrollować w odpowiednie miejsce)
  const listSectionRef = useRef<HTMLElement>(null);

  // NOWE: Stan dla tekstów edytowalnych (ACF) i loadera
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
      case "OC/AC":
        return Car;
      case "Dom":
        return Home;
      case "Życie":
        return Heart;
      case "Turystyka":
        return Plane;
      case "Rolne":
        return Wheat;
      default:
        return Shield;
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
      <div className="w-full h-full bg-linear-to-br from-[#2D7A5F]/28 via-[#2D7A5F]/12 to-white flex items-center justify-center">
        <div
          className={
            featuredSize
              ? "w-20 h-20 rounded-3xl bg-[#2D7A5F] text-white flex items-center justify-center shadow-sm"
              : "w-14 h-14 rounded-2xl bg-[#2D7A5F] text-white flex items-center justify-center shadow-sm"
          }
        >
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

    return {
      id: String(p.id),
      slug: p.slug,
      title,
      excerpt,
      dateISO: p.date,
      wpHref: p.link,
      image,
      text,
    };
  };

  // 0) NOWE: Pobieranie tekstów z ACF przez Global Loadera
  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      const url = `${WP_BASE}/wp-json/wp/v2/pages/${BLOG_PAGE_ID}?_fields=acf`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.acf) setTexts(json.acf);
      }
    });
  }, [fetchTexts]);

  useEffect(() => {
    loadTextsData();
  }, [loadTextsData]);

  // 1) Pobieranie FEATURED
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingFeatured(true);
      setErrorMsg(null);
      try {
        const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=1&page=1&_embed=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`WP error: ${res.status}`);
        const totalStr = res.headers.get("X-WP-Total");
        const total = totalStr ? Number(totalStr) : null;
        const data = (await res.json()) as WpPost[];
        const first = data?.[0] ? mapWp(data[0]) : null;
        if (aborted) return;
        setFeatured(first);
        if (total && Number.isFinite(total)) {
          const remaining = Math.max(0, total - 1);
          const pages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
          setTotalPages(pages);
          setPage((p) => Math.min(p, pages));
        } else {
          setTotalPages(null);
        }
      } catch {
        if (aborted) return;
        setFeatured(null);
        setTotalPages(null);
      } finally {
        if (!aborted) setLoadingFeatured(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, []);

  // 2) Pobieranie LISTY (offset 1)
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingPage(true);
      try {
        const offset = 1 + (page - 1) * PAGE_SIZE;
        const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&offset=${offset}&_embed=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`WP error: ${res.status}`);
        const data = (await res.json()) as WpPost[];
        const mapped = data.map(mapWp);
        if (aborted) return;
        setPagePosts(mapped);
      } catch (err: unknown) {
        if (aborted) return;
        setPagePosts([]);
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Błąd pobierania wpisów.");
        }
      } finally {
        if (!aborted) setLoadingPage(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, [page]);

  // NOWE: Scroll do góry listy przy zmianie strony (page)
  useEffect(() => {
    if (page > 1 && listSectionRef.current) {
      listSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  useEffect(() => {
    setPage((p) => (p === 1 ? p : 1));
  }, [topic, query]);

  // --- LOGIKA WYSZUKIWANIA ---
  const filteredGrid = useMemo(() => {
    const q = query.trim().toLowerCase();

    let allPosts = [...pagePosts];
    if (featured) {
      if (!allPosts.find((p) => p.id === featured.id)) {
        allPosts = [featured, ...allPosts];
      }
    }

    return allPosts.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.text}`.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const inferred = inferTopic(p);
      const matchesTopic = topic === "Wszystkie" || inferred === topic;
      return matchesQuery && matchesTopic;
    });
  }, [featured, pagePosts, query, topic]);

  const isFiltering = topic !== "Wszystkie" || query.trim() !== "";
  const showFeaturedBlock = !!featured && !isFiltering;

  const postsToRender = showFeaturedBlock
    ? filteredGrid.filter((p) => p.id !== featured?.id)
    : filteredGrid;

  // Renderowanie loadera Globalnego tylko na czas pobierania tekstów
  if (loadingTexts) return <PageLoader />;

  return (
    <main className="bg-[#F5F1E8]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-14 sm:pb-16 lg:pb-20">
        <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
        <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />
        <div className="pointer-events-none absolute bottom-20 left-16 sm:left-36 w-16 h-16 sm:w-24 sm:h-24 border-4 border-white/10 rotate-12" />

        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-8 max-w-4xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                <Newspaper className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-5xl sm:text-4xl lg:text-6xl text-white leading-tight mb-6 sm:mb-8">
                {texts.blog_hero_title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-3xl whitespace-pre-wrap">
                {texts.blog_hero_desc}
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl w-full">
                <h3 className="text-white text-xl sm:text-2xl mb-3">
                  {texts.blog_cta_title}
                </h3>

                <p className="text-white/80 leading-relaxed mb-7 sm:mb-8">
                  {texts.blog_cta_desc}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <a
                    href={`tel:${(texts.blog_phone || "").replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white hover:bg-[#F5F1E8] text-[#2D7A5F] rounded-xl transition-all shadow-lg group"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">{texts.blog_phone}</span>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href={`${WP_BASE}/kontakt/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{texts.blog_email_btn}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section ref={listSectionRef} className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8] relative">
        <div className="pointer-events-none absolute top-10 left-1/4 w-24 h-24 bg-[#2D7A5F]/5 rounded-full" />
        <div className="pointer-events-none absolute top-32 right-1/3 w-16 h-16 bg-[#2D7A5F]/5 rotate-45" />
        <div className="pointer-events-none absolute bottom-20 right-1/4 w-32 h-32 bg-[#2D7A5F]/5 rounded-full" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-10 sm:mb-14 lg:mb-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D7A5F]/10 rounded-full mb-6">
                  <Newspaper className="w-4 h-4 text-[#2D7A5F]" />
                  <span className="text-sm text-[#2D7A5F] uppercase tracking-wide">
                    Przeglądaj wpisy
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-3">
                  {texts.blog_list_title}
                </h2>
                <p className="text-base sm:text-lg text-[#6B6B6B]">
                  {texts.blog_list_desc}
                </p>

                {errorMsg && (
                  <p className="mt-3 text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                    {errorMsg}
                  </p>
                )}
              </div>

              <div className="w-full md:w-[420px]">
                <div className="bg-white border border-[#2D7A5F]/10 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#2D7A5F]/60" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={texts.blog_search_placeholder}
                    className="w-full bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#6B6B6B]"
                    aria-label="Szukaj wpisów na blogu"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {TOPICS.map((t) => {
                    const active = t === topic;
                    return (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className={
                          active
                            ? "px-4 py-2 rounded-full bg-[#2D7A5F] text-white text-sm shadow-sm"
                            : "px-4 py-2 rounded-full bg-white border border-[#2D7A5F]/10 text-[#2D7A5F] text-sm hover:bg-[#2D7A5F]/5"
                        }
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <>
              {/* Szkielet ładowania */}
              {!!showFeaturedBlock && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 animate-pulse mb-8">
                  <div className="aspect-[16/9] w-full bg-[#2D7A5F]/10 rounded-2xl mb-4" />
                  <div className="h-7 bg-[#2D7A5F]/10 rounded-xl mb-2 w-3/4" />
                  <div className="h-6 bg-[#2D7A5F]/10 rounded-xl mb-2 w-2/3" />
                  <div className="h-12 bg-[#2D7A5F]/10 rounded-2xl mt-4 w-44" />
                </div>
              )}

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                  <div
                    key={`s-${idx}`}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 animate-pulse"
                  >
                    <div className="aspect-[16/9] w-full bg-[#2D7A5F]/10 rounded-2xl mb-4" />
                    <div className="h-6 bg-[#2D7A5F]/10 rounded-xl mb-2 w-5/6" />
                    <div className="h-6 bg-[#2D7A5F]/10 rounded-xl mb-4 w-2/3" />
                    <div className="h-10 bg-[#2D7A5F]/10 rounded-xl" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* FEATURED: Pokazujemy TYLKO gdy nie ma filtrowania */}
              {showFeaturedBlock &&
                featured &&
                (() => {
                  const ft = inferTopic(featured);
                  const Icon = topicIcon(ft);

                  return (
                    <Link
                      to={`/blog/${featured.slug}`}
                      className="group block bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden mb-8"
                    >
                      <div className="pointer-events-none absolute top-0 right-0 w-28 h-28 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

                      <div className="relative flex flex-col lg:flex-row gap-6">
                        <div className="relative w-full lg:w-[46%] overflow-hidden rounded-2xl border border-[#2D7A5F]/10 bg-[#2D7A5F]/5">
                          <div className="aspect-[16/9] w-full">
                            <Cover
                              image={featured.image}
                              title={featured.title}
                              icon={Icon}
                              featuredSize
                            />
                          </div>

                          <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] text-[#2D7A5F] uppercase tracking-wide border border-[#2D7A5F]/10">
                            {ft}
                          </div>
                        </div>

                        <div className="relative flex-1">
                          <div className="text-xs text-[#6B6B6B] mb-3">
                            {formatDatePL(featured.dateISO)}
                          </div>

                          <h3
                            className="text-2xl sm:text-3xl text-[#1A1A1A] leading-tight mb-3"
                            style={clampStyle(2)}
                          >
                            {featured.title}
                          </h3>

                          <p
                            className="text-[#6B6B6B] leading-relaxed mb-5"
                            style={clampStyle(3)}
                          >
                            {featured.excerpt}
                          </p>

                          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D7A5F] text-white shadow-sm">
                            <span>Czytaj wpis</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

              {/* GRID */}
              {postsToRender.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#2D7A5F]/10">
                  <div className="text-lg text-[#1A1A1A] mb-2">Brak wyników</div>
                  <div className="text-[#6B6B6B]">
                    Zmień frazę lub wybierz inny temat.
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {postsToRender.map((p) => {
                    const t = inferTopic(p);
                    const Icon = topicIcon(t);

                    return (
                      <Link
                        key={p.id}
                        to={`/blog/${p.slug}`}
                        className="group bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#2D7A5F]/10 hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col"
                      >
                        <div className="pointer-events-none absolute top-0 right-0 w-20 h-20 bg-[#2D7A5F]/5 rounded-bl-full transition-all group-hover:bg-[#2D7A5F]/10" />

                        <div className="relative mb-4 overflow-hidden rounded-2xl border border-[#2D7A5F]/10 bg-[#2D7A5F]/5">
                          <div className="aspect-[16/9] w-full">
                            <Cover image={p.image} title={p.title} icon={Icon} />
                          </div>

                          <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] text-[#2D7A5F] uppercase tracking-wide border border-[#2D7A5F]/10">
                            {t}
                          </div>

                          <div className="absolute right-4 top-4 text-[11px] text-white/90 bg-black/35 px-2.5 py-1 rounded-full">
                            {formatDatePL(p.dateISO)}
                          </div>
                        </div>

                        <h3
                          className="text-xl sm:text-[22px] text-[#1A1A1A] mb-2 leading-tight"
                          style={clampStyle(2)}
                        >
                          {p.title}
                        </h3>

                        <p
                          className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed mb-4"
                          style={clampStyle(3)}
                        >
                          {p.excerpt}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#2D7A5F]/10">
                          <span className="text-[#2D7A5F] font-medium group-hover:translate-x-1 transition-transform">
                            Czytaj
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#2D7A5F] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* PAGINACJA: Ukrywamy jeśli filtrujemy, bo filtrujemy tylko załadowane posty */}
          {!loading && !isFiltering && totalPages && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#2D7A5F]/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[#2D7A5F]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Poprzednia</span>
              </button>

              <div className="px-4 py-2 rounded-xl bg-[#2D7A5F]/10 text-[#2D7A5F] text-sm">
                Strona {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#2D7A5F]/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[#2D7A5F]"
              >
                <span>Następna</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}