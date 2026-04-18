import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#060608",
  surface: "#0C0C10",
  surfaceHigh: "#121218",
  border: "#1C1C24",
  borderHigh: "#2A2A38",
  gold: "#C8A96E",
  goldDim: "#7A6535",
  white: "#F0EDE8",
  muted: "#5A5A6E",
  mutedLow: "#2E2E3A",
  wear: "#C8A96E",
  studio: "#8B7FD4",
  tiktok: "#F0EDE8",
  threads: "#6A9E7F",
  red: "#C84E4E",
  green: "#4EAA7A",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACCOUNTS = [
  { id: "wear", handle: "obskur_wear", platform: "Instagram", color: T.wear, symbol: "W", tagline: "Produit · Lifestyle · Drop" },
  { id: "studio", handle: "obskur.studio", platform: "Instagram", color: T.studio, symbol: "S", tagline: "Créatif · Vision · Art" },
  { id: "tiktok", handle: "obskur_tiktok", platform: "TikTok", color: T.tiktok, symbol: "T", tagline: "Vidéo · Viral · Tendance" },
  { id: "threads", handle: "obskur_threads", platform: "Threads", color: T.threads, symbol: "Th", tagline: "Texte · Pensée · Culture" },
];

const CONTENT_TYPES = {
  wear: ["Drop produit", "Promo Pack IA", "Lookbook", "Behind the scenes", "Teasing collection", "Lifestyle", "Restock"],
  studio: ["Moodboard", "Manifeste", "Processus créatif", "Vision brand", "Collab", "Visual essay", "Inspiration"],
  tiktok: ["Tendance", "POV créatif", "Tutoriel IA", "Storytelling", "Lifestyle sombre", "Unboxing"],
  threads: ["Réflexion brand", "Thread storytelling", "Avis chaud", "Lancement", "Q&A communauté"],
};

const TONES = [
  { id: "street", label: "Street", desc: "Brut, direct, authentique" },
  { id: "luxe", label: "Luxe", desc: "Froid, premium, élitiste" },
  { id: "mysterieux", label: "Mystérieux", desc: "Flou, intriguant, retenu" },
  { id: "agressif", label: "Agressif", desc: "Tranchant, sans filtre" },
  { id: "minimal", label: "Minimal", desc: "Épuré, peu de mots, fort" },
];

const HOOKS_BANK = [
  "Built in tension.",
  "Ce que tu portes dit ce que tu tais.",
  "Pas pour tout le monde. Pour toi.",
  "La rue n'oublie pas.",
  "Dans l'ombre, on construit.",
  "Silence = identité.",
  "Ce n'est pas du streetwear. C'est une posture.",
  "Tout ce qui brille n'est pas pour toi.",
  "On ne fait pas du bruit. On laisse des traces.",
  "Tu portes ce que tu es.",
  "Rien à prouver. Tout à imposer.",
  "Construit dans le noir, visible en plein jour.",
  "Le luxe, c'est quand personne ne demande le prix.",
  "Dakar. Underground. Global.",
  "L'identité se porte, ne s'explique pas.",
];

const HASHTAGS = {
  wear: "#obskurwear #streetweardakar #streetwearafrica #modeafricaine #dakarfashion #africanstreet #streetstyle #luxestreet #modedakar #lookstreet #fashionafrica #westafricastyle #dakarstyle #obskur",
  studio: "#obskurstudio #creativedakar #brandidentity #visualstory #streetwearvisuals #aiartwork #designafrica #moodboard #artdirection #creativeprocess #africancreative #visualidentity",
  tiktok: "#obskur #streetwear #dakar #senegal #africa #fashion #style #modeafrique #tiktokafrica #streetwearafrique #fyp #foryou",
  threads: "#obskur #streetwear #brandbuilding #entrepreneurafrica #dakar #creativeentrepreneur #modeafricaine",
};

const FORMATS = {
  wear: ["Carrousel produit (4-7 slides)", "Reel 15s ambiance", "Photo unique fond noir", "Stories swipe-up", "Reel unboxing"],
  studio: ["Carrousel moodboard", "Reel making-of 30s", "Vidéo texte cinématique", "Photo série 3 images", "Story poll"],
  tiktok: ["Reel vertical 30s", "Voix off + B-roll", "POV trending 15s", "Texte animé", "Green screen"],
  threads: ["Thread 5-7 tweets", "Post court percutant", "Question ouverte", "Opinion tranchée"],
};

const IDEAS_POOL = {
  wear: [
    "Post d'ambiance : vêtement posé sur fond béton sous lumière froide",
    "Teaser Collection #03 : fragments de tissu, aucun détail visible",
    "Behind the scenes : coutures et étiquettes en macro",
    "Post 'who wears OBSKUR' : silhouette urbaine, visage non visible",
    "Countdown 3 jours avant un drop : compte à rebours minimal",
  ],
  studio: [
    "Moodboard 'tension entre lumière et ombre' — 9 visuels en grille",
    "Manifeste texte sur fond noir : 'On ne fait pas de la mode. On fait du silence.'",
    "Process créatif : du croquis au visuel final en 4 étapes",
    "Série 'Influences' : 3 références visuelles qui ont construit OBSKUR",
    "Visual essay : Dakar + street culture + identité globale",
  ],
  tiktok: [
    "POV : tu reçois ton premier OBSKUR — déballage cinématique",
    "Tutoriel : générer un visuel streetwear pro avec IA en 60s",
    "Trending sound + silhouette OBSKUR dans rue de Dakar",
    "Split screen : avant / après IA streetwear prompts",
    "Voix off brand story : 'Pourquoi j'ai créé OBSKUR'",
  ],
  threads: [
    "Thread : 5 raisons pourquoi le streetwear africain va dominer",
    "Opinion : 'Le luxe n'est pas dans le prix, il est dans l'intention'",
    "Q&A : Qu'est-ce qu'OBSKUR pour vous ?",
    "Réflexion : construire une marque en solo vs en équipe",
    "Thread : comment j'utilise l'IA pour créer des visuels à 0 budget",
  ],
};

