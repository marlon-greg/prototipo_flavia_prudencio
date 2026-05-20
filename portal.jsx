// portal.jsx — Portal do Aluno (mobile)

const { REPOSICAO_SLOTS, PAGAMENTOS } = window.STUDIO_DATA;

const Portal = ({ accent, layout, onLayoutChange }) => {
  const [screen, setScreen] = useState("home"); // anamnese | home | reposicao | plano | aulas
  const [anamneseDone, setAnamneseDone] = useState(false);
  const [toast, showToast] = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [faltasOpen, setFaltasOpen] = useState(false);
  const [whatsOpen, setWhatsOpen] = useState(false);
  const [alterarPlanoOpen, setAlterarPlanoOpen] = useState(false);
  const [nextClass, setNextClass] = useState({ data: "Quinta-feira, 27/05", hora: "08h00", horaFim: "09h00", professor: "Flávia" });
  const [faltas, setFaltas] = useState(1);
  const [reposicoes, setReposicoes] = useState(2);
  const [bookedRepos, setBookedRepos] = useState(null);
  // Minutes until next class — in a real app this is computed from class.startTime - Date.now().
  // Defaults to 45 (45min) so the "justificativa obrigatória" branch is visible on first open.
  const [minutesUntilClass, setMinutesUntilClass] = useState(45);

  const aluno = { nome: "Ana Beatriz", first: "Ana", planoFim: "12/06/2026", plano: "Mensal 2x" };

  return (
    <div className="phone-stage">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div className="phone">
          <div className="phone-screen">
            <IOSStatusBar />
            {!anamneseDone && screen === "anamnese" ? (
              <Anamnese accent={accent}
                onExit={() => setScreen("home")}
                onComplete={() => { setAnamneseDone(true); setScreen("home"); showToast("Anamnese registrada com sucesso"); }} />
            ) : screen === "home" ? (
              <Dashboard accent={accent} aluno={aluno} nextClass={nextClass}
                         faltas={faltas} reposicoes={reposicoes}
                         anamneseDone={anamneseDone}
                         onStartAnamnese={() => setScreen("anamnese")}
                         onCancel={() => setCancelOpen(true)}
                         onReposicao={() => setScreen("reposicao")}
                         onFaltas={() => setFaltasOpen(true)}
                         onAulas={() => setScreen("aulas")}
                         onPlano={() => setScreen("plano")}
                         onWhatsApp={() => setWhatsOpen(true)}
                         onProfile={() => setScreen("profile")}
                         onAlterarPlano={() => setAlterarPlanoOpen(true)}
                         showToast={showToast}/>
            ) : screen === "reposicao" ? (
              <Reposicao accent={accent}
                         disponivel={reposicoes}
                         onBack={() => setScreen("home")}
                         onBook={(slot) => {
                           setBookedRepos(slot);
                           setReposicoes(r => Math.max(0, r-1));
                           setScreen("home");
                           showToast(`Reposição confirmada: ${slot.dia} ${slot.data} • ${slot.hora}`);
                         }} />
            ) : screen === "plano" ? (
              <MeuPlano accent={accent} aluno={aluno}
                onBack={() => setScreen("home")}
                onAlterarPlano={() => setAlterarPlanoOpen(true)}/>
            ) : screen === "aulas" ? (
              <Aulas accent={accent} nextClass={nextClass} bookedRepos={bookedRepos} onBack={() => setScreen("home")} />
            ) : screen === "profile" ? (
              <Perfil accent={accent} aluno={aluno}
                onBack={() => setScreen("home")}
                onReabrirAnamnese={() => { setAnamneseDone(false); setScreen("anamnese"); }}
                onTermo={() => showToast("Abrindo Termo de Compromisso (PDF)")}
                onLogout={() => showToast("Sessão encerrada com sucesso")}/>
            ) : null}

            {anamneseDone && screen !== "anamnese" && (
              <BottomNav screen={screen} onSwitch={setScreen} accent={accent}/>
            )}

            <CancelModal open={cancelOpen} onClose={() => setCancelOpen(false)} nextClass={nextClass}
              minutesUntilClass={minutesUntilClass} accent={accent}
              onConfirm={(isLast) => {
                setCancelOpen(false);
                if (isLast) { setFaltas(f => f+1); showToast("Cancelamento registrado. Falta computada."); }
                else        { setReposicoes(r => r+1); showToast("Aula cancelada. +1 reposição disponível."); }
                setNextClass(c => ({ ...c, data: "Sexta-feira, 29/05", hora: "17h00", horaFim: "18h00" }));
              }} />
            <FaltasModal open={faltasOpen} onClose={() => setFaltasOpen(false)} accent={accent} aluno={aluno}/>
            <WhatsAppConfirmModal open={whatsOpen} onClose={() => setWhatsOpen(false)} accent={accent}/>
            <AlterarPlanoModal open={alterarPlanoOpen} onClose={() => setAlterarPlanoOpen(false)} accent={accent} aluno={aluno}
              onConfirm={(p) => { setAlterarPlanoOpen(false); showToast(`Solicitação enviada: trocar para ${p}`); }}/>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          {!anamneseDone && screen !== "anamnese" && (
            <button className="btn btn-soft btn-sm" onClick={() => setScreen("anamnese")}>
              Simular 1º acesso (Anamnese)
            </button>
          )}
          {anamneseDone && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setAnamneseDone(false); setScreen("anamnese"); }}>
              Reabrir anamnese
            </button>
          )}
          {/* DEV: simulate minutes until next class (drives the "em cima da hora" branch) */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 6px 5px 12px",
            background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 999,
            fontSize: 11, color: "var(--ink-500)",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }}>DEV · tempo até a aula</span>
            <div style={{ display: "flex", gap: 2, background: "var(--ink-50)", padding: 2, borderRadius: 999 }}>
              {[[15, "15min"], [45, "45min"], [120, "2h"], [600, "10h"]].map(([m, l]) => (
                <button key={m} onClick={() => setMinutesUntilClass(m)} style={{
                  border: 0, padding: "4px 8px", borderRadius: 999, fontFamily: "inherit", fontSize: 11, fontWeight: 500,
                  background: minutesUntilClass === m ? "var(--green-800)" : "transparent",
                  color: minutesUntilClass === m ? "#fff" : "var(--ink-700)",
                  cursor: "pointer",
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        {toast}
      </div>
    </div>
  );
};

// ============================================================
// ANAMNESE (4 steps)
// ============================================================
const Anamnese = ({ accent, onComplete, onExit }) => {
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
    if (step === 2) return data.medicamentos !== "" || true;
    if (step === 3) return data.aceiteImagem && data.aceiteTermos;
    return true;
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 28px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0 6px" }}>
        <button onClick={onExit} aria-label="Voltar" style={{
          background: "var(--green-800)", border: 0, width: 36, height: 36, borderRadius: 999,
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
          color: "#fff", boxShadow: "0 4px 12px rgba(31,74,61,.25)",
        }}>
          <Icon name="chev_left" size={17} color="#fff" stroke={2}/>
        </button>
        <div style={{ flex: 1 }}>
          <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Primeiro acesso</span>
          <h2 style={{ fontSize: 20, marginTop: 4, letterSpacing: "-.02em" }}>Anamnese inicial</h2>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 4, marginBottom: 14, lineHeight: 1.5 }}>
        Etapa obrigatória. Suas respostas ajudam a Flávia a planejar suas aulas.
      </p>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= step ? accent : "var(--ink-100)",
            transition: "background .2s",
          }}/>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-500)", marginBottom: 18 }}>
        <span>Passo {step+1} de {steps.length}</span>
        <span style={{ fontWeight: 500, color: accent }}>{steps[step]}</span>
      </div>

      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MField label="Nome completo" v={data.nome} onChange={v => upd("nome", v)} />
          <MField label="Data de nascimento" v={data.nasc} onChange={v => upd("nasc", v)} ph="dd/mm/aaaa" mask="date"/>
          <MField label="Profissão" v={data.profissao} onChange={v => upd("profissao", v)} ph="Ex: professora"/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MField label="Peso (kg)" v={data.peso} onChange={v => upd("peso", v.replace(/\D/g, ""))} ph="65"/>
            <MField label="Altura (cm)" v={data.altura} onChange={v => upd("altura", v.replace(/\D/g, ""))} ph="165"/>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <MField label="Qual sua queixa principal?" v={data.queixa} onChange={v => upd("queixa", v)} ph="Descreva o que te trouxe ao studio" textarea/>
          <MField label="Onde dói principalmente?" v={data.localDor} onChange={v => upd("localDor", v)} ph="Ex: lombar, ombro direito"/>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)", marginBottom: 8, display:"block" }}>
              Nível da dor agora
            </label>
            <PainScale value={data.dor} onChange={v => upd("dor", v)} accent={accent} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <CheckRow label="Hipertensão"
            checked={data.hipertensao} onChange={v => upd("hipertensao", v)} accent={accent}/>
          <CheckRow label="Diabetes"
            checked={data.diabetes} onChange={v => upd("diabetes", v)} accent={accent}/>
          <MField label="Cirurgias anteriores" v={data.cirurgias} onChange={v => upd("cirurgias", v)} ph="Ex: hérnia, joelho" />
          <MField label="Medicamentos em uso" v={data.medicamentos} onChange={v => upd("medicamentos", v)} ph="Liste medicamentos contínuos" textarea/>
          <Radios label="Está grávida?" value={data.gravida} onChange={v => upd("gravida", v)} accent={accent}
            options={[["nao","Não"],["sim","Sim"],["na","N/A"]]}/>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Radios label="Qualidade do sono"
            value={data.sono} onChange={v => upd("sono", v)} accent={accent}
            options={[["ruim","Ruim"],["regular","Regular"],["boa","Boa"]]}/>
          <Radios label="Postura no trabalho"
            value={data.postura} onChange={v => upd("postura", v)} accent={accent}
            options={[["sentado","Sentado"],["em-pe","Em pé"],["misto","Misto"]]}/>
          <Radios label="Atividade física fora do studio"
            value={data.atividade} onChange={v => upd("atividade", v)} accent={accent}
            options={[["nenhuma","Nenhuma"],["ocasional","Ocasional"],["regular","Regular"]]}/>
          <div style={{ marginTop: 12, padding: 16, background: "var(--teal-50)", borderRadius: 14 }}>
            <CheckRow label={<>Aceito o <b>Termo de Imagem</b> para fotos e vídeos durante as aulas</>}
              checked={data.aceiteImagem} onChange={v => upd("aceiteImagem", v)} accent={accent} />
            <div style={{ height: 10 }}/>
            <CheckRow label={<>Confirmo que as informações acima são verdadeiras</>}
              checked={data.aceiteTermos} onChange={v => upd("aceiteTermos", v)} accent={accent}/>
          </div>
        </div>
      )}

      <div style={{ marginTop: "auto", paddingTop: 22, display: "flex", gap: 8 }}>
        {step > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ flex: "0 0 auto" }} onClick={() => setStep(s => s-1)}>
            <Icon name="chev_left" size={14}/> Voltar
          </button>
        )}
        <button
          className="btn btn-primary btn-sm"
          disabled={!canNext()}
          style={{
            flex: 1, background: canNext() ? accent : "var(--ink-200)",
            color: canNext() ? "#fff" : "var(--ink-500)",
            cursor: canNext() ? "pointer" : "not-allowed", boxShadow:"none",
          }}
          onClick={() => step === 3 ? onComplete() : setStep(s => s+1)}
        >
          {step === 3 ? "Finalizar anamnese" : "Continuar"} <Icon name="arrow_right" size={14}/>
        </button>
      </div>
    </div>
  );
};

