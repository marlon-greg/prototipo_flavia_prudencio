// portal-desktop.jsx — Desktop version of Portal do Aluno
// Reuses the same data, modals and screens (Anamnese, CancelModal, Reposicao slots, etc.)
// from portal.jsx — only the layout & navigation chrome are different.

const { REPOSICAO_SLOTS: PD_REPOS, PAGAMENTOS: PD_PAG } = window.STUDIO_DATA;

const PortalDesktop = ({ accent, layout, onLayoutChange }) => {
  const [screen, setScreen] = useState("home"); // home | anamnese | aulas | reposicao | plano | perfil
  const [anamneseDone, setAnamneseDone] = useState(false);
  const [toast, showToast] = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [faltasOpen, setFaltasOpen] = useState(false);
  const [whatsOpen, setWhatsOpen] = useState(false);
  const [alterarPlanoOpen, setAlterarPlanoOpen] = useState(false);
  const [nextClass, setNextClass] = useState({ data: "Quarta, 27/05", hora: "16h00", professor: "Flávia" });
  const [faltas, setFaltas] = useState(1);
  const [reposicoes, setReposicoes] = useState(2);
  const [bookedRepos, setBookedRepos] = useState(null);
  const [minutesUntilClass, setMinutesUntilClass] = useState(45);

  const aluno = { nome: "Ana Beatriz Carvalho", first: "Ana", planoFim: "12/06/2026", plano: "Mensal 2x" };

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)",
      paddingTop: 76,
      background: `radial-gradient(70% 50% at 50% 0%, rgba(200,230,220,.45), transparent 60%), var(--bg)`,
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "24px 40px 60px",
        display: "grid", gridTemplateColumns: "260px 1fr", gap: 28,
      }}>
        {/* LEFT SIDEBAR */}
        <PDSidebar aluno={aluno} screen={screen} onNav={setScreen} accent={accent} onWhatsApp={() => setWhatsOpen(true)}/>

        {/* MAIN AREA */}
        <main>
          {screen !== "anamnese" && (
            <PDTopBar aluno={aluno} accent={accent} screen={screen}
              onNav={setScreen}
              onAlterarPlano={() => setAlterarPlanoOpen(true)}
              showToast={showToast}/>
          )}

          {screen === "home" && (
            <PDHome
              aluno={aluno} accent={accent}
              nextClass={nextClass} faltas={faltas} reposicoes={reposicoes}
              anamneseDone={anamneseDone}
              onStartAnamnese={() => setScreen("anamnese")}
              onCancel={() => setCancelOpen(true)}
              onReposicao={() => setScreen("reposicao")}
              onFaltas={() => setFaltasOpen(true)}
              onWhatsApp={() => setWhatsOpen(true)}
              onAlterarPlano={() => setAlterarPlanoOpen(true)}
              bookedRepos={bookedRepos}
              onNav={setScreen}
            />
          )}
          {screen === "anamnese" && (
            <PDAnamnese accent={accent}
              onExit={() => setScreen("home")}
              onComplete={() => { setAnamneseDone(true); setScreen("home"); showToast("Anamnese registrada com sucesso"); }}/>
          )}
          {screen === "aulas" && (
            <PDAulas accent={accent} nextClass={nextClass} bookedRepos={bookedRepos} onBack={() => setScreen("home")}/>
          )}
          {screen === "reposicao" && (
            <PDReposicao accent={accent} disponivel={reposicoes}
              onBack={() => setScreen("home")}
              onBook={(slot) => {
                setBookedRepos(slot);
                setReposicoes(r => Math.max(0, r-1));
                setScreen("home");
                showToast(`Reposição confirmada: ${slot.dia} ${slot.data} • ${slot.hora}`);
              }}/>
          )}
          {screen === "plano" && (
            <PDPlano accent={accent} aluno={aluno} onBack={() => setScreen("home")} onWhatsApp={() => setWhatsOpen(true)} onAlterarPlano={() => setAlterarPlanoOpen(true)}/>
          )}
          {screen === "perfil" && (
            <PDPerfil accent={accent} aluno={aluno}/>
          )}
        </main>
      </div>

      {/* DEV controls */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px 30px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 6px 6px 14px",
            background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 999,
            fontSize: 11, color: "var(--ink-500)",
          }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }}>DEV · tempo até a aula</span>
          <div style={{ display: "flex", gap: 2, background: "var(--ink-50)", padding: 2, borderRadius: 999 }}>
            {[[15,"15min"],[45,"45min"],[120,"2h"],[600,"10h"]].map(([m, l]) => (
              <button key={m} onClick={() => setMinutesUntilClass(m)} style={{
                border: 0, padding: "4px 10px", borderRadius: 999, fontFamily: "inherit", fontSize: 11, fontWeight: 500,
                background: minutesUntilClass === m ? "var(--green-800)" : "transparent",
                color: minutesUntilClass === m ? "#fff" : "var(--ink-700)", cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
          {anamneseDone && (
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 4 }}
              onClick={() => { setAnamneseDone(false); setScreen("anamnese"); }}>
              Reabrir anamnese
            </button>
          )}
        </div>
        </div>
      </div>

      <CancelModal open={cancelOpen} onClose={() => setCancelOpen(false)} nextClass={nextClass}
        minutesUntilClass={minutesUntilClass} accent={accent}
        onConfirm={(isLast) => {
          setCancelOpen(false);
          if (isLast) { setFaltas(f => f+1); showToast("Cancelamento registrado. Falta computada."); }
          else        { setReposicoes(r => r+1); showToast("Aula cancelada. +1 reposição disponível."); }
          setNextClass(c => ({ ...c, data: "Sexta, 29/05", hora: "17h00" }));
        }} />
      <FaltasModal open={faltasOpen} onClose={() => setFaltasOpen(false)} accent={accent} aluno={aluno}/>
      <WhatsAppConfirmModal open={whatsOpen} onClose={() => setWhatsOpen(false)} accent={accent}/>
      <AlterarPlanoModal open={alterarPlanoOpen} onClose={() => setAlterarPlanoOpen(false)} accent={accent} aluno={aluno}
        onConfirm={(p) => { setAlterarPlanoOpen(false); showToast(`Solicitação enviada: trocar para ${p}`); }}/>
      {toast}
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const PDSidebar = ({ aluno, screen, onNav, accent, onWhatsApp }) => {
  const items = [
    { id: "home",      icon: "home",     label: "Início" },
    { id: "aulas",     icon: "calendar", label: "Minhas aulas" },
    { id: "reposicao", icon: "plus",     label: "Reposição" },
    { id: "plano",     icon: "cash",     label: "Meu plano" },
    { id: "perfil",    icon: "user",     label: "Perfil" },
  ];
  return (
    <aside style={{
      position: "sticky", top: 92, alignSelf: "start",
      background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 22,
      padding: 22, display: "flex", flexDirection: "column", gap: 6,
      boxShadow: "0 2px 10px rgba(15,51,38,.04)",
    }}>
      <div style={{ padding: "4px 4px 14px" }}>
        <StudioLogo size="md"/>
      </div>

      <div style={{
        background: "var(--teal-50)", borderRadius: 14, padding: 14, margin: "0 0 12px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: "var(--teal-200)",
          color: accent, display: "grid", placeItems: "center", fontWeight: 600, fontSize: 13,
        }}>AB</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{aluno.first}</div>
          <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{aluno.plano}</div>
        </div>
      </div>

      <div style={{
        fontSize: 10, color: "var(--ink-500)", letterSpacing: ".14em",
        textTransform: "uppercase", padding: "8px 8px 4px", fontWeight: 500,
      }}>Navegação</div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(it => {
          const active = screen === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 12px", borderRadius: 10, border: 0,
              background: active ? "var(--green-800)" : "transparent",
              color: active ? "#fff" : "var(--ink-700)",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 13.5, fontWeight: active ? 500 : 400,
              textAlign: "left", transition: "background .15s",
            }}>
              <Icon name={it.icon} size={17} stroke={active ? 1.9 : 1.6}/>
              <span style={{ flex: 1 }}>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--ink-100)", display: "flex", flexDirection: "column", gap: 2 }}>
        <button onClick={onWhatsApp} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
          background: "transparent", border: 0, color: "var(--ink-500)", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, textAlign: "left",
        }}>
          <Icon name="phone" size={15}/> <span>Falar com a Sílvia</span>
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
          background: "transparent", border: 0, color: "var(--ink-500)", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, textAlign: "left",
        }}>
          <Icon name="logout" size={15}/> <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

