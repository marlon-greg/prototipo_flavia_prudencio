// landing-mobile.jsx — Mobile version of the public landing page

const { PRICING: LM_PRICING } = window.STUDIO_DATA;

const LandingMobile = ({ accent, onAccessPortal }) => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const scrollTo = (id) => {
    const c = scrollRef.current;
    if (!c) return;
    const el = c.querySelector(`[data-anchor="${id}"]`);
    if (!el) return;
    c.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  return (
    <div className="phone-stage" style={{ paddingTop: 90 }}>
      <div className="phone" style={{ height: 820 }}>
        <div className="phone-screen">
          <IOSStatusBar/>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
            {/* Header */}
            <div style={{
              padding: "10px 18px 14px", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              background: "#fff",
              borderBottom: "1px solid rgba(15,51,38,.05)",
              position: "sticky", top: 0, zIndex: 10,
            }}>
              <StudioLogo size="sm"/>
              <button onClick={() => setMenuOpen(true)} style={{
                width: 38, height: 38, border: 0, background: "var(--ink-50)",
                borderRadius: 12, display: "grid", placeItems: "center", cursor: "pointer",
              }}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="var(--green-900)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M1 1h16M1 7h16M1 13h16"/>
                </svg>
              </button>
            </div>

            {/* Hero */}
            <section style={{ padding: "24px 22px 28px" }}>
              <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>
                Fisio · Pilates clínico
              </span>
              <h1 style={{ fontSize: 32, lineHeight: 1.05, marginTop: 14, letterSpacing: "-.02em" }}>
                Bem-estar <em style={{ fontStyle: "italic", fontWeight: 300, color: accent, fontFamily: "Poppins" }}>que começa</em><br/>
                no movimento certo.
              </h1>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-700)", marginTop: 14 }}>
                Atendimento individualizado em grupos de até 4 alunos por horário.
              </p>
              <button className="btn btn-primary" onClick={() => setSignupOpen(true)}
                style={{ background: accent, width: "100%", marginTop: 18 }}>
                Agende sua avaliação <Icon name="arrow_right" size={16}/>
              </button>

              {/* Photo */}
              <div style={{
                marginTop: 22, aspectRatio: "4/5", borderRadius: 22, overflow: "hidden",
                background: "var(--teal-50)",
                boxShadow: "0 12px 30px rgba(15,51,38,.10)",
              }}>
                <img
                  src={window.__resources?.pilatesPhoto || "https://image.pollinations.ai/prompt/minimalist%20pilates%20studio%20interior%20with%20reformer%20machine,%20soft%20natural%20morning%20light%20through%20large%20windows,%20wooden%20floor,%20indoor%20plants,%20beige%20and%20sage%20green%20tones,%20clinical%20calm%20atmosphere,%20professional%20editorial%20photography,%20wide%20angle,%20no%20people?width=720&height=900&nologo=true&seed=4271"}
                  alt="Sala de pilates"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Stats inline */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8,
                marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--ink-100)",
              }}>
                <LMStat n="12" label="anos" />
                <LMStat n="320+" label="alunos" />
                <LMStat n="4" label="por aula" />
              </div>
            </section>

            {/* Pillars */}
            <section data-anchor="metodo" style={{ padding: "28px 22px", background: "var(--teal-50)" }}>
              <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Método</span>
              <h2 style={{ fontSize: 22, marginTop: 10, letterSpacing: "-.02em" }}>
                Cuidado clínico, conduzido com calma.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                {[
                  { i: "leaf",    t: "Avaliação corporal",   d: "Anamnese completa antes da primeira aula." },
                  { i: "users",   t: "Turmas pequenas",      d: "Máximo de 4 alunos por horário." },
                  { i: "sparkle", t: "Progressão guiada",    d: "Plano ajustado mensalmente." },
                ].map((p, i) => (
                  <div key={i} className="card" style={{ padding: 16, display: "flex", gap: 12, alignItems: "start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: "var(--teal-100)",
                      display: "grid", placeItems: "center", color: accent, flexShrink: 0,
                    }}>
                      <Icon name={p.i} size={18}/>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 14 }}>{p.t}</h3>
                      <p style={{ fontSize: 12, color: "var(--ink-700)", lineHeight: 1.5, marginTop: 4 }}>{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section data-anchor="planos" style={{ padding: "28px 22px" }}>
              <span className="section-eyebrow" style={{ color: accent, fontSize: 10 }}>Planos</span>
              <h2 style={{ fontSize: 22, marginTop: 10, letterSpacing: "-.02em" }}>
                Escolha o ritmo da sua semana.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
                {LM_PRICING.map(p => <LMPriceCard key={p.id} plan={p} accent={accent} onCTA={() => setSignupOpen(true)}/>)}
              </div>
              <p style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
                Avaliação inicial gratuita inclusa em todos os planos.
              </p>
            </section>

            {/* CTA */}
            <section style={{ padding: "0 16px 24px" }}>
              <div style={{
                background: "var(--green-900)", borderRadius: 20, color: "#fff",
                padding: 22,
              }}>
                <span style={{
                  fontSize: 10, color: "var(--teal-200)", letterSpacing: ".12em",
                  textTransform: "uppercase", fontWeight: 500,
                }}>Primeira visita</span>
                <h3 style={{ color: "#fff", fontSize: 20, marginTop: 10, lineHeight: 1.15 }}>
                  Avaliação corporal sem custo.
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => setSignupOpen(true)}
                  style={{ background: "#fff", color: accent, marginTop: 14, width: "100%" }}>
                  Agendar agora <Icon name="arrow_right" size={14}/>
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer data-anchor="contato" style={{
              padding: "20px 22px 28px", background: "var(--ink-50)",
              borderTop: "1px solid var(--ink-100)",
            }}>
              <StudioLogo size="sm"/>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-700)", lineHeight: 1.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="map" size={13} color={accent}/> Rua Tuiuti, 318 — Centro
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="whatsapp" size={13} color={accent}/> (31) 99812-4421
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="clock" size={13} color={accent}/> Seg–Sex · 07–11h e 15–21h
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="instagram" size={13} color={accent}/> @studioflaviaprudencio
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--ink-200)", fontSize: 10, color: "var(--ink-500)" }}>
                © 2026 Studio Flávia Prudêncio · CREFITO 12345-F
              </div>
            </footer>
          </div>

          <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} accent={accent} onAccessPortal={onAccessPortal}/>
          <LMMenu open={menuOpen} onClose={() => setMenuOpen(false)}
            onCTA={() => { setMenuOpen(false); setSignupOpen(true); }}
            onScrollTo={(id) => { setMenuOpen(false); setTimeout(() => scrollTo(id), 220); }}
            accent={accent}/>
        </div>
      </div>
    </div>
  );
};