const PainScale = ({ value, onChange, accent }) => {
  const labelFor = (v) => v === 0 ? "Sem dor" : v <= 3 ? "Leve" : v <= 6 ? "Moderada" : v <= 8 ? "Forte" : "Muito forte";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button key={i} onClick={() => onChange(i)} style={{
            flex: 1, aspectRatio: "1", border: 0, borderRadius: 8,
            background: i <= value
              ? `oklch(${Math.max(.55, .75 - i*0.02)} ${0.07 + i*0.012} ${145 - i*5})`
              : "var(--ink-50)",
            color: i <= value ? "#fff" : "var(--ink-500)",
            fontWeight: 500, fontSize: 12, cursor: "pointer",
            transition: "transform .1s",
          }} className="num">{i}</button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--ink-500)" }}>
        <span>Sem dor</span>
        <span style={{ color: accent, fontWeight: 500 }}>{labelFor(value)}</span>
        <span>Insuportável</span>
      </div>
    </div>
  );
};

const MField = ({ label, v, onChange, ph, textarea, mask }) => {
  const handle = (e) => {
    let val = e.target.value;
    if (mask === "date") val = val.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").replace(/(\d{2})(\d)/,"$1/$2").slice(0,10);
    onChange(val);
  };
  return (
    <div className="field">
      <label>{label}</label>
      {textarea
        ? <textarea value={v} onChange={(e) => onChange(e.target.value)} placeholder={ph} rows={3}/>
        : <input value={v} onChange={handle} placeholder={ph}/>
      }
    </div>
  );
};

