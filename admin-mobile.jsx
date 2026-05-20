// admin-mobile.jsx — Painel Administrativo, nativo mobile
// Reescrito do zero: app de gestão real para celular, com top bar, bottom nav,
// cards de hora para a Grade, sheets para alunos e modal de baixa.

const { STUDENTS: M_STUDENTS, SCHEDULE_HOURS: M_HOURS, SCHEDULE_DATA: M_DATA,
        FINANCEIRO_ENTRADAS: M_ENT, FINANCEIRO_SAIDAS: M_SAI,
        RELATORIOS: M_REL, GERENCIAIS: M_GER } = window.STUDIO_DATA;

const PERMISSIONS_M = {
  recepcionista: ["grade", "alunos", "recebimentos"],
  dona:          ["grade", "alunos", "recebimentos", "caixa", "relatorios"],
};

// shared slot color tokens (matches desktop)
const M_SLOT_STYLES = {
  free:    { bg: "#EAF4E6", border: "#5C9684", text: "var(--green-900)", label: "var(--green-700)", tag: "Livre" },
  fixo:    { bg: "#E1ECF7", border: "#4E81B7", text: "#143A66",          label: "#3A6EA5",         tag: "Fixo" },
  repondo: { bg: "#FFF1C9", border: "#D9A300", text: "#6B4D00",          label: "#9A7700",         tag: "Reposição" },
  fisio:   { bg: "#F2DAFA", border: "#8E3FAF", text: "#4B1A65",          label: "#7B2A9D",         tag: "Fisio" },
  block:   { bg: "#E8E8E8", border: "#BBB",    text: "#666",              label: "#888",            tag: "Bloqueado" },
};

const MLockGlyph = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2.5"/>
    <path d="M8 10V7a4 4 0 018 0v3"/>
  </svg>
);

// ============================================================
// FRAME (the entry point exported to window)
// ============================================================
const AdminMobileFrame = ({ accent /* , gradeVariant — not used in mobile */ }) => {
  const [role, setRole] = useState("dona");
  const [page, setPage] = useState("grade");
  const [drawer, setDrawer] = useState(false);
  const [lockedAttempt, setLockedAttempt] = useState(null);
  const [toast, showToast] = useToast();

  // modals / sheets state
  const [editingSlot, setEditingSlot] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [openSaida, setOpenSaida] = useState(false);

  const canAccess = (p) => PERMISSIONS_M[role].includes(p);

  useEffect(() => { if (!canAccess(page)) setPage("grade"); /* eslint-disable-next-line */ }, [role]);

  const tryNav = (p) => {
    if (canAccess(p)) { setPage(p); setDrawer(false); }
    else              { setLockedAttempt(p); setDrawer(false); }
  };

  const titles = {
    grade: "Grade diária",
    alunos: "Alunos",
    recebimentos: "Recebimentos",
    caixa: "Caixa & Despesas",
    relatorios: "Relatórios",
    mais: "Mais",
  };

  return (
    <div className="phone-stage" style={{ paddingTop: 90 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div className="phone" style={{ height: 820 }}>
          <div className="phone-screen" style={{ background: "var(--ink-50)" }}>
            <IOSStatusBar />
            <MAdminHeader title={titles[page]} role={role} page={page}
              onMenu={() => setDrawer(true)}
              accent={accent}
              onNewSaida={() => setOpenSaida(true)}
            />
            <div style={{ flex: 1, overflow: "auto", overflowX: "hidden", background: "var(--ink-50)" }}>
              {page === "grade"        && <MGrade        accent={accent} onSlotTap={setEditingSlot}/>}
              {page === "alunos"       && <MAlunos       accent={accent} onSelect={setSelectedStudent}/>}
              {page === "recebimentos" && <MRecebimentos accent={accent} role={role} onConfirm={setConfirming}/>}
              {page === "caixa"        && canAccess("caixa")      && <MCaixa      accent={accent} onNewSaida={() => setOpenSaida(true)}/>}
              {page === "relatorios"   && canAccess("relatorios") && <MRelatorios accent={accent}/>}
              {page === "mais"         && <MMais role={role} onNav={tryNav} accent={accent} showToast={showToast}/>}
            </div>
            <MBottomNav page={page} role={role} onNav={tryNav}/>

            {/* Drawer (slide-down sheet from top showing identity + role + nav) */}
            {drawer && <MDrawer onClose={() => setDrawer(false)} role={role} onRoleChange={setRole}/>}

            {/* Slot editor (encaixar / mover / remover) */}
            {editingSlot && (
              <MSlotEditor slot={editingSlot} accent={accent} onClose={() => setEditingSlot(null)}
                onAction={(msg) => { setEditingSlot(null); showToast(msg); }}/>
            )}

            {/* Student sheet */}
            <MStudentSheet open={!!selectedStudent} student={selectedStudent}
              onClose={() => setSelectedStudent(null)} accent={accent} showToast={showToast}/>

            {/* Baixa modal */}
            <MBaixaModal open={!!confirming} entry={confirming} accent={accent}
              onClose={() => setConfirming(null)}
              onConfirm={(forma) => { const a = confirming.aluno; setConfirming(null); showToast(`${a}: pagamento confirmado via ${forma}`); }}/>

            {/* Nova saída */}
            <MNovaSaidaModal open={openSaida} accent={accent}
              onClose={() => setOpenSaida(false)}
              onSave={() => { setOpenSaida(false); showToast("Saída registrada no livro caixa"); }}/>

            {/* Locked attempt */}
            <MLockedModal open={!!lockedAttempt} item={lockedAttempt} accent={accent}
              onClose={() => setLockedAttempt(null)}/>

            {toast}
          </div>
        </div>

        {/* Helper hint below phone */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px",
          background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 999,
          fontSize: 11.5, color: "var(--ink-500)",
        }}>
          <span>Perfil ativo:</span>
          <div style={{ display: "flex", gap: 2, background: "var(--ink-50)", padding: 2, borderRadius: 999 }}>
            {[["recepcionista","Recepção"],["dona","Dona"]].map(([id, l]) => (
              <button key={id} onClick={() => setRole(id)} style={{
                border: 0, padding: "4px 12px", borderRadius: 999, fontFamily: "inherit",
                fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: role === id ? "var(--green-800)" : "transparent",
                color: role === id ? "#fff" : "var(--ink-700)",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HEADER
// ============================================================
const MAdminHeader = ({ title, role, page, onMenu, accent, onNewSaida }) => {
  const dateStr = "Ter, 26/05";
  const isDona = role === "dona";
  return (
    <div style={{
      padding: "6px 16px 12px",
      background: "#fff",
      borderBottom: "1px solid var(--ink-100)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <button onClick={onMenu} aria-label="Menu" style={{
          width: 36, height: 36, borderRadius: 10, background: "var(--ink-50)", border: 0,
          display: "grid", placeItems: "center", cursor: "pointer",
        }}>
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="var(--ink-900)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 2h14M1 7h14M1 12h10"/>
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <div style={{ fontSize: 9.5, color: "var(--ink-500)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500 }}>
            {dateStr}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginTop: 1, letterSpacing: "-.01em" }}>{title}</div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 999,
          background: isDona ? "var(--green-800)" : "var(--ink-50)",
          color: isDona ? "#fff" : "var(--ink-700)",
          fontSize: 11, fontWeight: 500,
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 999,
            background: isDona ? "var(--teal-200)" : "#fff",
            color: "var(--green-900)", display: "grid", placeItems: "center",
            fontSize: 9, fontWeight: 700,
          }}>{isDona ? "FP" : "R"}</span>
          {isDona ? "Dona" : "Recep."}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// BOTTOM NAV
// ============================================================
const MBottomNav = ({ page, role, onNav }) => {
  const items = [
    { id: "grade",        icon: "calendar", label: "Grade" },
    { id: "alunos",       icon: "users",    label: "Alunos" },
    { id: "recebimentos", icon: "cash",     label: "Receber" },
    { id: "mais",         icon: "menu",     label: "Mais" },
  ];
  return (
    <nav style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      borderTop: "1px solid var(--ink-100)", background: "#fff",
      paddingBottom: 6,
    }}>
      {items.map(it => {
        const active = page === it.id ||
          (it.id === "mais" && (page === "caixa" || page === "relatorios"));
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "9px 0 6px", background: "transparent", border: 0, cursor: "pointer",
            color: active ? "var(--green-800)" : "var(--ink-500)", fontFamily: "inherit",
          }}>
            {it.icon === "menu"
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6} strokeLinecap="round"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>
              : <Icon name={it.icon} size={20} stroke={active ? 2 : 1.6}/>}
            <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500, letterSpacing: ".01em" }}>{it.label}</span>
            {active && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--green-800)", marginTop: 1 }}/>}
          </button>
        );
      })}
    </nav>
  );
};

