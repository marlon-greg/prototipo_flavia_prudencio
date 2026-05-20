// admin.jsx — Painel Administrativo (desktop)

const { STUDENTS, SCHEDULE_HOURS, SCHEDULE_DATA,
        FINANCEIRO_ENTRADAS, FINANCEIRO_SAIDAS, RELATORIOS, GERENCIAIS } = window.STUDIO_DATA;

// Permission map: which pages each role can access
const PERMISSIONS = {
  recepcionista: ["grade", "alunos", "recebimentos"],
  dona:          ["grade", "alunos", "recebimentos", "caixa", "relatorios", "funcionarios"],
};

const Admin = ({ accent, gradeVariant }) => {
  const [role, setRole] = useState("dona"); // recepcionista | dona
  const [page, setPage] = useState("grade");
  const [lockedAttempt, setLockedAttempt] = useState(null);
  const [toast, showToast] = useToast();

  const canAccess = (p) => PERMISSIONS[role].includes(p);

  // when role switches, drop the user back to grade if current page now restricted
  useEffect(() => { if (!canAccess(page)) setPage("grade"); }, [role]);

  const tryNav = (p) => {
    if (canAccess(p)) setPage(p);
    else setLockedAttempt(p);
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 80px)", background: "var(--ink-50)" }}>
      <AdminSidebar page={page} onNav={tryNav} role={role} onRoleChange={setRole} showToast={showToast}/>
      <div style={{ flex: 1, minWidth: 0, padding: "84px 32px 40px", overflow: "auto" }}>
        {page === "grade"        && <GradeDiaria accent={accent} variant={gradeVariant} showToast={showToast}/>}
        {page === "alunos"       && <Alunos accent={accent} showToast={showToast}/>}
        {page === "recebimentos" && <Recebimentos accent={accent} showToast={showToast} role={role}/>}
        {page === "caixa"        && canAccess("caixa")      && <CaixaDespesas accent={accent} showToast={showToast}/>}
        {page === "relatorios"   && canAccess("relatorios") && <Relatorios accent={accent} showToast={showToast}/>}
      </div>
      <LockedModal open={!!lockedAttempt} item={lockedAttempt} onClose={() => setLockedAttempt(null)} accent={accent}/>
      {toast}
    </div>
  );
};

// ---- Locked modal shown when recepcionista tries to access restricted item
const LockedModal = ({ open, item, onClose, accent }) => {
  const labels = { caixa: "Caixa & Despesas", relatorios: "Relatórios gerenciais" };
  return (
    <Modal open={open} onClose={onClose} width={380}>
      <div style={{ padding: 28, textAlign: "center" }}>
        <div style={{
          width: 60, height: 60, borderRadius: 999, background: "var(--ink-50)",
          margin: "0 auto", display: "grid", placeItems: "center",
          border: "1px solid var(--ink-100)",
        }}>
          <Icon name="info" size={26} color="var(--ink-500)"/>
        </div>
        <h3 style={{ fontSize: 18, marginTop: 16 }}>Acesso restrito</h3>
        <p style={{ fontSize: 13, color: "var(--ink-700)", lineHeight: 1.55, marginTop: 8 }}>
          A área <b>{labels[item] || item}</b> é exclusiva da Flávia (perfil Administradora).
          Peça para ela liberar pelo computador dela.
        </p>
        <button className="btn btn-primary btn-sm" onClick={onClose} style={{ background: accent, marginTop: 18 }}>
          Entendi
        </button>
      </div>
    </Modal>
  );
};

// ============================================================
// SIDEBAR (dark) — role-aware
// ============================================================
// Lock SVG icon (inline because shared Icon set doesn't have one)
const LockGlyph = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2.5"/>
    <path d="M8 10V7a4 4 0 018 0v3"/>
  </svg>
);

const AdminSidebar = ({ page, onNav, role, onRoleChange, showToast }) => {
  const isDona = role === "dona";
  const operacao = [
    { id: "grade",        icon: "calendar", label: "Grade diária", badge: "Hoje" },
    { id: "alunos",       icon: "users",    label: "Alunos" },
    { id: "recebimentos", icon: "cash",     label: "Recebimentos" },
  ];
  const gestao = [
    { id: "caixa",         icon: "cash",      label: "Caixa & Despesas" },
    { id: "relatorios",    icon: "chart",     label: "Relatórios" },
    { id: "funcionarios",  icon: "users",     label: "Funcionários", toast: "Abrindo gestão de funcionários\u2026" },
  ];

  return (
    <aside style={{
      width: 252, background: "var(--green-900)", color: "#fff",
      display: "flex", flexDirection: "column", padding: 22,
      position: "sticky", top: 0, height: "100vh", flexShrink: 0,
    }}>
      <div style={{ paddingTop: 50 }}>
        <StudioLogo size="md" variant="light"/>
      </div>

      <SidebarSection label="Operação">
        {operacao.map(it => (
          <SidebarItem key={it.id} item={it} active={page === it.id} onClick={() => onNav(it.id)}/>
        ))}
      </SidebarSection>

      {isDona ? (
        <SidebarSection label="Gestão">
          {gestao.map(it => (
            <SidebarItem key={it.id} item={it}
              active={page === it.id}
              onClick={() => it.toast ? showToast(it.toast) : onNav(it.id)}/>
          ))}
        </SidebarSection>
      ) : null}

      {/* Footer — current role + switcher */}
      <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px 12px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999,
            background: isDona ? "var(--teal-200)" : "#fff",
            color: "var(--green-900)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12,
          }}>{isDona ? "FP" : "R"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{isDona ? "Flávia Prudêncio" : "Recepção"}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.5)" }}>
              {isDona ? "Administradora · acesso total" : "Operação · acesso parcial"}
            </div>
          </div>
        </div>
        {/* Role switcher (demo) */}
        <div style={{
          fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase",
          color: "rgba(255,255,255,.4)", padding: "0 4px 6px", fontWeight: 500,
        }}>Visualizar como (demo)</div>
        <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,.2)", padding: 4, borderRadius: 8 }}>
          {[["recepcionista","Recepção"], ["dona","Dona"]].map(([id, l]) => (
            <button key={id} onClick={() => onRoleChange(id)} style={{
              flex: 1, padding: "7px 0", border: 0, borderRadius: 6,
              background: role === id ? "rgba(255,255,255,.12)" : "transparent",
              color: role === id ? "#fff" : "rgba(255,255,255,.55)",
              fontFamily: "inherit", fontSize: 11.5, fontWeight: 500, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>
    </aside>
  );
};

const SidebarSection = ({ label, right, children }) => (
  <>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".14em",
      textTransform: "uppercase", marginTop: 28, marginBottom: 8, paddingLeft: 4,
      fontWeight: 500,
    }}>
      <span>{label}</span>{right}
    </div>
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</nav>
  </>
);

const SidebarItem = ({ item, active, onClick, locked }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "11px 12px", borderRadius: 10,
    background: active ? "rgba(255,255,255,.10)" : "transparent",
    border: 0,
    color: active ? "#fff" : (locked ? "rgba(255,255,255,.42)" : "rgba(255,255,255,.7)"),
    cursor: "pointer", fontFamily: "inherit",
    fontSize: 13.5, fontWeight: active ? 500 : 400,
    textAlign: "left", position: "relative",
    opacity: locked && !active ? .85 : 1,
  }}>
    <Icon name={item.icon} size={17} stroke={active ? 1.9 : 1.6}/>
    <span style={{ flex: 1 }}>{item.label}</span>
    {locked && <LockGlyph size={12} color={active ? "var(--teal-200)" : "rgba(255,255,255,.4)"}/>}
    {item.badge && !locked && (
      <span style={{
        fontSize: 10, padding: "2px 8px", borderRadius: 999,
        background: active ? "var(--teal-200)" : "rgba(255,255,255,.1)",
        color: active ? "var(--green-900)" : "rgba(255,255,255,.6)",
        fontWeight: 500,
      }}>{item.badge}</span>
    )}
  </button>
);

