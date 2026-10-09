# Fútbol Libre — SEO Implementation Report

**Brand:** Fútbol Libre · **Primary keyword:** futbol libre · **Target:** Spain (Europe/Madrid, CEST)
**Tech:** Pure HTML5 + CSS3 + Vanilla JS · **Deploy:** Vercel (static, no build)
**Date:** 2026-10-10

## 1. Competitor & SERP research (what was analyzed)

**Reference site:** futbollibretv.bet (fetched 2026-10-10). Structure mapped from the live
homepage: sticky header + nav → H1 hero → "📅 Agenda de Partidos" panel (live search +
category filter, JS-rendered rows: time + flag + "Competition: Home vs Away") → Discord/Telegram
CTA cards → "Canales Deportivos México" card grid (8 channels, logo + name + "Ver Canal") →
long-form SEO content blocks ("¿Qué es…?", "Ver … por internet gratis", "Ligas y torneos",
"¿Cómo ver…?", "Canales deportivos en vivo", "Ligas de fútbol en español" league grid,
"Preguntas frecuentes" accordion) → dark footer with link columns + disclaimer.

**SERP findings for "futbol libre" (es, 2026-10-10):** the query is dominated by agenda-style
results ("partidos de hoy: horario y dónde ver") from ole.com.ar, elcomercio.pe, rpp.pe,
claro sports — i.e. search intent = **"qué partidos hay hoy y a qué hora"**. Notably,
elcomercio.pe already ranks a page titled "ver Fútbol Libre TV Barcelona vs Getafe hoy online
por LaLiga" — the exact brand+match pattern is proven SERP real estate. Also noted:
eldestapeweb.com runs "ver por Fútbol Libre es ilegal" content — legal-viewing framing is
both a compliance need and a content gap (nobody in the niche does it well).

**Secondary / semantic keywords used naturally:** agenda de partidos, partidos de hoy,
partidos en vivo, horario de partidos, hora peninsular española, canales deportivos,
dónde ver (legal), LaLiga / Premier League / Serie A / Bundesliga / Ligue 1 / Liga MX,
fútbol en español.

## 2. Keyword density (primary: "fútbol libre")

Method: exact-phrase count, case-insensitive, accent-normalized ("fútbol libre" ≡ "futbol libre";
the site uses correct Spanish orthography throughout). Analyzed region = `<main>` of the
homepage (boilerplate header/footer excluded; headings included — 2 of the occurrences sit
in the H1/H2).

- Analyzed words: **1,094**
- Exact-match occurrences: **6**
- Density = 6 ÷ 1,094 × 100 = **0.548%** ✅ (target 0.4–0.7%)

Occurrences: H1 (1), hero lede (1), "¿Qué es Fútbol Libre?" H2+body (2), FAQ questions (2).
If natural writing had conflicted with the target, quality would have won; it didn't.

## 3. Pages built (13)

| Page | Purpose / H1 |
|---|---|
| `/` index.html | H1 "Fútbol Libre en Vivo" — agenda + channels + full SEO content + FAQ |
| `/agenda` | Full agenda (day tabs, search, category filter, match modal) |
| `/canales` | Channel guide (8 cards + search + official-availability table) |
| `/ligas` | Leagues & tournaments coverage (Europe / América / other sports) |
| `/guia` | HowTo guide: 4 steps to follow a match |
| `/faq` | 8 Q&As (FAQPage schema) |
| `/nosotros` | About: what the site is / is not |
| `/contacto` | Contact form (Formspree-ready) |
| `/privacidad`, `/terminos`, `/dmca`, `/aviso-legal` | Legal pages (ES) |
| 404.html | Custom 404 (noindex) |

## 4. Agenda data — verified, not invented

