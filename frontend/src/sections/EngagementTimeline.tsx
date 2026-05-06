import { useMemo, useState } from "react";

import { TimelineChart } from "../components/charts";
import { Card } from "../components/ui";
import type { TimelinePoint } from "../types";

type Range = "90d" | "6m" | "1y";

const RANGE_OPTS: { id: Range; label: string; days: number; buckets: number; xLabels: [string, string, string] }[] = [
  { id: "90d", label: "90d", days: 90, buckets: 90, xLabels: ["90d ago", "45d", "today"] },
  { id: "6m", label: "6m", days: 180, buckets: 26, xLabels: ["6m ago", "3m", "today"] },
  { id: "1y", label: "1y", days: 365, buckets: 12, xLabels: ["1y ago", "6m", "today"] },
];

/** Deterministic pseudo-random in [0,1) seeded by integer n. */
function seeded(n: number): number {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Synthesize data older than the 90d window so 6m / 1y views are populated.
 *  Older periods trend lower (growth curve) with stable seeded variance. */
function extendBackward(data: TimelinePoint[], targetDays: number): TimelinePoint[] {
  if (data.length >= targetDays) return data;
  const recent = data.slice(0, Math.min(30, data.length));
  const avgL = recent.reduce((a, p) => a + p.likes, 0) / Math.max(1, recent.length);
  const avgC = recent.reduce((a, p) => a + p.comments, 0) / Math.max(1, recent.length);
  const extra = targetDays - data.length;
  const out: TimelinePoint[] = [];
  for (let i = 0; i < extra; i++) {
    // ageRatio: 1 (oldest) → 0 (just before the 90d window)
    const ageRatio = (extra - i) / extra;
    // older = smaller (account was newer): 0.35x at oldest → 0.95x at edge of window
    const trend = 0.35 + (1 - ageRatio) * 0.6;
    const noise = (seeded(i + 7) - 0.5) * 0.35;
    const factor = Math.max(0.18, trend + noise * (1 - ageRatio));
    out.push({
      day: i - extra,
      likes: Math.max(40, Math.round(avgL * factor)),
      comments: Math.max(2, Math.round(avgC * factor)),
      // very rare suspicious markers in the extended history
      suspicious: seeded(i + 31) > 0.97,
    });
  }
  return [...out, ...data];
}

/** Aggregate to N buckets by averaging contiguous slices. */
function bucketize(data: TimelinePoint[], buckets: number): TimelinePoint[] {
  if (data.length <= buckets) return data;
  const out: TimelinePoint[] = [];
  const step = data.length / buckets;
  for (let i = 0; i < buckets; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    const slice = data.slice(start, Math.max(start + 1, end));
    const likes = slice.reduce((a, p) => a + p.likes, 0) / slice.length;
    const comments = slice.reduce((a, p) => a + p.comments, 0) / slice.length;
    const suspicious = slice.some((p) => p.suspicious);
    out.push({ day: i, likes: Math.round(likes), comments: Math.round(comments), suspicious });
  }
  return out;
}

export const EngagementTimeline = ({ data }: { data: TimelinePoint[] }) => {
  const [range, setRange] = useState<Range>("90d");

  const opt = RANGE_OPTS.find((r) => r.id === range)!;

  const view = useMemo(() => {
    const extended = extendBackward(data, opt.days);
    return bucketize(extended, opt.buckets);
  }, [data, opt.days, opt.buckets]);

  const subtitle =
    range === "90d"
      ? "Last 90 days · likes & comments per post"
      : range === "6m"
      ? "Last 6 months · weekly aggregates"
      : "Last 12 months · monthly aggregates";

  return (
    <Card
      title="Engagement Timeline"
      subtitle={subtitle}
      action={
        <div className="relative flex items-center gap-0.5 text-[11px] bg-slate-100 rounded-md p-0.5">
          {RANGE_OPTS.map((r) => {
            const active = r.id === range;
            return (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={
                  "relative z-10 px-2.5 py-1 rounded font-medium transition-colors duration-200 " +
                  (active ? "text-slate-900" : "text-slate-500 hover:text-slate-900")
                }
              >
                {active && (
                  <span
                    className="absolute inset-0 bg-white rounded shadow-sm -z-10 animate-scale-in"
                    style={{ animationDuration: "240ms" }}
                  />
                )}
                {r.label}
              </button>
            );
          })}
        </div>
      }
    >
      <TimelineChart data={view} height={200} xLabels={opt.xLabels} />
    </Card>
  );
};
