import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Car,
  Home,
  Heart,
  Plane,
  Wheat,
  Shield,
  MessageCircle,
  Send,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PageLoader, usePageLoader } from "../GlobalContext";

// --- KONFIGURACJA ---
const WP_BASE = "https://www.opolskieubezpieczenia.pl/wp";
const WP_BASE2 = "https://www.opolskieubezpieczenia.pl/";

// ID strony w WordPress (Panel ustawień bloga)
const BLOG_SETTINGS_ID = 2700;

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  image?: string | null;
  html: string;
};

type WpComment = {
  id: number;
  date: string;
  author_name: string;
  content: { rendered: string };
};

type Comment = {
  id: string;
  dateISO: string;
  author: string;
  text: string;
};

// Typ dla pól ACF (box boczny)
type SinglePostACF = {
  single_cta_title?: string;
  single_cta_desc?: string;
  single_phone?: string;
  single_email_btn?: string;
  single_cta_footer?: string;
};

// ---- Funkcja naprawiająca URL (dodaje /wp/ jeśli brakuje) ----
const fixImgUrl = (url?: string | null) => {
  if (!url) return null;
  // Jeśli URL zawiera /wp-content/ ale NIE MA przed nim /wp/, to dodajemy
  if (url.includes("/wp-content/") && !url.includes("/wp/wp-content/")) {
    return url.replace("/wp-content/", "/wp/wp-content/");
  }
  return url;
};

// ---- helpers ----
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