// ============================================================
// GRADE DIÁRIA (the critical screen)
// ---- Day-shifted mock data for grade navigation (ontem / hoje / amanhã)
const ALT_NAMES = [
  "Marina Silva", "Pedro Henrique", "Rafaela Souza", "Lucas Martins",
  "Carolina Pinto", "Júlia Andrade", "Felipe Costa", "Beatriz Lima",
  "Gabriel Reis", "Patrícia Nunes",
];
const ALT_PLANOS = ["Mensal 2x", "Trimestral 3x", "Mensal 3x", "Avulso"];
function getScheduleForDay(day) {
  if (day === "hoje") return SCHEDULE_DATA;
  const out = {};
  const seed = day === "ontem" ? 7 : 13;
  Object.entries(SCHEDULE_DATA).forEach(([h, slots], hi) => {
    out[h] = slots.map((s, i) => {
      if (s.type === "block") return s;
      const k = hi * 4 + i + seed;
      if (day === "ontem") {
        // Past day: fewer free slots; rotated student names
        if (s.type === "free" && k % 4 === 0) {
          return { type: "fixo", name: ALT_NAMES[k % ALT_NAMES.length], plano: ALT_PLANOS[k % ALT_PLANOS.length] };
        }
        if (s.type === "free") return s;
        return { ...s, name: ALT_NAMES[(k * 3) % ALT_NAMES.length], plano: ALT_PLANOS[k % ALT_PLANOS.length] };
      }
      // amanha
      if (s.type === "free") {
        if (k % 5 === 0) return { type: "repondo", name: ALT_NAMES[k % ALT_NAMES.length], plano: "Reposição" };
        return s;
      }
      return { ...s, name: ALT_NAMES[(k + 2) % ALT_NAMES.length], plano: ALT_PLANOS[(k + 1) % ALT_PLANOS.length] };
    });
  });
  return out;
}
const DAY_LABELS = {
  ontem:  { title: "Segunda-feira, 25 de maio", short: "25/05" },
  hoje:   { title: "Terça-feira, 26 de maio",   short: "26/05" },
  amanha: { title: "Quarta-feira, 27 de maio",  short: "27/05" },
};

// ============================================================
// GRADE DIÁRIA (the critical screen)
// ============================================================
const GradeDiaria = ({ accent, variant, showToast }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [day, setDay] = useState("hoje");

  const scheduleData = useMemo(() => getScheduleForDay(day), [day]);
  const today = DAY_LABELS[day].title;
  const totalAulas = SCHEDULE_HOURS.length;
  const totalAlunos = SCHEDULE_HOURS.reduce((acc, h) =>
    acc + scheduleData[h].filter(s => s.type === "fixo" || s.type === "repondo" || s.type === "fisio").length, 0);
  const totalLivres = SCHEDULE_HOURS.reduce((acc, h) =>
    acc + scheduleData[h].filter(s => s.type === "free").length, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Grade diária"
        title={today}
        subtitle="4 vagas por horário · 07h–11h e 15h–21h"
        accent={accent}
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <button className={`btn btn-ghost btn-sm ${day === "ontem" ? "active-day" : ""}`}
              onClick={() => setDay("ontem")}
              style={day === "ontem" ? { background: "var(--teal-100)", color: accent, borderColor: accent } : undefined}>
              <Icon name="chev_left" size={14}/> Ontem
            </button>
            <button className="btn btn-ghost btn-sm"
              onClick={() => setDay("hoje")}
              style={day === "hoje" ? { background: "var(--teal-100)", color: accent, borderColor: accent } : undefined}>
              <Icon name="calendar" size={14}/> Hoje
            </button>
            <button className="btn btn-ghost btn-sm"
              onClick={() => setDay("amanha")}
              style={day === "amanha" ? { background: "var(--teal-100)", color: accent, borderColor: accent } : undefined}>
              Amanhã <Icon name="chev_right" size={14}/>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => showToast("Selecionar data específica…")} title="Selecionar data" aria-label="Selecionar data">
              <Icon name="calendar" size={14}/>
            </button>
            <button className="btn btn-primary btn-sm" style={{ background: accent }}
              onClick={() => {
                // Find the first free slot of the day and open the editor on it
                for (const h of SCHEDULE_HOURS) {
                  const idx = scheduleData[h].findIndex(s => s.type === "free");
                  if (idx >= 0) { setEditingSlot({ ...scheduleData[h][idx], hour: h, idx }); return; }
                }
                showToast("Não há vagas livres para encaixe hoje");
              }}>
              <Icon name="plus" size={14}/> Encaixe
            </button>
          </div>
        }
      />

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        <StatTile label="Aulas hoje"        value={totalAulas} icon="calendar" accent={accent}/>
        <StatTile label="Alunos agendados"  value={totalAlunos} icon="users"   accent={accent}/>
        <StatTile label="Vagas livres"      value={totalLivres} icon="plus"    color="var(--green-700)"/>
        <StatTile label="Faltas registradas" value={2} icon="info" color="var(--warn)"/>
      </div>

      {/* Legend */}
      <Legend style={{ marginTop: 22 }}/>

      {/* Grade */}
      <div style={{ marginTop: 14 }}>
        {variant === "stacked" ? (
          <GradeStacked accent={accent} data={scheduleData} onSlotClick={setEditingSlot} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot}/>
        ) : variant === "compact" ? (
          <GradeCompact accent={accent} data={scheduleData} onSlotClick={setEditingSlot}/>
        ) : (
          <GradeKanban accent={accent} data={scheduleData} onSlotClick={setEditingSlot}/>
        )}
      </div>

      {editingSlot && (
        <SlotEditor slot={editingSlot} onClose={() => setEditingSlot(null)} accent={accent}
          onAction={(action) => {
            setEditingSlot(null);
            showToast(action);
          }}
        />
      )}
    </div>
  );
};

