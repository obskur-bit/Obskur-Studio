import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#050507",
  surface: "#0A0A0F",
  surfaceHigh: "#101018",
  surfaceMid: "#0D0D14",
  border: "#18181F",
  borderHigh: "#252530",
  gold: "#C8A96E",
  goldBright: "#E2C07A",
  goldDim: "#6A5530",
  white: "#F2EEE8",
  muted: "#52526A",
  mutedMid: "#3A3A50",
  mutedLow: "#22222E",
  wear: "#C8A96E",
  studio: "#9B8FE8",
  tiktok: "#E8E4DC",
  threads: "#5A9E78",
  red: "#C84E4E",
  green: "#4EAA7A",
  orange: "#C87840",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACCOUNTS = [
  { id: "wear", handle: "obskur_wear", platform: "Instagram", color: T.wear, tagline: "Produit · Lifestyle · Drop" },
  { id: "studio", handle: "obskur.studio", platform: "Instagram", color: T.studio, tagline: "Créatif · Vision · Art" },
  { id: "tiktok", handle: "obskur_tiktok", platform: "TikTok", color: T.tiktok, tagline: "Vidéo · Viral · Tendance" },
  { id: "threads", handle: "obskur_threads", platform: "Threads", color: T.threads, tagline: "Texte · Pensée · Culture" },
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

const GOALS = [
  { id: "vendre", label: "Vendre", icon: "◈" },
  { id: "engager", label: "Engager", icon: "◉" },
  { id: "teaser", label: "Teaser", icon: "◆" },
  { id: "inspirer", label: "Inspirer", icon: "◐" },
  { id: "informer", label: "Informer", icon: "▣" },
];

const FORMATS = {
  wear: ["Photo unique", "Carrousel 4-7", "Reel 15s", "Reel 30s", "Story"],
  studio: ["Carrousel moodboard", "Reel making-of", "Vidéo texte", "Photo série", "Story poll"],
  tiktok: ["Reel vertical 30s", "POV 15s", "Voix off + B-roll", "Texte animé"],
  threads: ["Thread 5-7 posts", "Post court", "Question ouverte", "Opinion"],
};

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

const DAILY_INSPO = [
  { text: "Le silence est une stratégie. Poste quand tu as quelque chose à dire.", author: "OBSKUR" },
  { text: "Une collection ne se vend pas. Elle se désire.", author: "OBSKUR" },
  { text: "Dakar construit ce que le monde portera demain.", author: "OBSKUR" },
  { text: "L'authenticité est le seul luxe que l'on ne peut pas copier.", author: "OBSKUR" },
  { text: "Chaque post est une pierre dans l'édifice de ta marque.", author: "OBSKUR" },
  { text: "La tension crée le désir. Le désir crée l'achat.", author: "OBSKUR" },
];

const IDEAS_POOL = {
  wear: [
    "Post ambiance : vêtement sur fond béton sous lumière froide",
    "Teaser Col. #03 : fragments de tissu, aucun détail visible",
    "Behind the scenes : coutures et étiquettes en macro",
    "Silhouette urbaine — visage non visible",
    "Countdown 3 jours avant le drop",
    "Flat lay minimaliste : pièce seule sur fond noir",
    "Collab idea : deux silhouettes, une seule identité",
  ],
  studio: [
    "Moodboard 'tension entre lumière et ombre' — 9 visuels",
    "Manifeste texte sur fond noir",
    "Process créatif : du croquis au visuel final",
    "Série 'Influences' : 3 références visuelles",
    "Visual essay : Dakar + street culture + identité globale",
    "Coulisses d'une session shooting",
  ],
  tiktok: [
    "POV : tu reçois ton premier OBSKUR",
    "Tutoriel : visuel streetwear IA en 60s",
    "Trending sound + silhouette OBSKUR dans rue de Dakar",
    "Split screen : avant / après IA prompts",
    "Voix off brand story",
  ],
  threads: [
    "5 raisons pourquoi le streetwear africain va dominer",
    "Opinion : 'Le luxe n'est pas dans le prix'",
    "Q&A : Qu'est-ce qu'OBSKUR pour vous ?",
    "Réflexion : construire une marque en solo",
    "Thread : comment j'utilise l'IA à 0 budget",
  ],
};

const SYSTEM_PROMPT = `Tu es le copywriter officiel d'OBSKUR, marque streetwear premium fondée à Dakar, Sénégal.
Tagline : "Built in tension." — L'univers OBSKUR : sombre, tendu, silencieux, premium, identitaire, africain et global.
La marque ne crie pas. Elle impose.

Règles :
- TOUJOURS en français
- Max 6 lignes pour le corps
- Structure : [HOOK fort] → [Corps 2-3 lignes] → [CTA discret]
- Jamais de CTA agressif
- Hashtags en fin, saut de ligne avant
- Zéro cliché, zéro mot creux`;

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const SK = "obs_v3";
function load(k, d) { try { const v = localStorage.getItem(`${SK}_${k}`); return v ? JSON.parse(v) : d; } catch { return d; } }
function save(k, v) { try { localStorage.setItem(`${SK}_${k}`, JSON.stringify(v)); } catch {} }

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = {
  Dashboard: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Generate: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Drafts: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
  Calendar: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Tools: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Settings: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Copy: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Save: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  Trash: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>,
  Close: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Spark: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Refresh: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Dupe: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/></svg>,
  Fire: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Zap: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  Eye: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

// ─── MINI COMPONENTS ──────────────────────────────────────────────────────────
function Tag({ children, color, active, onClick, style: s }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", fontSize: 10, fontFamily: "inherit",
      letterSpacing: "0.08em", cursor: onClick ? "pointer" : "default",
      background: active ? (color || T.gold) + "1A" : "transparent",
      color: active ? (color || T.gold) : T.muted,
      border: `1px solid ${active ? (color || T.gold) + "55" : T.border}`,
      transition: "all 0.15s", ...s,
    }}>{children}</button>
  );
}

function Label({ children, style: s }) {
  return <div style={{ fontSize: 9, letterSpacing: "0.2em", color: T.muted, textTransform: "uppercase", marginBottom: 10, ...s }}>{children}</div>;
}