// ============================================================
// TOP BAR
// ============================================================
const PDTopBar = ({ aluno, accent, screen, onNav, onAlterarPlano, showToast }) => {
  const titles = {
    home:      ["Olá,", aluno.first],
    aulas:     ["Minhas", "aulas"],
    reposicao: ["Agendar", "reposição"],
    plano:     ["Meu", "plano"],
    perfil:    ["Meu", "perfil"],
  };
  const [pre, main] = titles[screen] || ["", ""];
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "end",
      padding: "4px 4px 28px",
    }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 4 }}>
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </div>
        <h2 style={{ fontSize: 38, letterSpacing: "-.025em", lineHeight: 1 }}>
          <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>{pre}</span>{" "}
          <span style={{ color: "var(--ink-900)" }}>{main}</span>
        </h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <button onClick={() => setNotifOpen(v => !v)}
          style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid var(--ink-100)", background: "#fff", display: "grid", placeItems: "center", position: "relative", cursor: "pointer" }}>
          <Icon name="bell" size={17}/>
          <span style={{ position:"absolute", top: 10, right: 11, width: 8, height: 8, borderRadius: 999, background: accent, border: "2px solid #fff" }}/>
        </button>
        <button onClick={() => setMenuOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "4px 12px 4px 4px",
            borderRadius: 999, border: "1px solid var(--ink-100)", background: "#fff",
            cursor: "pointer", fontFamily: "inherit",
          }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999, background: "var(--teal-200)",
            color: accent, display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12,
          }}>{aluno.first.slice(0, 1)}B</div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)" }}>{aluno.first}</span>
          <Icon name="chev_down" size={13} color="var(--ink-500)"/>
        </button>
        {notifOpen && (
          <div style={{ position: "absolute", top: 50, right: 0, zIndex: 5 }}>
            <NotifPopover onClose={() => setNotifOpen(false)} accent={accent}/>
          </div>
        )}
        {menuOpen && (
          <div style={{ position: "absolute", top: 50, right: 0, zIndex: 5 }}>
            <AvatarMenu onClose={() => setMenuOpen(false)}
              onPerfil={() => { setMenuOpen(false); onNav?.("perfil"); }}
              onEdit={() => { setMenuOpen(false); showToast?.("Abrindo editar dados"); }}
              onPlano={() => { setMenuOpen(false); onAlterarPlano?.(); }}
              accent={accent}/>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// HOME (dashboard, desktop)
// ============================================================
const PDHome = ({ aluno, accent, nextClass, faltas, reposicoes, anamneseDone,
                  onStartAnamnese, onCancel, onReposicao, onFaltas, onWhatsApp, onAlterarPlano, bookedRepos, onNav }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
    {/* LEFT COLUMN */}
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {!anamneseDone && (
        <div style={{
          background: accent, color: "#fff", borderRadius: 18, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.16)",
            display: "grid", placeItems: "center",
          }}><Icon name="file" size={22} color="#fff"/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>Complete sua anamnese</div>
            <div style={{ fontSize: 12.5, opacity: .8, marginTop: 3 }}>Obrigatório antes da primeira aula. Leva cerca de 5 minutos.</div>
          </div>
          <button className="btn btn-sm" onClick={onStartAnamnese} style={{ background: "#fff", color: accent, fontWeight: 600 }}>
            Preencher <Icon name="arrow_right" size={14}/>
          </button>
        </div>
      )}

      {/* Next class hero */}
      <div className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: accent }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 18 }}>
          <div>
            <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Sua próxima aula</span>
            <div style={{ fontSize: 13.5, color: "var(--ink-700)", marginTop: 12, fontWeight: 500 }}>{nextClass.data}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 56, fontWeight: 600, color: accent, letterSpacing: "-.03em", lineHeight: 1 }} className="num">{nextClass.hora}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-700)", marginTop: 8 }}>Pilates · com Flávia</div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button className="btn btn-soft btn-sm">
                <Icon name="pin" size={14}/> Como chegar
              </button>
              <button className="btn btn-danger btn-sm" onClick={onCancel}>
                Desmarcar
              </button>
            </div>
          </div>
          <div style={{
            width: 220, height: 160, borderRadius: 14, flexShrink: 0,
            background: "var(--teal-50)", padding: 18,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            border: "1px solid var(--teal-100)",
          }}>
            <div style={{ fontSize: 10, color: accent, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>
              Turma de hoje
            </div>
            <div>
              <div style={{ display: "flex", marginBottom: 8 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: 999,
                    background: i === 0 ? accent : "var(--teal-200)",
                    color: i === 0 ? "#fff" : accent,
                    border: "2px solid #fff", marginLeft: i ? -8 : 0,
                    display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600,
                  }}>{i === 0 ? "AB" : ""}</div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-700)" }}>3 lugares ocupados, 1 livre</div>
            </div>
          </div>
        </div>
      </div>

      {/* Counters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <PDCounter color="var(--warn)" bg="#FBEFC9" label="Faltas no mês" value={faltas} icon="info"
          help="Limite de 4 faltas por mês" onClick={onFaltas}/>
        <PDCounter color={accent} bg="var(--teal-100)" label="Reposições disponíveis" value={reposicoes} icon="sparkle"
          help="Acumuladas dos cancelamentos com antecedência" onClick={onReposicao}/>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 14 }}>Atalhos</h3>
          <span style={{ fontSize: 11, color: "var(--ink-500)" }}>Tudo o que você usa no dia a dia</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          <PDQuickAction icon="plus"     label="Agendar reposição"  accent={accent} onClick={onReposicao}/>
          <PDQuickAction icon="calendar" label="Minhas aulas"        accent={accent} onClick={() => onNav("aulas")}/>
          <PDQuickAction icon="cash"     label="Pagamentos"          accent={accent} onClick={() => onNav("plano")}/>
          <PDQuickAction icon="phone"    label="Falar com a Sílvia"  accent={accent} onClick={onWhatsApp}/>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Plano card */}
      <div className="card" onClick={onAlterarPlano} style={{ padding: 24, background: accent, color: "#fff", border: "none", cursor: "pointer", transition: "transform .12s, box-shadow .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,51,38,.18)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = ""; }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.65)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>Plano atual</span>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{aluno.plano}</div>
          </div>
          <span className="chip" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
            <span className="chip-dot"/>Em dia
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.18)" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Início</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }} className="num">12/02/2026</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Término</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }} className="num">{aluno.planoFim}</div>
          </div>
          <button onClick={() => onNav("plano")} style={{
            background: "rgba(255,255,255,.12)", border: 0, color: "#fff", padding: "6px 12px",
            borderRadius: 999, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
          }}>
            Detalhes →
          </button>
        </div>
      </div>

      {/* Próximas aulas */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 14 }}>Próximas aulas</h3>
          <button onClick={() => onNav("aulas")} style={{
            background: "transparent", border: 0, color: accent, fontFamily: "inherit",
            fontSize: 11.5, fontWeight: 500, cursor: "pointer",
          }}>Ver todas →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PDAulaRow data="Qua 27/05" hora="16h00" tag="Fixa" accent={accent} active/>
          {bookedRepos && (
            <PDAulaRow data={`${bookedRepos.dia.slice(0,3)} ${bookedRepos.data}`} hora={bookedRepos.hora} tag="Reposição" accent="var(--warn)" highlight/>
          )}
          <PDAulaRow data="Sex 29/05" hora="17h00" tag="Fixa" accent={accent}/>
          <PDAulaRow data="Seg 01/06" hora="17h00" tag="Fixa" accent={accent}/>
        </div>
      </div>

      {/* Próximo pagamento */}
      <div className="card" style={{ padding: 22, background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
        <span style={{ fontSize: 10.5, color: "var(--green-700)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>Próximo pagamento</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: "var(--green-900)" }} className="num">R$ 220,00</span>
          <span style={{ fontSize: 12, color: "var(--ink-700)" }}>05/06/2026</span>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 8, lineHeight: 1.5 }}>
          A Sílvia entrará em contato 3 dias antes para combinar a forma.
        </div>
      </div>
    </div>
  </div>
);

const PDCounter = ({ color, bg, label, value, icon, help, onClick }) => {
  const Wrap = onClick ? "button" : "div";
  return (
    <Wrap onClick={onClick} className="card" style={{
      padding: 22, background: bg, border: "none",
      cursor: onClick ? "pointer" : "default", fontFamily: "inherit", textAlign: "left", width: "100%",
      transition: "transform .12s, box-shadow .15s",
    }}
    onMouseEnter={onClick ? (e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,51,38,.10)"; } : undefined}
    onMouseLeave={onClick ? (e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = ""; } : undefined}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--ink-700)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 44, fontWeight: 600, color, marginTop: 6, letterSpacing: "-.02em", lineHeight: 1 }} className="num">{value}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name={icon} size={18} color={color}/>
          {onClick && <Icon name="chev_right" size={14} color={color} style={{ opacity: .6 }}/>}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 8, opacity: .75 }}>{help}</div>
    </Wrap>
  );
};