// ---- Legend
const Legend = ({ style }) => (
  <div style={{
    display: "flex", gap: 18, padding: "12px 16px",
    background: "#fff", borderRadius: 12, border: "1px solid var(--ink-100)",
    fontSize: 12, color: "var(--ink-700)", flexWrap: "wrap", ...style,
  }}>
    <LegendItem dotBg="#EAF4E6" dotBorder="#5C9684" label="Vaga livre"/>
    <LegendItem dotBg="#E1ECF7" dotBorder="#4E81B7" label="Aluno fixo"/>
    <LegendItem dotBg="#FFF1C9" dotBorder="#D9A300" label="Aluno repondo"/>
    <LegendItem dotBg="#F2DAFA" dotBorder="#8E3FAF" label="Fisioterapia"/>
    <LegendItem dotBg="#E8E8E8" dotBorder="#999" label="Horário bloqueado"/>
  </div>
);
const LegendItem = ({ dotBg, dotBorder, label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
    <span style={{ width: 12, height: 12, borderRadius: 4, background: dotBg, border: `1.5px solid ${dotBorder}` }}/>
    {label}
  </span>
);

// ---- Variant A: Stacked (default) — each hour row with 4 explicit slots
const GradeStacked = ({ accent, data, onSlotClick, hoveredSlot, setHoveredSlot }) => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--ink-100)", overflow: "hidden" }}>
    {/* Header */}
    <div style={{
      display: "grid", gridTemplateColumns: "96px repeat(4, 1fr)",
      padding: "12px 18px", borderBottom: "1px solid var(--ink-100)",
      fontSize: 10.5, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500,
      background: "var(--ink-50)",
    }}>
      <span>Horário</span>
      <span>Vaga 1</span>
      <span>Vaga 2</span>
      <span>Vaga 3</span>
      <span>Vaga 4</span>
    </div>
    {SCHEDULE_HOURS.map((h, idx) => {
      const slots = (data || SCHEDULE_DATA)[h];
      const isBreak = idx === 4; // last morning row, after this is break to 15h
      return (
        <div key={h}>
          <div style={{
            display: "grid", gridTemplateColumns: "96px repeat(4, 1fr)",
            padding: 12, gap: 10, borderTop: idx ? "1px solid var(--ink-100)" : "none",
            alignItems: "stretch",
          }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{h}h</span>
              <span style={{ fontSize: 11, color: "var(--ink-500)" }}>—{(Number(h)+1).toString().padStart(2,"0")}h</span>
            </div>
            {slots.map((s, i) => (
              <SlotCell key={i} slot={s} hour={h} idx={i}
                onClick={() => s.type !== "block" && onSlotClick({ ...s, hour: h, idx: i })}
                hovered={hoveredSlot === `${h}-${i}`}
                onHover={(v) => setHoveredSlot(v ? `${h}-${i}` : null)}
              />
            ))}
          </div>
          {isBreak && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 18px",
              background: "var(--ink-50)", color: "var(--ink-500)", fontSize: 12,
              borderTop: "1px solid var(--ink-100)",
            }}>
              <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }}/>
              <span style={{ letterSpacing: ".08em", textTransform: "uppercase", fontSize: 10.5, fontWeight: 500 }}>Almoço · studio fechado das 11h às 15h</span>
              <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }}/>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ---- SlotCell — the critical 4-vaga visual
const SLOT_STYLES = {
  free:    { bg: "#EAF4E6", border: "#5C9684", text: "var(--green-900)", labelColor: "var(--green-700)", tag: "Livre" },
  fixo:    { bg: "#E1ECF7", border: "#4E81B7", text: "#143A66",          labelColor: "#3A6EA5",         tag: "Fixo" },
  repondo: { bg: "#FFF1C9", border: "#D9A300", text: "#6B4D00",          labelColor: "#9A7700",         tag: "Reposição" },
  fisio:   { bg: "#F2DAFA", border: "#8E3FAF", text: "#4B1A65",          labelColor: "#7B2A9D",         tag: "Fisio" },
  block:   { bg: "#E8E8E8", border: "#BBB",    text: "#666",              labelColor: "#888",            tag: "Bloqueado" },
};
const SlotCell = ({ slot, onClick, hovered, onHover }) => {
  const s = SLOT_STYLES[slot.type];
  const isFree = slot.type === "free";
  const isBlock = slot.type === "block";
  return (
    <div
      onClick={isBlock ? undefined : onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      style={{
        background: s.bg,
        border: `1.5px ${isFree ? "dashed" : "solid"} ${s.border}`,
        borderRadius: 12, padding: "10px 12px", cursor: isBlock ? "not-allowed" : "pointer",
        minHeight: 74, display: "flex", flexDirection: "column", justifyContent: "space-between",
        transition: "transform .12s, box-shadow .15s",
        boxShadow: hovered ? "0 6px 18px rgba(15,51,38,.08)" : "none",
        transform: hovered && !isBlock ? "translateY(-1px)" : "none",
        position: "relative", overflow: "hidden",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, color: s.labelColor, letterSpacing: ".1em", textTransform: "uppercase" }}>
          {s.tag}
        </span>
        {!isFree && !isBlock && (
          <span style={{ fontSize: 10, color: s.labelColor, opacity: .6 }}>•••</span>
        )}
      </div>
      {isFree ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: s.labelColor, fontSize: 12 }}>
          <Icon name="plus" size={14} color={s.labelColor}/>
          <span>Encaixar aluno</span>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: s.text, lineHeight: 1.2 }}>
            {slot.name}
          </div>
          {slot.plano && (
            <div style={{ fontSize: 11, color: s.labelColor, marginTop: 3, opacity: .85 }}>{slot.plano}</div>
          )}
        </div>
      )}
    </div>
  );
};