function Divider({ style: s }) { return <div style={{ height: 1, background: T.border, ...s }} />; }

function StatusBadge({ status, onClick }) {
  const cfg = { draft: [T.muted, "BROUILLON"], ready: [T.gold, "PRÊT"], published: [T.green, "PUBLIÉ"] };
  const [c, l] = cfg[status] || cfg.draft;
  return (
    <button onClick={onClick} style={{
      fontSize: 9, letterSpacing: "0.12em", cursor: onClick ? "pointer" : "default",
      color: c, background: c + "15", border: "none",
      padding: "3px 8px", fontFamily: "inherit",
    }}>{l}</button>
  );
}

function GoldBtn({ children, onClick, disabled, full, size = "md" }) {
  const sz = { sm: "8px 14px", md: "12px 20px", lg: "15px 28px" };
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      background: disabled ? T.surface : T.gold,
      border: `1px solid ${disabled ? T.border : T.gold}`,
      color: disabled ? T.muted : T.bg,
      padding: sz[size], cursor: disabled ? "not-allowed" : "pointer",
      fontSize: size === "lg" ? 12 : 11, fontWeight: 700,
      letterSpacing: "0.18em", fontFamily: "inherit",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
      width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
      transition: "all 0.15s",
    }}>{children}</button>
  );
}

function GhostBtn({ children, onClick, color, active }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || T.gold) + "15" : "none",
      border: `1px solid ${active ? (color || T.gold) + "44" : T.border}`,
      color: active ? (color || T.gold) : T.muted,
      padding: "7px 12px", cursor: "pointer", fontSize: 10,
      fontFamily: "inherit", letterSpacing: "0.1em",
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "all 0.15s",
    }}>{children}</button>
  );
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [drafts, setDrafts] = useState(() => load("drafts", []));
  const [plan, setPlan] = useState(() => load("plan", []));
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => { save("drafts", drafts); }, [drafts]);
  useEffect(() => { save("plan", plan); }, [plan]);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const copyText = useCallback((text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(""), 2000);
      showToast("Copié ✓");
    });
  }, [showToast]);

  const addDraft = useCallback((d) => {
    setDrafts(prev => [{ id: Date.now(), ...d, status: "draft", createdAt: new Date().toISOString() }, ...prev]);
    showToast("Sauvegardé en draft ✓");
  }, [showToast]);

  const NAV = [
    { id: "dashboard", label: "Dashboard", I: Ic.Dashboard },
    { id: "generate", label: "Générer", I: Ic.Generate },
    { id: "drafts", label: `Drafts${drafts.length ? ` (${drafts.length})` : ""}`, I: Ic.Drafts },
    { id: "planning", label: "Planning", I: Ic.Calendar },
    { id: "tools", label: "Outils", I: Ic.Tools },
    { id: "settings", label: "Paramètres", I: Ic.Settings },
  ];

  const PAGES = { dashboard: Dashboard, generate: Generate, drafts: DraftsPage, planning: Planning, tools: Tools, settings: SettingsPage };
  const PageComp = PAGES[page] || Dashboard;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: "'DM Mono','Courier New',monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${T.bg}}::-webkit-scrollbar-thumb{background:${T.border}}
        textarea,input,select{outline:none;-webkit-appearance:none;font-size:16px!important}
        textarea::placeholder,input::placeholder{color:${T.mutedLow}}
        select option{background:${T.surface};color:${T.white}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:.2}50%{opacity:.5}}
        @keyframes toastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 0 ${T.gold}00}50%{box-shadow:0 0 20px 0 ${T.gold}22}}
        .page{animation:fadeUp .2s ease both}
        .shimmer{animation:shimmer 1.5s ease infinite}
        button:active{transform:scale(0.97)}
      `}</style>

      {/* Header */}
      <header style={{
        height: 50, background: T.surface + "EE", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setMobileNav(!mobileNav)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
            display: "flex", flexDirection: "column", gap: 3.5,
          }}>
            {[0,1,2].map(i => <div key={i} style={{ width: mobileNav && i===1 ? 12 : 16, height: 1.5, background: T.muted, transition: "width 0.2s" }} />)}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26,
              background: `linear-gradient(135deg, ${T.gold}22, ${T.gold}08)`,
              border: `1px solid ${T.gold}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: T.gold, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: 1,
            }}>O</div>
            <span style={{ fontSize: 13, letterSpacing: "0.2em", fontFamily: "'Bebas Neue',sans-serif" }}>
              OBSKUR <span style={{ color: T.gold }}>STUDIO</span>
              <span style={{
                marginLeft: 8, fontSize: 8, letterSpacing: "0.15em",
                color: T.gold, background: T.gold + "18", padding: "2px 6px",
                border: `1px solid ${T.gold}33`, verticalAlign: "middle",
              }}>V2</span>
            </span>
          </div>
        </div>
        <div style={{ fontSize: 8, color: T.mutedLow, letterSpacing: "0.18em" }}>
          {NAV.find(n => n.id === page)?.label?.toUpperCase()}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <nav style={{
          width: mobileNav ? 210 : 0, minWidth: mobileNav ? 210 : 0,
          background: T.surface, borderRight: `1px solid ${T.border}`,
          position: "fixed", top: 50, bottom: 0, left: 0, zIndex: 90,
          display: "flex", flexDirection: "column",
          transition: "all 0.22s ease", overflow: "hidden",
        }}>
          <div style={{ padding: "12px 0" }}>
            {NAV.map(({ id, label, I }) => (
              <button key={id} onClick={() => { setPage(id); setMobileNav(false); }} style={{
                background: page === id ? T.gold + "12" : "none", border: "none",
                borderLeft: `2px solid ${page === id ? T.gold : "transparent"}`,
                color: page === id ? T.gold : T.muted, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 18px", fontSize: 10, letterSpacing: "0.12em",
                fontFamily: "inherit", transition: "all 0.14s", width: "100%", textAlign: "left",
              }}><I />{label}</button>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 8, color: T.mutedLow, letterSpacing: "0.14em", lineHeight: 1.9 }}>
              Built in tension.<br />Dakar · Global · {new Date().getFullYear()}
            </div>
          </div>
        </nav>

        {mobileNav && <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, zIndex: 89, background: "rgba(0,0,0,0.65)" }} />}

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <div className="page" key={page}>
            <PageComp drafts={drafts} setDrafts={setDrafts} plan={plan} setPlan={setPlan}
              copyText={copyText} copied={copied} addDraft={addDraft} showToast={showToast} setPage={setPage} />
          </div>
        </main>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: T.surface + "F8", borderTop: `1px solid ${T.border}`,
        display: "flex", padding: "7px 0 11px", backdropFilter: "blur(12px)",
      }}>
        {NAV.slice(0, 5).map(({ id, label, I }) => (
          <button key={id} onClick={() => { setPage(id); setMobileNav(false); }} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: page === id ? T.gold : T.mutedLow, fontSize: 7.5,
            letterSpacing: "0.08em", fontFamily: "inherit", transition: "color 0.14s",
            position: "relative",
          }}>
            {page === id && <div style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)", width: 20, height: 1.5, background: T.gold }} />}
            <I />{label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 60, right: 14, zIndex: 200,
          background: T.surface, border: `1px solid ${toast.type === "err" ? T.red : T.green}44`,
          color: toast.type === "err" ? T.red : T.green,
          padding: "9px 14px", fontSize: 10, letterSpacing: "0.1em",
          animation: "toastIn .18s ease",
        }}>{toast.msg}</div>
      )}
    </div>
  );
}