const PDQuickAction = ({ icon, label, onClick, accent }) => (
  <button onClick={onClick} style={{
    border: "1px solid var(--ink-100)", borderRadius: 14, background: "#fff",
    padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "start", gap: 12,
    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
    transition: "transform .12s, box-shadow .15s",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,51,38,.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10, background: "var(--teal-50)",
      display: "grid", placeItems: "center", color: accent,
    }}>
      <Icon name={icon} size={16}/>
    </div>
    <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)" }}>{label}</span>
  </button>
);

const PDAulaRow = ({ data, hora, tag, accent, active, highlight }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 10,
    background: highlight ? "#FFFAEC" : (active ? "var(--teal-50)" : "var(--ink-50)"),
    border: active ? "1px solid var(--teal-100)" : "1px solid transparent",
  }}>
    <div style={{
      width: 6, height: 32, borderRadius: 999, background: accent, flexShrink: 0,
    }}/>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{data}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }} className="num">{hora}</div>
    </div>
    <span style={{
      fontSize: 10.5, padding: "3px 9px", borderRadius: 999, fontWeight: 500,
      background: highlight ? "#FBEFC9" : "#fff",
      color: highlight ? "#7A5A0A" : "var(--ink-700)",
      border: highlight ? "none" : "1px solid var(--ink-100)",
    }}>{tag}</span>
  </div>
);