const LMStat = ({ n, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 22, fontWeight: 600, color: "var(--green-900)", letterSpacing: "-.02em" }} className="num">{n}</div>
    <div style={{ fontSize: 10.5, color: "var(--ink-500)", marginTop: 2 }}>{label}</div>
  </div>
);

const LMPriceCard = ({ plan, accent, onCTA }) => {
  const isHero = plan.destaque;
  return (
    <div style={{
      padding: 18, borderRadius: 16,
      background: isHero ? accent : "#fff",
      color: isHero ? "#fff" : "var(--ink-900)",
      border: isHero ? "none" : "1px solid var(--ink-100)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <h3 style={{ fontSize: 17, color: isHero ? "#fff" : "var(--green-900)" }}>{plan.titulo}</h3>
          <div style={{ fontSize: 11, color: isHero ? "rgba(255,255,255,.7)" : "var(--ink-500)", marginTop: 2 }}>
            {plan.subtitle}
          </div>
        </div>
        {isHero && (
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
            color: "#fff", background: "rgba(255,255,255,.18)", padding: "3px 8px", borderRadius: 999,
          }}>Destaque</span>
        )}
      </div>
      <div style={{
        marginTop: 12, paddingTop: 10,
        borderTop: `1px solid ${isHero ? "rgba(255,255,255,.18)" : "var(--ink-100)"}`,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {plan.valores.map(([freq, val], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 12, color: isHero ? "rgba(255,255,255,.85)" : "var(--ink-700)" }}>{freq}</span>
            <span style={{
              fontSize: 18, fontWeight: 600, letterSpacing: "-.02em",
              color: isHero ? "#fff" : "var(--green-900)",
            }} className="num">
              <small style={{ fontSize: 10, fontWeight: 500, color: isHero ? "rgba(255,255,255,.65)" : "var(--ink-500)" }}>R$ </small>
              {val}<small style={{ fontSize: 10, fontWeight: 500, color: isHero ? "rgba(255,255,255,.65)" : "var(--ink-500)" }}>,00</small>
            </span>
          </div>
        ))}
      </div>
      <button onClick={onCTA} style={{
        marginTop: 14, width: "100%", padding: "10px 0",
        background: isHero ? "#fff" : "var(--ink-50)",
        color: isHero ? accent : "var(--green-800)",
        border: 0, borderRadius: 999, fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      }}>
        Quero esse plano
      </button>
    </div>
  );
};

const LMMenu = ({ open, onClose, onCTA, onScrollTo, accent }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(15,51,38,.45)",
      backdropFilter: "blur(2px)", zIndex: 50,
      animation: "fadeIn .15s",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "78%",
        background: "#fff", padding: "60px 24px 24px",
        display: "flex", flexDirection: "column", gap: 4,
        animation: "slideRightIn .22s cubic-bezier(.2,.8,.2,1)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20, background: "var(--ink-50)", border: 0,
          width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer",
        }}>
          <Icon name="close" size={14}/>
        </button>
        {[
          ["Planos","planos"],
          ["Método","metodo"],
          ["Contato","contato"],
        ].map(([l, id]) => (
          <button key={l} onClick={() => onScrollTo?.(id)} style={{
            padding: "14px 6px", fontSize: 17, fontWeight: 500,
            color: "var(--green-900)", textDecoration: "none",
            borderBottom: "1px solid var(--ink-100)",
            background: "transparent", border: 0,
            borderBottom: "1px solid var(--ink-100)",
            fontFamily: "inherit", textAlign: "left", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            {l}
            <Icon name="chev_right" size={14} color="var(--ink-300)"/>
          </button>
        ))}
        <button className="btn btn-primary" onClick={onCTA} style={{
          background: accent, marginTop: 22, width: "100%",
        }}>
          Agende sua avaliação <Icon name="arrow_right" size={14}/>
        </button>
      </div>
      <style>{`@keyframes slideRightIn{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
};

window.LandingMobile = LandingMobile;
