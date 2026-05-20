// app.jsx — root with module switcher and Tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1F4A3D",
  "gradeVariant": "stacked",
  "layout": "desktop"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  "#1F4A3D",  // dark green (default)
  "#0F3D33",  // deeper green
  "#2C5E4A",  // medium green
  "#3D7461",  // sage
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [module, setModule] = useState("landing");
  // restore last module
  useEffect(() => {
    const saved = sessionStorage.getItem("sfp:module");
    if (saved && ["landing","aluno","admin"].includes(saved)) setModule(saved);
  }, []);
  useEffect(() => { sessionStorage.setItem("sfp:module", module); }, [module]);

  const accent = t.accent;
  const layout = t.layout || "desktop";
  // For Aluno, "mobile" is the natural default; if user never explicitly chose, default Aluno to mobile.
  const effectiveLayout = module === "aluno" && !t._layoutTouched ? "mobile" : layout;
  const setLayout = (v) => setTweak({ layout: v, _layoutTouched: true });

  // Inject accent into CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  return (
    <div data-screen-label={`Studio Flávia Prudêncio · ${module}`}>
      <TopBar module={module} onModuleChange={setModule}
              layout={effectiveLayout} onLayoutChange={setLayout}/>

      {module === "landing" && (
        effectiveLayout === "mobile"
          ? <LandingMobile accent={accent} onAccessPortal={() => setModule("aluno")}/>
          : <Landing accent={accent} onAccessPortal={() => setModule("aluno")}/>
      )}
      {module === "aluno" && (
        effectiveLayout === "desktop"
          ? <PortalDesktop accent={accent} layout="desktop" onLayoutChange={setLayout}/>
          : <Portal accent={accent} layout="mobile" onLayoutChange={setLayout}/>
      )}
      {module === "admin" && (
        effectiveLayout === "mobile"
          ? <AdminMobileFrame accent={accent} gradeVariant={t.gradeVariant}/>
          : <Admin accent={accent} gradeVariant={t.gradeVariant}/>
      )}

      <TweaksPanel>
        <TweakSection label="Identidade visual"/>
        <TweakColor label="Verde primário" value={t.accent}
          options={ACCENT_OPTIONS} onChange={(v) => setTweak("accent", v)}/>

        <TweakSection label="Viewport"/>
        <TweakRadio label="Layout"
          value={effectiveLayout}
          options={["mobile","desktop"]}
          labels={["Mobile","Desktop"]}
          onChange={setLayout}/>

        {module === "admin" && (
          <>
            <TweakSection label="Grade Diária"/>
            <TweakRadio label="Variante"
              value={t.gradeVariant}
              options={["stacked","compact","kanban"]}
              labels={["Empilhado","Compacto","Kanban"]}
              onChange={(v) => setTweak("gradeVariant", v)}/>
          </>
        )}

        <TweakSection label="Atalhos"/>
        <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
          {[
            ["landing","Visão pública"],
            ["aluno","Portal do aluno"],
            ["admin","Painel admin"],
          ].map(([id, l]) => (
            <button key={id} className="twk-field" onClick={() => setModule(id)}
              style={{
                textAlign:"left", cursor:"pointer", height: 28,
                background: module === id ? "rgba(31,74,61,.1)" : "rgba(255,255,255,.6)",
                color: module === id ? "var(--green-800)" : "inherit",
                fontWeight: module === id ? 500 : 400,
              }}>
              → {l}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

const TopBar = ({ module, onModuleChange, layout, onLayoutChange }) => {
  const tabs = [
    { id: "landing", label: "Visão pública" },
    { id: "aluno",   label: "Portal do aluno" },
    { id: "admin",   label: "Painel admin" },
  ];
  return (
    <div style={{
      position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)",
      zIndex: 1000, display: "flex", gap: 10, alignItems: "center",
    }}>
      <div className="switcher" style={{ position: "static", transform: "none" }}>
        {tabs.map(t => (
          <button key={t.id} className={module === t.id ? "active" : ""}
            onClick={() => onModuleChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="switcher" style={{ position: "static", transform: "none" }}>
        <button className={layout === "mobile" ? "active" : ""} onClick={() => onLayoutChange("mobile")}
          title="Visualizar em mobile">
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ verticalAlign: "-2px", marginRight: 6 }}>
            <rect x="1" y="1" width="9" height="11" rx="1.5"/><path d="M4.5 10.2h2"/>
          </svg>
          Mobile
        </button>
        <button className={layout === "desktop" ? "active" : ""} onClick={() => onLayoutChange("desktop")}
          title="Visualizar em desktop">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ verticalAlign: "-2px", marginRight: 6 }}>
            <rect x="1" y="1" width="12" height="8.5" rx="1"/><path d="M4.5 12.2h5M7 9.5v2.7"/>
          </svg>
          Desktop
        </button>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
