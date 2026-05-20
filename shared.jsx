// shared.jsx — shared components and icons

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons (line icons) ----------
const Icon = ({ name, size = 18, color = "currentColor", stroke = 1.6, ...props }) => {
  const paths = {
    home:        <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    user:        <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></>,
    users:       <><circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 4-5 7-5s6 1.5 7 5"/><circle cx="17" cy="9" r="3"/><path d="M22 19c-.5-2.5-2.5-4-5-4"/></>,
    calendar:    <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    cash:        <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></>,
    chart:       <><path d="M4 20V10M10 20V4M16 20v-8M22 20v-4"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.8V9c.1.6.6 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    bell:        <><path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3z"/><path d="M10 21a2 2 0 004 0"/></>,
    search:      <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>,
    close:       <><path d="M6 6l12 12M18 6L6 18"/></>,
    check:       <><path d="M4 12l5 5L20 6"/></>,
    plus:        <><path d="M12 5v14M5 12h14"/></>,
    chev_right:  <><path d="M9 6l6 6-6 6"/></>,
    chev_left:   <><path d="M15 6l-6 6 6 6"/></>,
    chev_down:   <><path d="M6 9l6 6 6-6"/></>,
    chev_up:     <><path d="M6 15l6-6 6 6"/></>,
    upload:      <><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></>,
    download:    <><path d="M12 4v12M6 14l6 6 6-6"/><path d="M4 20h16"/></>,
    phone:       <><path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></>,
    map:         <><path d="M12 21s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    mail:        <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    leaf:        <><path d="M3 21c0-8 6-15 18-15-1 9-7 15-15 15-1.5 0-3-1-3-3z"/><path d="M3 21c4-4 8-7 14-9"/></>,
    sparkle:     <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></>,
    play:        <><path d="M6 4l14 8-14 8z"/></>,
    drag:        <><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></>,
    file:        <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></>,
    arrow_right: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    logout:      <><path d="M16 17l5-5-5-5M21 12H9"/><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/></>,
    pin:         <><path d="M12 22s-7-8-7-13a7 7 0 1114 0c0 5-7 13-7 13z"/></>,
    instagram:   <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></>,
    whatsapp:    <><path d="M3 21l1.7-5.3A9 9 0 1112 21H3z"/></>,
    trash:       <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    edit:        <><path d="M14 4l6 6-12 12H2v-6L14 4z"/></>,
    info:        <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.5"/></>,
    hand_off:    <><path d="M8 11V6.5a1.5 1.5 0 013 0V11"/><path d="M11 11V5a1.5 1.5 0 013 0v6"/><path d="M14 11V6a1.5 1.5 0 013 0v8a6 6 0 01-12 0v-2l-2-2a1.5 1.5 0 012-2l2 2"/></>,
    refresh:     <><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    star:        <><path d="M12 3l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 17l-5.6 3.2 1.5-6.3L3 9.6l6.4-.6L12 3z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name] || null}
    </svg>
  );
};

// ---------- Logo placeholder ----------
const StudioLogo = ({ size = "md", variant = "dark" }) => {
  const isDark = variant === "dark";
  return (
    <div className="logo">
      <div className="logo-mark" style={{
        background: isDark ? "var(--green-800)" : "#fff",
        color: isDark ? "#fff" : "var(--green-800)",
        width: size === "lg" ? 44 : size === "sm" ? 28 : 36,
        height: size === "lg" ? 44 : size === "sm" ? 28 : 36,
        fontSize: size === "lg" ? 15 : size === "sm" ? 11 : 13,
        border: isDark ? "none" : "1px solid var(--ink-200)"
      }}>
        <span>FP</span>
      </div>
      <div className="logo-name">
        <b style={{
          fontSize: size === "lg" ? 17 : size === "sm" ? 12 : 14,
          color: isDark ? "var(--green-900)" : "#fff"
        }}>Flávia Prudêncio</b>
        <small style={{ color: isDark ? "var(--ink-500)" : "rgba(255,255,255,.7)" }}>
          Fisio · Pilates
        </small>
      </div>
    </div>
  );
};