// ============================================================
// DRAWER (top sheet) — identity, role switch, full nav
// ============================================================
const MDrawer = ({ onClose, role, onRoleChange }) => {
  const isDona = role === "dona";
  return (
    <div className="overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", left: 0, right: 0, top: 0,
        background: "#fff", borderRadius: "0 0 22px 22px",
        padding: "16px 18px 22px",
        animation: "drawerDown .25s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ink-200)" }}/>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999,
            background: isDona ? "var(--teal-200)" : "var(--ink-100)",
            color: "var(--green-900)", display: "grid", placeItems: "center",
            fontWeight: 600, fontSize: 14,
          }}>{isDona ? "FP" : "R"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{isDona ? "Flávia Prudêncio" : "Recepção"}</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>
              {isDona ? "Administradora · acesso total" : "Operação · acesso parcial"}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 32, height: 32,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>

        <div style={{ marginTop: 18, padding: 12, background: "var(--ink-50)", borderRadius: 12 }}>
          <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
            Visualizar como (demo)
          </div>
          <div style={{ display: "flex", gap: 4, background: "#fff", padding: 4, borderRadius: 8 }}>
            {[["recepcionista","Recepção"],["dona","Dona"]].map(([id, l]) => (
              <button key={id} onClick={() => onRoleChange(id)} style={{
                flex: 1, padding: "8px 0", border: 0, borderRadius: 6,
                background: role === id ? "var(--green-800)" : "transparent",
                color: role === id ? "#fff" : "var(--ink-700)",
                fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 10, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500, paddingLeft: 6 }}>
          Atalhos
        </div>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
          <DrawerLink icon="settings" label="Configurações do estúdio" />
          <DrawerLink icon="info" label="Ajuda" />
          <DrawerLink icon="logout" label="Sair" danger/>
        </div>
      </div>
      <style>{`@keyframes drawerDown{from{transform:translateY(-40px);opacity:.4}to{transform:none;opacity:1}}`}</style>
    </div>
  );
};
const DrawerLink = ({ icon, label, danger }) => (
  <button style={{
    display: "flex", alignItems: "center", gap: 12, padding: "12px 8px",
    border: 0, background: "transparent", borderRadius: 8, cursor: "pointer",
    fontFamily: "inherit", fontSize: 13.5, color: danger ? "var(--danger)" : "var(--ink-900)",
    textAlign: "left",
  }}>
    <Icon name={icon} size={17} color={danger ? "var(--danger)" : "var(--ink-700)"}/>
    <span style={{ flex: 1 }}>{label}</span>
    <Icon name="chev_right" size={14} color="var(--ink-300)"/>
  </button>
);

// ============================================================
// GRADE DIÁRIA — mobile
// ============================================================
const MGrade = ({ accent, onSlotTap }) => {
  const [day, setDay] = useState("hoje"); // ontem | hoje | amanha
  const data = useMemo(() => window.getScheduleForDay ? window.getScheduleForDay(day) : M_DATA, [day]);
  const totalAulas = M_HOURS.length;
  const totalAlunos = M_HOURS.reduce((acc, h) => acc + data[h].filter(s => s.type !== "free" && s.type !== "block").length, 0);
  const totalLivres = M_HOURS.reduce((acc, h) => acc + data[h].filter(s => s.type === "free").length, 0);

  return (
    <div style={{ padding: "12px 12px 90px" }}>
      {/* Day strip */}
      <div style={{ display: "flex", gap: 6, background: "#fff", padding: 4, borderRadius: 12, border: "1px solid var(--ink-100)" }}>
        {[["ontem","Ontem","25/05"],["hoje","Hoje","26/05"],["amanha","Amanhã","27/05"]].map(([id, l, d]) => (
          <button key={id} onClick={() => setDay(id)} style={{
            flex: 1, padding: "9px 0 8px", border: 0, borderRadius: 9,
            background: day === id ? "var(--green-800)" : "transparent",
            color: day === id ? "#fff" : "var(--ink-700)",
            fontFamily: "inherit", cursor: "pointer",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{l}</div>
            <div style={{ fontSize: 10, marginTop: 1, opacity: .7 }} className="num">{d}</div>
          </button>
        ))}
      </div>

      {/* Stats — 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        <MStatTile label="Aulas hoje"    value={totalAulas}  icon="calendar" color={accent}/>
        <MStatTile label="Alunos"        value={totalAlunos} icon="users"    color={accent}/>
        <MStatTile label="Vagas livres"  value={totalLivres} icon="plus"     color="var(--green-700)"/>
        <MStatTile label="Faltas hoje"   value={2}           icon="info"     color="var(--warn)"/>
      </div>

      {/* Legend (horizontal scroll) */}
      <div style={{
        display: "flex", gap: 14, marginTop: 16, padding: "10px 12px",
        background: "#fff", borderRadius: 12, border: "1px solid var(--ink-100)",
        overflowX: "auto", WebkitOverflowScrolling: "touch",
      }}>
        {[
          ["#EAF4E6","#5C9684","Livre"],
          ["#E1ECF7","#4E81B7","Fixo"],
          ["#FFF1C9","#D9A300","Reposição"],
          ["#F2DAFA","#8E3FAF","Fisio"],
        ].map(([bg, br, l]) => (
          <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-700)", whiteSpace: "nowrap" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: bg, border: `1.5px solid ${br}` }}/>
            {l}
          </span>
        ))}
      </div>

      {/* Almoço break splits morning/afternoon */}
      <SectionLabel>Manhã · 07h–11h</SectionLabel>
      {M_HOURS.slice(0, 5).map(h => (
        <MHourCard key={h} hour={h} slots={data[h]} onSlotTap={onSlotTap} accent={accent}/>
      ))}

      {/* Break */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 4px",
        color: "var(--ink-500)", fontSize: 11,
      }}>
        <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }}/>
        <span style={{ letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
          Almoço · 11h às 15h
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }}/>
      </div>

      <SectionLabel>Tarde / Noite · 15h–22h</SectionLabel>
      {M_HOURS.slice(5).map(h => (
        <MHourCard key={h} hour={h} slots={data[h]} onSlotTap={onSlotTap} accent={accent}/>
      ))}

      <div style={{ height: 12 }}/>
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, color: "var(--ink-500)", letterSpacing: ".14em", textTransform: "uppercase",
    fontWeight: 500, padding: "16px 4px 8px",
  }}>{children}</div>
);

