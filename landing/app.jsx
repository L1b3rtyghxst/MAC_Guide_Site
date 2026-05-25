// Main app for "Маршруты по памятникам" landing
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons (outline, stroke=currentColor) ----------
const I = {
  Building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M13 9h.01M9 13h.01M13 13h.01M9 17h.01M13 17h.01"/>
    </svg>
  ),
  MapPin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Map: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M1 6v15l7-3 8 3 7-3V3l-7 3-8-3-7 3z"/><path d="M8 3v15"/><path d="M16 6v15"/>
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
    </svg>
  ),
  Info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="6 4 20 12 6 20 6 4"/>
    </svg>
  ),
  Compass: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/>
    </svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Walk: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="13" cy="4" r="2"/><path d="M7 22l2-6 4-2-1-5 3 4 4 1"/><path d="M9 16l-2 4"/>
    </svg>
  ),
};

// ---------- Data (синхронизировано с src/data/monuments.ts из репозитория) ----------
const VIDEO_RICK = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const MONUMENTS = [
  {
    id: "1", name: "Памятник Минину и Пожарскому", year: 1818,
    category: "monument", badge: "Памятник",
    addr: "Красная площадь, Москва",
    coords: { lat: 55.7520, lng: 37.6175 },
    desc: "Бронзовая скульптурная группа работы Ивана Мартоса, посвящённая героям Смутного времени.",
    descLong: "Первая крупная скульптурная композиция Москвы, созданная Иваном Мартосом. Памятник посвящён Кузьме Минину и Дмитрию Пожарскому — руководителям второго народного ополчения в Смутное время. Первоначально был установлен на Красной площади перед Верхними торговыми рядами.",
    image: "https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#7a6852", "#3d2f22"], silhouette: "duo",
  },
  {
    id: "2", name: "Могила Неизвестного Солдата", year: 1967,
    category: "memorial", badge: "Мемориал",
    addr: "Александровский сад, Москва",
    coords: { lat: 55.7525, lng: 37.6135 },
    desc: "Мемориальный комплекс с Вечным огнём у стен Московского Кремля.",
    descLong: "Архитектурный мемориальный ансамбль в Александровском саду у стен Кремля. Сооружён в 1966–1967 годах по проекту архитекторов Д. И. Бурдина, В. А. Климова, Ю. Р. Рабаева и скульптора Н. В. Томского. Вечный огонь, вырывающийся из бронзовой звезды, зажжён от огня на Марсовом поле в Санкт-Петербурге.",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#7a2222", "#3a0a0a"], silhouette: "torch",
  },
  {
    id: "3", name: "Памятник Юрию Долгорукому", year: 1954,
    category: "statue", badge: "Статуя",
    addr: "Тверская площадь, Москва",
    coords: { lat: 55.7610, lng: 37.6095 },
    desc: "Конная статуя основателя Москвы на Тверской площади.",
    descLong: "Памятник основателю Москвы установлен в 1954 году на Тверской площади напротив здания Мэрии. Скульпторы — С. М. Орлов, А. П. Антропов, Н. Л. Штамм, архитектор — В. С. Андреев. Князь изображён верхом на коне, правая рука простёрта вперёд, указывая место основания города.",
    image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#6e5a45", "#2c1f15"], silhouette: "horse",
  },
  {
    id: "4", name: "Памятник Пушкину", year: 1880,
    category: "statue", badge: "Статуя",
    addr: "Пушкинская площадь, Москва",
    coords: { lat: 55.7648, lng: 37.6055 },
    desc: "Знаменитый памятник великому русскому поэту работы А. М. Опекушина.",
    descLong: "Памятник Александру Сергеевичу Пушкину работы скульптора А. М. Опекушина был установлен в Москве 6 июня 1880 года. Расположен на Пушкинской площади. Бронзовая статуя высотой около 11 метров изображает поэта в полный рост, в задумчивой позе, со склонённой головой.",
    image: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#6b4c3a", "#3a261c"], silhouette: "pushkin",
  },
  {
    id: "5", name: "Триумфальные ворота", year: 1834,
    category: "architectural", badge: "Архитектура",
    addr: "Кутузовский проспект, Москва",
    coords: { lat: 55.7389, lng: 37.5181 },
    desc: "Триумфальная арка в честь победы в Отечественной войне 1812 года.",
    descLong: "Триумфальная арка построена в 1829–1834 годах в Москве по проекту архитектора О. И. Бове в честь победы русского народа в Отечественной войне 1812 года. Представляет собой однопролётную арку, украшенную чугунными колоннами и скульптурными композициями.",
    image: "https://images.unsplash.com/photo-1571118027171-d6de3e7ffaca?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#8a7048", "#4a371f"], silhouette: "arch",
  },
  {
    id: "6", name: "Памятник Маяковскому", year: 1958,
    category: "statue", badge: "Статуя",
    addr: "Триумфальная площадь, Москва",
    coords: { lat: 55.7711, lng: 37.5963 },
    desc: "Бронзовая статуя советского поэта-футуриста работы А. П. Кибальникова.",
    descLong: "Памятник Владимиру Маяковскому работы скульптора А. П. Кибальникова установлен в 1958 году на площади, носящей имя поэта. Бронзовая фигура высотой 6 метров изображает его в характерной позе — стоящим широко расставив ноги, в распахнутом пиджаке.",
    image: "https://images.unsplash.com/photo-1566932769119-7a1fb6d7ce23?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#5a4838", "#2a1f15"], silhouette: "pushkin",
  },
  {
    id: "7", name: "Памятник Гоголю", year: 1909,
    category: "statue", badge: "Статуя",
    addr: "Никитский бульвар, Москва",
    coords: { lat: 55.7520, lng: 37.5965 },
    desc: "Выразительный памятник великому русскому писателю работы Н. А. Андреева.",
    descLong: "Памятник Николаю Васильевичу Гоголю работы скульптора Н. А. Андреева установлен в 1909 году. Писатель изображён сидящим, погружённым в глубокие раздумья. На постаменте расположены горельефы с персонажами произведений Гоголя.",
    image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#5c4838", "#241810"], silhouette: "pushkin",
  },
  {
    id: "8", name: "Мемориал Победы на Поклонной горе", year: 1995,
    category: "memorial", badge: "Мемориал",
    addr: "Поклонная гора, Москва",
    coords: { lat: 55.7303, lng: 37.5065 },
    desc: "Грандиозный мемориальный комплекс Победы в Великой Отечественной войне.",
    descLong: "Мемориальный комплекс Победы посвящён победе в Великой Отечественной войне 1941–1945 годов. Включает Центральный музей Великой Отечественной войны, монумент Победы высотой 141,8 метра и храмы трёх конфессий.",
    image: "https://images.unsplash.com/photo-1595981234058-a9459f0b2a6e?w=1200",
    videoUrl: VIDEO_RICK,
    palette: ["#5e3d2a", "#28160a"], silhouette: "arch",
  },
];