// ============================================================
// ANAMNESE (desktop)
// ============================================================
const PDAnamnese = ({ accent, onComplete, onExit }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    nome: "Ana Beatriz Carvalho", nasc: "", profissao: "", peso: "", altura: "",
    queixa: "", dor: 4, localDor: "",
    hipertensao: false, diabetes: false, cirurgias: "", medicamentos: "", gravida: "nao",
    sono: "regular", postura: "sentado", atividade: "ocasional",
    aceiteImagem: false, aceiteTermos: false,
  });
  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));
  const steps = ["Dados pessoais", "Queixa & dor", "Histórico de saúde", "Hábitos"];

  const canNext = () => {
    if (step === 0) return data.nome && data.nasc && data.profissao;
    if (step === 1) return data.queixa && data.localDor;
    if (step === 3) return data.aceiteImagem && data.aceiteTermos;
    return true;
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button onClick={onExit} aria-label="Voltar" style={{
          background: "var(--green-800)", border: 0, width: 42, height: 42, borderRadius: 999,
          display: "grid", placeItems: "center", cursor: "pointer", color: "#fff",
          boxShadow: "0 4px 14px rgba(31,74,61,.25)", flexShrink: 0,
        }}>
          <Icon name="chev_left" size={18} color="#fff" stroke={2}/>
        </button>
        <div>
          <span className="section-eyebrow" style={{ color: accent, fontSize: 11 }}>Primeiro acesso</span>
          <h2 style={{ fontSize: 32, marginTop: 4, letterSpacing: "-.02em" }}>Anamnese inicial</h2>
        </div>
      </div>

      <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.55, marginTop: 0, marginBottom: 28, maxWidth: 540 }}>
        Etapa obrigatória antes da primeira aula. Suas respostas ajudam a Flávia a planejar a prática.
      </p>

      {/* Stepper */}
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= step ? accent : "var(--ink-100)",
              transition: "background .2s",
            }}/>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-500)", marginBottom: 24 }}>
          <span>Passo {step+1} de {steps.length}</span>
          <span style={{ fontWeight: 500, color: accent }}>{steps[step]}</span>
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <MField label="Nome completo" v={data.nome} onChange={v => upd("nome", v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <MField label="Data de nascimento" v={data.nasc} onChange={v => upd("nasc", v)} ph="dd/mm/aaaa" mask="date"/>
              <MField label="Profissão" v={data.profissao} onChange={v => upd("profissao", v)} ph="Ex: professora"/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <MField label="Peso (kg)" v={data.peso} onChange={v => upd("peso", v.replace(/\D/g, ""))} ph="65"/>
              <MField label="Altura (cm)" v={data.altura} onChange={v => upd("altura", v.replace(/\D/g, ""))} ph="165"/>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MField label="Qual sua queixa principal?" v={data.queixa} onChange={v => upd("queixa", v)} ph="Descreva o que te trouxe ao studio" textarea/>
            <MField label="Onde dói principalmente?" v={data.localDor} onChange={v => upd("localDor", v)} ph="Ex: lombar, ombro direito"/>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)", marginBottom: 10, display:"block" }}>
                Nível da dor agora
              </label>
              <PainScale value={data.dor} onChange={v => upd("dor", v)} accent={accent}/>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <CheckRow label="Hipertensão" checked={data.hipertensao} onChange={v => upd("hipertensao", v)} accent={accent}/>
              <CheckRow label="Diabetes" checked={data.diabetes} onChange={v => upd("diabetes", v)} accent={accent}/>
            </div>
            <MField label="Cirurgias anteriores" v={data.cirurgias} onChange={v => upd("cirurgias", v)} ph="Ex: hérnia, joelho"/>
            <MField label="Medicamentos em uso" v={data.medicamentos} onChange={v => upd("medicamentos", v)} ph="Liste medicamentos contínuos" textarea/>
            <Radios label="Está grávida?" value={data.gravida} onChange={v => upd("gravida", v)} accent={accent}
              options={[["nao","Não"],["sim","Sim"],["na","N/A"]]}/>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Radios label="Qualidade do sono" value={data.sono} onChange={v => upd("sono", v)} accent={accent}
              options={[["ruim","Ruim"],["regular","Regular"],["boa","Boa"]]}/>
            <Radios label="Postura no trabalho" value={data.postura} onChange={v => upd("postura", v)} accent={accent}
              options={[["sentado","Sentado"],["em-pe","Em pé"],["misto","Misto"]]}/>
            <Radios label="Atividade física fora do studio" value={data.atividade} onChange={v => upd("atividade", v)} accent={accent}
              options={[["nenhuma","Nenhuma"],["ocasional","Ocasional"],["regular","Regular"]]}/>
            <div style={{ marginTop: 8, padding: 18, background: "var(--teal-50)", borderRadius: 14 }}>
              <CheckRow label={<>Aceito o <b>Termo de Imagem</b> para fotos e vídeos durante as aulas</>}
                checked={data.aceiteImagem} onChange={v => upd("aceiteImagem", v)} accent={accent}/>
              <div style={{ height: 12 }}/>
              <CheckRow label={<>Confirmo que as informações acima são verdadeiras</>}
                checked={data.aceiteTermos} onChange={v => upd("aceiteTermos", v)} accent={accent}/>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "space-between" }}>
          {step > 0 ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(s => s-1)}>
              <Icon name="chev_left" size={14}/> Voltar
            </button>
          ) : <span/>}
          <button
            className="btn btn-primary"
            disabled={!canNext()}
            style={{
              background: canNext() ? accent : "var(--ink-200)",
              color: canNext() ? "#fff" : "var(--ink-500)",
              cursor: canNext() ? "pointer" : "not-allowed", boxShadow:"none",
            }}
            onClick={() => step === 3 ? onComplete() : setStep(s => s+1)}>
            {step === 3 ? "Finalizar anamnese" : "Continuar"} <Icon name="arrow_right" size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AULAS (desktop)