const MStatTile = ({ label, value, icon, color }) => (
  <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: "12px 13px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>{label}</span>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--teal-50)", color, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={12}/>
      </div>
    </div>
    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{value}</div>
  </div>
);

const MHourCard = ({ hour, slots, onSlotTap, accent }) => {
  const ocup = slots.filter(s => s.type !== "free" && s.type !== "block").length;
  const free = slots.filter(s => s.type === "free").length;
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 14,
      padding: "12px 12px 8px", marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{hour}h</span>
          <span style={{ fontSize: 11, color: "var(--ink-500)" }} className="num">— {(Number(hour)+1).toString().padStart(2,"0")}h</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} style={{
                width: 8, height: 14, borderRadius: 2,
                background: i < ocup ? "var(--green-700)" : "var(--ink-100)",
              }}/>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-500)" }}>
            {ocup}/4{free ? ` · ${free} livre${free>1?"s":""}` : ""}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {slots.map((s, i) => (
          <MSlotRow key={i} slot={s} idx={i}
            onClick={() => s.type !== "block" && onSlotTap({ ...s, hour, idx: i })}/>
        ))}
      </div>
    </div>
  );
};

const MSlotRow = ({ slot, idx, onClick }) => {
  const s = M_SLOT_STYLES[slot.type];
  const isFree = slot.type === "free";
  const isBlock = slot.type === "block";
  return (
    <button onClick={onClick} disabled={isBlock} style={{
      display: "flex", alignItems: "center", gap: 10,
      background: s.bg, border: `1.5px ${isFree ? "dashed" : "solid"} ${s.border}`,
      borderLeft: `4px solid ${s.border}`,
      borderRadius: 10, padding: "9px 10px",
      cursor: isBlock ? "not-allowed" : "pointer",
      fontFamily: "inherit", textAlign: "left", width: "100%",
    }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: s.label, width: 18 }} className="num">{idx + 1}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {isFree ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: s.label, fontSize: 12.5, fontWeight: 500 }}>
            <Icon name="plus" size={13} color={s.label}/> Encaixar aluno
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: s.text, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {slot.name}
            </div>
            {slot.plano && (
              <div style={{ fontSize: 10.5, color: s.label, marginTop: 1 }}>{slot.plano}</div>
            )}
          </>
        )}
      </div>
      <span style={{
        fontSize: 9, fontWeight: 600, color: s.label,
        letterSpacing: ".08em", textTransform: "uppercase",
        padding: "3px 8px", borderRadius: 999,
        background: "rgba(255,255,255,.5)",
      }}>{s.tag}</span>
    </button>
  );
};