const CheckRow = ({ label, checked, onChange, accent }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
    <span style={{
      width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${checked ? accent : "var(--ink-200)"}`,
      background: checked ? accent : "#fff", display: "grid", placeItems: "center",
      transition: "all .15s", flexShrink: 0,
    }}>
      {checked && <Icon name="check" size={14} color="#fff" stroke={2.5}/>}
    </span>
    <span style={{ fontSize: 13, color: "var(--ink-900)", lineHeight: 1.4 }}>{label}</span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ display: "none" }}/>
  </label>
);

const Radios = ({ label, value, onChange, options, accent }) => (
  <div>
    <label style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-700)", display:"block", marginBottom: 8 }}>{label}</label>
    <div style={{ display: "flex", gap: 6, background: "var(--ink-50)", padding: 4, borderRadius: 10 }}>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} style={{
          flex: 1, padding: "8px 0", border: 0, borderRadius: 7,
          background: value === v ? "#fff" : "transparent",
          boxShadow: value === v ? "0 1px 3px rgba(0,0,0,.06)" : "none",
          color: value === v ? accent : "var(--ink-700)",
          fontSize: 12.5, fontWeight: 500, cursor: "pointer",
        }}>{l}</button>
      ))}
    </div>
  </div>
);

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard = ({ accent, aluno, nextClass, faltas, reposicoes, anamneseDone, onStartAnamnese, onCancel, onReposicao, onFaltas, onAulas, onPlano, onWhatsApp, onProfile, onAlterarPlano, showToast }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
  <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 100px" }}>
    {/* Greeting */}
    <div style={{ paddingTop: 10, paddingBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--ink-500)" }}>Olá,</div>
        <h2 style={{ fontSize: 22, marginTop: 2 }}>{aluno.first}</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        <button onClick={() => setNotifOpen(v => !v)}
          style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--ink-100)", background: "#fff", display: "grid", placeItems: "center", position: "relative", cursor: "pointer" }}>
          <Icon name="bell" size={16}/>
          <span style={{ position:"absolute", top: 8, right: 9, width: 8, height: 8, borderRadius: 999, background: accent, border: "2px solid #fff" }}/>
        </button>
        <button onClick={() => setMenuOpen(v => !v)} style={{
          width: 38, height: 38, borderRadius: 999, background: "var(--teal-200)", color: accent,
          display: "grid", placeItems: "center", fontWeight: 600, fontSize: 13, border: 0, cursor: "pointer",
          fontFamily: "inherit",
        }}>AB</button>
        {notifOpen && <NotifPopover onClose={() => setNotifOpen(false)} accent={accent}/>}
        {menuOpen && <AvatarMenu onClose={() => setMenuOpen(false)}
          onPerfil={() => { setMenuOpen(false); onProfile?.(); }}
          onEdit={() => { setMenuOpen(false); showToast?.("Abrindo editar dados"); }}
          onPlano={() => { setMenuOpen(false); onAlterarPlano?.(); }} accent={accent}/>}
      </div>
    </div>

    {!anamneseDone && (
      <div style={{
        background: accent, color: "#fff", borderRadius: 14, padding: 16,
        display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
        boxShadow: "0 8px 20px rgba(31,74,61,.18)",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>Complete sua anamnese</div>
          <div style={{ fontSize: 11.5, opacity: .8, marginTop: 2 }}>Obrigatório antes da primeira aula.</div>
        </div>
        <button onClick={onStartAnamnese} style={{ background: "#fff", color: accent, border: 0, padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          Preencher
        </button>
      </div>
    )}

    {/* Plano summary */}
    <div style={{
      padding: 18, borderRadius: 16, background: "var(--teal-50)",
      boxShadow: "0 2px 10px rgba(15,51,38,.05)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10.5, color: "var(--green-700)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>Plano atual</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>{aluno.plano}</div>
        </div>
        <span className="chip chip-green"><span className="chip-dot"/>Em dia</span>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(31,74,61,.18)", fontSize: 12, color: "var(--ink-700)", display: "flex", justifyContent: "space-between" }}>
        <span>Termina em</span>
        <b className="num">{aluno.planoFim}</b>
      </div>
    </div>

    {/* Next class */}
    <h3 style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 22, marginBottom: 10, paddingLeft: 4 }}>Sua próxima prática</h3>
    <div style={{
      background: "#fff", borderRadius: 18, padding: 18,
      border: "1px solid var(--ink-100)",
      boxShadow: "0 4px 16px rgba(15,51,38,.06)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: accent }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: "var(--ink-500)", fontWeight: 500 }}>{nextClass.data}</div>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 4, marginTop: 6,
            fontVariantNumeric: "tabular-nums",
          }}>
            <span style={{ fontSize: 34, fontWeight: 600, color: accent, letterSpacing: "-.025em", lineHeight: 1 }}>{nextClass.hora}</span>
            <span style={{ fontSize: 16, color: "var(--ink-500)", fontWeight: 500 }}>— {nextClass.horaFim}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-700)", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }}/>
            Pilates · com Flávia
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: "var(--teal-100)",
          display: "grid", placeItems: "center", color: accent, flexShrink: 0,
        }}>
          <Icon name="calendar" size={18}/>
        </div>
      </div>
      {/* Compact outline buttons side-by-side */}
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "9px 8px", background: "#fff",
          border: "1px solid var(--ink-200)", borderRadius: 10,
          color: "var(--ink-700)", fontFamily: "inherit", fontSize: 12, fontWeight: 500,
          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all .15s",
        }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ink-200)"; e.currentTarget.style.color = "var(--ink-700)"; }}>
          <Icon name="close" size={13}/> Desmarcar
        </button>
        <button onClick={onReposicao} style={{
          flex: 1, padding: "9px 8px", background: "#fff",
          border: `1px solid ${accent}33`, borderRadius: 10,
          color: accent, fontFamily: "inherit", fontSize: 12, fontWeight: 500,
          cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all .15s",
        }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--teal-50)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
          <Icon name="refresh" size={13}/> Alterar horário
        </button>
      </div>
    </div>

    {/* Counters */}
    <h3 style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 22, marginBottom: 10, paddingLeft: 4 }}>Resumo do mês</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <Counter color="var(--warn)" bg="#FFFAEC" label="Faltas no mês" value={faltas} icon="hand_off" onClick={onFaltas}/>
      <Counter color={accent} bg="var(--teal-50)" label={<>Reposições<br/>disponíveis</>} value={reposicoes} icon="refresh" onClick={onReposicao}/>
    </div>

    {/* Quick actions */}
    <h3 style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 22, marginBottom: 10, paddingLeft: 4 }}>Atalhos</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <QuickAction icon="plus"     label="Agendar reposição"    onClick={onReposicao} accent={accent}/>
      <QuickAction icon="calendar" label="Minhas aulas"          onClick={onAulas}     accent={accent}/>
      <QuickAction icon="cash"     label="Pagamentos"            onClick={onPlano}     accent={accent}/>
      <QuickAction icon="phone"    label="Falar com a Sílvia"   onClick={onWhatsApp}  accent={accent}/>
    </div>
  </div>
  );
};

const Counter = ({ color, bg, label, value, icon, onClick }) => {
  const Wrap = onClick ? "button" : "div";
  return (
    <Wrap onClick={onClick} style={{
      padding: 16, borderRadius: 16, background: bg,
      border: "1px solid rgba(15,51,38,.04)",
      boxShadow: "0 2px 10px rgba(15,51,38,.05)",
      display: "flex", flexDirection: "column", gap: 12, minHeight: 96,
      cursor: onClick ? "pointer" : "default",
      fontFamily: "inherit", textAlign: "left", width: "100%",
      transition: "transform .12s, box-shadow .15s",
      position: "relative",
    }}
    onMouseEnter={onClick ? (e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,51,38,.08)"; } : undefined}
    onMouseLeave={onClick ? (e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(15,51,38,.05)"; } : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "rgba(255,255,255,.6)",
          display: "grid", placeItems: "center", color,
        }}>
          <Icon name={icon} size={15} stroke={1.9}/>
        </div>
        {onClick && <Icon name="chev_right" size={13} color={color} style={{ opacity: .6 }}/>}
      </div>
      <div>
        <span style={{ fontSize: 28, fontWeight: 600, color, letterSpacing:"-.025em", lineHeight: 1 }} className="num">{value}</span>
        <div style={{ fontSize: 11, color: "var(--ink-700)", marginTop: 5, lineHeight: 1.3 }}>{label}</div>
      </div>
    </Wrap>
  );
};

const QuickAction = ({ icon, label, onClick, accent }) => (
  <button onClick={onClick} style={{
    padding: 14, border: "1px solid var(--ink-100)", background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 10px rgba(15,51,38,.04)",
    display: "flex", flexDirection: "column", alignItems: "start", gap: 10,
    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, background: "var(--teal-50)",
      display: "grid", placeItems: "center", color: accent,
    }}>
      <Icon name={icon} size={16}/>
    </div>
    <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)" }}>{label}</span>
  </button>
);

// ============================================================
// CANCEL MODAL — sistema calcula automaticamente se é "em cima da hora"
// ============================================================
const CancelModal = ({ open, onClose, nextClass, minutesUntilClass, onConfirm, accent }) => {
  // Em produção: const isLast = (classStartTimestamp - Date.now()) < 1 * 60 * 60 * 1000;
  // Aqui usamos minutesUntilClass injetado pelo prop para simular o cálculo.
  const isLast = minutesUntilClass < 60;

  const [motivo, setMotivo] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!open) { setMotivo(""); setFile(null); }
  }, [open]);

  const canSubmit = isLast ? motivo.trim().length >= 5 : true;

  // Format minutes → "2h 30min" / "45min"
  const fmtTime = (m) => {
    const h = Math.floor(m / 60), mm = m % 60;
    if (h === 0) return `${mm} min`;
    if (mm === 0) return `${h}h`;
    return `${h}h ${mm}min`;
  };

  return (
    <Modal open={open} onClose={onClose} width={400} padding={0}>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Desmarcar aula</span>
            <h3 style={{ fontSize: 19, marginTop: 6 }}>Você quer cancelar?</h3>
          </div>
          <button onClick={onClose} style={{ background:"var(--ink-50)", border:0, borderRadius:999, width:28, height:28, cursor:"pointer", display:"grid", placeItems:"center" }}>
            <Icon name="close" size={14}/>
          </button>
        </div>

        {/* Class info card */}
        <div style={{ marginTop: 16, padding: 14, background: "var(--ink-50)", borderRadius: 12, fontSize: 13 }}>
          <div style={{ color: "var(--ink-500)", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase" }}>Aula</div>
          <div style={{ marginTop: 6, fontWeight: 500 }}>{nextClass.data} · {nextClass.hora}</div>
        </div>

        {/* Auto-computed time banner — drives whether justification is required */}
        <div style={{
          marginTop: 12, padding: "12px 14px", borderRadius: 12,
          display: "flex", gap: 12, alignItems: "center",
          background: isLast ? "#FFF6E0" : "var(--teal-50)",
          border: `1px solid ${isLast ? "#F3D89A" : "rgba(31,74,61,.12)"}`,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999, flexShrink: 0,
            background: isLast ? "var(--warn)" : accent, color: "#fff",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="clock" size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase" }}>
              Sistema calculou
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-900)", fontWeight: 500, marginTop: 2 }}>
              Faltam <b className="num">{fmtTime(minutesUntilClass)}</b> para a aula
              {isLast
                ? <> · <span style={{ color: "#7A5A0A" }}>em cima da hora</span></>
                : <> · <span style={{ color: "var(--green-700)" }}>com folga</span></>}
            </div>
          </div>
        </div>

        {/* Rule explainer */}
        <div style={{
          marginTop: 12, padding: 12, background: "var(--teal-50)", borderRadius: 10,
          fontSize: 12, color: "var(--ink-700)", display: "flex", gap: 10, alignItems: "start",
        }}>
          <Icon name="info" size={16} color={accent}/>
          <div>
            Cancelamentos feitos com <b>até 1h de antecedência</b> liberam direito a reposição.
            Depois disso é contado como falta — e a justificativa fica obrigatória.
          </div>
        </div>

        {/* Justification area — renders ONLY when system detects <1h */}
        {isLast && (
          <div style={{ marginTop: 16, animation: "fadeIn .25s" }}>
            {/* Developer note */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              color: "var(--ink-500)", background: "var(--ink-50)",
              padding: "6px 10px", borderRadius: 6, marginBottom: 12,
              border: "1px dashed var(--ink-200)",
            }}>
              {`// Esta seção renderiza automaticamente apenas se o cancelamento ocorrer faltando menos de 1 hora para o início da prática`}
            </div>

            <div style={{
              padding: "10px 12px", background: "#FFF6E0", borderRadius: 10,
              fontSize: 12, color: "#7A5A0A", marginBottom: 12, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--warn)" }}/>
              Justificativa obrigatória
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="field">
                <label>Motivo <span style={{ color: "var(--danger)" }}>*</span></label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
                  placeholder="Descreva o que aconteceu (mínimo 5 caracteres)"/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-700)", display: "block", marginBottom: 6 }}>
                  Documento de justificativa
                </label>
                <DropZone file={file} onFile={setFile} label="Arraste atestado, comprovante…"/>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Manter aula</button>
          <button
            className="btn btn-sm"
            disabled={!canSubmit}
            onClick={() => onConfirm(isLast)}
            style={{
              flex: 1.2,
              background: canSubmit ? (isLast ? "var(--warn)" : accent) : "var(--ink-200)",
              color: canSubmit ? "#fff" : "var(--ink-500)",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}>
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// FALTAS MODAL — mostra histórico de faltas do mês
// ============================================================
const FALTAS_DO_MES = [
  {
    data: "15/05/2026", dia: "Quinta",
    hora: "08h00",
    tipo: "Falta justificada", justificada: true,
    motivo: "Atestado médico — virose",
    creditoReposicao: true,
    anexo: "Atestado-15-05.pdf",
  },
];

const FaltasModal = ({ open, onClose, accent, aluno }) => {
  const faltas = FALTAS_DO_MES;
  return (
    <Modal open={open} onClose={onClose} width={400} padding={0}>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className="section-eyebrow" style={{ color: "var(--warn)", fontSize: 10 }}>Faltas no mês</span>
            <h3 style={{ fontSize: 19, marginTop: 6 }}>Maio · {faltas.length} falta{faltas.length !== 1 ? "s" : ""}</h3>
            <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>
              {aluno?.nome || "Ana Beatriz"} · {aluno?.plano || "Mensal 2x"}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--ink-50)", border: 0, borderRadius: 999, width: 28, height: 28,
            cursor: "pointer", display: "grid", placeItems: "center",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>

        {/* Resumo */}
        <div style={{
          marginTop: 16, padding: 14, background: "#FFFAEC", borderRadius: 12,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999, background: "var(--warn)",
            color: "#fff", display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon name="hand_off" size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#7A5A0A", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 500 }}>
              Limite mensal do seu plano
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-900)", marginTop: 2 }}>
              <b className="num">{faltas.length}</b> de 4 faltas usadas
            </div>
          </div>
        </div>

        {/* Lista */}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {faltas.map((f, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 12, border: "1px solid var(--ink-100)",
              background: "#fff",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>
                    {f.dia} · <span className="num">{f.data.slice(0, 5)}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 2 }} className="num">{f.hora}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: "3px 9px", borderRadius: 999,
                  background: f.justificada ? "#DDF1E2" : "#FADCDC",
                  color: f.justificada ? "#1F6B3A" : "var(--danger)",
                  letterSpacing: ".04em", textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {f.justificada ? "Justificada" : "Não justificada"}
                </span>
              </div>
              <div style={{
                marginTop: 10, padding: 10, background: "var(--ink-50)", borderRadius: 8,
                fontSize: 12, color: "var(--ink-700)", lineHeight: 1.4,
              }}>
                <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500, marginBottom: 3 }}>
                  Motivo
                </div>
                {f.motivo}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                {f.anexo && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: accent, fontWeight: 500 }}>
                    <Icon name="file" size={13} color={accent}/>
                    {f.anexo}
                  </span>
                )}
                <div style={{ flex: 1 }}/>
                <span style={{
                  fontSize: 10.5, color: f.creditoReposicao ? "var(--green-700)" : "var(--ink-500)",
                  display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500,
                }}>
                  <Icon name={f.creditoReposicao ? "check" : "close"} size={11}
                        color={f.creditoReposicao ? "var(--green-700)" : "var(--ink-500)"} stroke={2.4}/>
                  {f.creditoReposicao ? "Reposição liberada" : "Sem crédito"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Política */}
        <div style={{
          marginTop: 14, padding: 12, background: "var(--teal-50)", borderRadius: 10,
          fontSize: 11.5, color: "var(--ink-700)", display: "flex", gap: 10, alignItems: "start",
        }}>
          <Icon name="info" size={15} color={accent}/>
          <div>
            Faltas com aviso de até <b>1h antes</b> da aula geram crédito de reposição automaticamente. Após esse prazo, é necessário justificar.
          </div>
        </div>

        <button className="btn btn-ghost" onClick={onClose} style={{ marginTop: 16, width: "100%" }}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};

// ============================================================
// WHATSAPP CONFIRM MODAL — confirma redirecionamento para Sílvia
// ============================================================
const WhatsAppConfirmModal = ({ open, onClose, accent }) => {
  const openWhats = () => {
    window.open("https://wa.me/5531998124421?text=" + encodeURIComponent("Olá Sílvia! Preciso de uma ajuda com o studio."), "_blank", "noopener,noreferrer");
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} width={360} padding={0}>
      <div style={{ padding: 24 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 999, background: "#25D366",
          margin: "0 auto", display: "grid", placeItems: "center",
        }}>
          <Icon name="whatsapp" size={28} color="#fff"/>
        </div>
        <h3 style={{ fontSize: 18, marginTop: 16, textAlign: "center" }}>Falar com a Sílvia</h3>
        <p style={{ fontSize: 13, color: "var(--ink-700)", lineHeight: 1.55, textAlign: "center", marginTop: 8 }}>
          Você será redirecionada para o WhatsApp da <b>Sílvia</b>, do atendimento do studio.
        </p>
        <div style={{
          marginTop: 14, padding: "10px 14px", background: "var(--ink-50)",
          borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>Número</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-900)", fontWeight: 500 }} className="num">(31) 99812-4421</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--ink-500)", textAlign: "center", marginTop: 12 }}>
          Atendimento de seg a sex · 7h às 21h
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-sm" style={{ flex: 1.2, background: "#25D366", color: "#fff" }} onClick={openWhats}>
            <Icon name="whatsapp" size={14}/> Abrir WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// REPOSIÇÃO (only available slots, no full calendar)
// ============================================================
const Reposicao = ({ accent, disponivel, onBack, onBook }) => {
  const [selected, setSelected] = useState(null);
  const byDay = REPOSICAO_SLOTS.reduce((acc, s) => {
    const k = `${s.dia} • ${s.data}`;
    (acc[k] = acc[k] || []).push(s); return acc;
  }, {});

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 92px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0 16px" }}>
        <button onClick={onBack} style={{ background: "var(--ink-50)", border: 0, width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer" }}>
          <Icon name="chev_left" size={16}/>
        </button>
        <div>
          <h2 style={{ fontSize: 19 }}>Agendar reposição</h2>
          <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{disponivel} reposição{disponivel !== 1 ? "ões" : ""} disponível{disponivel !== 1 ? "is" : ""} · próximos 7 dias</div>
        </div>
      </div>

      <div style={{ background: "var(--teal-50)", borderRadius: 12, padding: 14, fontSize: 12, color: "var(--ink-700)", display: "flex", gap: 10, alignItems: "start" }}>
        <Icon name="info" size={16} color={accent}/>
        <div>Mostramos apenas os horários com <b>vagas livres</b>. Toque em um horário para reservar.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18 }}>
        {Object.entries(byDay).map(([day, slots]) => (
          <div key={day}>
            <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>{day}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {slots.map(s => {
                const sel = selected?.id === s.id;
                return (
                  <button key={s.id} onClick={() => setSelected(s)} style={{
                    background: sel ? accent : "#fff",
                    color: sel ? "#fff" : "var(--ink-900)",
                    border: `1.5px solid ${sel ? accent : "var(--ink-100)"}`,
                    borderRadius: 14, padding: "14px 14px", textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4,
                    transition: "all .15s",
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-.02em" }} className="num">{s.hora}</span>
                    <span style={{ fontSize: 11, color: sel ? "rgba(255,255,255,.7)" : "var(--ink-500)" }}>
                      {s.vagas} {s.vagas === 1 ? "vaga" : "vagas"} livre{s.vagas === 1 ? "" : "s"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{
          position: "absolute", left: 16, right: 16, bottom: 78,
          background: "#fff", borderRadius: 18, boxShadow: "0 14px 38px rgba(15,51,38,.18)",
          padding: 14, display: "flex", gap: 10, alignItems: "center", border: "1px solid var(--ink-100)",
          animation: "popIn .2s",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{selected.dia} · {selected.data}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Reposição às {selected.hora}</div>
          </div>
          <button className="btn btn-primary btn-sm" style={{ background: accent }} onClick={() => onBook(selected)}>
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MEU PLANO
// ============================================================
const MeuPlano = ({ accent, aluno, onBack, onAlterarPlano }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 92px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0 16px" }}>
      <button onClick={onBack} style={{ background:"var(--ink-50)", border:0, width:34, height:34, borderRadius:999, display:"grid", placeItems:"center", cursor:"pointer" }}>
        <Icon name="chev_left" size={16}/>
      </button>
      <h2 style={{ fontSize: 19 }}>Meu plano</h2>
    </div>

    <button onClick={onAlterarPlano} className="card" style={{
      background: accent, color: "#fff", border: "none", padding: 20,
      width: "100%", fontFamily: "inherit", textAlign: "left", cursor: "pointer",
      display: "block", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", letterSpacing: ".06em", textTransform:"uppercase" }}>Plano atual</div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{aluno.plano}</div>
        </div>
        <span style={{
          fontSize: 10.5, padding: "4px 10px", background: "rgba(255,255,255,.18)", color: "#fff",
          borderRadius: 999, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
          whiteSpace: "nowrap",
        }}>
          Alterar <Icon name="chev_right" size={11} color="#fff"/>
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.18)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Início</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }} className="num">12/02/2026</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:".06em" }}>Término</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }} className="num">{aluno.planoFim}</div>
        </div>
        <span className="chip" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
          <span className="chip-dot"/>Em dia
        </span>
      </div>
    </button>

    <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-500)", letterSpacing: ".06em", textTransform: "uppercase", marginTop: 22, marginBottom: 10 }}>Histórico de pagamentos</h3>
    <div className="card" style={{ overflow: "hidden" }}>
      {PAGAMENTOS.map((p, i) => (
        <div key={i} style={{
          padding: "14px 16px",
          borderTop: i ? "1px solid var(--ink-100)" : "none",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.mes}</div>
            <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{p.data} · {p.forma}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="num">{p.valor}</div>
            <div style={{ marginTop: 4 }}><StatusPill status={p.status}/></div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 16, padding: 14, background: "var(--teal-50)", borderRadius: 12, fontSize: 12, color: "var(--ink-700)", lineHeight: 1.5 }}>
      Próxima renovação em <b>{aluno.planoFim}</b>. A Flávia entrará em contato uma semana antes para confirmar.
    </div>
  </div>
);

// ============================================================
// AULAS (placeholder screen)
// ============================================================
const Aulas = ({ accent, nextClass, bookedRepos, onBack }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 92px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0 16px" }}>
      <button onClick={onBack} style={{ background:"var(--ink-50)", border:0, width:34, height:34, borderRadius:999, display:"grid", placeItems:"center", cursor:"pointer" }}>
        <Icon name="chev_left" size={16}/>
      </button>
      <h2 style={{ fontSize: 19 }}>Minhas aulas</h2>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AulaItem when="Próxima" data={nextClass.data} hora={nextClass.hora} tipo="Aula fixa" accent={accent}/>
      {bookedRepos && (
        <AulaItem when="Reposição" data={`${bookedRepos.dia} · ${bookedRepos.data}`} hora={bookedRepos.hora} tipo="Reposição agendada" accent={accent} highlight/>
      )}
      <AulaItem when="Anterior" data="Sex, 22/05" hora="17h00" tipo="Realizada" accent={accent} past/>
      <AulaItem when="Anterior" data="Qua, 20/05" hora="17h00" tipo="Realizada" accent={accent} past/>
      <AulaItem when="Anterior" data="Sex, 15/05" hora="17h00" tipo="Falta justificada" accent={accent} past warn/>
    </div>
  </div>
);

const AulaItem = ({ when, data, hora, tipo, accent, past, highlight, warn }) => (
  <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: past ? .85 : 1, background: highlight ? "var(--teal-50)" : "#fff" }}>
    <div style={{
      width: 52, height: 52, borderRadius: 12,
      background: warn ? "#FBEFC9" : (past ? "var(--ink-50)" : "var(--teal-100)"),
      color: warn ? "var(--warn)" : (past ? "var(--ink-500)" : accent),
      display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <Icon name={warn ? "info" : "calendar"} size={20}/>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{when}</div>
      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{data} · <span className="num">{hora}</span></div>
      <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{tipo}</div>
    </div>
  </div>
);

// ============================================================
// NOTIFICATION POPOVER (bell)
// ============================================================
const NOTIFS = [
  { icon: "calendar", title: "Sua aula de amanhã está confirmada", time: "há 2h", color: "var(--green-700)", desc: "Quarta, 27/05 · 08h00 — chegue 5 min antes" },
  { icon: "cash",     title: "Seu plano vence em 5 dias",          time: "ontem", color: "var(--warn)",       desc: "Renovação automática em 12/06/2026" },
  { icon: "refresh",  title: "+1 reposição disponível",             time: "2 dias", color: "var(--ink-700)", desc: "Aula de 24/05 foi cancelada com folga" },
];
const NotifPopover = ({ onClose, accent }) => (
  <>
    <div onClick={onClose} style={{
      position: "absolute", inset: -200, background: "transparent", zIndex: 4,
    }}/>
    <div onClick={(e) => e.stopPropagation()} style={{
      position: "absolute", top: 46, right: -8, width: 290,
      background: "#fff", borderRadius: 14,
      boxShadow: "0 12px 40px rgba(15,51,38,.18), 0 4px 12px rgba(15,51,38,.10)",
      border: "1px solid var(--ink-100)", zIndex: 5,
      animation: "popIn .18s cubic-bezier(.2,.8,.2,1)",
    }}>
      <div style={{
        padding: "12px 14px", borderBottom: "1px solid var(--ink-100)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Notificações</span>
        <span style={{
          fontSize: 9.5, padding: "2px 7px", borderRadius: 999,
          background: "var(--teal-100)", color: accent, fontWeight: 600,
        }}>{NOTIFS.length} novas</span>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {NOTIFS.map((n, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "11px 14px",
            borderTop: i ? "1px solid var(--ink-100)" : "none",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: "var(--ink-50)", color: n.color,
              display: "grid", placeItems: "center",
            }}>
              <Icon name={n.icon} size={14}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 3, lineHeight: 1.35 }}>{n.desc}</div>
              <div style={{ fontSize: 9.5, color: "var(--ink-300)", marginTop: 4, letterSpacing: ".04em" }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{
        width: "100%", padding: "10px 0", border: 0, borderTop: "1px solid var(--ink-100)",
        background: "transparent", color: accent, fontFamily: "inherit",
        fontSize: 12, fontWeight: 500, cursor: "pointer",
      }}>Ver todas</button>
    </div>
  </>
);

// ============================================================
// AVATAR MENU (top-right)
// ============================================================
const AvatarMenu = ({ onClose, onPerfil, onEdit, onPlano, accent }) => (
  <>
    <div onClick={onClose} style={{ position: "absolute", inset: -200, background: "transparent", zIndex: 4 }}/>
    <div onClick={(e) => e.stopPropagation()} style={{
      position: "absolute", top: 46, right: -8, width: 200,
      background: "#fff", borderRadius: 12,
      boxShadow: "0 12px 40px rgba(15,51,38,.18), 0 4px 12px rgba(15,51,38,.10)",
      border: "1px solid var(--ink-100)", zIndex: 5,
      overflow: "hidden",
      animation: "popIn .18s cubic-bezier(.2,.8,.2,1)",
    }}>
      <MenuItem icon="user"     label="Acessar perfil"  onClick={onPerfil} accent={accent}/>
      <MenuItem icon="edit"     label="Editar dados"    onClick={onEdit}   accent={accent} divider/>
      <MenuItem icon="cash"     label="Alterar plano"   onClick={onPlano}  accent={accent} divider/>
    </div>
  </>
);
const MenuItem = ({ icon, label, onClick, accent, divider }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
    width: "100%", background: "transparent", border: 0, cursor: "pointer",
    borderTop: divider ? "1px solid var(--ink-100)" : "none",
    fontFamily: "inherit", textAlign: "left",
    fontSize: 12.5, color: "var(--ink-900)",
  }}>
    <Icon name={icon} size={15} color={accent}/>
    <span style={{ flex: 1 }}>{label}</span>
    <Icon name="chev_right" size={12} color="var(--ink-300)"/>
  </button>
);

// ============================================================
// ALTERAR PLANO
// ============================================================
const PLANO_OPTIONS = [
  { id: "M2", title: "Mensal 2x/semana", price: "R$ 290 / mês",  desc: "8 aulas no mês · ideal para começar" },
  { id: "M3", title: "Mensal 3x/semana", price: "R$ 380 / mês",  desc: "12 aulas no mês · mais frequência",  recommended: true },
  { id: "T3", title: "Trimestral 3x",    price: "R$ 1.020 / 3m", desc: "Desconto de 10% pago à vista" },
  { id: "AV", title: "Avulso",           price: "R$ 90 / aula",  desc: "Para reposição ou aula extra" },
];
const AlterarPlanoModal = ({ open, onClose, accent, aluno, onConfirm }) => {
  const [sel, setSel] = useState(null);
  useEffect(() => { if (open) setSel(null); }, [open]);
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} width={420} padding={0}>
      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Alterar plano</span>
            <h3 style={{ fontSize: 19, marginTop: 6 }}>Escolha um novo pacote</h3>
            <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>
              Plano atual: <b>{aluno?.plano || "Mensal 2x"}</b>
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"var(--ink-50)", border:0, borderRadius:999, width:28, height:28,
            cursor:"pointer", display:"grid", placeItems:"center",
          }}>
            <Icon name="close" size={14}/>
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {PLANO_OPTIONS.map(p => {
            const isCurrent = (aluno?.plano || "").startsWith(p.title.split(" ")[0]) && (aluno?.plano || "").includes(p.title.split(" ")[1]?.slice(0,2) || "");
            const isSel = sel === p.id;
            return (
              <button key={p.id} onClick={() => setSel(p.id)} disabled={isCurrent} style={{
                padding: 14, borderRadius: 12, textAlign: "left",
                background: isSel ? "var(--teal-50)" : "#fff",
                border: `1.5px solid ${isSel ? accent : "var(--ink-100)"}`,
                cursor: isCurrent ? "not-allowed" : "pointer",
                fontFamily: "inherit", opacity: isCurrent ? .55 : 1,
                position: "relative",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.title}</span>
                      {p.recommended && !isCurrent && (
                        <span style={{
                          fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 999,
                          background: accent, color: "#fff", letterSpacing: ".04em", textTransform: "uppercase",
                        }}>Recomendado</span>
                      )}
                      {isCurrent && (
                        <span style={{
                          fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 999,
                          background: "var(--ink-100)", color: "var(--ink-700)", letterSpacing: ".04em", textTransform: "uppercase",
                        }}>Atual</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-500)", marginTop: 4, lineHeight: 1.35 }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isSel ? accent : "var(--ink-900)", whiteSpace: "nowrap" }} className="num">{p.price}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: 14, padding: 10, background: "var(--ink-50)", borderRadius: 10,
          fontSize: 11, color: "var(--ink-700)", lineHeight: 1.45,
          display: "flex", gap: 8, alignItems: "start",
        }}>
          <Icon name="info" size={13} color="var(--ink-500)"/>
          <span>Sua solicitação será enviada à Flávia para confirmação. A troca passa a valer no próximo ciclo do plano.</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-sm" disabled={!sel}
            onClick={() => onConfirm(PLANO_OPTIONS.find(p => p.id === sel)?.title || "novo plano")}
            style={{
              flex: 1.3,
              background: sel ? accent : "var(--ink-200)",
              color: sel ? "#fff" : "var(--ink-500)",
              cursor: sel ? "pointer" : "not-allowed",
            }}>
            Solicitar troca
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// PERFIL
// ============================================================
const Perfil = ({ accent, aluno, onBack, onReabrirAnamnese, onTermo, onLogout }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 92px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0 16px" }}>
      <button onClick={onBack} style={{
        background: "var(--ink-50)", border: 0, width: 32, height: 32, borderRadius: 999,
        display: "grid", placeItems: "center", cursor: "pointer",
      }}>
        <Icon name="chev_left" size={16}/>
      </button>
      <h2 style={{ fontSize: 19 }}>Meu perfil</h2>
    </div>

    {/* Avatar + identidade */}
    <div style={{
      padding: 18, borderRadius: 16, background: `linear-gradient(135deg, ${accent}, var(--green-900))`,
      color: "#fff", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 999, background: "var(--teal-200)",
        color: "var(--green-900)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 20,
        flexShrink: 0,
      }}>
        {aluno.nome.split(" ").map(p => p[0]).slice(0,2).join("")}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{aluno.nome}</div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.75)", marginTop: 2 }}>
          {aluno.plano} · vence em <span className="num">{aluno.planoFim}</span>
        </div>
      </div>
    </div>

    {/* Dados da conta */}
    <h3 style={{
      fontSize: 11, fontWeight: 500, color: "var(--ink-500)",
      letterSpacing: ".1em", textTransform: "uppercase",
      marginTop: 22, marginBottom: 10, paddingLeft: 4,
    }}>Dados da conta</h3>
    <div style={{
      background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden",
    }}>
      <PRow label="E-mail" v="ana.carvalho@email.com" mono/>
      <PRow label="Telefone" v="(31) 99812-4421" mono divider/>
      <PRow label="CPF" v="123.456.789-01" mono divider/>
      <PRow label="Endereço" v="Rua das Acácias, 120 — Belo Horizonte/MG" divider/>
    </div>

    {/* Ações */}
    <h3 style={{
      fontSize: 11, fontWeight: 500, color: "var(--ink-500)",
      letterSpacing: ".1em", textTransform: "uppercase",
      marginTop: 20, marginBottom: 10, paddingLeft: 4,
    }}>Saúde e documentos</h3>
    <div style={{
      background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden",
    }}>
      <PAction icon="file" label="Refazer anamnese" desc="Atualize seu histórico clínico"
        onClick={onReabrirAnamnese} accent={accent}/>
      <PAction icon="file" label="Termo de compromisso" desc="Termo assinado no início do plano"
        onClick={onTermo} accent={accent} divider/>
    </div>

    <h3 style={{
      fontSize: 11, fontWeight: 500, color: "var(--ink-500)",
      letterSpacing: ".1em", textTransform: "uppercase",
      marginTop: 20, marginBottom: 10, paddingLeft: 4,
    }}>Preferências</h3>
    <div style={{
      background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 12, overflow: "hidden",
    }}>
      <PToggle label="Lembretes de aula" desc="1h antes do início da sua aula" defaultOn/>
      <PToggle label="Notificar pagamentos próximos" desc="3 dias antes do vencimento" defaultOn divider/>
      <PToggle label="E-mails de novidades" desc="Promoções, workshops, eventos" divider/>
    </div>

    <button onClick={onLogout} style={{
      width: "100%", marginTop: 22, padding: "13px 0",
      background: "#fff", border: "1px solid rgba(193,59,59,.25)",
      borderRadius: 12, color: "var(--danger)", fontFamily: "inherit",
      fontSize: 13.5, fontWeight: 500, cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <Icon name="logout" size={15}/> Sair da conta
    </button>

    <div style={{ marginTop: 14, textAlign: "center", fontSize: 10.5, color: "var(--ink-500)" }}>
      Studio Flávia Prudêncio · versão 1.0
    </div>
  </div>
);

const PRow = ({ label, v, mono, divider }) => (
  <div style={{
    padding: "12px 14px", borderTop: divider ? "1px solid var(--ink-100)" : "none",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  }}>
    <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{label}</span>
    <span style={{
      fontSize: 12.5, color: "var(--ink-900)", textAlign: "right",
      fontFamily: mono ? "'JetBrains Mono'" : "inherit",
    }}>{v}</span>
  </div>
);

const PAction = ({ icon, label, desc, onClick, accent, divider }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
    width: "100%", background: "transparent", border: 0, cursor: "pointer",
    borderTop: divider ? "1px solid var(--ink-100)" : "none",
    fontFamily: "inherit", textAlign: "left",
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, background: "var(--teal-50)",
      color: accent, display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <Icon name={icon} size={14}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)" }}>{label}</div>
      {desc && <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{desc}</div>}
    </div>
    <Icon name="chev_right" size={14} color="var(--ink-300)"/>
  </button>
);

const PToggle = ({ label, desc, defaultOn, divider }) => {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button onClick={() => setOn(v => !v)} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      width: "100%", background: "transparent", border: 0, cursor: "pointer",
      borderTop: divider ? "1px solid var(--ink-100)" : "none",
      fontFamily: "inherit", textAlign: "left",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)" }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{desc}</div>}
      </div>
      <span style={{
        width: 36, height: 22, borderRadius: 999, position: "relative",
        background: on ? "var(--green-700)" : "var(--ink-200)",
        transition: "background .2s",
        flexShrink: 0,
      }}>
        <span style={{
          width: 18, height: 18, background: "#fff", borderRadius: 999,
          position: "absolute", top: 2, left: on ? 16 : 2,
          transition: "left .2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.18)",
        }}/>
      </span>
    </button>
  );
};

// ============================================================
// BOTTOM NAV
// ============================================================
const BottomNav = ({ screen, onSwitch, accent }) => {
  const tabs = [
    { id: "home",      icon: "home",     label: "Início" },
    { id: "aulas",     icon: "calendar", label: "Aulas" },
    { id: "reposicao", icon: "plus",     label: "Repor",  primary: true },
    { id: "plano",     icon: "cash",     label: "Plano" },
    { id: "profile",   icon: "user",     label: "Perfil" },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--ink-100)",
      padding: "10px 18px 22px",
      boxShadow: "0 -4px 20px rgba(15,51,38,.05)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
    }}>
      {tabs.map(t => {
        const active = screen === t.id;
        if (t.primary) return (
          <button key={t.id} onClick={() => onSwitch(t.id)} style={{
            width: 52, height: 52, borderRadius: 999, background: accent, color: "#fff", border: 0,
            display: "grid", placeItems: "center", cursor: "pointer",
            boxShadow: `0 8px 22px ${accent}55`, transform: "translateY(-8px)",
          }}>
            <Icon name={t.icon} size={20} stroke={2}/>
          </button>
        );
        return (
          <button key={t.id} onClick={() => onSwitch(t.id)} style={{
            background: "transparent", border: 0, cursor: "pointer", padding: "4px 8px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active ? accent : "var(--ink-500)", fontFamily: "inherit",
          }}>
            <Icon name={t.icon} size={20} stroke={active ? 2 : 1.6}/>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

window.Portal = Portal;
// Export internals so portal-desktop.jsx can reuse them
Object.assign(window, { CancelModal, FaltasModal, WhatsAppConfirmModal, AlterarPlanoModal, NotifPopover, AvatarMenu, MField, CheckRow, Radios, PainScale });

// Shared visible layout switcher between Mobile / Desktop
const LayoutSwitcher = ({ value, onChange }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 6px 5px 14px",
    background: "#fff", border: "1px solid var(--ink-100)", borderRadius: 999,
    fontSize: 11.5, color: "var(--ink-700)", boxShadow: "0 2px 8px rgba(15,51,38,.05)",
  }}>
    <span style={{ fontWeight: 500 }}>Layout</span>
    <div style={{ display: "flex", gap: 2, background: "var(--ink-50)", padding: 3, borderRadius: 999 }}>
      {[
        ["mobile",  "Mobile"],
        ["desktop", "Desktop"],
      ].map(([id, l]) => (
        <button key={id} onClick={() => onChange(id)} style={{
          border: 0, padding: "5px 14px", borderRadius: 999, fontFamily: "inherit",
          fontSize: 11.5, fontWeight: 500, cursor: "pointer",
          background: value === id ? "var(--green-800)" : "transparent",
          color: value === id ? "#fff" : "var(--ink-700)",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {id === "mobile" ? <PhoneGlyph/> : <MonitorGlyph/>} {l}
        </button>
      ))}
    </div>
  </div>
);
const PhoneGlyph = () => (
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="1" y="1" width="9" height="11" rx="1.5"/><path d="M4.5 10.2h2"/>
  </svg>
);
const MonitorGlyph = () => (
  <svg width="14" height="13" viewBox="0 0 14 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="1" y="1" width="12" height="8.5" rx="1"/><path d="M4.5 12.2h5M7 9.5v2.7"/>
  </svg>
);
window.LayoutSwitcher = LayoutSwitcher;