// ---- Variant B: Compact list (one row per hour, slots inline)
const GradeCompact = ({ accent, data, onSlotClick }) => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--ink-100)", overflow: "hidden" }}>
    {SCHEDULE_HOURS.map((h, idx) => {
      const slots = (data || SCHEDULE_DATA)[h];
      const ocup = slots.filter(s => s.type === "fixo" || s.type === "repondo" || s.type === "fisio").length;
      return (
        <div key={h} style={{
          display: "grid", gridTemplateColumns: "80px 1fr 110px",
          padding: "14px 18px", borderTop: idx ? "1px solid var(--ink-100)" : "none",
          alignItems: "center", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--green-900)" }} className="num">{h}h</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-500)", letterSpacing: ".06em" }}>{ocup}/4 ocupadas</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {slots.map((s, i) => (
              <SlotPill key={i} slot={s} onClick={() => s.type !== "block" && onSlotClick({ ...s, hour: h, idx: i })}/>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <OccupancyBar value={ocup} total={4}/>
          </div>
        </div>
      );
    })}
  </div>
);
const SlotPill = ({ slot, onClick }) => {
  const s = SLOT_STYLES[slot.type];
  const isFree = slot.type === "free";
  return (
    <button onClick={onClick} style={{
      background: s.bg, border: `1.5px ${isFree ? "dashed" : "solid"} ${s.border}`,
      borderRadius: 999, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
      cursor: slot.type === "block" ? "not-allowed" : "pointer", fontFamily: "inherit", textAlign: "left",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.border, flexShrink: 0 }}/>
      <span style={{ fontSize: 12, color: s.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {isFree ? "Vaga livre" : slot.name}
      </span>
    </button>
  );
};
const OccupancyBar = ({ value, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          width: 14, height: 22, borderRadius: 4,
          background: i < value ? "var(--green-700)" : "var(--ink-100)",
        }}/>
      ))}
    </div>
    <span style={{ fontSize: 11, color: "var(--ink-500)" }}>{value}/{total}</span>
  </div>
);

// ---- Variant C: Kanban (columns by hour, slots stacked vertically)
const GradeKanban = ({ accent, data, onSlotClick }) => (
  <div style={{
    background: "#fff", borderRadius: 16, border: "1px solid var(--ink-100)",
    padding: 14, overflowX: "auto",
  }}>
    <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(180px, 1fr)", gap: 10 }}>
      {SCHEDULE_HOURS.map(h => (
        <div key={h}>
          <div style={{
            padding: "8px 10px", marginBottom: 8, background: "var(--ink-50)",
            borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }} className="num">{h}h</span>
            <span style={{ fontSize: 10.5, color: "var(--ink-500)" }}>4 vagas</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(data || SCHEDULE_DATA)[h].map((s, i) => (
              <SlotCell key={i} slot={s} onClick={() => s.type !== "block" && onSlotClick({ ...s, hour: h, idx: i })}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---- Slot Editor modal
const SlotEditor = ({ slot, onClose, accent, onAction }) => {
  const isFree = slot.type === "free";
  return (
    <Modal open onClose={onClose} width={420}>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>{slot.hour}h · Vaga {slot.idx + 1}</span>
            <h3 style={{ fontSize: 20, marginTop: 6 }}>{isFree ? "Encaixar aluno" : slot.name}</h3>
            {slot.plano && <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{slot.plano}</div>}
          </div>
          <button onClick={onClose} style={{ background:"var(--ink-50)", border:0, borderRadius:999, width:28, height:28, cursor:"pointer", display:"grid", placeItems:"center" }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        {isFree ? (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="field">
              <label>Buscar aluno</label>
              <input placeholder="Digite o nome do aluno"/>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-soft btn-sm" style={{ flex: 1 }}>Aula fixa</button>
              <button className="btn btn-soft btn-sm" style={{ flex: 1 }}>Reposição</button>
              <button className="btn btn-soft btn-sm" style={{ flex: 1 }}>Fisio</button>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: accent, marginTop: 8 }}
              onClick={() => onAction("Aluno encaixado no horário")}>
              Confirmar encaixe
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              fontSize: 11.5, color: "var(--ink-500)", padding: "10px 12px",
              background: "var(--ink-50)", borderRadius: 8, lineHeight: 1.45,
              display: "flex", gap: 8, alignItems: "start",
            }}>
              <Icon name="info" size={14} color="var(--ink-500)"/>
              <span>O aluno fica como <b style={{ color: "var(--green-700)" }}>presente</b> por padrão. Use os botões abaixo apenas em casos de exceção.</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onAction("Selecione um novo horário na grade")}>Mover / Reagendar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onAction(`Abrindo a ficha de ${slot.name}`)}>Ver ficha do aluno</button>
            <button className="btn btn-danger btn-sm" onClick={() => onAction(`Falta registrada para ${slot.name} às ${slot.hour}h`)}>
              <Icon name="hand_off" size={13}/> Marcar falta
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onAction("Aula removida deste horário")}>
              Remover deste horário
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ============================================================
// PAGE HEADER
// ============================================================
const PageHeader = ({ eyebrow, title, subtitle, right, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
    <div>
      <span className="section-eyebrow" style={{ color: accent }}>{eyebrow}</span>
      <h2 style={{ fontSize: 28, marginTop: 8, letterSpacing: "-.02em" }}>{title}</h2>
      {subtitle && <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>{subtitle}</div>}
    </div>
    {right}
  </div>
);

// ---- Stat Tile
const StatTile = ({ label, value, icon, accent, color }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11.5, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 500 }}>{label}</span>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--teal-50)", color: color || accent, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={15}/>
      </div>
    </div>
    <div style={{ fontSize: 30, fontWeight: 600, marginTop: 8, color: color || "var(--green-900)", letterSpacing: "-.02em" }} className="num">{value}</div>
  </div>
);

// ============================================================
// ALUNOS
// ============================================================
const Alunos = ({ accent, showToast }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);

  const filtered = STUDENTS.filter(s => {
    if (filter === "em-dia"   && s.situacao !== "em-dia")   return false;
    if (filter === "pendente" && s.situacao !== "pendente") return false;
    if (filter === "inativo"  && s.situacao !== "inativo")  return false;
    if (q) return s.nome.toLowerCase().includes(q.toLowerCase());
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Gestão"
        title="Alunos"
        subtitle={`${STUDENTS.length} alunos cadastrados · ${STUDENTS.filter(s=>s.situacao==="em-dia").length} ativos`}
        accent={accent}
        right={
          <button className="btn btn-primary btn-sm" style={{ background: accent }} onClick={() => showToast("Abrindo formulário de nova matrícula\u2026")}>
            <Icon name="plus" size={14}/> Novo aluno
          </button>
        }
      />

      <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: 13, color: "var(--ink-500)" }}/>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome…"
            style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 10, border: "1px solid var(--ink-200)", fontSize: 13, fontFamily: "inherit", background: "#fff" }}/>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#fff", borderRadius: 10, border: "1px solid var(--ink-100)" }}>
          {[["todos","Todos"],["em-dia","Em dia"],["pendente","Pendentes"],["inativo","Inativos"]].map(([id, l]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              background: filter === id ? "var(--green-800)" : "transparent",
              color: filter === id ? "#fff" : "var(--ink-700)",
              border: 0, padding: "7px 14px", borderRadius: 7, fontFamily: "inherit", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr .8fr .8fr 1fr",
          padding: "12px 18px", background: "var(--ink-50)", fontSize: 10.5,
          color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500,
        }}>
          <span>Aluno</span><span>Plano</span><span>Próxima aula</span>
          <span style={{ textAlign:"center" }}>Faltas</span><span style={{ textAlign:"center" }}>Reposições</span><span>Situação</span>
        </div>
        {filtered.map((s, i) => (
          <div key={s.id} onClick={() => setSelected(s)} style={{
            display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr .8fr .8fr 1fr",
            padding: "14px 18px", borderTop: i ? "1px solid var(--ink-100)" : "none",
            alignItems: "center", cursor: "pointer", fontSize: 13.5, transition: "background .12s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--ink-50)"}
            onMouseLeave={(e) => e.currentTarget.style.background = ""}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--teal-100)", color: accent, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>
                {s.nome.split(" ").map(p => p[0]).slice(0,2).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{s.nome}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }} className="num">{s.tel}</div>
              </div>
            </div>
            <span style={{ color: "var(--ink-700)" }}>{s.plano}</span>
            <span style={{ color: "var(--ink-700)", fontSize: 12.5 }} className="num">{s.prox}</span>
            <span style={{ textAlign:"center", color: s.faltas > 1 ? "var(--warn)" : "var(--ink-700)", fontWeight: s.faltas > 1 ? 600 : 400 }} className="num">{s.faltas}</span>
            <span style={{ textAlign:"center", color: "var(--ink-700)" }} className="num">{s.reposicoes}</span>
            <span><StatusPill status={s.situacao}/></span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign:"center", color: "var(--ink-500)", fontSize: 13 }}>Nenhum aluno encontrado.</div>
        )}
      </div>

      <StudentSheet open={!!selected} student={selected} onClose={() => setSelected(null)} accent={accent} showToast={showToast}/>
    </div>
  );
};

