// Shared components, icons, and utilities

// ---------------- Icons (lucide-style) ----------------
const Icon = ({ d, size = 16, stroke = 1.75, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const IconSearch = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>} />;
const IconCheck = (p) => <Icon {...p} d="M20 6 9 17l-5-5" />;
const IconShield = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />;
const IconAlert = (p) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>} />;
const IconFlag = (p) => <Icon {...p} d={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>} />;
const IconUsers = (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />;
const IconActivity = (p) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IconSparkles = (p) => <Icon {...p} d={<><path d="M9.94 14.06 12 22l2.06-7.94L22 12l-7.94-2.06L12 2 9.94 9.94 2 12z" /></>} />;
const IconChevronDown = (p) => <Icon {...p} d="m6 9 6 6 6-6" />;
const IconArrowUpRight = (p) => <Icon {...p} d={<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>} />;
const IconEye = (p) => <Icon {...p} d={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>} />;
const IconDownload = (p) => <Icon {...p} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />;
const IconCompare = (p) => <Icon {...p} d={<><path d="M3 3h7v18H3z" /><path d="M14 3h7v18h-7z" /><path d="M10 12h4" /></>} />;
const IconClose = (p) => <Icon {...p} d="M18 6 6 18M6 6l18 18" />;
const IconUserMinus = (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="22" y1="11" x2="16" y2="11" /></>} />;
const IconRefresh = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>} />;
const IconExternal = (p) => <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>} />;
const IconDot = ({ className = "" }) => <span className={"inline-block w-1.5 h-1.5 rounded-full " + className} />;

// Platform glyphs
const IconInstagram = (p) => (
  <Icon {...p} d={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>} />
);
const IconTikTok = (p) => (
  <Icon {...p} d={<><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></>} />
);
const IconYouTube = (p) => (
  <Icon {...p} d={<><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></>} />
);
const PlatformIcon = ({ platform, ...p }) => {
  if (platform === "instagram") return <IconInstagram {...p} />;
  if (platform === "tiktok") return <IconTikTok {...p} />;
  if (platform === "youtube") return <IconYouTube {...p} />;
  return null;
};

// ---------------- Utilities ----------------
const fmtNum = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 10e3 ? 0 : 1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
};

// Score → color tier
const scoreTier = (score) => {
  if (score >= 75) return { label: "Authentic", tone: "good", hex: "#10b981", soft: "#ecfdf5", ring: "#10b98133" };
  if (score >= 45) return { label: "Suspicious", tone: "warn", hex: "#f59e0b", soft: "#fffbeb", ring: "#f59e0b33" };
  return { label: "Likely Fake", tone: "bad", hex: "#ef4444", soft: "#fef2f2", ring: "#ef444433" };
};

