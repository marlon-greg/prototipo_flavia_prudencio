// landing.jsx — Public landing page

const { PRICING } = window.STUDIO_DATA;

const Landing = ({ accent, onAccessPortal }) => {
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <div style={{ minHeight: "calc(100vh - 80px)", paddingTop: 76 }}>
      <LandingNav onCTA={() => setSignupOpen(true)} accent={accent} />
      <Hero onCTA={() => setSignupOpen(true)} accent={accent} />
      <Pillars accent={accent} />
      <Pricing onCTA={() => setSignupOpen(true)} accent={accent} />
      <CTABanner onCTA={() => setSignupOpen(true)} accent={accent} />
      <Footer />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} accent={accent} onAccessPortal={onAccessPortal} />
    </div>
  );
};

const LandingNav = ({ onCTA }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, padding: "22px 48px",
    display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5,
  }}>
    <StudioLogo size="md" />
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <a href="#planos" style={{ color: "var(--ink-700)", textDecoration: "none", fontSize: 13.5, fontWeight: 500 }}>Planos</a>
      <a href="#metodo" style={{ color: "var(--ink-700)", textDecoration: "none", fontSize: 13.5, fontWeight: 500 }}>Método</a>
      <a href="#contato" style={{ color: "var(--ink-700)", textDecoration: "none", fontSize: 13.5, fontWeight: 500 }}>Contato</a>
      <button className="btn btn-primary btn-sm" onClick={onCTA}>Agende sua avaliação</button>
    </div>
  </div>
);

const Hero = ({ onCTA, accent }) => (
  <section style={{
    padding: "60px 48px 80px",
    display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center",
    maxWidth: 1280, margin: "0 auto",
  }}>
    <div>
      <span className="section-eyebrow" style={{ color: accent }}>Fisioterapia · Pilates clínico</span>
      <h1 style={{ fontSize: 64, lineHeight: 1.04, marginTop: 18, letterSpacing: "-.03em" }}>
        Bem-estar <em style={{ fontFamily: "Poppins", fontStyle: "italic", fontWeight: 300, color: accent }}>que começa</em><br/>
        no movimento certo.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--ink-700)", marginTop: 22, maxWidth: 480 }}>
        Atendimento individualizado em pequenos grupos de até 4 alunos por horário.
        Avaliação corporal completa antes da primeira aula — você sai com um plano claro.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
        <button className="btn btn-primary" onClick={onCTA} style={{ background: accent }}>
          Agende sua avaliação <Icon name="arrow_right" size={16}/>
        </button>
        <a href="#planos" className="btn btn-ghost">Ver planos</a>
      </div>
      <div style={{ display: "flex", gap: 32, marginTop: 56, paddingTop: 28, borderTop: "1px solid var(--ink-100)" }}>
        <Stat n="12" label={<>anos de<br/>atendimento</>} />
        <Stat n="320+" label={<>alunos<br/>ativos</>} />
        <Stat n="4" label={<>alunos por<br/>horário, no máximo</>} />
      </div>
    </div>
    <div style={{ position: "relative" }}>
      <div style={{
        aspectRatio: "4/5", borderRadius: 28, overflow: "hidden",
        background: "var(--teal-50)",
        boxShadow: "0 20px 60px rgba(15,51,38,.12)",
      }}>
        <img
          src={window.__resources?.pilatesPhoto || "https://image.pollinations.ai/prompt/minimalist%20pilates%20studio%20interior%20with%20reformer%20machine,%20soft%20natural%20morning%20light%20through%20large%20windows,%20wooden%20floor,%20indoor%20plants,%20beige%20and%20sage%20green%20tones,%20clinical%20calm%20atmosphere,%20professional%20editorial%20photography,%20wide%20angle,%20no%20people?width=720&height=900&nologo=true&seed=4271"}
          alt="Sala de pilates do Studio Flávia Prudêncio"
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => {
            // fallback to striped placeholder if Pollinations is unreachable
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add("placeholder");
            e.currentTarget.parentElement.innerHTML =
              '<span style="font-family:JetBrains Mono;font-size:12px;color:var(--green-700)">[ foto · sala de pilates ]</span>';
          }}
        />
      </div>
      <div className="card" style={{
        position: "absolute", left: -32, bottom: 32, padding: 18, width: 230,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Próxima turma</span>
        <b style={{ fontSize: 16 }}>Avaliação corporal</b>
        <div style={{ fontSize: 12, color: "var(--ink-500)" }}>Quarta · 27/05 · 11h</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ display: "flex" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: 999, background: "var(--teal-200)",
                border: "2px solid #fff", marginLeft: i ? -7 : 0,
              }}/>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-700)" }}>3 vagas livres</span>
        </div>
      </div>
      <div className="card" style={{
        position: "absolute", right: -16, top: 40, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10, fontSize: 12, color:"var(--ink-700)",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "#3D7461" }}/>
        Atendimento individualizado
      </div>
    </div>
  </section>
);