const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "memorial", label: "Мемориалы" },
  { id: "statue", label: "Статуи" },
  { id: "monument", label: "Памятники" },
  { id: "architectural", label: "Архитектура" },
].map((c) => ({
  ...c,
  count: c.id === "all" ? MONUMENTS.length : MONUMENTS.filter((m) => m.category === c.id).length,
}));

// ---------- Synthetic monument "photo" placeholder ----------
function MonumentPhoto({ palette, silhouette, image }) {
  const [errored, setErrored] = useState(false);
  const [c1, c2] = palette;
  // SVG silhouettes for variety
  const silhouettes = {
    pushkin: <path d="M50 100 V62 c0-8 6-14 12-14 s12 6 12 14 V100 z M58 56 c0 6 8 6 8 0 c0 -8 -8 -8 -8 0z" fill="#1a0f08" />,
    torch: <g fill="#1a0f08"><rect x="58" y="60" width="8" height="40"/><path d="M55 60 h14 v-6 l-3-12 l-4 8 l-4-8 l-3 12z"/></g>,
    arch: <g fill="#1a0f08"><rect x="30" y="50" width="60" height="50"/><rect x="34" y="56" width="52" height="6" fill="none"/><path d="M48 100 V66 a12 12 0 0 1 24 0 V100z" fill="#332010"/></g>,
    duo: <g fill="#1a0f08"><rect x="40" y="92" width="40" height="10"/><path d="M52 92 V64 c0-4 4-6 6-6 s4 2 4 6 V92z M64 92 V60 c0-4 4-6 6-6 s4 2 4 6 V92z"/></g>,
    horse: <path d="M30 92 H88 V100 H30z M40 92 V68 c8 -6 22 -8 32 0 V92 M58 68 V52 c4 -2 8 -2 12 2 V68" fill="#1a0f08" stroke="#1a0f08" strokeWidth="2" strokeLinejoin="round"/>,
    wall: <g fill="#1a0f08"><rect x="20" y="55" width="80" height="48"/><rect x="22" y="57" width="14" height="6" fill="#553030"/><rect x="40" y="64" width="20" height="5" fill="#553030"/><rect x="62" y="60" width="12" height="6" fill="#553030"/><rect x="78" y="68" width="18" height="4" fill="#553030"/></g>,
  };
  return (
    <div className="mon-photo">
      <div className="bg" style={{ background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)` }} />
      {image && !errored ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setErrored(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <>
          <div className="glow" style={{ top: "10%", left: "20%" }} />
          <div className="horizon" />
          <svg className="silhouette" viewBox="0 0 120 110" preserveAspectRatio="xMidYMax meet">
            {silhouettes[silhouette] || silhouettes.pushkin}
          </svg>
        </>
      )}
    </div>
  );
}

// ---------- Reveal-on-scroll wrapper ----------
function Reveal({ children, delay = 0, kind = "up", once = false, className = "", as: As = "div", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [once]);
  const d = delay ? ` delay-${delay}` : "";
  return <As ref={ref} className={`reveal reveal-${kind}${shown ? " in" : ""}${d} ${className}`.trim()} {...rest}>{children}</As>;
}

// Word-by-word reveal — splits text into spans that fade up with stagger
function WordsReveal({ text, className = "", baseDelay = 0, perWord = 60, tag = "span", once = false }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const Tag = tag;
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      });
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [once]);
  const words = String(text).split(/(\s+)/);
  return (
    <Tag ref={ref} className={`words ${shown ? "in" : ""} ${className}`.trim()}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        return (
          <span key={i} className="word">
            <span className="w-in" style={{ transitionDelay: `${baseDelay + i * perWord}ms` }}>{w}</span>
          </span>
        );
      })}
    </Tag>
  );
}

// Animated counter — counts from 0 to target when scrolled into view
function Counter({ to, suffix = "", duration = 1400, decimals = 0 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const animate = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

// Parallax hook — drives a CSS var on an element based on its viewport position
function useParallax(ref, strength = 0.25, varName = "--py") {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let raf = null;
    const tick = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const wh = window.innerHeight;
      // -1 when entering from bottom, 0 centered, +1 leaving top
      const t = (r.top + r.height / 2 - wh / 2) / wh;
      el.style.setProperty(varName, `${(t * strength * 100).toFixed(2)}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, strength, varName]);
}