const SYSTEM_PROMPT = `Tu es le copywriter officiel d'OBSKUR, marque streetwear premium fondée à Dakar, Sénégal.
Tagline de la marque : "Built in tension."
L'univers OBSKUR : sombre, tendu, silencieux, premium, identitaire, africain et global à la fois.
La marque ne crie pas. Elle impose.

Règles absolues :
- Écris TOUJOURS en français
- Pas plus de 6 lignes pour le corps du texte
- Structure : [HOOK] → [CORPS 2-3 lignes] → [CALL TO ACTION discret]
- Le CTA ne doit jamais être agressif (pas de "Achetez maintenant !")
- Les hashtags en fin, séparés par un saut de ligne
- Zéro cliché, zéro mot creux, zéro exclamation excessive
- Le silence est une arme. L'épuré est un luxe.`;

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const SK = "obs_studio_v2";
function load(key, def) {
  try { const v = localStorage.getItem(`${SK}_${key}`); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(`${SK}_${key}`, JSON.stringify(val)); } catch {}
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = {
  Dashboard: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Generate: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Drafts: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Tools: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Settings: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Copy: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Save: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  Trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Dupe: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/></svg>,
  Spark: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Plus: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>,
  Edit: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Close: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "ghost", size = "md", disabled, style: s, full }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, cursor: disabled ? "not-allowed" : "pointer", border: "none",
    fontFamily: "'DM Mono', 'Courier New', monospace", fontWeight: 500,
    transition: "all 0.15s ease", letterSpacing: "0.06em", lineHeight: 1,
    width: full ? "100%" : "auto", whiteSpace: "nowrap",
    opacity: disabled ? 0.4 : 1,
  };
  const sizes = { sm: { padding: "6px 12px", fontSize: 10 }, md: { padding: "9px 16px", fontSize: 11 }, lg: { padding: "13px 24px", fontSize: 12 } };
  const variants = {
    primary: { background: T.gold, color: T.bg },
    ghost: { background: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    danger: { background: "transparent", color: T.red, border: `1px solid ${T.red}33` },
    accent: { background: T.surfaceHigh, color: T.white, border: `1px solid ${T.borderHigh}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

function Tag({ children, color, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "4px 10px", fontSize: 10, fontFamily: "'DM Mono','Courier New',monospace",
      letterSpacing: "0.08em", cursor: onClick ? "pointer" : "default", border: "none",
      background: active ? (color || T.gold) + "22" : "transparent",
      color: active ? (color || T.gold) : T.muted,
      borderRadius: 2, border: `1px solid ${active ? (color || T.gold) + "55" : T.border}`,
      transition: "all 0.15s",
    }}>{children}</button>
  );
}

function Card({ children, style: s, accent }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderLeft: accent ? `2px solid ${accent}` : `1px solid ${T.border}`,
      padding: 16, ...s,
    }}>{children}</div>
  );
}

function Label({ children, style: s }) {
  return <div style={{ fontSize: 9, letterSpacing: "0.18em", color: T.muted, textTransform: "uppercase", marginBottom: 8, ...s }}>{children}</div>;
}

function Divider({ style: s }) {
  return <div style={{ height: 1, background: T.border, ...s }} />;
}

function StatusBadge({ status, onClick }) {
  const cfg = {
    draft: { color: T.muted, label: "BROUILLON" },
    ready: { color: T.gold, label: "PRÊT" },
    published: { color: T.green, label: "PUBLIÉ" },
  };
  const c = cfg[status] || cfg.draft;
  return (
    <button onClick={onClick} style={{
      fontSize: 9, letterSpacing: "0.14em", cursor: onClick ? "pointer" : "default",
      color: c.color, background: c.color + "18", border: `1px solid ${c.color}44`,
      padding: "3px 8px", fontFamily: "'DM Mono','Courier New',monospace", border: "none",
      borderRadius: 2,
    }}>{c.label}</button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ObskurContentStudio() {
  const [page, setPage] = useState("dashboard");
  const [drafts, setDrafts] = useState(() => load("drafts", []));
  const [plan, setPlan] = useState(() => load("plan", []));
  const [settings, setSettings] = useState(() => load("settings", { name: "OBSKUR", language: "fr" }));
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => { save("drafts", drafts); }, [drafts]);
  useEffect(() => { save("plan", plan); }, [plan]);
  useEffect(() => { save("settings", settings); }, [settings]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  }, []);

  const copyText = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
      showToast("Copié dans le presse-papier");
    });
  }, [showToast]);

  const addDraft = useCallback((draft) => {
    setDrafts(prev => [{ id: Date.now(), ...draft, status: "draft", createdAt: new Date().toISOString() }, ...prev]);
    showToast("Sauvegardé en draft ✓");
  }, [showToast]);

  const NAV = [
    { id: "dashboard", label: "Dashboard", Icon: Icon.Dashboard },
    { id: "generate", label: "Générer", Icon: Icon.Generate },
    { id: "drafts", label: `Drafts${drafts.length ? ` (${drafts.length})` : ""}`, Icon: Icon.Drafts },
    { id: "planning", label: "Planning", Icon: Icon.Calendar },
    { id: "tools", label: "Outils", Icon: Icon.Tools },
    { id: "settings", label: "Paramètres", Icon: Icon.Settings },
  ];

  const pages = { dashboard: Dashboard, generate: Generate, drafts: DraftsPage, planning: Planning, tools: Tools, settings: Settings };
  const PageComponent = pages[page] || Dashboard;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: "'DM Mono','Courier New',monospace", display: "flex", flexDirection: "column" }}>

      {/* CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${T.bg}; } ::-webkit-scrollbar-thumb { background: ${T.border}; }
        textarea, input, select { outline: none; -webkit-appearance: none; }
        textarea::placeholder, input::placeholder { color: ${T.mutedLow}; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100%{opacity:.25} 50%{opacity:.55} }
        @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .page-enter { animation: fadeIn 0.22s ease both; }
        .shimmer { animation: shimmer 1.6s ease-in-out infinite; }
        select option { background: ${T.surface}; color: ${T.white}; }
      `}</style>

      {/* Top bar */}
      <header style={{
        height: 52, background: T.surface, borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileNav(!mobileNav)} style={{
            background: "none", border: "none", color: T.muted, cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 4, padding: 4,
          }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 1.5, background: T.muted }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, background: T.gold + "22", border: `1px solid ${T.gold}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: T.gold, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1,
            }}>O</div>
            <span style={{ fontSize: 13, letterSpacing: "0.18em", color: T.white, fontFamily: "'Bebas Neue', sans-serif" }}>
              OBSKUR <span style={{ color: T.gold }}>STUDIO</span>
            </span>
          </div>
        </div>
        <div style={{ fontSize: 9, color: T.mutedLow, letterSpacing: "0.2em" }}>
          {NAV.find(n => n.id === page)?.label?.toUpperCase()}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Sidebar */}
        <nav style={{
          width: mobileNav ? 220 : 0, minWidth: mobileNav ? 220 : 0,
          background: T.surface, borderRight: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column",
          transition: "all 0.25s ease", overflow: "hidden",
          position: mobileNav ? "fixed" : "relative",
          top: 52, left: 0, bottom: 0, zIndex: 90,
        }}>
          <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map(({ id, label, Icon: I }) => (
              <button key={id} onClick={() => { setPage(id); setMobileNav(false); }} style={{
                background: page === id ? T.gold + "14" : "none", border: "none",
                borderLeft: `2px solid ${page === id ? T.gold : "transparent"}`,
                color: page === id ? T.gold : T.muted, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 20px", fontSize: 11, letterSpacing: "0.1em",
                fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
              }}>
                <I /> {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.mutedLow, letterSpacing: "0.15em", lineHeight: 1.8 }}>
              Built in tension.<br />Dakar · Global
            </div>
          </div>
        </nav>

        {/* Overlay mobile */}
        {mobileNav && <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, zIndex: 89, background: "rgba(0,0,0,0.6)" }} />}

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <div className="page-enter" key={page}>
            <PageComponent
              drafts={drafts} setDrafts={setDrafts}
              plan={plan} setPlan={setPlan}
              settings={settings} setSettings={setSettings}
              copyText={copyText} copied={copied}
              addDraft={addDraft} showToast={showToast}
              setPage={setPage}
            />
          </div>
        </main>
      </div>

      {/* Bottom mobile nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: T.surface, borderTop: `1px solid ${T.border}`,
        display: "flex", padding: "8px 0 12px",
      }}>
        {NAV.slice(0, 5).map(({ id, label, Icon: I }) => (
          <button key={id} onClick={() => { setPage(id); setMobileNav(false); }} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: page === id ? T.gold : T.mutedLow,
            fontSize: 8, letterSpacing: "0.1em", fontFamily: "inherit",
            transition: "color 0.15s",
          }}>
            <I />{label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 64, right: 16, zIndex: 200,
          background: toast.type === "error" ? T.red + "22" : T.green + "22",
          border: `1px solid ${toast.type === "error" ? T.red : T.green}44`,
          color: toast.type === "error" ? T.red : T.green,
          padding: "10px 16px", fontSize: 11, letterSpacing: "0.1em",
          animation: "toastIn 0.2s ease",
        }}>{toast.msg}</div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ drafts, plan, setPage }) {
  const stats = {
    total: drafts.length,
    ready: drafts.filter(d => d.status === "ready").length,
    published: drafts.filter(d => d.status === "published").length,
    scheduled: plan.length,
  };
  const recent = drafts.slice(0, 3);
  const upcoming = [...plan].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <div style={{ padding: "24px 16px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.2em", marginBottom: 6 }}>
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: "0.1em", lineHeight: 1, color: T.white }}>
          CONTENT<br /><span style={{ color: T.gold }}>STUDIO</span>
        </h1>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "DRAFTS", val: stats.total, color: T.muted },
          { label: "PRÊTS", val: stats.ready, color: T.gold },
          { label: "PUBLIÉS", val: stats.published, color: T.green },
          { label: "PLANIFIÉS", val: stats.scheduled, color: T.studio },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.16em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 24 }}>
        <Label>ACCÈS RAPIDE</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Générer un post", page: "generate", color: T.gold, icon: "✦" },
            { label: "Voir mes drafts", page: "drafts", color: T.studio, icon: "◉" },
            { label: "Planifier", page: "planning", color: T.green, icon: "◈" },
            { label: "Boîte à outils", page: "tools", color: T.tiktok, icon: "◆" },
          ].map(({ label, page, color, icon }) => (
            <button key={page} onClick={() => setPage(page)} style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderTop: `2px solid ${color}44`,
              color: T.muted, cursor: "pointer",
              padding: "14px 14px", textAlign: "left",
              fontFamily: "inherit", fontSize: 11, letterSpacing: "0.08em",
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 20, marginBottom: 6, color }}>{icon}</div>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent drafts */}
      {recent.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Label>DERNIERS DRAFTS</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map(d => {
              const acc = ACCOUNTS.find(a => a.id === d.account);
              return (
                <div key={d.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${acc?.color || T.border}`, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: acc?.color, letterSpacing: "0.1em" }}>@{acc?.handle}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {d.caption?.slice(0, 120)}…
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <Label>PLANNING À VENIR</Label>
          {upcoming.map(e => {
            const acc = ACCOUNTS.find(a => a.id === e.account);
            return (
              <div key={e.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${acc?.color || T.border}`, padding: "10px 14px", marginBottom: 6, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 9, color: acc?.color, minWidth: 70 }}>
                  {new Date(e.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </div>
                <div style={{ fontSize: 11, color: T.muted, flex: 1 }}>{e.note}</div>
              </div>
            );
          })}
        </div>
      )}

      {drafts.length === 0 && plan.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.mutedLow }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: "0.1em", marginBottom: 8 }}>◈</div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em" }}>Commence par générer ton premier post</div>
        </div>
      )}
    </div>
  );
}

// ─── GENERATE ─────────────────────────────────────────────────────────────────
function Generate({ addDraft, copyText, copied, showToast }) {
  const [account, setAccount] = useState("wear");
  const [type, setType] = useState("Drop produit");
  const [tone, setTone] = useState("street");
  const [hook, setHook] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editOutput, setEditOutput] = useState(false);
  const [editVal, setEditVal] = useState("");

  const acc = ACCOUNTS.find(a => a.id === account);

  useEffect(() => {
    const types = CONTENT_TYPES[account];
    if (!types.includes(type)) setType(types[0]);
  }, [account]);

  async function generate() {
    setLoading(true);
    setOutput("");
    setEditOutput(false);

    const toneLabel = TONES.find(t => t.id === tone)?.label || tone;
    const prompt = `${SYSTEM_PROMPT}

Compte : @${acc.handle} (${acc.tagline})
Type de contenu : ${type}
Ton souhaité : ${toneLabel} — ${TONES.find(t => t.id === tone)?.desc}
${hook ? `Hook d'accroche (utilise ou inspire-toi-en) : "${hook}"` : "Crée un hook fort et original."}
${context ? `Contexte additionnel : ${context}` : ""}

Génère la caption complète avec :
1. Hook d'accroche (1 ligne percutante)
2. Corps du texte (2-3 lignes max)
3. Call to action discret
4. Saut de ligne puis hashtags optimisés pour ${acc.platform}

Produis UNIQUEMENT la caption, sans explication.`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setOutput(text);
    } catch {
      setOutput("Erreur de connexion. Vérifie ta connexion et réessaie.");
      showToast("Erreur de génération", "error");
    }
    setLoading(false);
  }

  async function generateIdeas() {
    setShowSuggestions(true);
    setSuggestions([]);
    const pool = IDEAS_POOL[account] || [];
    setSuggestions(pool);
  }

  function saveAsDraft() {
    if (!output) return;
    addDraft({ account, type, tone, caption: editOutput ? editVal : output });
  }

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <Label style={{ marginBottom: 2 }}>GÉNÉRER UN POST</Label>
        <p style={{ margin: 0, fontSize: 10, color: T.mutedLow, lineHeight: 1.6 }}>Configure ton post et laisse l'IA générer une caption dans l'univers OBSKUR.</p>
      </div>

      {/* Account selector */}
      <div style={{ marginBottom: 16 }}>
        <Label>COMPTE</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ACCOUNTS.map(a => (
            <button key={a.id} onClick={() => setAccount(a.id)} style={{
              background: account === a.id ? a.color + "12" : T.surface,
              border: `1px solid ${account === a.id ? a.color + "55" : T.border}`,
              color: account === a.id ? a.color : T.muted,
              padding: "10px 14px", cursor: "pointer", textAlign: "left",
              fontFamily: "inherit", fontSize: 11, letterSpacing: "0.08em",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all 0.15s",
            }}>
              <span>@{a.handle}</span>
              <span style={{ fontSize: 9, opacity: 0.6 }}>{a.platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content type */}
      <div style={{ marginBottom: 16 }}>
        <Label>TYPE DE CONTENU</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CONTENT_TYPES[account].map(t => (
            <Tag key={t} active={type === t} color={acc.color} onClick={() => setType(t)}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div style={{ marginBottom: 16 }}>
        <Label>TON</Label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TONES.map(t => (
            <Tag key={t.id} active={tone === t.id} color={acc.color} onClick={() => setTone(t.id)}>{t.label}</Tag>
          ))}
        </div>
      </div>

      {/* Hook */}
      <div style={{ marginBottom: 16 }}>
        <Label>HOOK D'ACCROCHE <span style={{ color: T.mutedLow }}>· optionnel</span></Label>
        <select value={hook} onChange={e => setHook(e.target.value)} style={{
          width: "100%", background: T.surface, border: `1px solid ${T.border}`,
          color: hook ? T.white : T.muted, padding: "10px 12px",
          fontSize: 11, fontFamily: "inherit", cursor: "pointer",
        }}>
          <option value="">Laisse l'IA créer un hook original</option>
          {HOOKS_BANK.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {/* Context */}
      <div style={{ marginBottom: 20 }}>
        <Label>CONTEXTE <span style={{ color: T.mutedLow }}>· optionnel</span></Label>
        <textarea value={context} onChange={e => setContext(e.target.value)}
          placeholder="Ex: Lancement Collection #03, fond béton, modèle masculin, ambiance nuit urbaine..."
          rows={3} style={{
            width: "100%", background: T.surface, border: `1px solid ${T.border}`,
            color: T.white, padding: "10px 12px", fontSize: 11,
            fontFamily: "inherit", resize: "none", lineHeight: 1.6,
          }} />
      </div>

      {/* Suggestions */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={generateIdeas} style={{
          background: "none", border: `1px solid ${T.border}`, color: T.muted,
          padding: "8px 14px", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
          letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6, width: "100%",
        }}>
          <Icon.Spark /> IDÉES DE POSTS POUR @{acc.handle.toUpperCase()}
        </button>
        {showSuggestions && suggestions.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => { setContext(s); setShowSuggestions(false); }} style={{
                background: T.surface, border: `1px solid ${T.border}`, padding: "10px 12px",
                fontSize: 11, color: T.muted, cursor: "pointer", lineHeight: 1.5,
                borderLeft: `2px solid ${acc.color}44`,
                transition: "all 0.15s",
              }}>{s}</div>
            ))}
          </div>
        )}
      </div>

      {/* Format recommendations */}
      <div style={{ marginBottom: 20 }}>
        <Label>FORMATS RECOMMANDÉS</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(FORMATS[account] || []).map(f => (
            <div key={f} style={{ fontSize: 9, color: T.mutedLow, border: `1px solid ${T.border}`, padding: "3px 8px", letterSpacing: "0.08em" }}>{f}</div>
          ))}
        </div>
      </div>

      <Divider style={{ marginBottom: 20 }} />

      {/* Generate button */}
      <button onClick={generate} disabled={loading} style={{
        width: "100%", background: loading ? T.surface : T.gold,
        border: `1px solid ${loading ? T.border : T.gold}`,
        color: loading ? T.muted : T.bg, padding: "14px",
        cursor: loading ? "not-allowed" : "pointer", fontSize: 12,
        fontWeight: 700, letterSpacing: "0.2em", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s", marginBottom: 20,
      }}>
        {loading ? <><span style={{ animation: "pulse 1s infinite" }}>◈</span> GÉNÉRATION EN COURS…</> : <><Icon.Generate /> GÉNÉRER LA CAPTION</>}
      </button>

      {/* Output */}
      {(loading || output) && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${acc.color}` }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: T.muted, letterSpacing: "0.15em" }}>OUTPUT · @{acc.handle}</span>
            {output && !editOutput && (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn size="sm" onClick={() => { setEditOutput(true); setEditVal(output); }} variant="ghost"><Icon.Edit /> Éditer</Btn>
                <Btn size="sm" onClick={() => copyText(output, "output")} variant="ghost"><Icon.Copy />{copied === "output" ? "Copié ✓" : "Copier"}</Btn>
                <Btn size="sm" onClick={saveAsDraft} variant="accent"><Icon.Save /> Draft</Btn>
              </div>
            )}
            {editOutput && (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn size="sm" onClick={() => { setOutput(editVal); setEditOutput(false); }} variant="primary"><Icon.Check /> OK</Btn>
                <Btn size="sm" onClick={() => setEditOutput(false)} variant="ghost"><Icon.Close /></Btn>
              </div>
            )}
          </div>
          <div style={{ padding: 14 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[100, 80, 90, 65, 75, 50].map((w, i) => (
                  <div key={i} className="shimmer" style={{ height: 10, background: T.border, width: `${w}%`, borderRadius: 2 }} />
                ))}
              </div>
            ) : editOutput ? (
              <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={10} style={{
                width: "100%", background: "transparent", border: "none",
                color: T.white, fontSize: 12, fontFamily: "inherit",
                lineHeight: 1.7, resize: "none",
              }} />
            ) : (
              <pre style={{ margin: 0, fontSize: 12, color: "#C8C4BC", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {output}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DRAFTS ───────────────────────────────────────────────────────────────────
function DraftsPage({ drafts, setDrafts, copyText, copied, showToast }) {
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const filtered = drafts.filter(d =>
    (filterAccount === "all" || d.account === filterAccount) &&
    (filterStatus === "all" || d.status === filterStatus)
  );

  function updateStatus(id) {
    const cycle = { draft: "ready", ready: "published", published: "draft" };
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: cycle[d.status] } : d));
  }

  function deleteDraft(id) {
    setDrafts(prev => prev.filter(d => d.id !== id));
    showToast("Draft supprimé");
  }

  function duplicateDraft(draft) {
    const newD = { ...draft, id: Date.now(), status: "draft", createdAt: new Date().toISOString() };
    setDrafts(prev => [newD, ...prev]);
    showToast("Draft dupliqué");
  }

  function saveEdit(id) {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, caption: editVal } : d));
    setEditId(null);
    showToast("Modifié ✓");
  }

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <Label>DRAFTS · {filtered.length}/{drafts.length}</Label>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag active={filterAccount === "all"} onClick={() => setFilterAccount("all")}>Tous</Tag>
          {ACCOUNTS.map(a => <Tag key={a.id} active={filterAccount === a.id} color={a.color} onClick={() => setFilterAccount(a.id)}>@{a.handle}</Tag>)}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "draft", "ready", "published"].map(s => (
            <Tag key={s} active={filterStatus === s} onClick={() => setFilterStatus(s)}>
              {s === "all" ? "Tout statut" : s === "draft" ? "Brouillon" : s === "ready" ? "Prêt" : "Publié"}
            </Tag>
          ))}
        </div>
      </div>

      <Divider style={{ marginBottom: 16 }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: T.mutedLow }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>◉</div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em" }}>Aucun draft trouvé</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(d => {
            const acc = ACCOUNTS.find(a => a.id === d.account);
            const isEditing = editId === d.id;
            return (
              <div key={d.id} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderLeft: `2px solid ${acc?.color || T.border}`,
              }}>
                {/* Header */}
                <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: acc?.color, letterSpacing: "0.1em" }}>@{acc?.handle}</span>
                    <span style={{ fontSize: 9, color: T.mutedLow }}>·</span>
                    <span style={{ fontSize: 9, color: T.mutedLow }}>{d.type}</span>
                  </div>
                  <StatusBadge status={d.status} onClick={() => updateStatus(d.id)} />
                </div>

                {/* Body */}
                <div style={{ padding: "12px 14px" }}>
                  {isEditing ? (
                    <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={6} style={{
                      width: "100%", background: T.surfaceHigh, border: `1px solid ${T.borderHigh}`,
                      color: T.white, padding: "10px", fontSize: 12, fontFamily: "inherit",
                      resize: "none", lineHeight: 1.7,
                    }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {d.caption?.length > 180 ? d.caption.slice(0, 180) + "…" : d.caption}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {isEditing ? (
                    <>
                      <Btn size="sm" variant="primary" onClick={() => saveEdit(d.id)}><Icon.Check /> Sauver</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => setEditId(null)}><Icon.Close /> Annuler</Btn>
                    </>
                  ) : (
                    <>
                      <Btn size="sm" variant="ghost" onClick={() => { setEditId(d.id); setEditVal(d.caption); }}><Icon.Edit /> Éditer</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => copyText(d.caption, `d-${d.id}`)}><Icon.Copy />{copied === `d-${d.id}` ? "Copié ✓" : "Copier"}</Btn>
                      <Btn size="sm" variant="ghost" onClick={() => duplicateDraft(d)}><Icon.Dupe /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => deleteDraft(d.id)}><Icon.Trash /></Btn>
                    </>
                  )}
                  <div style={{ marginLeft: "auto", fontSize: 9, color: T.mutedLow, display: "flex", alignItems: "center" }}>
                    {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PLANNING ─────────────────────────────────────────────────────────────────
function Planning({ plan, setPlan, showToast }) {
  const [date, setDate] = useState("");
  const [account, setAccount] = useState("wear");
  const [note, setNote] = useState("");
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState("");

  function add() {
    if (!date || !note.trim()) { showToast("Date et note requis", "error"); return; }
    setPlan(prev => [...prev, { id: Date.now(), date, account, note, type }]);
    setDate(""); setNote(""); setType("");
    showToast("Ajouté au planning ✓");
  }

  function remove(id) { setPlan(prev => prev.filter(e => e.id !== id)); showToast("Supprimé"); }

  function saveEdit(id) {
    setPlan(prev => prev.map(e => e.id === id ? { ...e, note: editNote } : e));
    setEditId(null);
  }

  const sorted = [...plan].sort((a, b) => a.date.localeCompare(b.date));
  const grouped = sorted.reduce((acc, e) => {
    const month = e.date.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(e);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <Label>CALENDRIER ÉDITORIAL</Label>
      </div>

      {/* Add form */}
      <Card style={{ marginBottom: 24 }}>
        <Label>AJOUTER UNE ENTRÉE</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
            background: T.surfaceHigh, border: `1px solid ${T.border}`,
            color: T.white, padding: "10px 12px", fontSize: 11, fontFamily: "inherit", width: "100%",
          }} />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ACCOUNTS.map(a => (
              <Tag key={a.id} active={account === a.id} color={a.color} onClick={() => setAccount(a.id)}>@{a.handle}</Tag>
            ))}
          </div>

          <select value={type} onChange={e => setType(e.target.value)} style={{
            background: T.surfaceHigh, border: `1px solid ${T.border}`,
            color: type ? T.white : T.muted, padding: "10px 12px", fontSize: 11, fontFamily: "inherit",
          }}>
            <option value="">Type de contenu (optionnel)</option>
            {CONTENT_TYPES[account].map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Description du post, idée, note..."
            rows={2} style={{
              background: T.surfaceHigh, border: `1px solid ${T.border}`,
              color: T.white, padding: "10px 12px", fontSize: 11,
              fontFamily: "inherit", resize: "none", lineHeight: 1.6,
            }} />

          <Btn onClick={add} variant="primary" full size="md"><Icon.Plus /> Ajouter</Btn>
        </div>
      </Card>

      {/* Calendar */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: T.mutedLow }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>◆</div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em" }}>Aucune entrée planifiée</div>
        </div>
      ) : (
        Object.entries(grouped).map(([month, entries]) => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.2em", marginBottom: 10, textTransform: "uppercase" }}>
              {new Date(month + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {entries.map(e => {
                const acc = ACCOUNTS.find(a => a.id === e.account);
                const isEditing = editId === e.id;
                const dayDate = new Date(e.date + "T00:00:00");
                const isToday = new Date().toDateString() === dayDate.toDateString();
                return (
                  <div key={e.id} style={{
                    background: T.surface, border: `1px solid ${isToday ? acc?.color + "44" : T.border}`,
                    borderLeft: `3px solid ${acc?.color || T.border}`,
                    padding: "10px 14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: acc?.color, lineHeight: 1 }}>
                          {dayDate.getDate()}
                        </span>
                        <div>
                          <div style={{ fontSize: 9, color: acc?.color, letterSpacing: "0.1em" }}>@{acc?.handle}</div>
                          {e.type && <div style={{ fontSize: 9, color: T.mutedLow }}>{e.type}</div>}
                        </div>
                        {isToday && <span style={{ fontSize: 8, color: T.gold, letterSpacing: "0.1em", border: `1px solid ${T.gold}44`, padding: "2px 6px" }}>AUJOURD'HUI</span>}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {isEditing ? (
                          <>
                            <Btn size="sm" variant="primary" onClick={() => saveEdit(e.id)}><Icon.Check /></Btn>
                            <Btn size="sm" variant="ghost" onClick={() => setEditId(null)}><Icon.Close /></Btn>
                          </>
                        ) : (
                          <>
                            <Btn size="sm" variant="ghost" onClick={() => { setEditId(e.id); setEditNote(e.note); }}><Icon.Edit /></Btn>
                            <Btn size="sm" variant="danger" onClick={() => remove(e.id)}><Icon.Trash /></Btn>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <textarea value={editNote} onChange={ev => setEditNote(ev.target.value)} rows={2} style={{
                        width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`,
                        color: T.white, padding: "8px", fontSize: 11, fontFamily: "inherit", resize: "none",
                      }} />
                    ) : (
                      <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{e.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── TOOLS ────────────────────────────────────────────────────────────────────
function Tools({ copyText, copied }) {
  const [toolTab, setToolTab] = useState("hooks");

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <Label>BOÎTE À OUTILS</Label>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `1px solid ${T.border}` }}>
        {[
          { id: "hooks", label: "HOOKS" },
          { id: "hashtags", label: "HASHTAGS" },
          { id: "guide", label: "GUIDE ÉDITORIAL" },
        ].map(t => (
          <button key={t.id} onClick={() => setToolTab(t.id)} style={{
            background: "none", border: "none", borderBottom: `2px solid ${toolTab === t.id ? T.gold : "transparent"}`,
            color: toolTab === t.id ? T.gold : T.muted, cursor: "pointer",
            padding: "8px 14px", fontSize: 10, letterSpacing: "0.15em",
            fontFamily: "inherit", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {toolTab === "hooks" && (
        <div>
          <p style={{ fontSize: 10, color: T.mutedLow, marginBottom: 16, lineHeight: 1.6 }}>Phrases d'accroche dans l'univers OBSKUR. Copie-les directement ou utilise-les comme base.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {HOOKS_BANK.map((h, i) => (
              <div key={i} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: "#C0BAB0", fontStyle: "italic", flex: 1 }}>"{h}"</span>
                <button onClick={() => copyText(h, `hook-${i}`)} style={{
                  background: "none", border: "none", color: copied === `hook-${i}` ? T.gold : T.muted,
                  cursor: "pointer", fontSize: 10, fontFamily: "inherit", padding: "4px 8px",
                  display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                }}>
                  {copied === `hook-${i}` ? <><Icon.Check /> Copié</> : <><Icon.Copy /> Copier</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {toolTab === "hashtags" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ACCOUNTS.map(acc => (
            <div key={acc.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${acc.color}44` }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: acc.color, letterSpacing: "0.1em" }}>@{acc.handle}</div>
                  <div style={{ fontSize: 9, color: T.mutedLow }}>{acc.platform}</div>
                </div>
                <button onClick={() => copyText(HASHTAGS[acc.id], `ht-${acc.id}`)} style={{
                  background: "none", border: `1px solid ${T.border}`, color: copied === `ht-${acc.id}` ? T.gold : T.muted,
                  cursor: "pointer", padding: "6px 12px", fontSize: 10, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {copied === `ht-${acc.id}` ? <><Icon.Check /> Copié</> : <><Icon.Copy /> Copier tout</>}
                </button>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <p style={{ margin: 0, fontSize: 10, color: T.muted, lineHeight: 1.8 }}>{HASHTAGS[acc.id]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {toolTab === "guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* OBSKUR WEAR */}
          <Card accent={T.wear}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.wear, letterSpacing: "0.15em" }}>@OBSKUR_WEAR</div>
              <div style={{ fontSize: 9, color: T.mutedLow, letterSpacing: "0.1em" }}>Produit · Lifestyle · Drop · Branding</div>
            </div>
            <Divider style={{ marginBottom: 12 }} />
            {[
              ["Rôle", "Le vitrine de la marque. Chaque post doit faire désirer le produit."],
              ["Ton", "Premium, froid, désirable. Jamais vulgaire, jamais creux."],
              ["Contenu", "Produits en situation, lookbooks, drops, prix discrets, teasers."],
              ["Fréquence", "4 à 5 posts/semaine. Régularité = présence."],
              ["À éviter", "Trop de texte sur l'image, emojis flashy, CTA agressifs."],
              ["Formats", "Photo produit fond noir, Reels courts, Carrousels lookbook."],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 9, color: T.wear, minWidth: 72, letterSpacing: "0.1em" }}>{k}</span>
                <span style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* OBSKUR STUDIO */}
          <Card accent={T.studio}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.studio, letterSpacing: "0.15em" }}>@OBSKUR.STUDIO</div>
              <div style={{ fontSize: 9, color: T.mutedLow, letterSpacing: "0.1em" }}>Créatif · Vision · Artistique · Culture</div>
            </div>
            <Divider style={{ marginBottom: 12 }} />
            {[
              ["Rôle", "Le laboratoire. Montre la vision, pas le produit."],
              ["Ton", "Poétique, artistique, profond. Moins commercial."],
              ["Contenu", "Moodboards, making-of, manifestes, références visuelles."],
              ["Fréquence", "2 à 3 posts/semaine. Qualité > quantité."],
              ["À éviter", "Parler de prix, CTA vente, contenu répétitif."],
              ["Formats", "Carrousels moodboard, Reels cinématiques, texte sur fond."],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 9, color: T.studio, minWidth: 72, letterSpacing: "0.1em" }}>{k}</span>
                <span style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Rule of thumb */}
          <Card style={{ background: T.gold + "08", border: `1px solid ${T.gold}22` }}>
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: "0.15em", marginBottom: 10 }}>RÈGLE D'OR</div>
            <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              <strong style={{ color: T.wear }}>obskur_wear</strong> vend sans vendre.<br />
              <strong style={{ color: T.studio }}>obskur.studio</strong> inspire sans expliquer.<br /><br />
              Les deux ensemble construisent une marque que les gens <em style={{ color: T.white }}>ressentent</em> avant de l'acheter.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings({ settings, setSettings, drafts, plan, showToast }) {
  const [localName, setLocalName] = useState(settings.name);

  function saveSettings() {
    setSettings(prev => ({ ...prev, name: localName }));
    showToast("Paramètres sauvegardés ✓");
  }

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <Label>PARAMÈTRES</Label>

      <Card style={{ marginBottom: 16 }}>
        <Label>IDENTITÉ</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 9, color: T.muted, marginBottom: 6 }}>NOM DE LA MARQUE</div>
            <input value={localName} onChange={e => setLocalName(e.target.value)} style={{
              width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`,
              color: T.white, padding: "10px 12px", fontSize: 12, fontFamily: "inherit",
            }} />
          </div>
          <Btn variant="primary" onClick={saveSettings}><Icon.Save /> Sauvegarder</Btn>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Label>STATISTIQUES</Label>
        {[
          ["Drafts totaux", drafts.length],
          ["Drafts prêts", drafts.filter(d => d.status === "ready").length],
          ["Posts publiés", drafts.filter(d => d.status === "published").length],
          ["Entrées planning", plan.length],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.muted }}>{k}</span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: T.gold, lineHeight: 1 }}>{v}</span>
          </div>
        ))}
      </Card>

      <Card style={{ background: T.red + "08", border: `1px solid ${T.red}22` }}>
        <Label style={{ color: T.red }}>ZONE DANGEREUSE</Label>
        <p style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.6 }}>
          Suppression irréversible de toutes les données.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="danger" size="sm" onClick={() => {
            if (confirm("Supprimer tous les drafts ?")) {
              setDrafts([]);
              showToast("Drafts supprimés");
            }
          }}><Icon.Trash /> Vider les drafts</Btn>
          <Btn variant="danger" size="sm" onClick={() => {
            if (confirm("Supprimer tout le planning ?")) {
              setPlan([]);
              showToast("Planning vidé");
            }
          }}><Icon.Trash /> Vider le planning</Btn>
        </div>
      </Card>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: T.border, letterSpacing: "0.2em" }}>OBSKUR CONTENT STUDIO</div>
        <div style={{ fontSize: 9, color: T.mutedLow, letterSpacing: "0.15em", marginTop: 4 }}>Built in tension · Dakar, Sénégal</div>
      </div>
    </div>
  );
}