const Stat = ({ n, label }) => (
  <div>
    <div style={{ fontSize: 28, fontWeight: 600, color: "var(--green-900)", letterSpacing: "-.02em" }}>{n}</div>
    <div style={{ fontSize: 12, color: "var(--ink-500)", lineHeight: 1.35, marginTop: 4 }}>{label}</div>
  </div>
);

const Pillars = ({ accent }) => (
  <section id="metodo" style={{ background: "var(--teal-50)", padding: "72px 48px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <span className="section-eyebrow" style={{ color: accent }}>Método</span>
      <h2 style={{ fontSize: 38, marginTop: 14, maxWidth: 620 }}>
        Cuidado clínico, conduzido com calma.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 40 }}>
        {[
          { i: "leaf",    t: "Avaliação corporal",   d: "Anamnese completa, escala de dor e histórico de saúde antes da primeira aula." },
          { i: "users",   t: "Turmas pequenas",      d: "Máximo de 4 alunos por horário — atenção real, não academia em série." },
          { i: "sparkle", t: "Progressão guiada",    d: "Cada plano é ajustado mensalmente conforme sua evolução e objetivos." },
        ].map((p, i) => (
          <div key={i} className="card" style={{ padding: 28, background: "#fff" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "var(--teal-200)",
              display: "grid", placeItems: "center", color: accent,
            }}>
              <Icon name={p.i} size={22}/>
            </div>
            <h3 style={{ fontSize: 19, marginTop: 18 }}>{p.t}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.55, marginTop: 8 }}>{p.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = ({ onCTA, accent }) => (
  <section id="planos" style={{ padding: "84px 48px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24 }}>
        <div>
          <span className="section-eyebrow" style={{ color: accent }}>Planos & valores</span>
          <h2 style={{ fontSize: 38, marginTop: 14, maxWidth: 540 }}>
            Escolha o ritmo que cabe na sua semana.
          </h2>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--ink-500)", maxWidth: 320, lineHeight: 1.55 }}>
          Todos os planos incluem avaliação inicial gratuita e acompanhamento
          do fisioterapeuta responsável.
        </p>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16, marginTop: 44,
      }}>
        {PRICING.map(p => (
          <PriceCard key={p.id} plan={p} onCTA={onCTA} accent={accent}/>
        ))}
      </div>
      <p style={{
        fontSize: 12, color: "var(--ink-500)", marginTop: 24, textAlign:"center",
      }}>
        Valores referentes a 2026. Mensalidade cobrada na assinatura do plano.
        Sessões de fisioterapia podem ser cobradas por pacote — consulte na avaliação.
      </p>
    </div>
  </section>
);

const PriceCard = ({ plan, onCTA, accent }) => {
  const isHero = plan.destaque;
  return (
    <div className="card" style={{
      padding: 28,
      background: isHero ? accent : "#fff",
      color: isHero ? "#fff" : "var(--ink-900)",
      border: isHero ? "none" : "1px solid var(--ink-100)",
      position: "relative", overflow: "hidden",
    }}>
      {isHero && (
        <span style={{
          position:"absolute", top:18, right:18, fontSize:10, fontWeight:600,
          letterSpacing:".12em", textTransform:"uppercase", color:"#fff",
          background:"rgba(255,255,255,.18)", padding:"4px 10px", borderRadius:999,
        }}>Destaque</span>
      )}
      <h3 style={{
        fontSize: 22, color: isHero ? "#fff" : "var(--green-900)",
      }}>{plan.titulo}</h3>
      <div style={{
        fontSize: 12, color: isHero ? "rgba(255,255,255,.7)" : "var(--ink-500)",
        marginTop: 4,
      }}>{plan.subtitle}</div>

      <div style={{
        marginTop: 24, paddingTop: 22,
        borderTop: `1px solid ${isHero ? "rgba(255,255,255,.18)" : "var(--ink-100)"}`,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {plan.valores.map(([freq, val], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, color: isHero ? "rgba(255,255,255,.85)" : "var(--ink-700)" }}>
              {freq}
            </span>
            <span style={{
              fontSize: 22, fontWeight: 600, letterSpacing: "-.02em",
              color: isHero ? "#fff" : "var(--green-900)",
            }} className="num">
              <small style={{ fontSize:11, fontWeight:500, color: isHero ? "rgba(255,255,255,.65)" : "var(--ink-500)" }}>R$ </small>
              {val}<small style={{ fontSize:11, fontWeight:500, color: isHero ? "rgba(255,255,255,.65)" : "var(--ink-500)" }}>,00</small>
            </span>
          </div>
        ))}
      </div>

      <button
        className="btn"
        onClick={onCTA}
        style={{
          marginTop: 28, width: "100%",
          background: isHero ? "#fff" : "var(--ink-50)",
          color: isHero ? accent : "var(--green-800)",
          fontWeight: 600, fontSize: 13.5,
        }}>
        Quero esse plano <Icon name="arrow_right" size={14}/>
      </button>
    </div>
  );
};

const CTABanner = ({ onCTA, accent }) => (
  <section style={{ padding: "0 48px 72px" }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto",
      background: "var(--green-900)", borderRadius: 28, color: "#fff",
      padding: "56px 60px", position: "relative", overflow: "hidden",
      display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems:"center"
    }}>
      <div>
        <span style={{
          fontSize: 11, color: "var(--teal-200)", letterSpacing: ".16em",
          textTransform: "uppercase", fontWeight: 500,
        }}>Primeira visita</span>
        <h2 style={{ color: "#fff", fontSize: 34, marginTop: 14, maxWidth: 480, lineHeight:1.1 }}>
          Comece com uma avaliação corporal sem custo.
        </h2>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.7)", marginTop: 12, maxWidth: 460, lineHeight: 1.55 }}>
          Em 50 minutos a Flávia avalia postura, mobilidade e queixas atuais.
          Você sai com a recomendação certa para o seu corpo.
        </p>
        <button className="btn btn-primary" onClick={onCTA} style={{
          marginTop: 28, background: "#fff", color: accent,
        }}>
          Agende agora <Icon name="arrow_right" size={16}/>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          ["Avaliação postural", "≈ 20 min"],
          ["Anamnese clínica", "≈ 15 min"],
          ["Plano sugerido", "≈ 15 min"],
        ].map(([t, d], i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,.08)", borderRadius: 14,
            padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 999, background: "rgba(255,255,255,.1)",
                color: "var(--teal-200)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600,
              }}>{i+1}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{t}</span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contato" style={{
    background: "#fff", borderTop: "1px solid var(--ink-100)",
    padding: "56px 48px 40px",
  }}>
    <div style={{
      maxWidth: 1280, margin: "0 auto",
      display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40,
    }}>
      <div>
        <StudioLogo size="md" />
        <p style={{
          fontSize: 13, color: "var(--ink-500)", marginTop: 16, lineHeight: 1.55, maxWidth: 280,
        }}>
          Studio de fisioterapia e pilates clínico em Belo Horizonte.
          Cuidando do seu movimento desde 2014.
        </p>
      </div>
      <div>
        <h4 style={{ fontSize: 12, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase" }}>Endereço</h4>
        <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--ink-900)", lineHeight: 1.6 }}>
          Rua Tuiuti, 318<br/>Centro<br/>Belo Horizonte / MG
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: 12, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase" }}>Contato</h4>
        <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--ink-900)", lineHeight: 1.85 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="whatsapp" size={14} color="var(--green-700)"/> (31) 99812-4421</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="mail" size={14} color="var(--green-700)"/> contato@studioflavia.com.br</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="instagram" size={14} color="var(--green-700)"/> @studioflaviaprudencio</div>
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: 12, color: "var(--ink-500)", letterSpacing: ".12em", textTransform: "uppercase" }}>Horários</h4>
        <div style={{ marginTop: 12, fontSize: 13.5, color: "var(--ink-900)", lineHeight: 1.6 }}>
          Seg a Sex<br/>07h–11h · 15h–21h<br/>
          <span style={{ color: "var(--ink-500)" }}>Sábado · sob agendamento</span>
        </div>
      </div>
    </div>
    <div style={{
      maxWidth: 1280, margin: "40px auto 0", paddingTop: 24,
      borderTop: "1px solid var(--ink-100)",
      display: "flex", justifyContent: "space-between",
      fontSize: 11.5, color: "var(--ink-500)",
    }}>
      <span>© 2026 Studio Flávia Prudêncio · CREFITO 12345-F</span>
      <span>Belo Horizonte / MG · Brasil</span>
    </div>
  </footer>
);