// Slot editor — bottom sheet
const MSlotEditor = ({ slot, onClose, accent, onAction }) => {
  const isFree = slot.type === "free";
  return (
    <div className="overlay side-sheet" onClick={onClose}>
      <div className="side-sheet-body" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ink-200)" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span style={{ fontSize: 10, color: accent, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>
              {slot.hour}h · Vaga {slot.idx + 1}
            </span>
            <h3 style={{ fontSize: 18, marginTop: 4 }}>{isFree ? "Encaixar aluno" : slot.name}</h3>
            {slot.plano && <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>{slot.plano}</div>}
          </div>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 30, height: 30,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        {isFree ? (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="field">
              <label>Buscar aluno</label>
              <input placeholder="Digite o nome do aluno"/>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Fixa","Reposição","Fisio"].map(l => (
                <button key={l} className="btn btn-soft btn-sm" style={{ flex: 1, padding: "8px 0" }}>{l}</button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ background: accent, marginTop: 6 }}
              onClick={() => onAction("Aluno encaixado no horário")}>
              Confirmar encaixe
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              fontSize: 11.5, color: "var(--ink-500)", padding: "10px 12px",
              background: "var(--ink-50)", borderRadius: 8, lineHeight: 1.4,
              display: "flex", gap: 8, alignItems: "start",
            }}>
              <Icon name="info" size={13} color="var(--ink-500)"/>
              <span>O aluno fica como <b style={{ color: "var(--green-700)" }}>presente</b> por padrão. Use abaixo apenas em casos de exceção.</span>
            </div>
            <button className="btn btn-ghost" onClick={() => onAction("Use o desktop para reagendar")}>Mover / Reagendar</button>
            <button className="btn btn-ghost" onClick={() => onAction(`Abrindo a ficha de ${slot.name}`)}>Ver ficha do aluno</button>
            <button className="btn btn-danger" onClick={() => onAction(`Falta registrada para ${slot.name}`)}>
              <Icon name="hand_off" size={14}/> Marcar falta
            </button>
            <button className="btn btn-danger" onClick={() => onAction("Aula removida deste horário")}>Remover</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ALUNOS — mobile
