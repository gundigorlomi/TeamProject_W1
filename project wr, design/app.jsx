// Main App: header, search, dashboard layout, compare mode
const { useState, useRef, useEffect } = React;

// ---------------- Search Combobox ----------------
const InfluencerSearch = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const filtered = Object.values(options).filter((o) =>
    !q || o.handle.toLowerCase().includes(q.toLowerCase()) || o.name.toLowerCase().includes(q.toLowerCase()) || o.niche.toLowerCase().includes(q.toLowerCase())
  );
  const current = options[value];
  return (
    <div ref={ref} className="relative w-[420px] max-w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-300 transition-colors text-left"
      >
        <IconSearch size={15} className="text-slate-400 shrink-0" />
        <Avatar initials={current.avatar} hue={current.avatarHue} size={22} />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-slate-900 leading-tight truncate">
            {current.handle} <span className="text-slate-400 font-normal">· {current.niche}</span>
          </div>
        </div>
        <PlatformIcon platform={current.platform} size={13} className="text-slate-400" />
        <IconChevronDown size={14} className={"text-slate-400 transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by handle, name, or niche..."
                className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-slate-50 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="max-h-80 overflow-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500">No matches</div>
            ) : filtered.map((o) => {
              const tier = scoreTier(o.score);
              return (
                <button
                  key={o.id}
                  onClick={() => { onChange(o.id); setOpen(false); setQ(""); }}
                  className={"w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-left " + (o.id === value ? "bg-slate-50" : "")}
                >
                  <Avatar initials={o.avatar} hue={o.avatarHue} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium text-slate-900">{o.name}</span>
                      <span className="text-[12px] text-slate-500 font-mono">{o.handle}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PlatformIcon platform={o.platform} size={10} className="text-slate-400" />
                      <span className="text-[11px] text-slate-500">{o.niche} · {fmtNum(o.followers)}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded" style={{ background: tier.soft, color: tier.hex }}>
                    {o.score}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Demo dataset · 3 influencers</span>
            <span className="font-mono">⌘K</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------- Header ----------------
const Header = ({ selectedId, onSelect, compareMode, onToggleCompare }) => (
  <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
    <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 grid place-items-center text-white">
          <IconShield size={16} stroke={2.25} />
        </div>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold text-slate-900 tracking-tight">Veracity</div>
          <div className="text-[10px] text-slate-500 -mt-0.5">Influencer Authenticity</div>
        </div>
      </div>
      <div className="h-7 w-px bg-slate-200 mx-1" />
      <InfluencerSearch value={selectedId} onChange={onSelect} options={INFLUENCERS} />
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleCompare}
          className={"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors " +
            (compareMode ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300")}
        >
          <IconCompare size={13} />
          Compare
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300">
          <IconDownload size={13} />
          Report
        </button>
        <div className="h-7 w-px bg-slate-200 mx-1" />
        <div className="flex items-center gap-2">
          <Avatar initials="AK" hue={260} size={28} />
          <div className="leading-tight hidden sm:block">
            <div className="text-[12px] font-medium text-slate-900">Anya Kovac</div>
            <div className="text-[10px] text-slate-500">Plum Agency · Pro</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// ---------------- Single-Influencer Dashboard ----------------
const Dashboard = ({ inf }) => (
  <div className="grid grid-cols-12 gap-4">
    {/* Row 1: Profile + Score */}
    <div className="col-span-12 lg:col-span-5">
      <div className="flex flex-col gap-4">
        <ProfileCard inf={inf} />
        <GeneratedProfilePhotos inf={inf} />
      </div>
    </div>
    <div className="col-span-12 lg:col-span-7">
      <ScoreCard inf={inf} />
    </div>

    {/* Row 2: Timeline (wide) + Red Flags */}
    <div className="col-span-12 lg:col-span-7">
      <EngagementTimeline inf={inf} />
    </div>
    <div className="col-span-12 lg:col-span-5">
      <RedFlagsPanel inf={inf} />
    </div>

    {/* Row 3: Comment quality + Audience demographics */}
    <div className="col-span-12 lg:col-span-5">
      <CommentQuality inf={inf} />
    </div>
    <div className="col-span-12 lg:col-span-7">
      <AudienceDemographics inf={inf} />
    </div>

    {/* Row 4: Suspicious followers */}
    <div className="col-span-12">
      <SuspiciousFollowers inf={inf} />
    </div>
  </div>
);

// ---------------- Compare Mode ----------------
const CompareView = ({ leftId, rightId, setLeft, setRight }) => {
  const left = INFLUENCERS[leftId];
  const right = INFLUENCERS[rightId];
  const diff = right.score - left.score;
  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-full text-[12px] text-slate-600">
          <span className="font-mono">{left.handle}</span>
          <span className="text-slate-300">vs</span>
          <span className="font-mono">{right.handle}</span>
          <span className="ml-1 px-2 py-0.5 rounded-full font-mono font-semibold text-[11px]"
            style={{
              background: diff > 0 ? "#ecfdf5" : diff < 0 ? "#fef2f2" : "#f1f5f9",
              color: diff > 0 ? "#059669" : diff < 0 ? "#dc2626" : "#64748b",
            }}>
            {diff > 0 ? "+" : ""}{diff} pts
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CompareColumn inf={left} onChange={setLeft} allInfluencers={INFLUENCERS} sideLabel="Influencer A" />
        <CompareColumn inf={right} onChange={setRight} allInfluencers={INFLUENCERS} sideLabel="Influencer B" />
      </div>
    </div>
  );
};

// ---------------- App ----------------
const App = () => {
  const [selectedId, setSelectedId] = useState("drew");
  const [compareMode, setCompareMode] = useState(false);
  const [leftId, setLeftId] = useState("maya");
  const [rightId, setRightId] = useState("ivy");
  const inf = INFLUENCERS[selectedId];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      <Header
        selectedId={selectedId}
        onSelect={setSelectedId}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode((v) => !v)}
      />
      <main className="max-w-[1440px] mx-auto px-6 py-5">
        {!compareMode && (
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold">Authenticity Report</div>
              <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight mt-0.5">
                {inf.name} <span className="text-slate-400 font-normal font-mono text-[15px]">· {inf.handle}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live data</span>
              <span>·</span>
              <span className="font-mono">Last scan 2026-05-06 14:12 UTC</span>
            </div>
          </div>
        )}
        {compareMode ? (
          <CompareView leftId={leftId} rightId={rightId} setLeft={setLeftId} setRight={setRightId} />
        ) : (
          <Dashboard inf={inf} />
        )}
        <footer className="mt-10 pb-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Veracity v3.4 · Demo data — no live API calls</span>
          <span className="flex items-center gap-3">
            <a className="hover:text-slate-700">Methodology</a>
            <a className="hover:text-slate-700">API docs</a>
            <a className="hover:text-slate-700">Status</a>
          </span>
        </footer>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