// ---------- Signup modal ----------
const SignupModal = ({ open, onClose, accent, onAccessPortal }) => {
  const [step, setStep] = useState("form"); // form | success
  const [form, setForm] = useState({ nome: "", email: "", endereco: "", cep: "", tel1: "", tel2: "", cpf: "" });
  const [errors, setErrors] = useState({});
  const [resent, setResent] = useState(false);
  const resend = () => { setResent(true); setTimeout(() => setResent(false), 2400); };

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setStep("form"); setForm({ nome: "", email: "", endereco: "", cep: "", tel1: "", tel2: "", cpf: "" }); setErrors({}); }, 300);
    }
  }, [open]);

  const update = (k) => (e) => {
    let v = e.target.value;
    if (k === "cep")  v = v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
    if (k === "tel1" || k === "tel2") v = v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
    if (k === "cpf")  v = v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1-$2").slice(0, 14);
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.nome || form.nome.split(" ").length < 2) errs.nome = "Informe nome completo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "E-mail inválido";
    if (!form.endereco) errs.endereco = "Informe o endereço";
    if (form.cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
    if (form.tel1.replace(/\D/g, "").length < 10) errs.tel1 = "Telefone inválido";
    if (form.cpf.replace(/\D/g, "").length !== 11) errs.cpf = "CPF inválido";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep("success");
  };

  return (
    <Modal open={open} onClose={onClose} width={520} padding={0}>
      {step === "form" ? (
        <div style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
            <div>
              <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Cadastro</span>
              <h2 style={{ fontSize: 24, marginTop: 8 }}>Agende sua avaliação</h2>
              <p style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 6, lineHeight: 1.5 }}>
                Preencha seus dados — entramos em contato pelo WhatsApp com os horários disponíveis.
              </p>
            </div>
            <button onClick={onClose} style={{ background: "var(--ink-50)", border: 0, borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Icon name="close" size={16}/>
            </button>
          </div>
          <form onSubmit={submit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nome completo" v={form.nome} onChange={update("nome")} err={errors.nome} ph="Maria da Silva Santos"/>
            <Field label="E-mail" v={form.email} onChange={update("email")} err={errors.email} ph="maria@email.com"/>
            <Field label="Endereço completo" v={form.endereco} onChange={update("endereco")} err={errors.endereco} ph="Rua, número, bairro, cidade"/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12 }}>
              <Field label="CEP" v={form.cep} onChange={update("cep")} err={errors.cep} ph="30000-000"/>
              <Field label="CPF" v={form.cpf} onChange={update("cpf")} err={errors.cpf} ph="000.000.000-00"/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Telefone 1" v={form.tel1} onChange={update("tel1")} err={errors.tel1} ph="(31) 99999-9999"/>
              <Field label="Telefone 2 (opcional)" v={form.tel2} onChange={update("tel2")} err={null} ph="(31) 3333-3333"/>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12, background: accent }}>
              Enviar cadastro <Icon name="arrow_right" size={16}/>
            </button>
            <p style={{ fontSize: 11, color: "var(--ink-500)", textAlign:"center", marginTop:4 }}>
              Seus dados serão usados apenas para agendamento. LGPD ✓
            </p>
          </form>
        </div>
      ) : (
        <div style={{ padding: "40px 32px 32px", textAlign:"center" }}>
          <div style={{
            width: 76, height: 76, borderRadius: 999, background: "var(--teal-100)",
            color: accent, display: "grid", placeItems: "center", margin: "0 auto",
          }}>
            <Icon name="mail" size={36} stroke={2}/>
          </div>
          <h2 style={{ fontSize: 22, marginTop: 18 }}>Cadastro recebido!</h2>
          <p style={{
            fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.55,
            marginTop: 10, maxWidth: 380, margin: "10px auto 0",
          }}>
            Enviamos uma <b>confirmação por e-mail</b> com o link para você criar sua senha e acessar a área do aluno.
          </p>

          {/* Mock email preview */}
          <div style={{
            marginTop: 22, padding: 16, background: "var(--ink-50)", borderRadius: 14,
            border: "1px solid var(--ink-100)", textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, background: accent,
                color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, flexShrink: 0,
              }}>FP</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)" }}>Studio Flávia Prudêncio</div>
                <div style={{ fontSize: 10.5, color: "var(--ink-500)" }}>
                  para <b className="num">{form.email || "você@email.com"}</b>
                </div>
              </div>
              <span style={{ fontSize: 10, color: "var(--ink-500)" }} className="num">agora</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-900)", marginTop: 12, fontWeight: 500 }}>
              ✉️ Confirme seu cadastro e crie sua senha
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-700)", marginTop: 6, lineHeight: 1.45 }}>
              Olá <b>{form.nome?.split(" ")[0] || "aluna"}</b>! Clique no botão abaixo para criar sua senha de acesso ao portal do aluno.
            </div>
            <div style={{
              marginTop: 12, padding: "8px 14px", background: accent, color: "#fff",
              borderRadius: 8, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <Icon name="check" size={12} color="#fff" stroke={2.4}/> Criar minha senha
            </div>
          </div>

          <p style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 14, lineHeight: 1.45 }}>
            Não recebeu o e-mail? Verifique a caixa de spam ou{" "}
            <button onClick={resend} style={{
              border: 0, background: "transparent", color: accent, textDecoration: "underline",
              cursor: "pointer", fontFamily: "inherit", fontSize: 11, padding: 0,
            }}>reenviar</button>.
            {resent && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 8,
                color: "var(--green-700)", fontWeight: 500,
              }}>
                <Icon name="check" size={11} color="var(--green-700)" stroke={2.4}/> E-mail reenviado!
              </span>
            )}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
            <button className="btn btn-primary"
              onClick={() => { onClose(); onAccessPortal?.(); }}
              style={{ background: accent }}>
              Acessar sua área <Icon name="arrow_right" size={16}/>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Voltar para a página
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const Field = ({ label, v, onChange, err, ph }) => (
  <div className="field">
    <label>{label}</label>
    <input value={v} onChange={onChange} placeholder={ph} style={{
      borderColor: err ? "var(--danger)" : "var(--ink-200)"
    }}/>
    {err && <span className="err">{err}</span>}
  </div>
);

window.Landing = Landing;
window.SignupModal = SignupModal;
