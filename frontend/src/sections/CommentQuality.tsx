import { DonutChart } from "../components/charts";
import { Card } from "../components/ui";
import type { CommentBreakdown } from "../types";

export const CommentQuality = ({ data }: { data: CommentBreakdown }) => {
  const segs = [
    { value: data.authentic, color: "#10b981", label: "Authentic" },
    { value: data.generic, color: "#f59e0b", label: "Generic" },
    { value: data.spam, color: "#ef4444", label: "Spam / Bot" },
  ];
  return (
    <Card title="Comment Quality" subtitle="Sample of 1,200 recent comments">
      <div className="flex items-center gap-5">
        <DonutChart segments={segs} size={144} thickness={20} centerValue={data.authentic + "%"} centerLabel="Authentic" />
        <div className="flex-1 flex flex-col gap-2.5">
          {segs.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-[13px] text-slate-700 flex-1">{s.label}</span>
              <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: s.color }}>
                {s.value}%
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
            Generic = 1–3 word praise / emoji-only.
            <br />
            Spam = links, repeated templates, promo.
          </div>
        </div>
      </div>
    </Card>
  );
};