// Mouse-tilt hook — gentle 3D tilt on hover
function useTilt(ref, max = 6) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, max]);
}

// ---------- Header ----------
function Header({ geoState, onGeo }) {
  const [shrink, setShrink] = useState(false);
  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header theme-brand-banner ${shrink ? "shrink" : ""}`}>
      <div className="container header-inner">
        <a href="#top" className="brand-mark">
          <div className="brand-logo theme-accent-banner">
            <I.Building width="28" height="28" stroke="white" />
          </div>
          <div className="brand-text">
            <h1>Маршруты по&nbsp;памятникам</h1>
            <p>Откройте для себя историческое наследие</p>
          </div>
        </a>
        <nav className="header-nav">
          <a href="#catalog">Каталог</a>
          <a href="#routes">Маршруты</a>
          <a href="#map">Карта</a>
          <a href="#how">Как это работает</a>
        </nav>
        <button
          className={`geo-btn ${geoState}`}
          onClick={onGeo}
          disabled={geoState === "loading"}
          title={
            geoState === "success" ? "Местоположение определено — нажмите, чтобы сбросить" :
            geoState === "error" ? "Не удалось определить — нажмите, чтобы повторить" :
            geoState === "loading" ? "Определяем местоположение..." :
            "Определить моё местоположение"
          }
        >
          {geoState === "loading" ? (
            <>
              <span className="spinner" />
              <span className="label-long">Определение...</span>
            </>
          ) : geoState === "success" ? (
            <>
              <span className="dot" />
              <span className="label-long">Местоположение найдено</span>
            </>
          ) : geoState === "fallback" ? (
            <>
              <I.MapPin width="16" height="16" />
              <span className="label-long">Москва (вручную)</span>
            </>
          ) : geoState === "error" ? (
            <>
              <I.MapPin width="16" height="16" />
              <span className="label-long">Ошибка геолокации</span>
            </>
          ) : (
            <>
              <I.MapPin width="16" height="16" />
              <span className="label-long">Определить меня</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  const visualRef = useRef(null);
  useParallax(visualRef, -0.35, "--py");
  useTilt(visualRef, 4);
  return (
    <section className="hero" id="top">
      <window.HeroCanvas />
      <div className="container">
        <div className="hero-grid">
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="pill">{MONUMENTS.length}</span>
                <span>Памятников в каталоге</span>
              </span>
            </Reveal>
            <h2>
              <WordsReveal text="Прогулки по " baseDelay={120} perWord={70} />
              <span className="accent"><WordsReveal text="истории" baseDelay={350} /></span>
              <WordsReveal text=" столицы — собранные на одной карте" baseDelay={550} perWord={50} />
            </h2>
            <Reveal delay={2}>
              <p className="lede">
                Подберите свой пешеходный маршрут между мемориалами, статуями и архитектурными памятниками. Откройте знакомые места заново.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="hero-cta">
                <a href="#catalog" className="btn btn-brand">
                  <I.Compass width="18" height="18" />
                  Начать маршрут
                </a>
                <a href="#routes" className="btn btn-ghost">
                  <I.Sparkle width="18" height="18" />
                  Готовые маршруты
                </a>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="hero-stats">
                <div className="stat"><div className="num"><Counter to={MONUMENTS.length} /></div><div className="lbl">памятников</div></div>
                <div className="stat"><div className="num"><Counter to={4} /></div><div className="lbl">маршрута</div></div>
                <div className="stat"><div className="num"><Counter to={4.2} decimals={1} suffix=" км" /></div><div className="lbl">средняя длина </div></div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2} kind="scale">
            <div className="hero-visual parallax tilt" ref={visualRef}>
              <div className="silhouette">
                <svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMax meet">
                  {/* Stylized monument silhouette */}
                  <g fill="#0e0805">
                    <rect x="80" y="200" width="40" height="18" />
                    <rect x="70" y="186" width="60" height="14" />
                    <rect x="85" y="100" width="30" height="86" />
                    <path d="M85 100 L100 60 L115 100 z" />
                    <circle cx="100" cy="55" r="6" />
                  </g>
                </svg>
              </div>
              <div className="hero-tag t1">
                <div className="pin">1</div>
                <div className="meta">
                  <div className="name">Триумфальная арка</div>
                  <div className="sub">1834 · Кутузовский</div>
                </div>
              </div>
              <div className="hero-tag t2">
                <div className="pin">3</div>
                <div className="meta">
                  <div className="name">Памятник Пушкину</div>
                  <div className="sub">1880 · Тверская</div>
                </div>
              </div>
              <div className="hero-tag t3">
                <div className="pin">5</div>
                <div className="meta">
                  <div className="name">Вечный огонь</div>
                  <div className="sub">1967 · Александровский сад</div>
                </div>
              </div>
              <div className="hero-caption">
                <div className="y">МСК</div>
                <div className="t">Маршрут №07 · 4.2 км</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="scroll-hint">
        <span>прокрутить</span>
        <span className="line" />
      </div>
    </section>
  );
}

// ---------- Marquee ----------
function Marquee() {
  const items = [
    "Тверская", "Арбат", "Замоскворечье", "Кремль", "Александровский сад",
    "Поклонная гора", "Чистые пруды", "Патриаршие", "Воробьёвы горы", "ВДНХ",
  ];
  const segment = (
    <span>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {it}
          <span className="sep" />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {segment}{segment}
      </div>
    </div>
  );
}

// ---------- Catalog ----------
function Catalog({ selectedIds, toggleSelect, getOrder, onOpenDetails }) {
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => {
    return MONUMENTS.filter((m) => cat === "all" || m.category === cat);
  }, [cat]);

  return (
    <section className="section" id="catalog">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="kicker">Каталог · Москва</div>
              <h3 className="title">Памятники, мимо которых вы&nbsp;<span className="b">проходите каждый день</span></h3>
            </div>
            <p>Фильтруйте по категориям и собирайте маршрут одним нажатием. Карточка показывает год, адрес, описание и категорию.</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="category-row">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`cat ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>
                {c.label}
                <span className="count">{c.count}</span>
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div className="cat" style={{ pointerEvents: "none", background: "transparent", border: "0", color: "var(--text-soft)" }}>
              Показано: {filtered.length}
            </div>
          </div>
        </Reveal>

        <div className="card-grid">
          {filtered.map((m, i) => {
            const selected = selectedIds.has(m.id);
            const order = getOrder(m.id);
            const kind = ["up", "left", "right", "scale"][i % 4];
            return (
              <Reveal key={m.id} delay={Math.min((i % 3) + 1, 5)} kind={kind}>
                <article className={`card ${selected ? "selected" : ""}`}>
                  <div className="photo">
                    <div className="img"><MonumentPhoto palette={m.palette} silhouette={m.silhouette} image={m.image} /></div>
                    <span className={`badge b-${m.category === "architectural" ? "arch" : m.category}`}>
                      {m.badge}
                    </span>
                    {selected && <div className="order-num">{order || "•"}</div>}
                    <div className="year">{m.year}<span>год</span></div>
                  </div>
                  <div className="body">
                    <h3>{m.name}</h3>
                    <p className="desc">{m.desc}</p>
                    <div className="addr">
                      <I.MapPin width="14" height="14" />
                      {m.addr}
                    </div>
                    <div className="actions">
                      <button className="btn-sm btn-soft" onClick={() => onOpenDetails(m)}>
                        <I.Info width="14" height="14" /> Подробнее
                      </button>
                      <button
                        className={`btn-sm ${selected ? "btn-accent-sm" : "btn-brand-sm"}`}
                        onClick={() => toggleSelect(m.id)}
                      >
                        {selected ? (<><I.Check width="14" height="14"/> В маршруте</>) : (<>+ Добавить</>)}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Featured routes ----------
// ---------- Featured routes (синхронизировано с src/components/PresetRoutes.tsx) ----------
const ROUTES = [
  {
    id: "all", theme: "brand", icon: <I.Map width="22" height="22" stroke="white"/>,
    title: "Полный маршрут", sub: "Все памятники — идеально для полноценной экскурсии",
    catFilter: null,
  },
  {
    id: "memorial", theme: "accent", icon: <I.Sparkle width="22" height="22" stroke="white"/>,
    title: "Мемориалы", sub: "Памятные места и мемориальные комплексы",
    catFilter: "memorial",
  },
  {
    id: "statue", theme: "stone", icon: <I.Compass width="22" height="22" stroke="white"/>,
    title: "Статуи и скульптуры", sub: "Памятники великим деятелям истории и культуры",
    catFilter: "statue",
  },
  {
    id: "architectural", theme: "forest", icon: <I.Building width="22" height="22" stroke="white"/>,
    title: "Архитектурные памятники", sub: "Триумфальные арки и архитектурные сооружения",
    catFilter: "architectural",
  },
].map((r) => {
  const count = r.catFilter ? MONUMENTS.filter((m) => m.category === r.catFilter).length : MONUMENTS.length;
  const km = (count * 0.8 + 0.6).toFixed(1) + " км";
  const mins = "≈ " + Math.round(count * 14 + 18) + " мин";
  return { ...r, points: count, len: km, time: mins };
});

function FeaturedRoutes({ onApply, selectedIds }) {
  const isActive = (r) => {
    const ids = r.catFilter ? MONUMENTS.filter((m) => m.category === r.catFilter).map((m) => m.id) : MONUMENTS.map((m) => m.id);
    return ids.length === selectedIds.size && ids.every((id) => selectedIds.has(id));
  };
  return (
    <section className="section featured-section" id="routes">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="kicker">Готовые маршруты</div>
              <h3 className="title">Четыре авторских прогулки по&nbsp;<span className="b">историческому центру</span></h3>
            </div>
            <p>Каждый маршрут собран экскурсоводами проекта и проверен на пешеходной доступности. Запускайте сразу или редактируйте по своему.</p>
          </div>
        </Reveal>
        <div className="featured-grid">
          {ROUTES.map((r, i) => (
            <Reveal key={r.id} delay={i + 1} kind={i % 2 ? "up" : "scale"}>
              <div
                className={`route-card rg-${r.theme}`}
                onClick={() => onApply(r.catFilter)}
                style={isActive(r) ? { transform: "translateY(-4px)", boxShadow: "0 0 0 3px var(--accent), 0 24px 50px rgba(47,33,28,0.28)" } : null}
              >
                <div>
                  <div className="ic">{r.icon}</div>
                  <h4>{r.title}</h4>
                  <div className="sub">{r.sub}</div>
                </div>
                <div className="footer">
                  <span>{r.len} · {r.time}</span>
                  <span className="count-pill">{r.points} мест</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Map preview ----------
function MapPreview({ selectedMonuments, mapMode, setMapMode, userLocation, onMonumentClick, onMapClick }) {
  // synthetic positions on the map (0..1 coords)
  const points = useMemo(() => ([
    { x: 0.20, y: 0.78 },
    { x: 0.32, y: 0.62 },
    { x: 0.42, y: 0.45 },
    { x: 0.56, y: 0.50 },
    { x: 0.66, y: 0.32 },
    { x: 0.82, y: 0.28 },
  ]), []);

  const totalKm = (selectedMonuments.length > 1 ? (selectedMonuments.length - 1) * 0.7 + 0.4 : 0).toFixed(1);
  const totalMin = selectedMonuments.length * 18;

  return (
    <section className="section" id="map">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="kicker">Интерактивная карта</div>
              <h3 className="title">Соберите маршрут визуально — <span className="b">точка за точкой</span></h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
              <p style={{ margin: 0 }}>Атмосферная пергаментная схема или живая карта Яндекса с пешеходным маршрутом — переключайтесь одним нажатием.</p>
              <div className="map-mode-toggle">
                <button className={mapMode === "canvas" ? "on" : ""} onClick={() => setMapMode("canvas")}>
                  <I.Sparkle width="14" height="14"/> Атмосферная
                </button>
                <button className={mapMode === "yandex" ? "on" : ""} onClick={() => setMapMode("yandex")}>
                  <I.Map width="14" height="14"/> Яндекс.Карта
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="map-wrap">
            <div className="map-card">
              {mapMode === "yandex" ? (
                <window.YandexMap
                  monuments={MONUMENTS}
                  selectedMonuments={selectedMonuments}
                  userLocation={userLocation}
                  onMonumentClick={onMonumentClick}
                  onMapClick={onMapClick}
                />
              ) : (
                <div className="map-canvas-host">
                  <window.MapCanvas points={points} />
                </div>
              )}
              <div className="map-overlay">
                <div className="map-info">
                  <div className="stat-row"><span className="label">Точек</span><span className="v">{selectedMonuments.length || points.length}</span></div>
                  <div className="stat-row"><span className="label">Расстояние</span><span className="v">{totalKm} км</span></div>
                  <div className="stat-row"><span className="label">Время</span><span className="v">{totalMin} мин</span></div>
                </div>
                <div className="map-legend">
                  <div className="row"><span className="dot" style={{ background: "#5f0909" }} />Выбранный памятник</div>
                  <div className="row"><span className="dot" style={{ background: "#8c6f60" }} />Другие памятники</div>
                  <div className="row"><span className="dot" style={{ background: "#3d6b8d" }} />Ваше местоположение</div>
                </div>
              </div>
            </div>

            <RoutePanel selectedMonuments={selectedMonuments} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RoutePanel({ selectedMonuments }) {
  const km = (selectedMonuments.length > 1 ? (selectedMonuments.length - 1) * 0.7 + 0.4 : 0).toFixed(1);
  const min = selectedMonuments.length * 18;
  return (
    <div className="route-panel">
      <div className="route-panel-head">
        <h4>Ваш маршрут</h4>
        <span className="pill">{selectedMonuments.length} точек</span>
      </div>
      <div className="route-stats">
        <div className="s"><div className="v">{km}</div><div className="l">КМ</div></div>
        <div className="s"><div className="v">{min}</div><div className="l">МИН</div></div>
      </div>
      <div className="route-points">
        {selectedMonuments.length === 0 ? (
          <div style={{ padding: "32px 12px", textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--surface-strong)",
              display: "grid", placeItems: "center", margin: "0 auto 14px"
            }}>
              <I.Map width="24" height="24" stroke="var(--text-muted)" />
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>Маршрут пуст</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
              Добавьте памятники из каталога, чтобы построить пешеходный маршрут
            </div>
          </div>
        ) : (
          selectedMonuments.map((m, i) => (
            <div className="route-point" key={m.id}>
              <div className="num">{i + 1}</div>
              <div className="meta">
                <div className="n">{m.name}</div>
                <div className="d">{m.year} · {m.addr}</div>
              </div>
              <button className="del" title="Убрать">
                <I.Trash width="14" height="14" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="route-actions">
        <button className="btn btn-accent" style={{ justifyContent: "center" }}>
          <I.Sparkle width="16" height="16" stroke="white" />
          Оптимизировать маршрут
        </button>
        <button className="btn btn-ghost" style={{ justifyContent: "center" }}>
          <I.Map width="16" height="16" />
          Открыть на карте
        </button>
      </div>
    </div>
  );
}

// ---------- How it works ----------
function HowItWorks() {
  const steps = [
    { n: "01", t: "Выбирайте памятники", p: "Фильтр по категориям, поиск по адресу. Каждая карточка — год, фото, описание и категория." },
    { n: "02", t: "Стройте маршрут", p: "Перетаскивайте точки на карте или включайте оптимизацию: алгоритм выстроит кратчайший путь пешком." },
    { n: "03", t: "Идите по маршруту", p: "Геолокация подскажет дистанцию до следующей точки. Видеообзор и описание открываются по нажатию." },
  ];
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="kicker">Как это работает</div>
              <h3 className="title">Три шага от&nbsp;<span className="b">идеи прогулки до точки на карте</span></h3>
            </div>
          </div>
        </Reveal>
        <div className="how-grid">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i + 1} kind={["left", "up", "right"][i]}>
              <div className="how-step">
                <div className="deco" />
                <div className="n">{s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA ----------
function CTA() {
  return (
    <section className="section compact">
      <div className="container">
        <Reveal>
          <div className="cta-banner">
            <div>
              <h3>Готовы пройти&nbsp;<span className="gold">маршрут</span><br/>сегодня вечером?</h3>
              <p>Выберите готовый маршрут или соберите свой. Сервис работает без регистрации, прямо в браузере вашего телефона.</p>
              <div className="ctas">
                <a href="#catalog" className="btn btn-accent">
                  <I.Compass width="18" height="18" stroke="white"/>
                  Открыть каталог
                </a>
                <a href="#routes" className="btn btn-ghost">
                  <I.Play width="16" height="16" /> Готовые маршруты
                </a>
              </div>
            </div>
            <div className="seal">
              <div className="inner">
                <span>МАЦ</span>
                <b>{MONUMENTS.length}</b>
                <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.85 }}>памятников</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-mark" style={{ marginBottom: 16 }}>
              <div className="brand-logo theme-accent-banner">
                <I.Building width="26" height="26" stroke="white" />
              </div>
              <div className="brand-text">
                <h1 style={{ fontSize: 22 }}>МАЦ</h1>
                <p>Маршруты по памятникам</p>
              </div>
            </div>
            <p style={{ maxWidth: 320 }}>Исследуйте историческое наследие · Создавайте уникальные маршруты по памятным местам Москвы.</p>
          </div>
          <div className="footer-col">
            <h5>Сервис</h5>
            <a href="#catalog">Каталог</a>
            <a href="#routes">Готовые маршруты</a>
            <a href="#map">Карта</a>
            <a href="#how">Как это работает</a>
          </div>
          <div className="footer-col">
            <h5>Категории</h5>
            <a href="#">Мемориалы</a>
            <a href="#">Статуи</a>
            <a href="#">Памятники</a>
            <a href="#">Архитектура</a>
          </div>
          <div className="footer-col">
            <h5>Контакты</h5>
            <p>routes@example.ru</p>
            <p>Москва, Тверская 7</p>
            <p>ежедневно 10:00–22:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 МАЦ — Маршруты по памятникам. Открытый культурный сервис.</span>
          <span>Сделано в Москве · v2.1</span>
        </div>
      </div>
    </footer>
  );
}

function BackToTop({ visible }) {
  return (
    <button
      className={`back-to-top ${visible ? "on" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      title="Наверх"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  );
}

// ---------- App ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#850f0f", "#b88b3b"],
  "serif": "Cormorant Garamond",
  "density": "regular",
  "radius": "soft",
  "showStats": true
}/*EDITMODE-END*/;

const PALETTES = [
  ["#850f0f", "#b88b3b"], // музейный (бордо + золото)
  ["#1f3a5f", "#c69a49"], // имперский (синий + золото)
  ["#3d5a3a", "#b88b3b"], // парковый (зелёный + золото)
  ["#5c3a2e", "#d4a574"], // ржавый (терракот + беж)
];

function applyTweaksToRoot(t) {
  const root = document.documentElement;
  // palette
  const [brand, accent] = t.palette || PALETTES[0];
  root.style.setProperty("--brand", brand);
  root.style.setProperty("--brand-strong", shade(brand, -18));
  root.style.setProperty("--brand-soft", shade(brand, 22));
  root.style.setProperty("--brand-ghost", hexToRgba(brand, 0.08));
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-strong", shade(accent, -22));
  root.style.setProperty("--accent-soft", shade(accent, 36));
  // serif
  root.style.setProperty("--serif", `"${t.serif}", Georgia, serif`);
  // density
  const dens = { compact: 64, regular: 96, spacious: 128 }[t.density] ?? 96;
  root.style.setProperty("--section-py", dens + "px");
  // radius
  const rad = { sharp: 0.5, soft: 1, round: 1.6 }[t.radius] ?? 1;
  root.style.setProperty("--radius-scale", rad);
}

function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function shade(hex, amt) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = clamp255(parseInt(n.slice(0, 2), 16) + amt);
  const g = clamp255(parseInt(n.slice(2, 4), 16) + amt);
  const b = clamp255(parseInt(n.slice(4, 6), 16) + amt);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function clamp255(v) { return Math.max(0, Math.min(255, v)); }

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaksToRoot(t); }, [t]);

  const [geo, setGeo] = useState("idle");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set(["1", "2", "3", "4"]));
  const [progress, setProgress] = useState(0);
  const [modalMonument, setModalMonument] = useState(null);
  const [mapMode, setMapMode] = useState("canvas");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectedMonuments = useMemo(
    () => [...selectedIds].map((id) => MONUMENTS.find((m) => m.id === id)).filter(Boolean),
    [selectedIds]
  );

  const applyRoute = (catFilter) => {
    const ids = catFilter ? MONUMENTS.filter((m) => m.category === catFilter).map((m) => m.id) : MONUMENTS.map((m) => m.id);
    setSelectedIds(new Set(ids));
    const el = document.getElementById("map");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleGeo = () => {
    if (geo === "success") {
      setGeo("idle"); setUserLocation(null);
      return;
    }
    if (!navigator.geolocation) {
      fallbackToMoscow("Геолокация не поддерживается браузером");
      return;
    }
    setGeo("loading");

    const onSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log(`[geo] lat=${latitude.toFixed(6)}, lng=${longitude.toFixed(6)}, accuracy=${Math.round(accuracy)}m`);
      setUserLocation({ lat: latitude, lng: longitude, accuracy, manual: false });
      setGeo("success");
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (err) => {
        console.warn(`[geo] high-accuracy failed: code=${err.code} ${err.message}`);
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          (err2) => {
            console.warn(`[geo] low-accuracy failed: code=${err2.code} ${err2.message}`);
            const reasons = { 1: "Доступ запрещён", 2: "Позиция недоступна", 3: "Время ожидания вышло" };
            fallbackToMoscow(reasons[err2.code] || "Не удалось определить");
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const fallbackToMoscow = (reason) => {
    setUserLocation({ lat: 55.7558, lng: 37.6173, accuracy: null, manual: true });
    setGeo("fallback");
    setMapMode("yandex");
    setToast({
      title: reason,
      text: "Используется центр Москвы. Кликните на карту Яндекса, чтобы указать ваше положение вручную.",
    });
    // auto-scroll to map
    setTimeout(() => {
      const el = document.getElementById("map");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  const handleMapClick = (coords) => {
    setUserLocation({ lat: coords[0], lng: coords[1], accuracy: null, manual: true });
    setGeo("success");
    setToast({ title: "Точка установлена", text: `${coords[0].toFixed(4)}°, ${coords[1].toFixed(4)}°` });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: progress + "%" }} />
      <BackToTop visible={progress > 8} />
      <Header geoState={geo} onGeo={handleGeo} />
      <Hero />
      <Marquee />
      <Catalog
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        getOrder={(id) => [...selectedIds].indexOf(id) + 1}
        onOpenDetails={setModalMonument}
      />
      <FeaturedRoutes onApply={applyRoute} selectedIds={selectedIds} />
      <MapPreview
        selectedMonuments={selectedMonuments}
        mapMode={mapMode}
        setMapMode={setMapMode}
        userLocation={userLocation}
        onMonumentClick={(m) => toggleSelect(m.id)}
        onMapClick={handleMapClick}
      />
      <HowItWorks />
      <CTA />
      <Footer />

      {window.MonumentModal && (
        <window.MonumentModal
          monument={modalMonument}
          isOpen={!!modalMonument}
          onClose={() => setModalMonument(null)}
          isSelected={modalMonument ? selectedIds.has(modalMonument.id) : false}
          onToggle={(id) => { toggleSelect(id); }}
        />
      )}

      {toast && (
        <div className="toast" onClick={() => setToast(null)}>
          <div className="toast-icon">
            <I.Info width="20" height="20" />
          </div>
          <div className="toast-body">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-text">{toast.text}</div>
          </div>
          <button className="toast-close" aria-label="Скрыть">×</button>
        </div>
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Палитра" />
        <window.TweakColor
          label="Бренд + акцент"
          value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak("palette", v)}
        />
        <window.TweakSection label="Типографика" />
        <window.TweakSelect
          label="Сериф"
          value={t.serif}
          options={["Cormorant Garamond", "Playfair Display", "PT Serif", "Lora"]}
          onChange={(v) => setTweak("serif", v)}
        />
        <window.TweakSection label="Размеры" />
        <window.TweakRadio
          label="Плотность"
          value={t.density}
          options={["compact", "regular", "spacious"]}
          onChange={(v) => setTweak("density", v)}
        />
        <window.TweakRadio
          label="Радиусы"
          value={t.radius}
          options={["sharp", "soft", "round"]}
          onChange={(v) => setTweak("radius", v)}
        />
        <window.TweakSection label="Контент" />
        <window.TweakToggle
          label="Показывать статы в hero"
          value={t.showStats}
          onChange={(v) => setTweak("showStats", v)}
        />
        <window.TweakButton
          label="Очистить маршрут"
          secondary
          onClick={() => setSelectedIds(new Set())}
        />
      </window.TweaksPanel>

      <style>{`
        :root { --section-py: 96px; --radius-scale: 1; }
        .section { padding: var(--section-py) 0; }
        .card { border-radius: calc(18px * var(--radius-scale)); }
        .route-card { border-radius: calc(18px * var(--radius-scale)); }
        .map-card, .route-panel { border-radius: calc(22px * var(--radius-scale)); }
        .how-step { border-radius: calc(20px * var(--radius-scale)); }
        .btn, .btn-sm { border-radius: calc(12px * var(--radius-scale)); }
        ${t.showStats ? "" : ".hero-stats { display: none; }"}
      `}</style>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