const StudentSheet = ({ open, student, onClose, accent, showToast }) => {
  const [tab, setTab] = useState("ficha");
  const [file, setFile] = useState(null);
  useEffect(() => { if (open) setTab("ficha"); }, [open, student?.id]);
  if (!student) return null;
  return (
    <SideSheet open={open} onClose={onClose} width={520}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--teal-200)", color: accent, display: "grid", placeItems: "center", fontWeight: 600, fontSize: 18 }}>
              {student.nome.split(" ").map(p => p[0]).slice(0,2).join("")}
            </div>
            <div>
              <h3 style={{ fontSize: 20 }}>{student.nome}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <StatusPill status={student.situacao}/>
                <span className="chip chip-teal">{student.plano}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"var(--ink-50)", border:0, borderRadius:999, width:32, height:32, cursor:"pointer", display:"grid", placeItems:"center" }}>
            <Icon name="close" size={15}/>
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, marginTop: 22, background: "var(--ink-50)", padding: 4, borderRadius: 10 }}>
          {[["ficha","Ficha"],["anamnese","Anamnese"],["historico","Histórico"],["anexos","Anexos"]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "8px 0", border: 0,
              background: tab === id ? "#fff" : "transparent",
              boxShadow: tab === id ? "0 1px 3px rgba(0,0,0,.06)" : "none",
              color: tab === id ? accent : "var(--ink-700)",
              fontFamily: "inherit", fontSize: 12.5, fontWeight: 500, borderRadius: 7, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>

        {tab === "ficha" && (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <FichaRow label="CPF" v={student.cpf} mono/>
            <FichaRow label="Telefone principal" v={student.tel} mono/>
            <FichaRow label="Endereço" v={student.endereco}/>
            <FichaRow label="Início do plano" v={student.inicio} mono/>
            <FichaRow label="Término do plano" v={student.fim} mono/>
            <button className="btn btn-soft btn-sm" onClick={() => showToast("Anamnese aberta em nova janela")}>
              <Icon name="file" size={14}/> Ver anamnese completa
            </button>
          </div>
        )}
        {tab === "anamnese" && (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <AnaRow label="Queixa principal" v="Dor lombar ao final do dia de trabalho. Sente travamento ao levantar."/>
            <AnaRow label="Nível de dor (0-10)" v={<span style={{ display:"flex", gap: 8, alignItems:"center" }}><b style={{ fontSize: 18 }}>4</b> <span style={{ fontSize: 12, color: accent }}>Moderada</span></span>}/>
            <AnaRow label="Local da dor" v="Região lombar baixa, lado direito"/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <AnaRow label="Hipertensão" v="Não"/>
              <AnaRow label="Diabetes" v="Não"/>
            </div>
            <AnaRow label="Medicamentos" v="Anti-inflamatório eventual"/>
            <AnaRow label="Postura no trabalho" v="Sentada (8h/dia)"/>
            <AnaRow label="Qualidade do sono" v="Regular"/>
          </div>
        )}
        {tab === "historico" && (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <HistItem date="22/05" what="Aula realizada · 17h"/>
            <HistItem date="20/05" what="Aula realizada · 17h"/>
            <HistItem date="15/05" what="Falta justificada (atestado)" warn/>
            <HistItem date="13/05" what="Aula realizada · 17h"/>
            <HistItem date="10/05" what="Reposição utilizada · 09h"/>
            <HistItem date="08/05" what="Aula realizada · 17h"/>
          </div>
        )}
        {tab === "anexos" && (
          <div style={{ marginTop: 22 }}>
            <DropZone file={file} onFile={(f) => { setFile(f); showToast("Arquivo anexado ao perfil"); }}
              label="Atestados, exames, fotos posturais…"/>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {["RX-coluna-jan.pdf","Atestado-22-04.pdf","Foto-postural-incial.jpg"].map((n, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  border: "1px solid var(--ink-100)", borderRadius: 10, fontSize: 13,
                }}>
                  <Icon name="file" size={16} color={accent}/>
                  <span style={{ flex: 1 }}>{n}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-500)" }}>{["12/01","22/04","15/02"][i]}</span>
                  <Icon name="download" size={14} color="var(--ink-500)"/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SideSheet>
  );
};

const FichaRow = ({ label, v, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid var(--ink-100)" }}>
    <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{label}</span>
    <span style={{ fontSize: 13, color: "var(--ink-900)", fontFamily: mono ? "'JetBrains Mono'" : "inherit" }}>{v}</span>
  </div>
);
const AnaRow = ({ label, v }) => (
  <div style={{ padding: 14, background: "var(--teal-50)", borderRadius: 12 }}>
    <div style={{ fontSize: 10.5, color: "var(--green-700)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 13, marginTop: 6, color: "var(--ink-900)", lineHeight: 1.5 }}>{v}</div>
  </div>
);
const HistItem = ({ date, what, warn }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: warn ? "#FFFAEC" : "var(--ink-50)" }}>
    <span style={{ fontSize: 11, color: "var(--ink-500)", width: 50 }} className="num">{date}</span>
    <span style={{ fontSize: 12.5, color: warn ? "#7A5A0A" : "var(--ink-900)" }}>{what}</span>
  </div>
);

// ============================================================
// RECEBIMENTOS (Entradas) — Recepcionista + Dona
// ============================================================
const Recebimentos = ({ accent, showToast, role }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("todos");
  const [confirming, setConfirming] = useState(null);

  const filtered = FINANCEIRO_ENTRADAS.filter(e => {
    if (filter === "pendente" && e.status !== "pendente") return false;
    if (filter === "baixado"  && e.status !== "baixado")  return false;
    if (q) return e.aluno.toLowerCase().includes(q.toLowerCase());
    return true;
  });

  const totalE = FINANCEIRO_ENTRADAS.filter(e => e.status === "baixado").reduce((a, e) => a + e.valor, 0);
  const totalP = FINANCEIRO_ENTRADAS.filter(e => e.status !== "baixado").reduce((a, e) => a + e.valor, 0);
  const countPend = FINANCEIRO_ENTRADAS.filter(e => e.status === "pendente").length;

  return (
    <div>
      <PageHeader
        eyebrow="Caixa do dia"
        title="Recebimentos"
        subtitle={`Pagamentos recebidos no balcão e pendências dos alunos · acesso ${role === "dona" ? "Administradora + Recepção" : "Recepção"}`}
        accent={accent}
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => showToast("Download do relatório do dia iniciado")}><Icon name="download" size={14}/> Exportar dia</button>
            <button className="btn btn-primary btn-sm" style={{ background: accent }} onClick={() => showToast("Abrindo lançamento de recebimento avulso\u2026")}>
              <Icon name="plus" size={14}/> Recebimento avulso
            </button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20 }}>
        <FinTile label="Recebido no mês"   value={formatBRL(totalE)} delta={`${FINANCEIRO_ENTRADAS.filter(e=>e.status==="baixado").length} pagamentos`} color={accent}/>
        <FinTile label="Pendente"           value={formatBRL(totalP)} delta={`${countPend} aluno${countPend!==1?"s":""}`} color="var(--warn)"/>
        <FinTile label="Recebido hoje"      value={formatBRL(220)}    delta="1 pagamento via PIX" color="var(--green-700)"/>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: 13, color: "var(--ink-500)" }}/>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar aluno…"
            style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 10, border: "1px solid var(--ink-200)", fontSize: 13, fontFamily: "inherit", background: "#fff" }}/>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "#fff", borderRadius: 10, border: "1px solid var(--ink-100)" }}>
          {[["todos","Todos"],["pendente","Pendentes"],["baixado","Baixados"]].map(([id, l]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              background: filter === id ? "var(--green-800)" : "transparent",
              color: filter === id ? "#fff" : "var(--ink-700)",
              border: 0, padding: "7px 14px", borderRadius: 7, fontFamily: "inherit", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 1.8fr 1.6fr 110px 110px 130px 150px",
          padding: "12px 18px", background: "var(--ink-50)", fontSize: 10.5,
          color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500,
        }}>
          <span>Data</span><span>Aluno</span><span>Descrição</span><span>Valor</span><span>Forma</span><span>Status</span><span></span>
        </div>
        {filtered.map((e, i) => (
          <div key={e.id} style={{
            display: "grid", gridTemplateColumns: "100px 1.8fr 1.6fr 110px 110px 130px 150px",
            padding: "14px 18px", borderTop: i ? "1px solid var(--ink-100)" : "none",
            alignItems: "center", fontSize: 13,
            background: e.status === "pendente" ? "#FFFCF3" : "transparent",
          }}>
            <span style={{ color: "var(--ink-500)" }} className="num">{e.data}</span>
            <span style={{ fontWeight: 500 }}>{e.aluno}</span>
            <span style={{ color: "var(--ink-700)" }}>{e.desc}</span>
            <span style={{ fontWeight: 600 }} className="num">{formatBRL(e.valor)}</span>
            <span style={{ color: "var(--ink-700)" }}>{e.forma}</span>
            <span><StatusPill status={e.status}/></span>
            <span>
              {e.status === "pendente"
                ? <button className="btn btn-sm" style={{ background: accent, color: "#fff", padding: "7px 14px", fontSize: 12 }}
                     onClick={() => setConfirming(e)}>
                    <Icon name="check" size={13} stroke={2.4}/> Dar baixa
                  </button>
                : <span style={{ fontSize: 11, color: "var(--ink-500)", display:"inline-flex", alignItems:"center", gap:6 }}>
                    <Icon name="check" size={12} color="var(--green-700)"/> Confirmado
                  </span>}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign:"center", color: "var(--ink-500)", fontSize: 13 }}>Nenhum pagamento encontrado.</div>
        )}
      </div>

      <BaixaModal open={!!confirming} entry={confirming} onClose={() => setConfirming(null)} accent={accent}
        onConfirm={(forma) => {
          setConfirming(null);
          showToast(`Pagamento de ${confirming.aluno} confirmado via ${forma}`);
        }}/>
    </div>
  );
};