// ─── DASHBOARD V2 ─────────────────────────────────────────────────────────────
function Dashboard({ drafts, plan, setPage }) {
  const today = new Date();
  const inspo = DAILY_INSPO[today.getDate() % DAILY_INSPO.length];
  const stats = {
    total: drafts.length,
    ready: drafts.filter(d => d.status === "ready").length,
    published: drafts.filter(d => d.status === "published").length,
    scheduled: plan.length,
  };
  const recent = drafts.slice(0, 3);
  const upcoming = [...plan].sort((a, b) => a.date.localeCompare(b.date)).filter(e => e.date >= today.toISOString().slice(0,10)).slice(0, 3);

  // Streak calc
  const publishedDates = drafts.filter(d => d.status === "published").map(d => d.createdAt?.slice(0,10)).filter(Boolean);
  const uniqueDays = [...new Set(publishedDates)].sort().reverse();
  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today); expected.setDate(today.getDate() - i);
    if (uniqueDays[i] === expected.toISOString().slice(0,10)) streak++;
    else break;
  }

  const weekDays = Array.from({length: 7}, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - 6 + i);
    const ds = d.toISOString().slice(0,10);
    const hasPost = publishedDates.includes(ds);
    const isToday = ds === today.toISOString().slice(0,10);
    return { ds, hasPost, isToday, label: d.toLocaleDateString("fr-FR", { weekday: "narrow" }) };
  });

  return (
    <div style={{ padding: "20px 14px 80px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 24, position: "relative" }}>
        <div style={{ fontSize: 8, color: T.muted, letterSpacing: "0.22em", marginBottom: 6 }}>
          {today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: "0.08em", lineHeight: 1, color: T.white }}>
          CONTENT<br /><span style={{ color: T.gold }}>STUDIO</span>
        </h1>
        {/* Streak badge */}
        {streak > 0 && (
          <div style={{
            position: "absolute", top: 0, right: 0,
            background: T.orange + "18", border: `1px solid ${T.orange}44`,
            padding: "6px 10px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: T.orange, lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 8, color: T.orange, letterSpacing: "0.1em" }}>JOURS</div>
          </div>
        )}
      </div>

      {/* Daily inspo */}
      <div style={{
        background: `linear-gradient(135deg, ${T.gold}08, transparent)`,
        border: `1px solid ${T.gold}22`,
        borderLeft: `3px solid ${T.gold}`,
        padding: "14px 16px", marginBottom: 20,
        animation: "glow 4s ease infinite",
      }}>
        <div style={{ fontSize: 8, color: T.goldDim, letterSpacing: "0.18em", marginBottom: 8 }}>PENSÉE DU JOUR</div>
        <p style={{ margin: 0, fontSize: 12, color: T.white, lineHeight: 1.6, fontStyle: "italic" }}>"{inspo.text}"</p>
        <div style={{ fontSize: 9, color: T.muted, marginTop: 8, letterSpacing: "0.1em" }}>— {inspo.author}</div>
      </div>

      {/* Activity heatmap (7 days) */}
      <div style={{ marginBottom: 20 }}>
        <Label>ACTIVITÉ · 7 DERNIERS JOURS</Label>
        <div style={{ display: "flex", gap: 6 }}>
          {weekDays.map(({ ds, hasPost, isToday, label }) => (
            <div key={ds} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", aspectRatio: "1", maxWidth: 36,
                background: hasPost ? T.gold + "44" : T.surface,
                border: `1px solid ${isToday ? T.gold + "66" : hasPost ? T.gold + "33" : T.border}`,
              }} />
              <span style={{ fontSize: 8, color: isToday ? T.gold : T.mutedLow }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[
          { label: "DRAFTS", val: stats.total, color: T.muted, sub: "total" },
          { label: "PRÊTS", val: stats.ready, color: T.gold, sub: "à publier" },
          { label: "PUBLIÉS", val: stats.published, color: T.green, sub: "this session" },
          { label: "PLANIFIÉS", val: stats.scheduled, color: T.studio, sub: "à venir" },
        ].map(({ label, val, color, sub }) => (
          <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${color}33`, padding: "12px 14px" }}>
            <div style={{ fontSize: 8, color: T.muted, letterSpacing: "0.16em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 8, color: T.mutedLow, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions — large CTA */}
      <div style={{ marginBottom: 24 }}>
        <GoldBtn onClick={() => setPage("generate")} full size="lg">
          <Ic.Generate /> GÉNÉRER UN POST MAINTENANT
        </GoldBtn>
      </div>

      {/* Ideas flash */}
      <div style={{ marginBottom: 20 }}>
        <Label>IDÉE DU MOMENT · obskur_wear</Label>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderLeft: `2px solid ${T.wear}44`, padding: "12px 14px",
          cursor: "pointer",
        }} onClick={() => setPage("generate")}>
          <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            {IDEAS_POOL.wear[today.getDate() % IDEAS_POOL.wear.length]}
          </p>
          <div style={{ fontSize: 9, color: T.gold, marginTop: 8, letterSpacing: "0.1em" }}>→ Utiliser cette idée</div>
        </div>
      </div>

      {/* Recent drafts */}
      {recent.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Label style={{ marginBottom: 0 }}>DERNIERS DRAFTS</Label>
            <button onClick={() => setPage("drafts")} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontSize: 9, fontFamily: "inherit", letterSpacing: "0.1em" }}>VOIR TOUT →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recent.map(d => {
              const acc = ACCOUNTS.find(a => a.id === d.account);
              return (
                <div key={d.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${acc?.color || T.border}`, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: acc?.color, letterSpacing: "0.08em" }}>@{acc?.handle}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {d.caption?.slice(0, 100)}…
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
              <div key={e.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${acc?.color || T.border}`, padding: "9px 12px", marginBottom: 5, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontSize: 9, color: acc?.color, minWidth: 60 }}>
                  {new Date(e.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </div>
                <div style={{ fontSize: 11, color: T.muted, flex: 1 }}>{e.note}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── GENERATE V2 ──────────────────────────────────────────────────────────────
function Generate({ addDraft, copyText, copied, showToast }) {
  const [account, setAccount] = useState("wear");
  const [type, setType] = useState("Drop produit");
  const [tone, setTone] = useState("street");
  const [goal, setGoal] = useState("vendre");
  const [format, setFormat] = useState("");
  const [hook, setHook] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editVal, setEditVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [postActions, setPostActions] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const acc = ACCOUNTS.find(a => a.id === account);

  useEffect(() => {
    const types = CONTENT_TYPES[account];
    if (!types.includes(type)) setType(types[0]);
    setFormat("");
  }, [account]);

  async function callAI(prompt) {
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
    return data.content?.map(b => b.text || "").join("") || "";
  }

  async function generate() {
    setLoading(true); setOutput(""); setEditMode(false); setPostActions(false);
    const toneLabel = TONES.find(t => t.id === tone)?.label;
    const goalLabel = GOALS.find(g => g.id === goal)?.label;
    const prompt = `${SYSTEM_PROMPT}

Compte : @${acc.handle} (${acc.tagline})
Type de contenu : ${type}
Ton : ${toneLabel}
Objectif du post : ${goalLabel}
${format ? `Format : ${format}` : ""}
${hook ? `Hook d'accroche à utiliser ou adapter : "${hook}"` : "Crée un hook fort et original."}
${context ? `Contexte : ${context}` : ""}

Génère la caption complète. Structure : Hook → Corps → CTA → Hashtags.
UNIQUEMENT la caption, rien d'autre.`;
    try {
      const text = await callAI(prompt);
      setOutput(text); setEditVal(text); setPostActions(true);
    } catch { showToast("Erreur de connexion", "err"); }
    setLoading(false);
  }

  async function postAction(action) {
    if (!output) return;
    setActionLoading(action);
    const actions = {
      shorter: `Raccourcis cette caption de moitié en gardant l'essentiel et le hook. Langue: français.\n\nCaption:\n${output}`,
      harder: `Rends cette caption plus agressive, plus tranchante, sans filtre. Langue: français.\n\nCaption:\n${output}`,
      mystery: `Rends cette caption plus mystérieuse, intrigante, moins directe. Langue: français.\n\nCaption:\n${output}`,
      regen: `Réécris complètement cette caption avec un angle différent pour @${acc.handle}. Garde le même objectif mais change tout. Langue: français.\n\nCaption originale:\n${output}`,
      signature: `Ajoute la signature OBSKUR à la fin de cette caption : une ligne courte, percutante, dans l'univers de la marque (pas juste "Built in tension."). Langue: français.\n\nCaption:\n${output}`,
    };
    try {
      const text = await callAI(actions[action]);
      setOutput(text); setEditVal(text);
    } catch { showToast("Erreur", "err"); }
    setActionLoading("");
  }

  function saveAsDraft() {
    if (!output) return;
    addDraft({ account, type, tone, goal, format, caption: editMode ? editVal : output });
  }

  const finalOutput = editMode ? editVal : output;

  return (
    <div style={{ padding: "18px 14px 80px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.12em", color: T.white }}>
          GÉNÉRER UN <span style={{ color: T.gold }}>POST</span>
        </div>
        <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.12em", marginTop: 2 }}>Configure · Génère · Affine · Publie</div>
      </div>

      {/* Account */}
      <div style={{ marginBottom: 14 }}>
        <Label>COMPTE</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {ACCOUNTS.map(a => (
            <button key={a.id} onClick={() => setAccount(a.id)} style={{
              background: account === a.id ? a.color + "10" : T.surface,
              border: `1px solid ${account === a.id ? a.color + "55" : T.border}`,
              color: account === a.id ? a.color : T.muted,
              padding: "9px 12px", cursor: "pointer", textAlign: "left",
              fontFamily: "inherit", fontSize: 11, letterSpacing: "0.06em",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all 0.14s",
            }}>
              <span>@{a.handle}</span>
              <span style={{ fontSize: 8, opacity: 0.6 }}>{a.platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Type + Format (2 col) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div>
          <Label>TYPE</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {CONTENT_TYPES[account].map(t => (
              <Tag key={t} active={type === t} color={acc.color} onClick={() => setType(t)}>{t}</Tag>
            ))}
          </div>
        </div>
        <div>
          <Label>FORMAT</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {(FORMATS[account] || []).map(f => (
              <Tag key={f} active={format === f} color={acc.color} onClick={() => setFormat(format === f ? "" : f)}>{f}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Objectif */}
      <div style={{ marginBottom: 14 }}>
        <Label>OBJECTIF DU POST</Label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {GOALS.map(g => (
            <button key={g.id} onClick={() => setGoal(g.id)} style={{
              background: goal === g.id ? T.gold + "18" : T.surface,
              border: `1px solid ${goal === g.id ? T.gold + "55" : T.border}`,
              color: goal === g.id ? T.gold : T.muted,
              padding: "7px 12px", cursor: "pointer",
              fontFamily: "inherit", fontSize: 10, letterSpacing: "0.08em",
              display: "flex", alignItems: "center", gap: 5,
              transition: "all 0.14s",
            }}>
              <span>{g.icon}</span>{g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ton */}
      <div style={{ marginBottom: 14 }}>
        <Label>TON</Label>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {TONES.map(t => (
            <Tag key={t.id} active={tone === t.id} color={acc.color} onClick={() => setTone(t.id)}>{t.label}</Tag>
          ))}
        </div>
      </div>

      {/* Hook */}
      <div style={{ marginBottom: 14 }}>
        <Label>HOOK D'ACCROCHE <span style={{ color: T.mutedLow }}>· optionnel</span></Label>
        <select value={hook} onChange={e => setHook(e.target.value)} style={{
          width: "100%", background: T.surface, border: `1px solid ${T.border}`,
          color: hook ? T.white : T.muted, padding: "9px 11px",
          fontSize: 11, fontFamily: "inherit", cursor: "pointer",
        }}>
          <option value="">Laisse l'IA créer un hook original</option>
          {HOOKS_BANK.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {/* Contexte */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Label style={{ marginBottom: 0 }}>CONTEXTE <span style={{ color: T.mutedLow }}>· optionnel</span></Label>
          <button onClick={() => { setSuggestions(IDEAS_POOL[account]); setShowSug(!showSug); }} style={{
            background: "none", border: "none", color: T.gold, cursor: "pointer",
            fontSize: 9, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
          }}><Ic.Spark /> Idées</button>
        </div>
        {showSug && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => { setContext(s); setShowSug(false); }} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderLeft: `2px solid ${acc.color}44`, padding: "8px 10px",
                fontSize: 10, color: T.muted, cursor: "pointer", lineHeight: 1.5,
              }}>{s}</div>
            ))}
          </div>
        )}
        <textarea value={context} onChange={e => setContext(e.target.value)}
          placeholder="Ex: Lancement Collection #03, fond béton, ambiance nuit urbaine..."
          rows={2} style={{
            width: "100%", background: T.surface, border: `1px solid ${T.border}`,
            color: T.white, padding: "9px 11px", fontSize: 11,
            fontFamily: "inherit", resize: "none", lineHeight: 1.6,
          }} />
      </div>

      <Divider style={{ marginBottom: 16 }} />

      {/* Generate CTA */}
      <GoldBtn onClick={generate} disabled={loading} full size="lg">
        {loading ? <><span style={{ animation: "pulse 1s infinite" }}>◈</span> GÉNÉRATION…</> : <><Ic.Generate /> GÉNÉRER</>}
      </GoldBtn>

      {/* Output */}
      {(loading || output) && (
        <div style={{ marginTop: 18, background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${acc.color}` }}>
          {/* Output header */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 9, color: acc.color, letterSpacing: "0.1em" }}>@{acc.handle}</span>
              <span style={{ fontSize: 9, color: T.mutedLow, marginLeft: 8 }}>{type} · {TONES.find(t => t.id === tone)?.label}</span>
            </div>
            {output && !editMode && (
              <div style={{ display: "flex", gap: 5 }}>
                <GhostBtn onClick={() => { setEditMode(true); setEditVal(output); }}><Ic.Edit /> Éditer</GhostBtn>
                <GhostBtn onClick={() => copyText(finalOutput, "output")}><Ic.Copy />{copied === "output" ? "✓" : "Copier"}</GhostBtn>
                <GhostBtn onClick={saveAsDraft} color={T.gold}><Ic.Save /> Draft</GhostBtn>
              </div>
            )}
            {editMode && (
              <div style={{ display: "flex", gap: 5 }}>
                <GoldBtn size="sm" onClick={() => { setOutput(editVal); setEditMode(false); }}><Ic.Check /> OK</GoldBtn>
                <GhostBtn onClick={() => setEditMode(false)}><Ic.Close /></GhostBtn>
              </div>
            )}
          </div>

          {/* Output body */}
          <div style={{ padding: 14 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[100, 78, 88, 62, 72, 48].map((w, i) => (
                  <div key={i} className="shimmer" style={{ height: 10, background: T.border, width: `${w}%` }} />
                ))}
              </div>
            ) : editMode ? (
              <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={10} style={{
                width: "100%", background: "transparent", border: "none",
                color: T.white, fontSize: 12, fontFamily: "inherit",
                lineHeight: 1.7, resize: "none",
              }} />
            ) : (
              <pre style={{ margin: 0, fontSize: 12, color: "#C8C4BC", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {output}
              </pre>
            )}
          </div>

          {/* POST ACTIONS — la vraie nouveauté V2 */}
          {postActions && output && !loading && (
            <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 8, color: T.muted, letterSpacing: "0.16em", marginBottom: 8 }}>AFFINER LE POST</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { key: "shorter", label: "Raccourcir", icon: "◂" },
                  { key: "harder", label: "+ Agressif", icon: "◆" },
                  { key: "mystery", label: "+ Mystérieux", icon: "◐" },
                  { key: "signature", label: "Signature OBSKUR", icon: "◈" },
                  { key: "regen", label: "Réécrire", icon: "↺" },
                ].map(({ key, label, icon }) => (
                  <button key={key} onClick={() => postAction(key)} disabled={!!actionLoading} style={{
                    background: actionLoading === key ? T.gold + "22" : T.surfaceHigh,
                    border: `1px solid ${actionLoading === key ? T.gold + "44" : T.borderHigh}`,
                    color: actionLoading === key ? T.gold : T.muted,
                    padding: "6px 11px", cursor: "pointer", fontSize: 10,
                    fontFamily: "inherit", letterSpacing: "0.06em",
                    display: "flex", alignItems: "center", gap: 5,
                    transition: "all 0.15s",
                  }}>
                    <span style={{ animation: actionLoading === key ? "pulse .8s infinite" : "none" }}>{icon}</span>
                    {actionLoading === key ? "…" : label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hashtags preview */}
      {output && (
        <div style={{ marginTop: 10, background: T.surface, border: `1px solid ${T.border}`, padding: "10px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: T.muted, letterSpacing: "0.14em" }}>HASHTAGS @{acc.handle}</span>
            <button onClick={() => copyText(HASHTAGS[account], "htag")} style={{
              background: "none", border: "none", color: copied === "htag" ? T.gold : T.muted,
              cursor: "pointer", fontSize: 9, fontFamily: "inherit",
            }}>{copied === "htag" ? "✓ Copié" : "Copier"}</button>
          </div>
          <p style={{ margin: 0, fontSize: 9, color: T.mutedLow, lineHeight: 1.7 }}>{HASHTAGS[account]}</p>
        </div>
      )}
    </div>
  );
}

// ─── DRAFTS V2 ────────────────────────────────────────────────────────────────
function DraftsPage({ drafts, setDrafts, copyText, copied, showToast }) {
  const [filterAcc, setFilterAcc] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [search, setSearch] = useState("");

  const filtered = drafts.filter(d =>
    (filterAcc === "all" || d.account === filterAcc) &&
    (filterStatus === "all" || d.status === filterStatus) &&
    (search === "" || d.caption?.toLowerCase().includes(search.toLowerCase()))
  );

  function nextStatus(id) {
    const cycle = { draft: "ready", ready: "published", published: "draft" };
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: cycle[d.status] } : d));
  }

  function del(id) { setDrafts(prev => prev.filter(d => d.id !== id)); showToast("Supprimé"); }
  function dupe(draft) { setDrafts(prev => [{ ...draft, id: Date.now(), status: "draft", createdAt: new Date().toISOString() }, ...prev]); showToast("Dupliqué ✓"); }
  function saveEdit(id) { setDrafts(prev => prev.map(d => d.id === id ? { ...d, caption: editVal } : d)); setEditId(null); showToast("Modifié ✓"); }

  // Grouped by status for kanban-feel
  const readyCount = drafts.filter(d => d.status === "ready").length;

  return (
    <div style={{ padding: "18px 14px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.12em" }}>
            DRAFTS <span style={{ color: T.gold }}>{filtered.length}</span><span style={{ color: T.muted, fontSize: 14 }}>/{drafts.length}</span>
          </div>
          {readyCount > 0 && (
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: "0.1em", marginTop: 2 }}>
              {readyCount} post{readyCount > 1 ? "s" : ""} prêt{readyCount > 1 ? "s" : ""} à publier
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans les drafts..."
        style={{
          width: "100%", background: T.surface, border: `1px solid ${T.border}`,
          color: T.white, padding: "9px 12px", fontSize: 11,
          fontFamily: "inherit", marginBottom: 12,
        }} />

      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Tag active={filterAcc === "all"} onClick={() => setFilterAcc("all")}>Tous comptes</Tag>
          {ACCOUNTS.map(a => <Tag key={a.id} active={filterAcc === a.id} color={a.color} onClick={() => setFilterAcc(a.id)}>@{a.handle}</Tag>)}
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[["all","Tout"], ["draft","Brouillons"], ["ready","Prêts"], ["published","Publiés"]].map(([v, l]) => (
            <Tag key={v} active={filterStatus === v} onClick={() => setFilterStatus(v)}>{l}</Tag>
          ))}
        </div>
      </div>

      <Divider style={{ marginBottom: 14 }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: T.mutedLow }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>◉</div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em" }}>{search ? "Aucun résultat" : "Aucun draft trouvé"}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {filtered.map(d => {
            const acc = ACCOUNTS.find(a => a.id === d.account);
            const isEditing = editId === d.id;
            return (
              <div key={d.id} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderLeft: `2px solid ${acc?.color || T.border}`,
                transition: "border-color 0.15s",
              }}>
                <div style={{ padding: "9px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: acc?.color, letterSpacing: "0.08em" }}>@{acc?.handle}</span>
                    <span style={{ fontSize: 8, color: T.mutedLow }}>·</span>
                    <span style={{ fontSize: 8, color: T.mutedLow }}>{d.type || "—"}</span>
                    {d.goal && <span style={{ fontSize: 8, color: T.mutedLow }}>· {d.goal}</span>}
                  </div>
                  <StatusBadge status={d.status} onClick={() => nextStatus(d.id)} />
                </div>

                <div style={{ padding: "10px 12px" }}>
                  {isEditing ? (
                    <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={6} style={{
                      width: "100%", background: T.surfaceHigh, border: `1px solid ${T.borderHigh}`,
                      color: T.white, padding: "8px", fontSize: 11, fontFamily: "inherit",
                      resize: "none", lineHeight: 1.7,
                    }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {d.caption?.length > 160 ? d.caption.slice(0, 160) + "…" : d.caption}
                    </p>
                  )}
                </div>

                <div style={{ padding: "7px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                  {isEditing ? (
                    <>
                      <GoldBtn size="sm" onClick={() => saveEdit(d.id)}><Ic.Check /> Sauver</GoldBtn>
                      <GhostBtn onClick={() => setEditId(null)}><Ic.Close /> Annuler</GhostBtn>
                    </>
                  ) : (
                    <>
                      <GhostBtn onClick={() => { setEditId(d.id); setEditVal(d.caption); }}><Ic.Edit /></GhostBtn>
                      <GhostBtn onClick={() => copyText(d.caption, `d-${d.id}`)}><Ic.Copy />{copied === `d-${d.id}` ? "✓" : ""}</GhostBtn>
                      <GhostBtn onClick={() => dupe(d)}><Ic.Dupe /></GhostBtn>
                      <button onClick={() => del(d.id)} style={{ background: "none", border: `1px solid ${T.red}33`, color: T.red, padding: "6px 10px", cursor: "pointer", fontSize: 10, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}><Ic.Trash /></button>
                    </>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 8, color: T.mutedLow }}>
                    {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PLANNING V2 ──────────────────────────────────────────────────────────────
function Planning({ plan, setPlan, showToast }) {
  const [date, setDate] = useState("");
  const [account, setAccount] = useState("wear");
  const [note, setNote] = useState("");
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNote, setEditNote] = useState("");

  function add() {
    if (!date || !note.trim()) { showToast("Date et note requis", "err"); return; }
    setPlan(prev => [...prev, { id: Date.now(), date, account, note, type }]);
    setDate(""); setNote(""); setType("");
    showToast("Ajouté ✓");
  }

  function remove(id) { setPlan(prev => prev.filter(e => e.id !== id)); }
  function saveEdit(id) { setPlan(prev => prev.map(e => e.id === id ? { ...e, note: editNote } : e)); setEditId(null); }

  const today = new Date().toISOString().slice(0,10);
  const sorted = [...plan].sort((a, b) => a.date.localeCompare(b.date));
  const grouped = sorted.reduce((acc, e) => {
    const m = e.date.slice(0, 7);
    if (!acc[m]) acc[m] = [];
    acc[m].push(e); return acc;
  }, {});

  const upcoming = sorted.filter(e => e.date >= today).length;
  const past = sorted.filter(e => e.date < today).length;

  return (
    <div style={{ padding: "18px 14px 80px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.12em" }}>
          PLANNING <span style={{ color: T.gold }}>{upcoming}</span>
          <span style={{ color: T.muted, fontSize: 14 }}> à venir</span>
        </div>
        {past > 0 && <div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>{past} passés</div>}
      </div>

      {/* Add form */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${T.gold}44`, padding: 14, marginBottom: 20 }}>
        <Label>NOUVELLE ENTRÉE</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today} style={{
            background: T.surfaceHigh, border: `1px solid ${T.border}`,
            color: T.white, padding: "9px 11px", fontSize: 11, fontFamily: "inherit", width: "100%",
          }} />
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {ACCOUNTS.map(a => <Tag key={a.id} active={account === a.id} color={a.color} onClick={() => setAccount(a.id)}>@{a.handle}</Tag>)}
          </div>
          <select value={type} onChange={e => setType(e.target.value)} style={{
            background: T.surfaceHigh, border: `1px solid ${T.border}`,
            color: type ? T.white : T.muted, padding: "9px 11px", fontSize: 11, fontFamily: "inherit",
          }}>
            <option value="">Type de contenu (optionnel)</option>
            {CONTENT_TYPES[account].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Idée, description du post..."
            rows={2} style={{
              background: T.surfaceHigh, border: `1px solid ${T.border}`,
              color: T.white, padding: "9px 11px", fontSize: 11,
              fontFamily: "inherit", resize: "none", lineHeight: 1.6,
            }} />
          <GoldBtn onClick={add} full><Ic.Plus /> Ajouter au planning</GoldBtn>
        </div>
      </div>

      {/* Calendar */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.mutedLow }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>◆</div>
          <div style={{ fontSize: 10, letterSpacing: "0.12em" }}>Aucune entrée planifiée</div>
        </div>
      ) : Object.entries(grouped).map(([month, entries]) => (
        <div key={month} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.2em", marginBottom: 10, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
            {new Date(month + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ color: T.mutedLow }}>{entries.length} post{entries.length > 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {entries.map(e => {
              const acc = ACCOUNTS.find(a => a.id === e.account);
              const isToday = e.date === today;
              const isPast = e.date < today;
              const isEditing = editId === e.id;
              const dayDate = new Date(e.date + "T00:00:00");
              return (
                <div key={e.id} style={{
                  background: T.surface,
                  border: `1px solid ${isToday ? acc?.color + "55" : T.border}`,
                  borderLeft: `3px solid ${isPast ? T.mutedLow : acc?.color || T.border}`,
                  padding: "10px 12px", opacity: isPast ? 0.55 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: isPast ? T.muted : acc?.color, lineHeight: 1 }}>
                        {dayDate.getDate()}
                      </span>
                      <div>
                        <div style={{ fontSize: 9, color: isPast ? T.muted : acc?.color, letterSpacing: "0.08em" }}>@{acc?.handle}</div>
                        {e.type && <div style={{ fontSize: 8, color: T.mutedLow }}>{e.type}</div>}
                      </div>
                      {isToday && <span style={{ fontSize: 8, color: T.gold, border: `1px solid ${T.gold}44`, padding: "2px 6px", letterSpacing: "0.1em" }}>AUJOURD'HUI</span>}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {isEditing ? (
                        <>
                          <GoldBtn size="sm" onClick={() => saveEdit(e.id)}><Ic.Check /></GoldBtn>
                          <GhostBtn onClick={() => setEditId(null)}><Ic.Close /></GhostBtn>
                        </>
                      ) : (
                        <>
                          <GhostBtn onClick={() => { setEditId(e.id); setEditNote(e.note); }}><Ic.Edit /></GhostBtn>
                          <button onClick={() => remove(e.id)} style={{ background: "none", border: `1px solid ${T.red}22`, color: T.red, padding: "5px 8px", cursor: "pointer", fontFamily: "inherit" }}><Ic.Trash /></button>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea value={editNote} onChange={ev => setEditNote(ev.target.value)} rows={2} style={{
                      width: "100%", background: T.surfaceHigh, border: `1px solid ${T.border}`,
                      color: T.white, padding: "7px", fontSize: 11, fontFamily: "inherit", resize: "none",
                    }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{e.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TOOLS V2 ─────────────────────────────────────────────────────────────────
function Tools({ copyText, copied }) {
  const [tab, setTab] = useState("hooks");

  return (
    <div style={{ padding: "18px 14px 80px" }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.12em", marginBottom: 16 }}>
        BOÎTE À <span style={{ color: T.gold }}>OUTILS</span>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 18, borderBottom: `1px solid ${T.border}` }}>
        {[["hooks","HOOKS"],["hashtags","HASHTAGS"],["guide","GUIDE"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: "none", border: "none",
            borderBottom: `2px solid ${tab === id ? T.gold : "transparent"}`,
            color: tab === id ? T.gold : T.muted, cursor: "pointer",
            padding: "8px 16px", fontSize: 9, letterSpacing: "0.18em",
            fontFamily: "inherit", transition: "all 0.14s",
          }}>{label}</button>
        ))}
      </div>

      {tab === "hooks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.12em", marginBottom: 8 }}>
            {HOOKS_BANK.length} HOOKS · UNIVERS OBSKUR · CLIQUE POUR COPIER
          </div>
          {HOOKS_BANK.map((h, i) => (
            <div key={i} onClick={() => copyText(h, `h${i}`)} style={{
              background: T.surface, border: `1px solid ${copied === `h${i}` ? T.gold + "44" : T.border}`,
              padding: "12px 14px", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all 0.14s",
            }}>
              <span style={{ fontSize: 13, color: copied === `h${i}` ? T.gold : "#C0BAB0", fontStyle: "italic" }}>"{h}"</span>
              <span style={{ fontSize: 9, color: copied === `h${i}` ? T.gold : T.mutedLow, whiteSpace: "nowrap", marginLeft: 10 }}>
                {copied === `h${i}` ? "✓ COPIÉ" : "COPIER"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "hashtags" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ACCOUNTS.map(acc => (
            <div key={acc.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${acc.color}44` }}>
              <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: acc.color, letterSpacing: "0.08em" }}>@{acc.handle}</div>
                  <div style={{ fontSize: 8, color: T.mutedLow }}>{acc.platform}</div>
                </div>
                <button onClick={() => copyText(HASHTAGS[acc.id], `ht-${acc.id}`)} style={{
                  background: "none", border: `1px solid ${T.border}`,
                  color: copied === `ht-${acc.id}` ? T.gold : T.muted,
                  padding: "6px 12px", cursor: "pointer", fontSize: 9, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 4,
                }}><Ic.Copy />{copied === `ht-${acc.id}` ? "Copié ✓" : "Copier"}</button>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <p style={{ margin: 0, fontSize: 10, color: T.muted, lineHeight: 1.9 }}>{HASHTAGS[acc.id]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { acc: ACCOUNTS[0], rules: [
              ["Rôle", "Vitrine de la marque. Faire désirer."],
              ["Ton", "Premium, froid, désirable. Jamais vulgaire."],
              ["Contenu", "Produits, lookbooks, drops, teasers."],
              ["Fréquence", "4-5 posts/semaine. Régularité = présence."],
              ["Formats", "Photo fond noir, Reels courts, Carrousels."],
              ["À éviter", "Trop de texte sur l'image, CTA agressifs."],
            ]},
            { acc: ACCOUNTS[1], rules: [
              ["Rôle", "Le laboratoire. Montrer la vision, pas le produit."],
              ["Ton", "Poétique, artistique, profond."],
              ["Contenu", "Moodboards, making-of, manifestes, références."],
              ["Fréquence", "2-3 posts/semaine. Qualité > quantité."],
              ["Formats", "Carrousels moodboard, Reels cinématiques."],
              ["À éviter", "Parler de prix, CTA vente directe."],
            ]},
          ].map(({ acc, rules }) => (
            <div key={acc.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${acc.color}44` }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: acc.color, letterSpacing: "0.14em" }}>@{acc.handle.toUpperCase()}</div>
                <div style={{ fontSize: 8, color: T.mutedLow, letterSpacing: "0.1em" }}>{acc.tagline}</div>
              </div>
              <div style={{ padding: "10px 14px" }}>
                {rules.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 8, color: acc.color, minWidth: 68, letterSpacing: "0.1em", paddingTop: 2 }}>{k}</span>
                    <span style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Règle d'or */}
          <div style={{ background: T.gold + "08", border: `1px solid ${T.gold}22`, padding: "14px 16px" }}>
            <div style={{ fontSize: 8, color: T.gold, letterSpacing: "0.18em", marginBottom: 10 }}>RÈGLE D'OR · DIFFÉRENCIATION</div>
            <p style={{ margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              <strong style={{ color: T.wear }}>obskur_wear</strong> vend sans vendre.<br />
              <strong style={{ color: T.studio }}>obskur.studio</strong> inspire sans expliquer.<br /><br />
              <em style={{ color: T.white, fontSize: 11 }}>Les deux ensemble construisent une marque que les gens ressentent avant de l'acheter.</em>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS V2 ──────────────────────────────────────────────────────────────
function SettingsPage({ drafts, setDrafts, plan, setPlan, showToast }) {
  return (
    <div style={{ padding: "18px 14px 80px" }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.12em", marginBottom: 18 }}>
        PARA<span style={{ color: T.gold }}>MÈTRES</span>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 14, marginBottom: 14 }}>
        <Label>STATISTIQUES</Label>
        {[
          ["Drafts totaux", drafts.length, T.muted],
          ["Prêts à publier", drafts.filter(d => d.status === "ready").length, T.gold],
          ["Publiés", drafts.filter(d => d.status === "published").length, T.green],
          ["Entrées planning", plan.length, T.studio],
        ].map(([k, v, c]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 11, color: T.muted }}>{k}</span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: c, lineHeight: 1 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background: T.red + "08", border: `1px solid ${T.red}22`, padding: 14 }}>
        <Label style={{ color: T.red }}>ZONE DANGEREUSE</Label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => { if (confirm("Vider tous les drafts ?")) { setDrafts([]); showToast("Drafts vidés"); } }} style={{
            background: "none", border: `1px solid ${T.red}44`, color: T.red,
            padding: "8px 14px", cursor: "pointer", fontSize: 10, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}><Ic.Trash /> Vider drafts</button>
          <button onClick={() => { if (confirm("Vider le planning ?")) { setPlan([]); showToast("Planning vidé"); } }} style={{
            background: "none", border: `1px solid ${T.red}44`, color: T.red,
            padding: "8px 14px", cursor: "pointer", fontSize: 10, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}><Ic.Trash /> Vider planning</button>
        </div>
      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: T.border, letterSpacing: "0.24em" }}>OBSKUR CONTENT STUDIO</div>
        <div style={{ fontSize: 8, color: T.mutedLow, letterSpacing: "0.18em", marginTop: 4 }}>V2 · Built in tension · Dakar</div>
      </div>
    </div>
  );
}
/ /   B U F F E R _ U P D A T E  
 