// ============================================================
const PDAulas = ({ accent, nextClass, bookedRepos, onBack }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22 }}>
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--ink-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14 }}>Histórico completo</h3>
        <div style={{ display: "flex", gap: 4, background: "var(--ink-50)", padding: 4, borderRadius: 8 }}>
          {["Todas","Próximas","Realizadas"].map((l, i) => (
            <button key={l} style={{
              padding: "6px 12px", border: 0, borderRadius: 6, fontSize: 11.5,
              fontFamily: "inherit", fontWeight: 500, cursor: "pointer",
              background: i === 0 ? "#fff" : "transparent",
              color: i === 0 ? accent : "var(--ink-700)",
              boxShadow: i === 0 ? "0 1px 3px rgba(0,0,0,.06)" : "none",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {[
        { when: "Próxima", data: nextClass.data, hora: nextClass.hora, tipo: "Aula fixa", icon: "calendar", state: "next" },
        ...(bookedRepos ? [{ when: "Reposição", data: `${bookedRepos.dia} · ${bookedRepos.data}`, hora: bookedRepos.hora, tipo: "Reposição agendada", icon: "sparkle", state: "repo" }] : []),
        { when: "Anterior", data: "Sex, 22/05", hora: "17h00", tipo: "Realizada", icon: "check", state: "past" },
        { when: "Anterior", data: "Qua, 20/05", hora: "17h00", tipo: "Realizada", icon: "check", state: "past" },
        { when: "Anterior", data: "Sex, 15/05", hora: "17h00", tipo: "Falta justificada", icon: "info", state: "warn" },
        { when: "Anterior", data: "Qua, 13/05", hora: "17h00", tipo: "Realizada", icon: "check", state: "past" },
        { when: "Anterior", data: "Seg, 11/05", hora: "17h00", tipo: "Reposição realizada", icon: "sparkle", state: "past" },
      ].map((a, i) => (
        <div key={i} style={{
          padding: "16px 22px", display: "flex", alignItems: "center", gap: 14,
          borderTop: i ? "1px solid var(--ink-100)" : "none",
          background: a.state === "next" ? "var(--teal-50)" : a.state === "repo" ? "#FFFAEC" : "transparent",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: a.state === "warn" ? "#FBEFC9" : (a.state === "next" ? "var(--teal-100)" : a.state === "repo" ? "#FBEFC9" : "var(--ink-50)"),
            color: a.state === "warn" ? "var(--warn)" : (a.state === "past" ? "var(--ink-500)" : a.state === "repo" ? "var(--warn)" : accent),
            display: "grid", placeItems: "center",
          }}>
            <Icon name={a.icon} size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase" }}>{a.when}</div>
            <div style={{ fontSize: 14, marginTop: 2, fontWeight: 500 }}>{a.data} · <span className="num">{a.hora}</span></div>
          </div>
          <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{a.tipo}</span>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ alignSelf: "start" }}>
        <Icon name="chev_left" size={14}/> Voltar para o início
      </button>
      <div className="card" style={{ padding: 22 }}>
        <h4 style={{ fontSize: 13 }}>Resumo do mês</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          <SmallStat label="Aulas realizadas" v="6"/>
          <SmallStat label="Faltas" v="1"/>
          <SmallStat label="Reposições" v="2"/>
          <SmallStat label="Taxa de presença" v="86%" highlight/>
        </div>
      </div>
      <div className="card" style={{ padding: 22, background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
        <h4 style={{ fontSize: 13 }}>Dica da Flávia</h4>
        <p style={{ fontSize: 12.5, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.55 }}>
          Manter constância de 2 aulas por semana costuma trazer resultado nos próximos 30 dias.
        </p>
      </div>
    </div>
  </div>
);

const SmallStat = ({ label, v, highlight }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 10, borderBottom: "1px solid var(--ink-100)" }}>
    <span style={{ fontSize: 12, color: "var(--ink-700)" }}>{label}</span>
    <span style={{ fontSize: highlight ? 22 : 16, fontWeight: 600, color: highlight ? "var(--green-700)" : "var(--ink-900)" }} className="num">{v}</span>
  </div>
);

// ============================================================
// REPOSICAO (desktop) — grid amplo
// ============================================================
const PDReposicao = ({ accent, disponivel, onBack, onBook }) => {
  const [selected, setSelected] = useState(null);
  const byDay = PD_REPOS.reduce((acc, s) => {
    const k = `${s.dia} • ${s.data}`;
    (acc[k] = acc[k] || []).push(s); return acc;
  }, {});

  return (
    <div>
      <div style={{
        background: "var(--teal-50)", borderRadius: 14, padding: 16,
        display: "flex", gap: 14, alignItems: "center", marginBottom: 22,
        border: "1px solid var(--teal-100)",
      }}>
        <Icon name="info" size={20} color={accent}/>
        <div style={{ flex: 1, fontSize: 13, color: "var(--ink-700)" }}>
          Mostramos apenas os horários com <b>vagas livres</b>. Clique em um horário para reservar.
        </div>
        <span className="chip chip-teal">
          <span className="chip-dot"/>{disponivel} reposição{disponivel !== 1 ? "ões" : ""} disponível{disponivel !== 1 ? "is" : ""}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {Object.entries(byDay).map(([day, slots]) => (
          <div key={day}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
              fontSize: 11.5, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500,
            }}>
              <span style={{ width: 24, height: 1, background: "var(--ink-200)" }}/>
              {day}
              <span style={{ flex: 1, height: 1, background: "var(--ink-100)" }}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {slots.map(s => {
                const sel = selected?.id === s.id;
                return (
                  <button key={s.id} onClick={() => setSelected(s)} style={{
                    background: sel ? accent : "#fff",
                    color: sel ? "#fff" : "var(--ink-900)",
                    border: `1.5px solid ${sel ? accent : "var(--ink-100)"}`,
                    borderRadius: 16, padding: "18px 18px", textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 6,
                    transition: "all .15s",
                  }}>
                    <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em" }} className="num">{s.hora}</span>
                    <span style={{ fontSize: 12, color: sel ? "rgba(255,255,255,.75)" : "var(--ink-500)" }}>
                      {s.vagas} {s.vagas === 1 ? "vaga" : "vagas"} livre{s.vagas === 1 ? "" : "s"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating confirm bar */}
      <div style={{
        position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
        background: "#fff", borderRadius: 999, boxShadow: "0 14px 38px rgba(15,51,38,.18)",
        padding: "10px 10px 10px 22px", display: "flex", gap: 14, alignItems: "center",
        border: "1px solid var(--ink-100)", zIndex: 50,
        opacity: selected ? 1 : 0, pointerEvents: selected ? "auto" : "none",
        transition: "opacity .2s",
      }}>
        {selected && (
          <>
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{selected.dia} · {selected.data}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Reposição às {selected.hora}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Cancelar</button>
            <button className="btn btn-primary btn-sm" style={{ background: accent }} onClick={() => onBook(selected)}>
              Confirmar reposição
            </button>
          </>
        )}
      </div>

      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginTop: 28 }}>
        <Icon name="chev_left" size={14}/> Voltar para o início
      </button>
    </div>
  );
};

// ============================================================
// MEU PLANO (desktop)
// ============================================================
const PDPlano = ({ accent, aluno, onBack, onWhatsApp, onAlterarPlano }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="card" onClick={onAlterarPlano} style={{ background: accent, color: "#fff", border: "none", padding: 28, cursor: "pointer", transition: "transform .12s, box-shadow .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,51,38,.18)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = ""; }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", letterSpacing: ".1em", textTransform:"uppercase" }}>Plano atual</div>
            <div style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>{aluno.plano}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 6 }}>Renovação automática · cobrança mensal</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <span className="chip" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
              <span className="chip-dot"/>Em dia
            </span>
            <span style={{
              fontSize: 11, padding: "5px 11px", background: "rgba(255,255,255,.16)", color: "#fff",
              borderRadius: 999, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap",
            }}>
              Alterar plano <Icon name="chev_right" size={11} color="#fff"/>
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.18)", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Início</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }} className="num">12/02/2026</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Término</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }} className="num">{aluno.planoFim}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Valor mensal</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }} className="num">R$ 220,00</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--ink-100)" }}>
          <h3 style={{ fontSize: 14 }}>Histórico de pagamentos</h3>
        </div>
        {PD_PAG.map((p, i) => (
          <div key={i} style={{
            padding: "14px 22px",
            borderTop: i ? "1px solid var(--ink-100)" : "none",
            display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr .8fr", alignItems: "center", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.mes}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }} className="num">{p.data}</div>
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-700)" }}>{p.forma}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }} className="num">{p.valor}</span>
            <span style={{ justifySelf: "end" }}><StatusPill status={p.status}/></span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ alignSelf: "start" }}>
        <Icon name="chev_left" size={14}/> Voltar para o início
      </button>

      <div className="card" style={{ padding: 22, background: "var(--teal-50)", border: "1px solid var(--teal-100)" }}>
        <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Próxima renovação</span>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>{aluno.planoFim}</div>
        <p style={{ fontSize: 12.5, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.55 }}>
          A Sílvia entrará em contato uma semana antes para confirmar a renovação e combinar a forma de pagamento.
        </p>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h4 style={{ fontSize: 13 }}>Formas de pagamento aceitas</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
          {["PIX (preferencial)", "Cartão de crédito", "Cartão de débito", "Dinheiro no balcão"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-700)" }}>
              <Icon name="check" size={14} color={accent} stroke={2.4}/>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h4 style={{ fontSize: 13 }}>Trocar de plano?</h4>
        <p style={{ fontSize: 12.5, color: "var(--ink-700)", marginTop: 8, lineHeight: 1.55 }}>
          Pode alternar entre planos a qualquer momento. Fale com a Sílvia para combinar.
        </p>
        <button className="btn btn-soft btn-sm" style={{ marginTop: 14 }} onClick={onWhatsApp}>
          <Icon name="phone" size={14}/> Falar com a Sílvia
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// PERFIL (desktop)
// ============================================================
const PDPerfil = ({ accent, aluno }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ fontSize: 16 }}>Dados pessoais</h3>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <PDField label="Nome completo" v={aluno.nome}/>
        <PDField label="CPF"           v="082.451.330-08" mono/>
        <PDField label="Telefone"      v="(31) 99812-4421" mono/>
        <PDField label="E-mail"        v="ana.carvalho@gmail.com"/>
        <PDField label="Endereço"      v="Rua das Acácias 142, Jardim Canadá — Belo Horizonte/MG"/>
        <PDField label="Aniversário"   v="14/08/1989" mono/>
      </div>
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}>
        <Icon name="edit" size={14}/> Editar dados
      </button>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 16 }}>Anamnese</h3>
        <p style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 6 }}>
          Última atualização: 12/02/2026
        </p>
        <div style={{ padding: 16, background: "var(--teal-50)", borderRadius: 12, marginTop: 14 }}>
          <div style={{ fontSize: 11, color: "var(--green-700)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>Queixa principal</div>
          <p style={{ fontSize: 13, color: "var(--ink-900)", marginTop: 6, lineHeight: 1.5 }}>
            Dor lombar ao final do dia de trabalho. Sente travamento ao levantar.
          </p>
        </div>
        <button className="btn btn-soft btn-sm" style={{ marginTop: 14 }}>
          Ver anamnese completa <Icon name="arrow_right" size={14}/>
        </button>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 16 }}>Notificações</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <PDToggle label="Lembrete de aula (1h antes)" on/>
          <PDToggle label="Confirmação de pagamento" on/>
          <PDToggle label="Novidades do studio"/>
        </div>
      </div>
    </div>
  </div>
);

const PDField = ({ label, v, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid var(--ink-100)" }}>
    <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{label}</span>
    <span style={{ fontSize: 13, color: "var(--ink-900)", fontFamily: mono ? "'JetBrains Mono'" : "inherit" }}>{v}</span>
  </div>
);
const PDToggle = ({ label, on }) => {
  const [state, setState] = useState(!!on);
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, cursor: "pointer" }}>
      <span style={{ fontSize: 13, color: "var(--ink-900)" }}>{label}</span>
      <span onClick={() => setState(!state)} style={{
        width: 36, height: 20, borderRadius: 999,
        background: state ? "var(--green-700)" : "var(--ink-200)",
        position: "relative", transition: "background .15s",
      }}>
        <span style={{
          position: "absolute", top: 2, left: state ? 18 : 2,
          width: 16, height: 16, borderRadius: 999, background: "#fff",
          transition: "left .15s",
        }}/>
      </span>
    </label>
  );
};

window.PortalDesktop = PortalDesktop;