const BaixaModal = ({ open, entry, onClose, onConfirm, accent }) => {
  const [forma, setForma] = useState("PIX");
  const [comprov, setComprov] = useState(null);
  useEffect(() => { if (open) { setForma("PIX"); setComprov(null); } }, [open]);
  if (!entry) return null;
  return (
    <Modal open={open} onClose={onClose} width={420}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Confirmar pagamento</span>
            <h3 style={{ fontSize: 20, marginTop: 6 }}>{entry.aluno}</h3>
            <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{entry.desc}</div>
          </div>
          <button onClick={onClose} style={{ background:"var(--ink-50)", border:0, borderRadius:999, width:28, height:28, cursor:"pointer", display:"grid", placeItems:"center" }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        <div style={{
          background: "var(--teal-50)", borderRadius: 12, padding: 16, marginTop: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "var(--ink-700)" }}>Valor</span>
          <span style={{ fontSize: 28, fontWeight: 600, color: accent, letterSpacing: "-.02em" }} className="num">{formatBRL(entry.valor)}</span>
        </div>
        <div style={{ marginTop: 18 }}>
          <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)", display:"block", marginBottom: 8 }}>Forma de pagamento</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
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
        <div style={{ marginTop: 18 }}>
          <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)", display: "block", marginBottom: 8 }}>
            Comprovante <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>(opcional)</span>
          </label>
          <DropZone file={comprov} onFile={setComprov} label="Foto do comprovante PIX ou nota da maquininha"/>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-sm" style={{ flex: 1.4, background: accent, color: "#fff" }} onClick={() => onConfirm(forma)}>
            <Icon name="check" size={14} stroke={2.5}/> Confirmar baixa
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// CAIXA & DESPESAS — Dona only
// ============================================================
const CaixaDespesas = ({ accent, showToast }) => {
  const [openSaida, setOpenSaida] = useState(false);
  const totalE = FINANCEIRO_ENTRADAS.filter(e => e.status === "baixado").reduce((a, e) => a + e.valor, 0);
  const totalS = FINANCEIRO_SAIDAS.reduce((a, e) => a + e.valor, 0);
  const totalP = FINANCEIRO_ENTRADAS.filter(e => e.status !== "baixado").reduce((a, e) => a + e.valor, 0);

  return (
    <div>
      <PageHeader
        eyebrow={<span style={{ display:"inline-flex", alignItems:"center", gap: 6 }}><LockGlyph size={11}/> Restrito · Dona</span>}
        title="Caixa & Despesas"
        subtitle="Livro caixa completo, saídas do estúdio e gráficos gerenciais"
        accent={accent}
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => showToast("Download do livro caixa iniciado")}><Icon name="download" size={14}/> Exportar</button>
            <button className="btn btn-primary btn-sm" style={{ background: accent }} onClick={() => setOpenSaida(true)}>
              <Icon name="plus" size={14}/> Nova saída
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        <FinTile label="Entradas no mês"  value={formatBRL(totalE)} delta="+12%" color={accent}/>
        <FinTile label="Saídas no mês"    value={formatBRL(totalS)} delta="−4%"  color="var(--danger)"/>
        <FinTile label="Saldo"            value={formatBRL(totalE - totalS)} delta="+18%" color="var(--green-700)"/>
        <FinTile label="Inadimplência"    value={formatBRL(totalP)} delta="2 alunos" color="var(--warn)"/>
      </div>

      {/* Gerenciais */}
      <h4 style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 30, marginBottom: 10 }}>Gráficos gerenciais</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 14 }}>
        <FaturamentoChart accent={accent}/>
        <RetencaoChart accent={accent}/>
        <InadimplenciaChart accent={accent}/>
      </div>

      {/* Saídas list */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 30, marginBottom: 10 }}>
        <h4 style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase" }}>Saídas do estúdio</h4>
        <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{FINANCEIRO_SAIDAS.length} lançamentos em Maio</span>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 2.4fr 1.4fr 130px 100px",
          padding: "12px 18px", background: "var(--ink-50)", fontSize: 10.5,
          color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500,
        }}>
          <span>Data</span><span>Descrição</span><span>Categoria</span><span>Valor</span><span>Comprov.</span>
        </div>
        {FINANCEIRO_SAIDAS.map((s, i) => (
          <div key={s.id} style={{
            display: "grid", gridTemplateColumns: "100px 2.4fr 1.4fr 130px 100px",
            padding: "14px 18px", borderTop: i ? "1px solid var(--ink-100)" : "none",
            alignItems: "center", fontSize: 13,
          }}>
            <span style={{ color: "var(--ink-500)" }} className="num">{s.data}</span>
            <span style={{ fontWeight: 500 }}>{s.desc}</span>
            <span><span className="chip chip-teal">{s.categoria}</span></span>
            <span style={{ fontWeight: 600, color: "var(--danger)" }} className="num">−{formatBRL(s.valor)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-500)" }}>
              <Icon name="file" size={14}/> 1 anexo
            </span>
          </div>
        ))}
      </div>

      <NovaSaidaModal open={openSaida} onClose={() => setOpenSaida(false)} accent={accent}
        onSave={() => { setOpenSaida(false); showToast("Saída registrada no livro caixa"); }}/>
    </div>
  );
};

