import { IconCheck } from "../components/icons";
import { Card } from "../components/ui";
import { severityStyles, type Severity } from "../lib/score";
import type { RedFlag } from "../types";

export const RedFlagsPanel = ({ flags }: { flags: RedFlag[] }) => {
  const counts = flags.reduce<Record<string, number>>((a, f) => {
    a[f.severity] = (a[f.severity] || 0) + 1;
    return a;
  }, {});
  return (
    <Card
      title="Red Flags"
      subtitle={`${flags.length} issue${flags.length === 1 ? "" : "s"} detected`}
      action={
        <div className="flex items-center gap-1.5">
          {(["high", "med", "low"] as Severity[]).map((s) =>
            counts[s] ? (
              <span
                key={s}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${severityStyles[s].bg} ${severityStyles[s].text} ${severityStyles[s].border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${severityStyles[s].dot}`} />
                {counts[s]} {severityStyles[s].label}
              </span>
            ) : null,
          )}
        </div>
      }
    >
      {flags.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
          <IconCheck size={28} className="mx-auto mb-2 text-emerald-500" />
          No red flags detected
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {flags.map((flag, i) => {
            const s = severityStyles[flag.severity];
            return (
              <li
                key={i}
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-200 hover:translate-x-0.5 hover:shadow-sm animate-fade-up ${s.bg} ${s.border}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <span className={`text-[13px] leading-snug flex-1 ${s.text}`}>{flag.text}</span>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${s.text} opacity-70`}>{s.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};