// ============================================================
const MAlunos = ({ accent, onSelect }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("todos");
  const filtered = M_STUDENTS.filter(s => {
    if (filter !== "todos" && s.situacao !== filter) return false;
    if (q && !s.nome.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <div style={{ padding: "12px 12px 90px" }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <Icon name="search" size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--ink-500)" }}/>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno…" style={{
          width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12,
          border: "1px solid var(--ink-100)", fontSize: 13, fontFamily: "inherit", background: "#fff",
        }}/>
      </div>
      {/* Filter chips */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
        {[["todos","Todos",M_STUDENTS.length],["em-dia","Em dia",M_STUDENTS.filter(s=>s.situacao==="em-dia").length],["pendente","Pendentes",M_STUDENTS.filter(s=>s.situacao==="pendente").length],["inativo","Inativos",M_STUDENTS.filter(s=>s.situacao==="inativo").length]].map(([id, l, n]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 12px", borderRadius: 999, border: 0, cursor: "pointer", fontFamily: "inherit",
            fontSize: 11.5, fontWeight: 500, whiteSpace: "nowrap",
            background: filter === id ? "var(--green-800)" : "#fff",
            color: filter === id ? "#fff" : "var(--ink-700)",
            boxShadow: filter === id ? "none" : "inset 0 0 0 1px var(--ink-100)",
          }}>
            {l}
            <span style={{
              fontSize: 10, fontWeight: 600,
              background: filter === id ? "rgba(255,255,255,.2)" : "var(--ink-50)",
              padding: "1px 6px", borderRadius: 999,
            }} className="num">{n}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(s => (
          <button key={s.id} onClick={() => onSelect(s)} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12,
            padding: "12px 12px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 999, background: "var(--teal-100)",
              color: accent, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>{s.nome.split(" ").map(p => p[0]).slice(0,2).join("")}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.nome}
                </span>
                <StatusPill status={s.situacao}/>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 11, color: "var(--ink-500)", flexWrap: "wrap" }}>
                <span>{s.plano}</span>
                <span>·</span>
                <span className="num">{s.prox}</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 10.5, color: "var(--ink-500)" }}>
                <span>Faltas <b style={{ color: s.faltas > 1 ? "var(--warn)" : "var(--ink-700)" }} className="num">{s.faltas}</b></span>
                <span>Reposições <b style={{ color: "var(--ink-700)" }} className="num">{s.reposicoes}</b></span>
              </div>
            </div>
            <Icon name="chev_right" size={14} color="var(--ink-300)"/>
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-500)", fontSize: 13 }}>
            Nenhum aluno encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

// Student bottom sheet
const MStudentSheet = ({ open, student, onClose, accent, showToast }) => {
  const [tab, setTab] = useState("ficha");
  useEffect(() => { if (open) setTab("ficha"); }, [open, student?.id]);
  if (!open || !student) return null;
  return (
    <div className="overlay side-sheet" onClick={onClose}>
      <div className="side-sheet-body" onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", padding: "16px 18px 22px", maxHeight: "92%",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ink-200)" }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 999, background: "var(--teal-200)",
            color: accent, display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14,
          }}>{student.nome.split(" ").map(p => p[0]).slice(0,2).join("")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{student.nome}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <StatusPill status={student.situacao}/>
              <span className="chip chip-teal" style={{ fontSize: 10.5 }}>{student.plano}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 30, height: 30,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 14, background: "var(--ink-50)", padding: 4, borderRadius: 10 }}>
          {[["ficha","Ficha"],["anamnese","Anamnese"],["historico","Histórico"],["anexos","Anexos"]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "7px 0", border: 0, borderRadius: 7,
              background: tab === id ? "#fff" : "transparent",
              boxShadow: tab === id ? "0 1px 3px rgba(0,0,0,.05)" : "none",
              color: tab === id ? accent : "var(--ink-700)",
              fontFamily: "inherit", fontSize: 11.5, fontWeight: 500, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>

        <div style={{ marginTop: 14, overflowY: "auto", maxHeight: 420 }}>
          {tab === "ficha" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <MFichaRow label="CPF" v={student.cpf} mono/>
              <MFichaRow label="Telefone" v={student.tel} mono/>
              <MFichaRow label="Endereço" v={student.endereco}/>
              <MFichaRow label="Início do plano" v={student.inicio} mono/>
              <MFichaRow label="Término do plano" v={student.fim} mono/>
              <button className="btn btn-soft btn-sm" style={{ marginTop: 4 }} onClick={() => showToast("Abrindo ficha completa")}>
                <Icon name="file" size={13}/> Ver ficha completa
              </button>
            </div>
          )}
          {tab === "anamnese" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <MAnaRow label="Queixa principal" v="Dor lombar ao final do dia."/>
              <MAnaRow label="Nível de dor (0-10)" v={<><b style={{ fontSize: 16 }}>4</b> <span style={{ fontSize: 11, color: accent, marginLeft: 6 }}>Moderada</span></>}/>
              <MAnaRow label="Local da dor" v="Lombar baixa, lado direito"/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <MAnaRow label="Hipertensão" v="Não"/>
                <MAnaRow label="Diabetes" v="Não"/>
              </div>
              <MAnaRow label="Postura no trabalho" v="Sentada (8h/dia)"/>
            </div>
          )}
          {tab === "historico" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["22/05","Aula realizada · 17h", false],
                ["20/05","Aula realizada · 17h", false],
                ["15/05","Falta justificada (atestado)", true],
                ["13/05","Aula realizada · 17h", false],
                ["10/05","Reposição utilizada · 09h", false],
              ].map(([d, w, warn], i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                  borderRadius: 10, background: warn ? "#FFFAEC" : "var(--ink-50)",
                }}>
                  <span style={{ fontSize: 10.5, color: "var(--ink-500)", width: 44 }} className="num">{d}</span>
                  <span style={{ fontSize: 12, color: warn ? "#7A5A0A" : "var(--ink-900)" }}>{w}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "anexos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["RX-coluna-jan.pdf","Atestado-22-04.pdf","Foto-postural.jpg"].map((n, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 12.5,
                }}>
                  <Icon name="file" size={15} color={accent}/>
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
                  <span style={{ fontSize: 10, color: "var(--ink-500)" }}>{["12/01","22/04","15/02"][i]}</span>
                </div>
              ))}
              <button className="btn btn-soft btn-sm" style={{ marginTop: 6 }} onClick={() => showToast("Use o desktop para anexar arquivos")}>
                <Icon name="plus" size={13}/> Anexar novo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MFichaRow = ({ label, v, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--ink-100)" }}>
    <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{label}</span>
    <span style={{ fontSize: 12.5, color: "var(--ink-900)", fontFamily: mono ? "'JetBrains Mono'" : "inherit", textAlign: "right" }}>{v}</span>
  </div>
);
const MAnaRow = ({ label, v }) => (
  <div style={{ padding: 12, background: "var(--teal-50)", borderRadius: 10 }}>
    <div style={{ fontSize: 10, color: "var(--green-700)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 12.5, marginTop: 4, color: "var(--ink-900)", lineHeight: 1.4 }}>{v}</div>
  </div>
);

// ============================================================
// RECEBIMENTOS — mobile
// ============================================================
const MRecebimentos = ({ accent, role, onConfirm }) => {
  const [filter, setFilter] = useState("todos");
  const [q, setQ] = useState("");
  const filtered = M_ENT.filter(e => {
    if (filter === "pendente" && e.status !== "pendente") return false;
    if (filter === "baixado"  && e.status !== "baixado")  return false;
    if (q && !e.aluno.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totalE = M_ENT.filter(e => e.status === "baixado").reduce((a, e) => a + e.valor, 0);
  const totalP = M_ENT.filter(e => e.status !== "baixado").reduce((a, e) => a + e.valor, 0);

  return (
    <div style={{ padding: "12px 12px 90px" }}>
      {/* KPI horizontal */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        <MFinTile label="Recebido no mês" value={formatBRL(totalE)} color={accent} delta={`${M_ENT.filter(e=>e.status==="baixado").length} pagos`}/>
        <MFinTile label="Pendente"         value={formatBRL(totalP)} color="var(--warn)" delta={`${M_ENT.filter(e=>e.status==="pendente").length} alunos`}/>
        <MFinTile label="Hoje"             value={formatBRL(220)}    color="var(--green-700)" delta="1 via PIX"/>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginTop: 12 }}>
        <Icon name="search" size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--ink-500)" }}/>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno…" style={{
          width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12,
          border: "1px solid var(--ink-100)", fontSize: 13, fontFamily: "inherit", background: "#fff",
        }}/>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {[["todos","Todos"],["pendente","Pendentes"],["baixado","Baixados"]].map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            flex: 1, padding: "8px 0", border: 0, borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
            fontSize: 12, fontWeight: 500,
            background: filter === id ? "var(--green-800)" : "#fff",
            color: filter === id ? "#fff" : "var(--ink-700)",
            boxShadow: filter === id ? "none" : "inset 0 0 0 1px var(--ink-100)",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(e => (
          <div key={e.id} style={{
            background: e.status === "pendente" ? "#FFFCF3" : "#fff",
            border: `1px solid ${e.status === "pendente" ? "#F3E4B5" : "var(--ink-100)"}`,
            borderRadius: 12, padding: "12px 12px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.aluno}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{e.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--green-900)", whiteSpace: "nowrap" }} className="num">{formatBRL(e.valor)}</div>
                <div style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}>{e.forma}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--ink-100)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusPill status={e.status}/>
                <span style={{ fontSize: 10.5, color: "var(--ink-500)" }} className="num">{e.data}</span>
              </div>
              {e.status === "pendente"
                ? <button onClick={() => onConfirm(e)} className="btn btn-sm" style={{
                    background: accent, color: "#fff", padding: "7px 14px", fontSize: 11.5,
                  }}>
                    <Icon name="check" size={12} stroke={2.4}/> Dar baixa
                  </button>
                : <span style={{ fontSize: 10.5, color: "var(--green-700)", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                    <Icon name="check" size={11} color="var(--green-700)"/> Confirmado
                  </span>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-500)", fontSize: 13 }}>
            Nenhum pagamento encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

const MFinTile = ({ label, value, delta, color }) => (
  <div style={{
    background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12,
    padding: "12px 14px", minWidth: 145, flexShrink: 0,
  }}>
    <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, color: "var(--green-900)", letterSpacing: "-.02em", whiteSpace: "nowrap" }} className="num">{value}</div>
    <div style={{ fontSize: 10.5, color, marginTop: 4, fontWeight: 500 }}>{delta}</div>
  </div>
);

// Baixa modal
const MBaixaModal = ({ open, entry, onClose, onConfirm, accent }) => {
  const [forma, setForma] = useState("PIX");
  const [comprov, setComprov] = useState(null);
  useEffect(() => { if (open) { setForma("PIX"); setComprov(null); } }, [open]);
  if (!open || !entry) return null;
  return (
    <div className="overlay side-sheet" onClick={onClose}>
      <div className="side-sheet-body" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "16px 18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ink-200)" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span style={{ fontSize: 10, color: accent, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>Confirmar pagamento</span>
            <h3 style={{ fontSize: 17, marginTop: 4 }}>{entry.aluno}</h3>
            <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }}>{entry.desc}</div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 30, height: 30,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        <div style={{
          background: "var(--teal-50)", borderRadius: 12, padding: "14px 16px", marginTop: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-700)" }}>Valor</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: accent }} className="num">{formatBRL(entry.valor)}</span>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-700)", display: "block", marginBottom: 8 }}>Forma de pagamento</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
            {["PIX","Dinheiro","Cartão","Outro"].map(f => (
              <button key={f} onClick={() => setForma(f)} style={{
                padding: "10px 0", border: `1.5px solid ${forma === f ? accent : "var(--ink-200)"}`,
                background: forma === f ? "var(--teal-100)" : "#fff",
                color: forma === f ? accent : "var(--ink-700)",
                borderRadius: 10, fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-700)", display: "block", marginBottom: 8 }}>
            Comprovante <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>(opcional)</span>
          </label>
          <DropZone file={comprov} onFile={setComprov} label="Foto do comprovante PIX ou nota da maquininha"/>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-sm" style={{ flex: 1.4, background: accent, color: "#fff" }} onClick={() => onConfirm(forma)}>
            <Icon name="check" size={13} stroke={2.5}/> Confirmar baixa
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CAIXA & DESPESAS — mobile (dona only)
// ============================================================
const MCaixa = ({ accent, onNewSaida }) => {
  const totalE = M_ENT.filter(e => e.status === "baixado").reduce((a, e) => a + e.valor, 0);
  const totalS = M_SAI.reduce((a, e) => a + e.valor, 0);
  const totalP = M_ENT.filter(e => e.status !== "baixado").reduce((a, e) => a + e.valor, 0);
  return (
    <div style={{ padding: "12px 12px 90px" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", background: "var(--green-900)", color: "#fff",
        borderRadius: 999, fontSize: 10.5, fontWeight: 500,
      }}>
        <MLockGlyph size={10}/> Restrito · Dona
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <MFinKpi label="Entradas"      value={formatBRL(totalE)} delta="+12%" color={accent}/>
        <MFinKpi label="Saídas"        value={formatBRL(totalS)} delta="−4%"  color="var(--danger)"/>
        <MFinKpi label="Saldo"         value={formatBRL(totalE - totalS)} delta="+18%" color="var(--green-700)"/>
        <MFinKpi label="Inadimplência" value={formatBRL(totalP)} delta="2 alunos" color="var(--warn)"/>
      </div>

      <SectionLabel>Faturamento · últimos 6 meses</SectionLabel>
      <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", gap: 12, fontSize: 10.5, marginBottom: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-700)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: accent }}/> Entradas
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ink-700)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--danger)" }}/> Saídas
          </span>
        </div>
        <MFatChart accent={accent}/>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <div style={{ flex: 1, background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Retenção</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: accent, marginTop: 2 }} className="num">
            {M_GER.retencao[M_GER.retencao.length-1].pct}%
          </div>
          <MSparkline data={M_GER.retencao.map(d => d.pct)} color={accent}/>
        </div>
        <div style={{ flex: 1, background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Inadimplência</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--warn)", marginTop: 2 }} className="num">
            {formatBRL(490)}
          </div>
          <MSparkline data={M_GER.inadimplencia.map(d => d.valor)} color="var(--warn)"/>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500 }}>Saídas do mês</div>
        <button className="btn btn-sm" style={{ background: accent, color: "#fff", padding: "6px 12px", fontSize: 11.5 }} onClick={onNewSaida}>
          <Icon name="plus" size={12}/> Nova
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {M_SAI.map(s => (
          <div key={s.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 10, padding: "10px 12px",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)" }}>{s.desc}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 3, fontSize: 10.5, color: "var(--ink-500)" }}>
                <span className="num">{s.data}</span>
                <span>·</span>
                <span>{s.categoria}</span>
              </div>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--danger)" }} className="num">−{formatBRL(s.valor)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MFinKpi = ({ label, value, delta, color }) => (
  <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: "12px 13px" }}>
    <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, color: "var(--green-900)", whiteSpace: "nowrap" }} className="num">{value}</div>
    <div style={{ fontSize: 10.5, color, marginTop: 3, fontWeight: 500 }}>{delta}</div>
  </div>
);

const MFatChart = ({ accent }) => {
  const data = M_GER.faturamento;
  const max = Math.max(...data.map(d => Math.max(d.entrada, d.saida)));
  return (
    <div style={{ height: 140, display: "flex", alignItems: "flex-end", gap: 10, paddingBottom: 18, position: "relative" }}>
      {data.map((d, i) => {
        const he = (d.entrada / max) * 110;
        const hs = (d.saida   / max) * 110;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 115, width: "100%", justifyContent: "center" }}>
              <div style={{ width: "42%", height: Math.max(he, 3), background: accent, borderRadius: "4px 4px 0 0" }}/>
              <div style={{ width: "42%", height: Math.max(hs, 3), background: "var(--danger)", opacity: .85, borderRadius: "4px 4px 0 0" }}/>
            </div>
            <span style={{ position: "absolute", bottom: -16, fontSize: 9.5, color: "var(--ink-500)" }}>{d.mes}</span>
          </div>
        );
      })}
    </div>
  );
};

const MSparkline = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return (
    <svg viewBox="0 0 100 30" style={{ width: "100%", height: 30, marginTop: 4 }} preserveAspectRatio="none">
      <path d={data.map((v, i) => {
        const x = (i / (data.length-1)) * 100;
        const y = 28 - ((v - min) / range) * 24;
        return `${i ? "L" : "M"}${x} ${y}`;
      }).join(" ")} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// Nova Saída modal
const MNovaSaidaModal = ({ open, onClose, onSave, accent }) => {
  const [form, setForm] = useState({ desc: "", categoria: "", valor: "", data: "" });
  if (!open) return null;
  return (
    <div className="overlay side-sheet" onClick={onClose}>
      <div className="side-sheet-body" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "16px 18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--ink-200)" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 17 }}>Nova saída</h3>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 30, height: 30,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <div className="field">
            <label>Descrição</label>
            <input value={form.desc} onChange={(e) => setForm(f => ({...f, desc: e.target.value}))} placeholder="Ex: Conta de luz"/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div className="field">
              <label>Valor</label>
              <input value={form.valor} onChange={(e) => setForm(f => ({...f, valor: e.target.value}))} placeholder="0,00"/>
            </div>
            <div className="field">
              <label>Data</label>
              <input value={form.data} onChange={(e) => setForm(f => ({...f, data: e.target.value}))} placeholder="dd/mm"/>
            </div>
          </div>
          <div className="field">
            <label>Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm(f => ({...f, categoria: e.target.value}))}>
              <option value="">Selecione…</option>
              <option>Aluguel</option><option>Utilidades</option>
              <option>Materiais</option><option>Manutenção</option><option>Outros</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ background: accent, marginTop: 6 }} onClick={onSave}>
            Salvar saída
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// RELATÓRIOS — mobile (dona only)
// ============================================================
const MRelatorios = ({ accent }) => (
  <div style={{ padding: "12px 12px 90px" }}>
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", background: "var(--green-900)", color: "#fff",
      borderRadius: 999, fontSize: 10.5, fontWeight: 500,
    }}>
      <MLockGlyph size={10}/> Restrito · Dona
    </div>
    <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 10 }}>Maio · atualizado hoje às 09:14</div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
      <MFinKpi label="Aulas dadas"        value="294" delta="+9%"  color="var(--green-700)"/>
      <MFinKpi label="Faltas"             value="22"  delta="−18%" color="var(--green-700)"/>
      <MFinKpi label="Reposições"         value="34"  delta="+12%" color={accent}/>
      <MFinKpi label="Avaliações"         value="11"  delta="+1"   color={accent}/>
    </div>

    <SectionLabel>Horários de pico</SectionLabel>
    <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
      <MBarChart data={M_REL.horariosPico} keyX="h" keyY="qtd" accent={accent} highlightMax/>
    </div>

    <SectionLabel>Alunos que pararam</SectionLabel>
    <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
      <MBarChart data={M_REL.pararam} keyX="mes" keyY="qtd" accent="var(--danger)"/>
    </div>

    <SectionLabel>Aulas dadas / mês</SectionLabel>
    <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, padding: 14 }}>
      <MBarChart data={M_REL.aulasDadas} keyX="mes" keyY="qtd" accent={accent}/>
    </div>

    <div style={{
      background: "var(--green-900)", color: "#fff", borderRadius: 12,
      padding: 16, marginTop: 14,
    }}>
      <div style={{ fontSize: 11.5, color: "var(--teal-200)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500 }}>
        Insight do mês
      </div>
      <p style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.5, color: "rgba(255,255,255,.85)" }}>
        18h é o horário mais cheio (24 alunos na semana). Considere abrir um horário extra às terças e quintas.
      </p>
    </div>
  </div>
);