// ---------- iOS status bar (for phone frame) ----------
const IOSStatusBar = ({ dark = false }) => {
  const col = dark ? "#fff" : "#0E1512";
  return (
    <div className="ios-status" style={{ color: col }}>
      <span>9:41</span>
      <div className="icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill={col}>
          <path d="M1 7h2v3H1zM5 5h2v5H5zM9 3h2v7H9zM13 1h2v9h-2z"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={col} strokeWidth="1">
          <path d="M1 5a8 8 0 0113 0M3.5 7.5a4.5 4.5 0 018 0M6 10a1.5 1.5 0 013 0"/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="1" y="1" width="20" height="9" rx="2" stroke={col} fill="none"/>
          <rect x="2.5" y="2.5" width="14" height="6" rx="1" fill={col}/>
          <rect x="22" y="4" width="1.5" height="3" rx=".5" fill={col}/>
        </svg>
      </div>
    </div>
  );
};

// ---------- Modal ----------
const Modal = ({ open, onClose, children, width = 480, padding = 28 }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width, padding }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// ---------- Side sheet (right slide-in for admin) ----------
const SideSheet = ({ open, onClose, children, width = 480 }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="overlay side-sheet" onClick={onClose} style={{ justifyContent:"flex-end", alignItems:"stretch" }}>
      <div className="side-sheet-body" onClick={(e) => e.stopPropagation()} style={{
        background:"#fff", width, maxWidth:"100vw", height:"100%", overflow:"auto",
        boxShadow:"var(--shadow-lg)",
        animation:"sheetIn .25s cubic-bezier(.2,.8,.2,1)"
      }}>
        {children}
      </div>
      <style>{`@keyframes sheetIn{from{transform:translateX(40px);opacity:.5}to{transform:none;opacity:1}}`}</style>
    </div>
  );
};

// ---------- Toast ----------
const useToast = () => {
  const [msg, setMsg] = useState(null);
  const show = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2400);
  };
  const node = msg ? <div className="toast">{msg}</div> : null;
  return [node, show];
};

// ---------- DropZone ----------
const DropZone = ({ file, onFile, label = "Arraste um documento ou clique para enviar" }) => {
  const inputRef = useRef();
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault(); setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      style={{
        border: `1.5px dashed ${hover ? "var(--green-700)" : "var(--ink-200)"}`,
        background: hover ? "var(--teal-50)" : "var(--ink-50)",
        borderRadius: 14, padding: "22px 18px", textAlign:"center",
        cursor:"pointer", transition:"all .15s"
      }}
    >
      <input ref={inputRef} type="file" hidden onChange={(e) => {
        const f = e.target.files?.[0]; if (f) onFile(f);
      }}/>
      {file ? (
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center" }}>
          <Icon name="file" size={20} color="var(--green-700)"/>
          <span style={{ fontSize:13, color:"var(--ink-900)", fontWeight:500 }}>{file.name}</span>
          <span style={{ fontSize:11, color:"var(--ink-500)" }}>({Math.round(file.size/1024)} KB)</span>
        </div>
      ) : (
        <>
          <Icon name="upload" size={22} color="var(--green-700)"/>
          <div style={{ fontSize:13, color:"var(--ink-700)", marginTop:8 }}>{label}</div>
          <div style={{ fontSize:11, color:"var(--ink-500)", marginTop:4 }}>PDF, JPG ou PNG · até 10 MB</div>
        </>
      )}
    </div>
  );
};

// ---------- Currency formatter ----------
const formatBRL = (n) => "R$ " + n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---------- Status pill ----------
const StatusPill = ({ status }) => {
  const cfg = {
    "em-dia":   { cls:"chip-teal",   label:"Em dia" },
    "pendente": { cls:"chip-warn",   label:"Pendente" },
    "inativo":  { cls:"chip-danger", label:"Inativo" },
    "pago":     { cls:"chip-teal",   label:"Pago" },
    "baixado":  { cls:"chip-teal",   label:"Baixado" },
  }[status] || { cls:"chip-info", label:status };
  return <span className={`chip ${cfg.cls}`}><span className="chip-dot"/>{cfg.label}</span>;
};

// Export to window
Object.assign(window, { Icon, StudioLogo, IOSStatusBar, Modal, SideSheet, useToast, DropZone, formatBRL, StatusPill });