// ---- Faturamento (dual bars: entradas / saídas)
const FaturamentoChart = ({ accent }) => {
  const data = GERENCIAIS.faturamento;
  const max = Math.max(...data.map(d => Math.max(d.entrada, d.saida)));
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <h4 style={{ fontSize: 14 }}>Faturamento</h4>
          <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4 }}>Entradas × saídas · últimos 6 meses</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-700)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: accent }}/> Entradas
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-700)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--danger)" }}/> Saídas
          </span>
        </div>
      </div>
      <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 18, marginTop: 22, paddingBottom: 22, position: "relative" }}>
        {data.map((d, i) => {
          const he = (d.entrada / max) * 170;
          const hs = (d.saida   / max) * 170;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 175, width: "100%", justifyContent: "center" }}>
                <div style={{ width: "40%", height: Math.max(he, 3), background: accent, borderRadius: "6px 6px 0 0", position: "relative" }}>
                  <span style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 9.5, color: "var(--ink-700)", fontWeight: 600 }}>{(d.entrada/1000).toFixed(1)}k</span>
                </div>
                <div style={{ width: "40%", height: Math.max(hs, 3), background: "var(--danger)", opacity: .85, borderRadius: "6px 6px 0 0" }}/>
              </div>
              <span style={{ position: "absolute", bottom: -18, fontSize: 10.5, color: "var(--ink-500)" }}>{d.mes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RetencaoChart = ({ accent }) => {
  const data = GERENCIAIS.retencao;
  const cur = data[data.length-1].pct;
  const prev = data[data.length-2].pct;
  const delta = cur - prev;
  return (
    <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
      <h4 style={{ fontSize: 14 }}>Retenção</h4>
      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4 }}>% renovação de plano</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 18 }}>
        <span style={{ fontSize: 38, fontWeight: 600, color: accent, letterSpacing: "-.02em" }} className="num">{cur}%</span>
        <span style={{ fontSize: 12, color: delta >= 0 ? "var(--green-700)" : "var(--danger)", fontWeight: 500 }}>
          {delta >= 0 ? "+" : ""}{delta}pp
        </span>
      </div>
      {/* sparkline */}
      <svg viewBox="0 0 220 80" style={{ marginTop: "auto", width: "100%", height: 80 }}>
        {(() => {
          const min = Math.min(...data.map(d => d.pct)) - 5;
          const max = Math.max(...data.map(d => d.pct)) + 3;
          const pts = data.map((d, i) => {
            const x = (i / (data.length-1)) * 220;
            const y = 80 - ((d.pct - min) / (max - min)) * 70 - 5;
            return [x, y];
          });
          const path = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
          const area = path + ` L 220 80 L 0 80 Z`;
          return (
            <>
              <path d={area} fill={`${accent}22`}/>
              <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {pts.map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r={i === pts.length-1 ? 3.5 : 2} fill="#fff" stroke={accent} strokeWidth="1.8"/>
              ))}
            </>
          );
        })()}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-500)", marginTop: 4 }}>
        {data.map((d, i) => <span key={i}>{d.mes}</span>)}
      </div>
    </div>
  );
};

