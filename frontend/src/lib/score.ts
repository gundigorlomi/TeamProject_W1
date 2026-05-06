// Mirror of backend/app/scoring/engine._verdict — kept in sync deliberately.
export interface Tier {
  label: string;
  tone: "good" | "warn" | "bad";
  hex: string;
  soft: string;
  ring: string;
}

export function scoreTier(score: number): Tier {
  if (score >= 75) return { label: "Authentic", tone: "good", hex: "#10b981", soft: "#ecfdf5", ring: "#10b98133" };
  if (score >= 45) return { label: "Suspicious", tone: "warn", hex: "#f59e0b", soft: "#fffbeb", ring: "#f59e0b33" };
  return { label: "Likely Fake", tone: "bad", hex: "#ef4444", soft: "#fef2f2", ring: "#ef444433" };
}

export const severityStyles = {
  high: { label: "HIGH", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  med: { label: "MED", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  low: { label: "LOW", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
} as const;

export type Severity = keyof typeof severityStyles;