const MBarChart = ({ data, keyX, keyY, accent, highlightMax }) => {
  const max = Math.max(...data.map(d => d[keyY]));
  return (
    <div style={{ height: 140, display: "flex", alignItems: "flex-end", gap: 6, paddingBottom: 18, position: "relative" }}>
      {data.map((d, i) => {
        const h = (d[keyY] / max) * 110;
        const isMax = highlightMax && d[keyY] === max;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "var(--ink-700)" }} className="num">{d[keyY]}</div>
            <div style={{
              width: "78%", height: Math.max(h, 3), borderRadius: 4,
              background: isMax ? accent : `${accent}33`,
              border: isMax ? "none" : `1px solid ${accent}55`,
            }}/>
            <span style={{ position: "absolute", bottom: -16, fontSize: 9, color: "var(--ink-500)" }}>{d[keyX]}</span>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// MAIS — mobile (settings / restricted entries / role)
// ============================================================
const MMais = ({ role, onNav, accent, showToast }) => {
  const isDona = role === "dona";
  return (
    <div style={{ padding: "14px 12px 90px" }}>
      {isDona && (
        <>
          <SectionLabel>Gestão</SectionLabel>
          <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden" }}>
            <MMaisRow icon="cash"  label="Caixa & Despesas" desc="Livro caixa completo, saídas, gráficos"      onClick={() => onNav("caixa")}/>
            <MMaisRow icon="chart" label="Relatórios"       desc="Horários de pico, retenção, KPIs"           onClick={() => onNav("relatorios")} divider/>
            <MMaisRow icon="users" label="Funcionários"     desc="Adicionar / remover acessos da recepção"
              onClick={() => showToast?.("Abrindo gestão de funcionários…")} divider/>
          </div>
        </>
      )}

      <SectionLabel>Operação</SectionLabel>
      <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden" }}>
        <MMaisRow icon="calendar" label="Grade diária"  desc="Aulas e encaixes do dia"               onClick={() => onNav("grade")}/>
        <MMaisRow icon="users"    label="Alunos"        desc="Ficha, anamnese, histórico"            onClick={() => onNav("alunos")} divider/>
        <MMaisRow icon="cash"     label="Recebimentos"  desc="Pagamentos do balcão"                  onClick={() => onNav("recebimentos")} divider/>
      </div>

      <SectionLabel>Conta</SectionLabel>
      <div style={{ background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden" }}>
        <MMaisRow icon="settings" label="Configurações do estúdio"/>
        <MMaisRow icon="info"     label="Ajuda" divider/>
        <MMaisRow icon="logout"   label="Sair" danger divider/>
      </div>

      <div style={{
        marginTop: 18, padding: 14, background: "#fff", border: "1px solid var(--ink-100)",
        borderRadius: 12, textAlign: "center",
      }}>
        <StudioLogo size="sm" variant="dark"/>
        <div style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 8 }}>
          Versão 1.0 · v25.05
        </div>
      </div>
    </div>
  );
};

const MMaisRow = ({ icon, label, desc, locked, danger, divider, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 12, width: "100%",
    background: "transparent", border: 0,
    borderTop: divider ? "1px solid var(--ink-100)" : "none",
    padding: "13px 14px", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: locked ? "#FBEFC9" : (danger ? "rgba(193,59,59,.08)" : "var(--teal-50)"),
      color: locked ? "var(--warn)" : (danger ? "var(--danger)" : "var(--green-700)"),
      display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <Icon name={icon} size={16}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: danger ? "var(--danger)" : "var(--ink-900)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {label}
        {locked && <MLockGlyph size={11} color="var(--warn)"/>}
      </div>
      {desc && <div style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 2 }}>{desc}</div>}
    </div>
    <Icon name="chev_right" size={14} color="var(--ink-300)"/>
  </button>
);

// Locked modal (when recep taps restricted)
const MLockedModal = ({ open, item, onClose, accent }) => {
  const labels = { caixa: "Caixa & Despesas", relatorios: "Relatórios" };
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: 22, textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: "#FBEFC9",
          margin: "0 auto", display: "grid", placeItems: "center",
        }}>
          <MLockGlyph size={22} color="var(--warn)"/>
        </div>
        <h3 style={{ fontSize: 16, marginTop: 14 }}>Acesso restrito</h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-700)", lineHeight: 1.5, marginTop: 6 }}>
          A área <b>{labels[item] || item}</b> é exclusiva da Flávia (Administradora). Peça para ela liberar pelo computador dela.
        </p>
        <button className="btn btn-primary btn-sm" onClick={onClose} style={{ background: accent, marginTop: 14 }}>
          Entendi
        </button>
      </div>
    </div>
  );
};

window.AdminMobileFrame = AdminMobileFrame;