// delikatne “upiększenie” HTML z WP + Naprawa zdjęć w treści
const styleWpHtml = (html: string) => {
  if (!html) return "";
  if (typeof document === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("h1").forEach((el) =>
    el.classList.add(
      "text-3xl",
      "sm:text-4xl",
      "font-semibold",
      "text-[#1A1A1A]",
      "leading-tight",
      "mb-4"
    )
  );
  doc.querySelectorAll("h2").forEach((el) =>
    el.classList.add(
      "text-2xl",
      "sm:text-3xl",
      "font-semibold",
      "text-[#1A1A1A]",
      "leading-tight",
      "mt-10",
      "mb-4"
    )
  );
  doc.querySelectorAll("h3").forEach((el) =>
    el.classList.add(
      "text-xl",
      "sm:text-2xl",
      "font-semibold",
      "text-[#1A1A1A]",
      "leading-tight",
      "mt-8",
      "mb-3"
    )
  );

  doc.querySelectorAll("p").forEach((el) =>
    el.classList.add("text-[15px]", "sm:text-base", "text-[#4B4B4B]", "leading-relaxed", "mb-4")
  );

  doc.querySelectorAll("ul").forEach((el) =>
    el.classList.add("my-5", "pl-6", "space-y-2", "list-disc", "text-[#4B4B4B]")
  );
  doc.querySelectorAll("ol").forEach((el) =>
    el.classList.add("my-5", "pl-6", "space-y-2", "list-decimal", "text-[#4B4B4B]")
  );

  doc.querySelectorAll("a").forEach((a) => {
    a.classList.add("text-[#2D7A5F]", "underline", "underline-offset-4", "hover:opacity-80", "transition");
    a.setAttribute("rel", "noopener noreferrer");
    a.setAttribute("target", "_blank");
  });

  doc.querySelectorAll("figure.wp-block-image, figure").forEach((fig) => {
    fig.classList.add("my-8");
  });

  // Naprawiamy SRC obrazków wewnątrz treści
  doc.querySelectorAll("img").forEach((img) => {
    img.classList.add("rounded-2xl", "shadow-lg", "border", "border-[#2D7A5F]/10", "block", "mx-auto");
    img.setAttribute("loading", "lazy");

    // Pobieramy obecny src i naprawiamy go funkcją fixImgUrl
    const currentSrc = img.getAttribute("src");
    if (currentSrc) {
      const fixedSrc = fixImgUrl(currentSrc);
      if (fixedSrc) {
        img.setAttribute("src", fixedSrc);
      }
    }
  });

  // hashtagowy paragraf: zamień w “chipsy”
  doc.querySelectorAll("p").forEach((p) => {
    const links = Array.from(p.querySelectorAll("a"));
    const text = (p.textContent || "").trim();
    const looksLikeHashtags = links.length >= 2 && text.replace(/\s+/g, "").startsWith("#");

    if (looksLikeHashtags) {
      p.className = "";
      p.classList.add("flex", "flex-wrap", "gap-2", "mt-6");
      links.forEach((a) => {
        a.className = "";
        a.classList.add(
          "px-3",
          "py-1.5",
          "rounded-full",
          "bg-[#2D7A5F]/10",
          "text-[#2D7A5F]",
          "text-xs",
          "sm:text-sm",
          "border",
          "border-[#2D7A5F]/15",
          "no-underline",
          "hover:bg-[#2D7A5F]/15",
          "transition"
        );
      });
    }
  });

  return doc.body.innerHTML;
};

type Topic = "OC/AC" | "Dom" | "Życie" | "Turystyka" | "Rolne";
const inferTopic = (title: string, excerpt: string, html: string): Topic => {
  const t = `${title} ${excerpt} ${stripHtml(html)}`.toLowerCase();
  if (/(upraw|roln|gospodar|kombajn|agro|dopłat|doplat)/.test(t)) return "Rolne";
  if (/(turyst|wyjazd|wakac|podróż|podroz|travel|paszport|lotnisk)/.test(t)) return "Turystyka";
  if (/(mieszkan|dom|nieruch|lokal|mury|wyposaż|wyposaz|zalanie|pożar|pozar)/.test(t)) return "Dom";
  if (/(życie|zycie|zdrow|nnw|hospital|lek|chorob)/.test(t)) return "Życie";
  return "OC/AC";
};

const topicIcon = (t: Topic) => {
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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);

  // Stan dla tekstów edytowalnych (ACF) i loadera
  const [texts, setTexts] = useState<SinglePostACF>({});
  const { loading: loadingTexts, fetchWithLoader: fetchTexts } = usePageLoader();

  // --- KLUCZOWA NAPRAWA TYTUŁU (MANUALNE WYMUSZENIE) ---
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | Opolskie Ubezpieczenia`;
    } else {
      document.title = "Wczytywanie wpisu... | Opolskie Ubezpieczenia";
    }
  }, [post, slug]);

  // 0) Pobieranie tekstów z ACF przez Global Loadera
  const loadTextsData = useCallback(() => {
    fetchTexts(async () => {
      const url = `${WP_BASE}/wp-json/wp/v2/pages/${BLOG_SETTINGS_ID}?_fields=acf`;
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

  useEffect(() => {
    let aborted = false;

    const run = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      setPost(null); // Resetujemy post, aby wymusić przeładowanie Helmeta i document.title

      try {
        const url =
          `${WP_BASE}/wp-json/wp/v2/posts` +
          `?slug=${encodeURIComponent(slug)}` +
          `&_embed=1` +
          `&_fields=id,slug,date,link,title,excerpt,content,_embedded`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`WP error: ${res.status}`);

        const data = (await res.json()) as WpPost[];
        const p = data?.[0];
        if (!p) throw new Error("Not found");

        const title = decodeHtml(p.title?.rendered ?? "");
        const excerpt = decodeHtml(stripHtml(p.excerpt?.rendered ?? ""));

        // Naprawa URL dla zdjęcia wyróżniającego (header)
        const rawFeaturedImg = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
        const featuredImg = fixImgUrl(rawFeaturedImg);

        const rawHtml = p.content?.rendered ?? "";
        // styleWpHtml teraz też naprawia URL obrazków w treści
        const styledHtml = styleWpHtml(rawHtml);

        const mapped: Post = {
          id: String(p.id),
          slug: p.slug,
          title,
          excerpt,
          dateISO: p.date,
          image: featuredImg,
          html: styledHtml,
        };

        if (aborted) return;
        setPost(mapped);
      } catch {
        if (aborted) return;
        setPost(null);
        setErrorMsg("Nie znaleziono wpisu lub błąd serwera.");
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [slug]);

  // fetch comments after post loaded
  useEffect(() => {
    let aborted = false;

    const run = async () => {
      if (!post?.id) return;

      setLoadingComments(true);
      setCommentError(null);

      try {
        // approved/public comments
        const url =
          `${WP_BASE}/wp-json/wp/v2/comments` +
          `?post=${encodeURIComponent(post.id)}` +
          `&per_page=50&orderby=date&order=desc` +
          `&_fields=id,date,author_name,content`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`WP comments error: ${res.status}`);

        const data = (await res.json()) as WpComment[];
        const mapped: Comment[] = (data || []).map((c) => ({
          id: String(c.id),
          dateISO: c.date,
          author: c.author_name || "Gość",
          text: decodeHtml(stripHtml(c.content?.rendered ?? "")),
        }));

        if (aborted) return;
        setComments(mapped);
      } catch {
        if (aborted) return;
        setComments([]);
        setCommentError("Nie udało się pobrać komentarzy.");
      } finally {
        if (!aborted) setLoadingComments(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [post?.id]);

  const meta = useMemo(() => {
    if (!post) return null;
    const topic = inferTopic(post.title, post.excerpt, post.html);
    const Icon = topicIcon(topic);

    const words = stripHtml(post.html).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));

    return { topic, Icon, minutes };
  }, [post]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id) return;

    setSentOk(false);
    setCommentError(null);

    const n = name.trim();
    const em = email.trim();
    const ct = commentText.trim();

    if (!n || !em || !ct) {
      setCommentError("Uzupełnij imię, e-mail oraz treść komentarza.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${WP_BASE}/wp-json/ou/v1/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: Number(post.id),
          name: n,
          email: em,
          content: ct,
          hp: "", // honeypot: ZAWSZE pusty
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // sukces: komentarz może trafić do moderacji w WP
      setName("");
      setEmail("");
      setCommentText("");
      setSentOk(true);

      // dociągnij listę jeszcze raz
      try {
        const refetch =
          `${WP_BASE}/wp-json/wp/v2/comments` +
          `?post=${encodeURIComponent(post.id)}` +
          `&per_page=50&orderby=date&order=desc` +
          `&_fields=id,date,author_name,content`;
        const r2 = await fetch(refetch);
        if (r2.ok) {
          const data = (await r2.json()) as WpComment[];
          setComments(
            (data || []).map((c) => ({
              id: String(c.id),
              dateISO: c.date,
              author: c.author_name || "Gość",
              text: decodeHtml(stripHtml(c.content?.rendered ?? "")),
            }))
          );
        }
      } catch {
        // ign
      }
    } catch {
      setCommentError("Nie udało się wysłać komentarza.");
    } finally {
      setSending(false);
      window.setTimeout(() => setSentOk(false), 2000);
    }
  };

  const helmetContent = (
    <Helmet key={slug} defer={false}>
      <title>{post?.title ? `${post.title} | Opolskie Ubezpieczenia` : "Wczytywanie wpisu..."}</title>
      <meta name="description" content={post?.excerpt ? post.excerpt : "Artykuł ekspercki na blogu Opolskie Ubezpieczenia."} />
    </Helmet>
  );

  if (loadingTexts || loading) return <>{helmetContent}<PageLoader /></>;

  return (
    <>
      {helmetContent}
      <main className="bg-[#F5F1E8]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#2D7A5F] pt-28 sm:pt-32 pb-12 sm:pb-14 lg:pb-16">
          {/* dekoracje */}
          <div className="pointer-events-none absolute top-16 right-10 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 border-4 border-white/10 rounded-full" />
          <div className="pointer-events-none absolute top-40 right-6 sm:right-16 w-14 h-14 sm:w-20 sm:h-20 border-4 border-white/10 rotate-45" />
          <div className="pointer-events-none absolute -bottom-10 left-6 sm:left-16 w-28 h-28 sm:w-40 sm:h-40 border-4 border-white/10 rounded-full" />

          <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
            <div className="mt-10 grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
              <div className="lg:col-span-8 max-w-4xl">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 sm:mb-8 border border-white/20">
                  <BookOpen className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                  {post?.title ?? "Wpis"}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-white/80">
                  {post?.dateISO && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDatePL(post.dateISO)}
                    </span>
                  )}

                  {meta && (
                    <>
                      <span className="text-white/35">•</span>
                      <span className="inline-flex items-center gap-2">
                        <meta.Icon className="w-4 h-4" />
                        {meta.topic}
                      </span>
                      <span className="text-white/35">•</span>
                      <span>{meta.minutes} min czytania</span>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl">
                  <h3 className="text-white text-lg sm:text-xl mb-2">
                    {texts.single_cta_title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    {texts.single_cta_desc}
                  </p>

                  <div className="space-y-3">
                    <a
                      href={`tel:${(texts.single_phone || "").replace(/\s/g, "")}`}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-white text-[#2D7A5F] px-5 py-3 font-medium hover:bg-[#F5F1E8] transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" /> Zadzwoń: {texts.single_phone}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                    <a
                      href={`${WP_BASE2}/kontakt/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent text-white px-5 py-3 hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" /> {texts.single_email_btn}
                    </a>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/20 text-xs text-white/70">
                    {texts.single_cta_footer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F1E8]">
          <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
            {errorMsg && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#2D7A5F]/10 text-center">
                <div className="text-lg text-[#1A1A1A] mb-2">Ups…</div>
                <div className="text-[#6B6B6B]">{errorMsg}</div>
                <div className="mt-6">
                  <Link
                    to="/blog"
                    className="inline-flex items-center justify-center rounded-2xl bg-white border border-[#2D7A5F]/15 text-[#2D7A5F] px-7 py-4 hover:bg-[#2D7A5F]/5 transition"
                  >
                    Wróć do listy wpisów
                  </Link>
                </div>
              </div>
            )}

            {post ? (
              <article className="max-w-[900px] mx-auto">
                {post.image && (
                  <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border border-[#2D7A5F]/10 mb-8">
                    <div className="relative w-full overflow-hidden rounded-2xl bg-[#2D7A5F]/5 border border-[#2D7A5F]/10">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-[#2D7A5F]/10">
                  <div dangerouslySetInnerHTML={{ __html: post.html }} />
                </div>

                {/* COMMENTS */}
                <div className="mt-10 bg-white rounded-3xl p-7 sm:p-9 shadow-lg border border-[#2D7A5F]/10">
                  <div className="flex items-center gap-2 mb-6">
                    <MessageCircle className="w-5 h-5 text-[#2D7A5F]" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Komentarze</h3>
                  </div>

                  {loadingComments ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-[#2D7A5F]/10 rounded-xl w-1/2 animate-pulse" />
                      <div className="h-4 bg-[#2D7A5F]/10 rounded-xl w-2/3 animate-pulse" />
                      <div className="h-4 bg-[#2D7A5F]/10 rounded-xl w-1/3 animate-pulse" />
                    </div>
                  ) : commentError ? (
                    <div className="text-sm text-[#6B6B6B]">{commentError}</div>
                  ) : comments.length === 0 ? (
                    <div className="text-sm text-[#6B6B6B]">Brak komentarzy — bądź pierwszy 🙂</div>
                  ) : (
                    <div className="space-y-5">
                      {comments.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-[#2D7A5F]/10 p-4 sm:p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-medium text-[#1A1A1A]">{c.author}</div>
                            <div className="text-xs text-[#6B6B6B]">{formatDatePL(c.dateISO)}</div>
                          </div>
                          <p className="mt-3 text-[15px] sm:text-base text-[#4B4B4B] leading-relaxed whitespace-pre-wrap">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-10 pt-8 border-t border-[#2D7A5F]/10">
                    <h4 className="text-lg font-semibold text-[#1A1A1A] mb-4">Dodaj komentarz</h4>

                    {sentOk && (
                      <div className="mb-4 rounded-2xl bg-[#2D7A5F]/10 border border-[#2D7A5F]/15 px-4 py-3 text-sm text-[#2D7A5F]">
                        Komentarz wysłany.
                      </div>
                    )}

                    <form onSubmit={submitComment} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#6B6B6B] mb-1">Imię*</label>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border border-[#2D7A5F]/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#2D7A5F]/25"
                            placeholder=""
                            autoComplete="name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6B6B6B] mb-1">E-mail*</label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full rounded-2xl border border-[#2D7A5F]/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#2D7A5F]/25"
                            placeholder=""
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-[#6B6B6B] mb-1">Komentarz*</label>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={5}
                          className="w-full rounded-2xl border border-[#2D7A5F]/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#2D7A5F]/25 resize-none"
                          placeholder="Napisz komentarz…"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2D7A5F] text-white px-6 py-3 font-medium hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {sending ? "Wysyłanie…" : "Wyślij komentarz"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/blog"
                    className="inline-flex items-center justify-center rounded-2xl bg-white border border-[#2D7A5F]/15 text-[#2D7A5F] px-7 py-4 hover:bg-[#2D7A5F]/5 transition"
                  >
                    Wróć do listy wpisów
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}