**118 events** across Sat 10 / Sun 11 / Mon 12 Oct 2026, all in **CEST (hora peninsular)**:
79 football (LaLiga J8, Premier GW6, Serie A J6, Bundesliga J5, Ligue 1 J6, Liga MX J11,
Argentina J12, Colombia J14, Uruguay F10), 20 NHL, 12 NBA preseason, 5 F1/MotoGP sessions,
2 UFC Fight Night 290 blocks. Sources: LFP/OneFootball, TNT Sports, Football-Italia,
Bundesliga.com, psg.fr/LFP, ESPN, Vavel, Sportradar, formula1.com, crash.net, motogp.com,
atptour.com. 4 fixtures flagged `approx` (shown with ≈ and "horario por confirmar").
Deliberately omitted: UEFA Nations League (no games those dates — MD1–4 already played),
UCL/UEL (midweek only), unverifiable boxing cards.

## 5. On-page SEO implemented

- Unique SEO title + meta description + canonical (absolute) on all 12 indexable pages;
  `noindex` on 404; `index, follow` elsewhere; `lang="es"`.
- OG + Twitter Card tags; OG image (`assets/img/og.jpg`, 1200×630) + alt.
- One H1 per page; logical H2/H3 hierarchy; descriptive anchors; contextual internal links.
- `robots.txt` (allow all + sitemap), `sitemap.xml` (12 canonical URLs), `vercel.json`
  (`cleanUrls`, no trailing slash) — direct-visit + refresh safe.
- JSON-LD (all parsed valid): index = WebSite + Organization + WebPage + BreadcrumbList +
  FAQPage; inner pages = WebPage (+ BreadcrumbList where useful); faq.html = full FAQPage;
  guia.html = HowTo. **No SportsEvent/ItemList** — deliberate: per-event `location` is not
  verifiable for every fixture, and Google flags that as a critical Rich-Results issue
  (lesson carried over from the Roja Directa build).

## 6. UI/UX (original design, darker scheme)

Competitor's *patterns* kept (agenda panel, channel cards, league grid, FAQ accordion,
dark footer); the *visual design* is original, not a pixel copy: deep forest-green
(#062b1a→#0e5a33) + amber accents on ivory, dark slate-green header/footer, rounded cards,
sticky nav with mobile hamburger, accessible modal (Esc/backdrop close, focus mgmt),
single-open FAQ accordion, live search (150 ms debounce), category filter, "EN VIVO"
auto-badge (kickoff < 115 min ago), `prefers-reduced-motion` respected, visible focus
rings, skip link. Channel cards use **text badges, not trademarked logos**.

## 7. QA results

- `node --check`: fixtures.js, agenda.js, main.js — syntax OK.
- Fixture data tests: 3 days, 118 matches, times HH:MM valid, chronological per day,
  categories valid, all `tv` refs resolve to defined channels — **30/30 passed**.
- Agenda logic tests (DOM stub): 3 tabs render, 47 Saturday rows, search ("real madrid"→1),
  empty-state message, Monday tab 18 rows, category filter (fútbol-only 13), modal opens
  with correct teams/venue/official channels — **all passed**.
- Internal links: **0 broken** (all resolve to built pages). JSON-LD: **8/8 valid**.
- Not browser-tested end-to-end (loopback blocked from the browser VM); markup is
  standard HTML/CSS/JS with no exotic APIs.

## 8. Boundaries held (same as the Roja Directa build)

1. **No stream links or players anywhere** — match modals show only *official* channels
   (DAZN / Movistar LaLiga / NBA League Pass, where confidently known) plus a fallback
   line "Consulta la programación oficial"; footer + FAQ + Términos state it plainly.
2. **No pixel-perfect clone** — same structural UX patterns, original code, new darker
   color scheme, 100% original Spanish copy (no text copied from the competitor).
3. **No invented data** — fixtures verified per competition; 4 approx-flagged; TV info only
   where the operator is well-established; everything else defers to official listings.

## 9. Outstanding / owner tasks

- [ ] Replace placeholder domain `https://futbollibrees.vercel.app/` (canonicals, OG, sitemap,
      robots.txt, JSON-LD, README) with the real domain.
- [ ] Contact form: add Formspree endpoint (`contacto.html` currently `f/TU_ID`).
- [ ] Connect real Discord/Telegram links (homepage buttons currently `#`, flagged in UI title).
- [ ] Refresh `fixtures.js` every matchday (format documented in README).
- [ ] Submit sitemap in Search Console after deploy.