const InadimplenciaChart = ({ accent }) => {
  const data = GERENCIAIS.inadimplencia;
  const max = Math.max(...data.map(d => d.valor));
  return (
    <div className="card" style={{ padding: 22 }}>
      <h4 style={{ fontSize: 14 }}>Inadimplência</h4>
      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4 }}>Valor pendente por mês</div>
      <div style={{ height: 150, display: "flex", alignItems: "flex-end", gap: 6, marginTop: 22, paddingBottom: 18, position: "relative" }}>
        {data.map((d, i) => {
          const h = (d.valor / max) * 120;
          const isLast = i === data.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
              <div style={{ fontSize: 9.5, color: "var(--ink-700)", fontWeight: 600 }} className="num">{d.valor}</div>
              <div style={{ width: "70%", height: Math.max(h, 4), borderRadius: 4,
                background: isLast ? "var(--warn)" : "#FBEFC9",
              }}/>
              <span style={{ position: "absolute", bottom: -16, fontSize: 10, color: "var(--ink-500)" }}>{d.mes}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--ink-100)" }}>
        Hoje: <b style={{ color: "var(--warn)" }} className="num">{formatBRL(490)}</b> em aberto
      </div>
    </div>
  );
};

const FinTile = ({ label, value, delta, color }) => (
  <div className="card" style={{ padding: 18 }}>
    <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{value}</div>
    <div style={{ fontSize: 11.5, color, marginTop: 6, fontWeight: 500 }}>{delta} <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>vs. mês anterior</span></div>
  </div>
);

const NovaSaidaModal = ({ open, onClose, onSave, accent }) => {
  const [form, setForm] = useState({ desc: "", categoria: "", valor: "", data: "" });
  const [file, setFile] = useState(null);
  return (
    <Modal open={open} onClose={onClose} width={460} padding={0}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={{ fontSize: 20 }}>Nova saída</h3>
          <button onClick={onClose} style={{ background:"var(--ink-50)", border:0, borderRadius:999, width:28, height:28, cursor:"pointer", display:"grid", placeItems:"center" }}>
            <Icon name="close" size={14}/>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          <Field2 label="Descrição" v={form.desc}     onChange={v => setForm(f => ({...f, desc: v}))}     ph="Ex: Conta de luz"/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field2 label="Valor (R$)" v={form.valor} onChange={v => setForm(f => ({...f, valor: v}))}    ph="0,00"/>
            <Field2 label="Data" v={form.data}        onChange={v => setForm(f => ({...f, data: v}))}     ph="dd/mm/aaaa"/>
          </div>
          <div className="field">
            <label>Categoria</label>
            <select value={form.categoria} onChange={(e) => setForm(f => ({...f, categoria: e.target.value}))}>
              <option value="">Selecione…</option>
              <option>Aluguel</option><option>Utilidades</option>
              <option>Materiais</option><option>Manutenção</option><option>Outros</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-700)", display: "block", marginBottom: 6 }}>Comprovante</label>
            <DropZone file={file} onFile={setFile} label="Anexar nota fiscal ou recibo"/>
          </div>
          <button className="btn btn-primary" style={{ background: accent, marginTop: 8 }} onClick={onSave}>
            Salvar saída
          </button>
        </div>
      </div>
    </Modal>
  );
};
const Field2 = ({ label, v, onChange, ph }) => (
  <div className="field">
    <label>{label}</label>
    <input value={v} onChange={(e) => onChange(e.target.value)} placeholder={ph}/>
  </div>
);

// ============================================================
// RELATÓRIOS
// ============================================================
const Relatorios = ({ accent, showToast }) => (
  <div>
    <PageHeader
      eyebrow={<span style={{ display:"inline-flex", alignItems:"center", gap: 6 }}><LockGlyph size={11}/> Restrito · Dona</span>}
      title="Relatórios"
      subtitle="Maio de 2026 · atualizado hoje às 09:14"
      accent={accent}
      right={<button className="btn btn-ghost btn-sm" onClick={() => showToast("Download do relatório em PDF iniciado")}><Icon name="download" size={14}/> Exportar PDF</button>}/>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 22 }}>
      <ChartCard title="Horários de pico" subtitle="Alunos atendidos por horário"
        big={RELATORIOS.horariosPico} keyX="h" keyY="qtd" accent={accent} height={220} highlightMax/>
      <ChartCard title="Alunos que pararam" subtitle="Pessoas que cancelaram o plano nos últimos 5 meses"
        big={RELATORIOS.pararam} keyX="mes" keyY="qtd" accent="var(--danger)" height={220}/>
      <ChartCard title="Aulas dadas" subtitle="Total de aulas conduzidas por mês"
        big={RELATORIOS.aulasDadas} keyX="mes" keyY="qtd" accent={accent} height={220}/>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <h4 style={{ fontSize: 14 }}>Resumo do mês</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 18 }}>
          <Mini label="Aulas dadas"            v="294"  d="+9%"/>
          <Mini label="Faltas registradas"     v="22"   d="−18%"/>
          <Mini label="Reposições agendadas"   v="34"   d="+12%"/>
          <Mini label="Avaliações realizadas"  v="11"   d="+1"/>
        </div>
      </div>
      <div className="card" style={{ padding: 22, background: "var(--green-900)", color: "#fff", border: "none" }}>
        <h4 style={{ fontSize: 14, color: "#fff" }}>Insight do mês</h4>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.78)", marginTop: 10, lineHeight: 1.55 }}>
          18h é o horário mais cheio (24 alunos na semana). Considere abrir um horário extra às terças e quintas.
        </p>
        <button className="btn btn-sm" style={{ marginTop: 14, background: "rgba(255,255,255,.1)", color: "#fff" }}
          onClick={() => showToast("Carregando sugestões da inteligência do sistema\u2026")}>
          Ver sugestões <Icon name="arrow_right" size={14}/>
        </button>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, big, keyX, keyY, accent, height, highlightMax }) => {
  const max = Math.max(...big.map(d => d[keyY]));
  return (
    <div className="card" style={{ padding: 22 }}>
      <h4 style={{ fontSize: 14 }}>{title}</h4>
      <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4 }}>{subtitle}</div>
      <div style={{ height, display: "flex", alignItems: "flex-end", gap: 6, marginTop: 22, paddingBottom: 22, position: "relative" }}>
        {big.map((d, i) => {
          const h = (d[keyY] / max) * (height - 30);
          const isMax = highlightMax && d[keyY] === max;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-700)" }} className="num">{d[keyY]}</div>
              <div style={{
                width: "100%", height: Math.max(h, 4), borderRadius: 6,
                background: isMax ? accent : `${accent}33`,
                border: isMax ? "none" : `1px solid ${accent}44`,
                transition: "height .3s",
              }}/>
              <div style={{ position: "absolute", bottom: -18, fontSize: 10, color: "var(--ink-500)" }}>{d[keyX]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const Mini = ({ label, v, d }) => (
  <div>
    <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{v}</div>
    <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{d} vs. abril</div>
  </div>
);

window.Admin = Admin;
window.getScheduleForDay = getScheduleForDay;
window.DAY_LABELS = DAY_LABELS;
