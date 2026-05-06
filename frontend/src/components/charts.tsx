import { useEffect, useMemo, useRef, useState } from "react";

import { fmtNum } from "../lib/format";
import { scoreTier } from "../lib/score";

/** Tweens a numeric value from 0 → target with a cubic ease whenever target changes. */
function useCountUp(target: number, durationMs = 1100): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const v = fromRef.current + (target - fromRef.current) * ease(t);
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}

export const AuthenticityGauge = ({
  score,
  size = 220,
  thickness = 14,
}: {
  score: number;
  size?: number;
  thickness?: number;
}) => {
  const tier = scoreTier(score);
  const animated = useCountUp(score, 1300);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -225;
  const endAngle = 45;
  const totalSweep = endAngle - startAngle;
  const polar = (cxv: number, cyv: number, rv: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cxv + rv * Math.cos(rad), y: cyv + rv * Math.sin(rad) };
  };
  const arcPath = (rv: number, sd: number, ed: number) => {
    const s = polar(cx, cy, rv, sd);
    const e = polar(cx, cy, rv, ed);
    const large = ed - sd > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rv} ${rv} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const valueAngle = startAngle + (Math.max(0, Math.min(100, animated)) / 100) * totalSweep;
  const segments = [
    { from: 0, to: 45, color: "#fecaca" },
    { from: 45, to: 75, color: "#fde68a" },
    { from: 75, to: 100, color: "#a7f3d0" },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={arcPath(r, startAngle, endAngle)} stroke="#f1f5f9" strokeWidth={thickness} fill="none" strokeLinecap="round" />
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
        <path
          d={arcPath(r, startAngle, valueAngle)}
          stroke={tier.hex}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          style={{ transition: "stroke 400ms ease" }}
        />
        {[45, 75].map((t) => {
          const a = startAngle + (t / 100) * totalSweep;
          const inner = polar(cx, cy, r - thickness / 2 - 2, a);
          const outer = polar(cx, cy, r + thickness / 2 + 2, a);
          return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#fff" strokeWidth={2} />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="font-mono text-[64px] leading-none font-semibold tracking-tight"
          style={{ color: tier.hex, fontFeatureSettings: '"tnum"', transition: "color 400ms ease" }}
        >
          {Math.round(animated)}
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mt-1">/100</div>
        <div
          className="mt-3 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider animate-scale-in"
          style={{ background: tier.soft, color: tier.hex }}
        >
          {tier.label}
        </div>
      </div>
    </div>
  );
};

export const SubscoreBar = ({
  label,
  value,
  hint,
  delayMs = 0,
}: {
  label: string;
  value: number;
  hint?: string;
  delayMs?: number;
}) => {
  const tier = scoreTier(value);
  const animated = useCountUp(value, 1100);
  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-medium text-slate-700">{label}</div>
          {hint && <div className="text-[11px] text-slate-400">{hint}</div>}
        </div>
        <div
          className="font-mono text-[13px] tabular-nums font-semibold"
          style={{ color: tier.hex, transition: "color 400ms ease" }}
        >
          {Math.round(animated)}
        </div>
      </div>
      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          key={value /* re-mount on value change to replay grow animation */}
          className="bar-fill h-full rounded-full relative"
          style={
            {
              "--target": value + "%",
              background: `linear-gradient(90deg, ${tier.hex}cc 0%, ${tier.hex} 60%, ${tier.hex} 100%)`,
              animationDelay: delayMs + "ms",
            } as React.CSSProperties
          }
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.6s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface TimelinePointLite {
  day: number;
  likes: number;
  comments: number;
  suspicious: boolean;
}

export const TimelineChart = ({
  data,
  height = 200,
  showSuspicious = true,
  xLabels,
}: {
  data: TimelinePointLite[];
  height?: number;
  showSuspicious?: boolean;
  xLabels?: [string, string, string];
}) => {
  const w = 720;
  const h = height;
  const padL = 40,
    padR = 12,
    padT = 16,
    padB = 24;

  // animation key based on data identity so the line re-draws when range changes
  const animKey = useMemo(() => `${data.length}-${data[0]?.likes ?? 0}-${data[data.length - 1]?.likes ?? 0}`, [data]);

  // hover state
  const [hover, setHover] = useState<{ i: number; cx: number; cy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const xs = (i: number) => padL + (i / Math.max(1, data.length - 1)) * (w - padL - padR);
  const maxL = Math.max(1, ...data.map((d) => d.likes));
  const maxC = Math.max(1, ...data.map((d) => d.comments));
  const yL = (v: number) => padT + (1 - v / maxL) * (h - padT - padB);
  const yC = (v: number) => padT + (1 - v / maxC) * (h - padT - padB);

  const pathL = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${yL(d.likes)}`).join(" ");
  const pathLArea = pathL + ` L ${xs(data.length - 1)} ${h - padB} L ${xs(0)} ${h - padB} Z`;
  const pathC = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${yC(d.comments)}`).join(" ");
  const spikes = data.filter((d) => d.suspicious);

  // approximate path length for stroke-dasharray draw animation
  const pathLen = useMemo(() => {
    let total = 0;
    for (let i = 1; i < data.length; i++) {
      const dx = xs(i) - xs(i - 1);
      const dy = yL(data[i].likes) - yL(data[i - 1].likes);
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.max(1, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, h, height]);

  const labels = xLabels ?? ["start", "mid", "today"];

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    if (px < padL || px > w - padR) {
      setHover(null);
      return;
    }
    const ratio = (px - padL) / (w - padL - padR);
    const i = Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1))));
    setHover({ i, cx: xs(i), cy: yL(data[i].likes) });
  };

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        preserveAspectRatio="none"
        style={{ display: "block" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="likesGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="likesLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
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
        {showSuspicious &&
          spikes.map((d, i) => {
            const idx = data.indexOf(d);
            return (
              <g key={i} className="animate-fade-in" style={{ animationDelay: `${800 + i * 60}ms` }}>
                <line
                  x1={xs(idx)}
                  y1={padT}
                  x2={xs(idx)}
                  y2={h - padB}
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.4"
                />
                <circle cx={xs(idx)} cy={yL(d.likes)} r="5" fill="#fff" stroke="#ef4444" strokeWidth="2" />
              </g>
            );
          })}
        {/* Area fill (fades in after line draws) */}
        <path
          key={`area-${animKey}`}
          d={pathLArea}
          fill="url(#likesGrad)"
          className="animate-fade-in"
          style={{ animationDelay: "650ms", animationDuration: "650ms" }}
        />
        {/* Line draw animation */}
        <path
          key={`line-${animKey}`}
          d={pathL}
          fill="none"
          stroke="url(#likesLine)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen,
            animation: `drawLine 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          }}
        />
        {/* Comments line */}
        <path
          key={`comments-${animKey}`}
          d={pathC}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          opacity="0"
          style={{ animation: "fadeIn 600ms ease 800ms forwards" }}
        />
        {[0, Math.floor(data.length / 2), data.length - 1].map((i, idx) => (
          <text
            key={i}
            x={xs(i)}
            y={h - 6}
            fontSize="9"
            fill="#94a3b8"
            textAnchor="middle"
            fontFamily="ui-monospace"
          >
            {labels[idx] ?? ""}
          </text>
        ))}
        {/* Hover crosshair */}
        {hover && (
          <g pointerEvents="none">
            <line
              x1={hover.cx}
              y1={padT}
              x2={hover.cx}
              y2={h - padB}
              stroke="#0f172a"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <circle cx={hover.cx} cy={hover.cy} r="9" fill="#6366f1" fillOpacity="0.18" />
            <circle cx={hover.cx} cy={hover.cy} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover && (
        <div
          className="pointer-events-none -mt-2 text-[11px] text-slate-600 font-mono px-1"
          style={{ marginLeft: `${(hover.cx / w) * 100}%`, transform: "translateX(-50%)" }}
        >
          <span className="inline-block bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm">
            <span className="text-indigo-600 font-semibold">{fmtNum(data[hover.i].likes)}</span>
            <span className="text-slate-300 mx-1.5">·</span>
            <span className="text-slate-500">{fmtNum(data[hover.i].comments)} cm</span>
          </span>
        </div>
      )}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 px-1 mt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500" /> Likes</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5" style={{ borderTop: "1px dashed #94a3b8", background: "transparent" }} /> Comments
        </span>
        {spikes.length > 0 && showSuspicious && (
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full ring-2 ring-rose-500 bg-white" /> {spikes.length} suspicious bursts
          </span>
        )}
      </div>
    </div>
  );
};

export const DonutChart = ({
  segments,
  size = 160,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: { value: number; color: string; label?: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}) => {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const polar = (deg: number) => ({
    x: cx + r * Math.cos(((deg - 90) * Math.PI) / 180),
    y: cy + r * Math.sin(((deg - 90) * Math.PI) / 180),
  });
  let cursor = 0;
  const arcs = segments.map((seg, i) => {
    const startA = (cursor / total) * 360;
    cursor += seg.value;
    const endA = (cursor / total) * 360;
    const s = polar(startA);
    const e = polar(endA - 0.01);
    const large = endA - startA > 180 ? 1 : 0;
    const arcLen = ((endA - startA) / 360) * (2 * Math.PI * r);
    return {
      d: `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`,
      color: seg.color,
      key: i,
      len: Math.max(1, arcLen),
    };
  });

  const animKey = useMemo(() => segments.map((s) => s.value).join("-"), [segments]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} stroke="#f1f5f9" strokeWidth={thickness} fill="none" />
        {arcs.map((a, i) => (
          <path
            key={`${animKey}-${a.key}`}
            d={a.d}
            stroke={a.color}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="butt"
            style={{
              strokeDasharray: a.len,
              strokeDashoffset: a.len,
              animation: `drawLine 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 180}ms forwards`,
            }}
          />
        ))}
      </svg>
      {centerValue != null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in">
          <div className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">{centerValue}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{centerLabel}</div>
        </div>
      )}
    </div>
  );
};

export const BarList = ({
  rows,
  valueSuffix = "%",
  color = "#0f172a",
}: {
  rows: { label?: string; country?: string; value: number }[];
  valueSuffix?: string;
  color?: string;
}) => (
  <div className="flex flex-col gap-2">
    {rows.map((r, i) => (
      <div
        key={i}
        className="flex items-center gap-3 group animate-fade-up"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <div className="text-[12px] text-slate-600 w-32 truncate">{r.label || r.country}</div>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="bar-fill h-full rounded-full"
            style={
              {
                "--target": r.value + "%",
                background: `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`,
                animationDelay: `${120 + i * 60}ms`,
              } as React.CSSProperties
            }
          />
        </div>
        <div className="font-mono text-[11px] tabular-nums text-slate-500 w-9 text-right group-hover:text-slate-900 transition-colors">
          {r.value}
          {valueSuffix}
        </div>
      </div>
    ))}
  </div>
);