const severityStyles = {
  high: { label: "HIGH", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  med:  { label: "MED",  bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  low:  { label: "LOW",  bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
};

// ---------------- Avatar ----------------
const Avatar = ({ initials, hue = 220, size = 56, ring = false }) => (
  <div
    className={"relative shrink-0 grid place-items-center font-semibold text-white select-none " + (ring ? "ring-4 ring-white" : "")}
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.32,
      background: `linear-gradient(135deg, oklch(0.72 0.14 ${hue}) 0%, oklch(0.55 0.18 ${hue + 30}) 100%)`,
      fontSize: size * 0.36,
      letterSpacing: "-0.02em",
    }}
  >
    {initials}
  </div>
);

// ---------------- Card ----------------
const Card = ({ title, subtitle, action, children, className = "", padded = true }) => (
  <section className={"bg-white border border-slate-200 rounded-xl " + className}>
    {(title || action) && (
      <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-slate-100">
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className={padded ? "p-5" : ""}>{children}</div>
  </section>
);

// ---------------- Authenticity Gauge ----------------
const AuthenticityGauge = ({ score, size = 220, thickness = 14 }) => {
  const tier = scoreTier(score);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // Arc spans from -135° to +135° (270° total)
  const startAngle = -225;
  const endAngle = 45;
  const totalSweep = endAngle - startAngle; // 270
  const polar = (cxv, cyv, rv, deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cxv + rv * Math.cos(rad), y: cyv + rv * Math.sin(rad) };
  };
  const arcPath = (rv, sd, ed) => {
    const s = polar(cx, cy, rv, sd);
    const e = polar(cx, cy, rv, ed);
    const large = ed - sd > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rv} ${rv} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const valueAngle = startAngle + (Math.max(0, Math.min(100, score)) / 100) * totalSweep;

  // Tick segments at 0/45/75 thresholds
  const segments = [
    { from: 0, to: 45, color: "#fecaca" },
    { from: 45, to: 75, color: "#fde68a" },
    { from: 75, to: 100, color: "#a7f3d0" },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <path d={arcPath(r, startAngle, endAngle)} stroke="#f1f5f9" strokeWidth={thickness} fill="none" strokeLinecap="round" />
        {/* Tier hint segments */}
        {segments.map((seg, i) => {
          const sd = startAngle + (seg.from / 100) * totalSweep;
          const ed = startAngle + (seg.to / 100) * totalSweep;
          return (
            <path
              key={i}
              d={arcPath(r + thickness * 0.85, sd, ed)}
              stroke={seg.color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          );
        })}
        {/* Value arc */}
        <path
          d={arcPath(r, startAngle, valueAngle)}
          stroke={tier.hex}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />
        {/* Tick marks at 45 and 75 */}
        {[45, 75].map((t) => {
          const a = startAngle + (t / 100) * totalSweep;
          const inner = polar(cx, cy, r - thickness / 2 - 2, a);
          const outer = polar(cx, cy, r + thickness / 2 + 2, a);
          return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#fff" strokeWidth={2} />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-[64px] leading-none font-semibold tracking-tight" style={{ color: tier.hex, fontFeatureSettings: '"tnum"' }}>
          {score}
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mt-1">/100</div>
        <div className="mt-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
          style={{ background: tier.soft, color: tier.hex }}>
          {tier.label}
        </div>
      </div>
    </div>
  );
};

// ---------------- Subscore Bar ----------------
const SubscoreBar = ({ label, value, hint }) => {
  const tier = scoreTier(value);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-medium text-slate-700">{label}</div>
          {hint && <div className="text-[11px] text-slate-400">{hint}</div>}
        </div>
        <div className="font-mono text-[13px] tabular-nums font-semibold" style={{ color: tier.hex }}>
          {value}
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: value + "%", background: tier.hex }} />
      </div>
    </div>
  );
};

// ---------------- Sparkline / Timeline Chart ----------------
const TimelineChart = ({ data, height = 200, showSuspicious = true }) => {
  const w = 720;
  const h = height;
  const padL = 40, padR = 12, padT = 16, padB = 24;
  const xs = (i) => padL + (i / (data.length - 1)) * (w - padL - padR);
  const maxL = Math.max(...data.map((d) => d.likes));
  const maxC = Math.max(...data.map((d) => d.comments));
  const yL = (v) => padT + (1 - v / maxL) * (h - padT - padB);
  const yC = (v) => padT + (1 - v / maxC) * (h - padT - padB);

  const pathL = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${yL(d.likes)}`).join(" ");
  const pathLArea = pathL + ` L ${xs(data.length - 1)} ${h - padB} L ${xs(0)} ${h - padB} Z`;
  const pathC = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${yC(d.comments)}`).join(" ");
  const spikes = data.filter((d) => d.suspicious);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="likesGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Y grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padT + p * (h - padT - padB);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={padL - 6} y={y + 3} fontSize="9" fill="#94a3b8" textAnchor="end" fontFamily="ui-monospace">
                {fmtNum(Math.round(maxL * (1 - p)))}
              </text>
            </g>
          );
        })}
        {/* Suspicious markers */}
        {showSuspicious && spikes.map((d, i) => (
          <g key={i}>
            <line x1={xs(d.day)} y1={padT} x2={xs(d.day)} y2={h - padB} stroke="#ef4444" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
            <circle cx={xs(d.day)} cy={yL(d.likes)} r="5" fill="#fff" stroke="#ef4444" strokeWidth="2" />
          </g>
        ))}
        {/* Likes area + line */}
        <path d={pathLArea} fill="url(#likesGrad)" />
        <path d={pathL} fill="none" stroke="#6366f1" strokeWidth="2" />
        {/* Comments line */}
        <path d={pathC} fill="none" stroke="#94a3b8" strokeWidth="1.25" strokeDasharray="3 3" />
        {/* X axis labels */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
          <text key={i} x={xs(i)} y={h - 6} fontSize="9" fill="#94a3b8" textAnchor="middle" fontFamily="ui-monospace">
            {i === 0 ? "90d ago" : i === data.length - 1 ? "today" : "45d"}
          </text>
        ))}
      </svg>
      <div className="flex items-center gap-4 text-[11px] text-slate-500 px-1 mt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500" /> Likes</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-400 border-dashed" style={{ borderTop: "1px dashed #94a3b8", background: "transparent" }} /> Comments</span>
        {spikes.length > 0 && showSuspicious && (
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full ring-2 ring-rose-500 bg-white" /> {spikes.length} suspicious bursts
          </span>
        )}
      </div>
    </div>
  );
};

// ---------------- Donut Chart ----------------
const DonutChart = ({ segments, size = 160, thickness = 22, centerLabel, centerValue }) => {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const polar = (deg) => ({
    x: cx + r * Math.cos((deg - 90) * Math.PI / 180),
    y: cy + r * Math.sin((deg - 90) * Math.PI / 180),
  });
  let cursor = 0;
  const arcs = segments.map((seg, i) => {
    const startA = (cursor / total) * 360;
    cursor += seg.value;
    const endA = (cursor / total) * 360;
    const s = polar(startA);
    const e = polar(endA - 0.01);
    const large = endA - startA > 180 ? 1 : 0;
    return { d: `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`, color: seg.color, key: i };
  });
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} stroke="#f1f5f9" strokeWidth={thickness} fill="none" />
        {arcs.map((a) => (
          <path key={a.key} d={a.d} stroke={a.color} strokeWidth={thickness} fill="none" strokeLinecap="butt" />
        ))}
      </svg>
      {centerValue != null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">{centerValue}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{centerLabel}</div>
        </div>
      )}
    </div>
  );
};

// ---------------- Bar List (for demographics) ----------------
const BarList = ({ rows, valueSuffix = "%", color = "#0f172a" }) => (
  <div className="flex flex-col gap-2">
    {rows.map((r, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="text-[12px] text-slate-600 w-32 truncate">{r.label || r.country}</div>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: r.value + "%", background: color }} />
        </div>
        <div className="font-mono text-[11px] tabular-nums text-slate-500 w-9 text-right">{r.value}{valueSuffix}</div>
      </div>
    ))}
  </div>
);

// Export to window
Object.assign(window, {
  Icon, IconSearch, IconCheck, IconShield, IconAlert, IconFlag, IconUsers, IconActivity,
  IconSparkles, IconChevronDown, IconArrowUpRight, IconEye, IconDownload, IconCompare,
  IconClose, IconUserMinus, IconRefresh, IconExternal, IconDot,
  IconInstagram, IconTikTok, IconYouTube, PlatformIcon,
  fmtNum, scoreTier, severityStyles,
  Avatar, Card, AuthenticityGauge, SubscoreBar, TimelineChart, DonutChart, BarList,
});
