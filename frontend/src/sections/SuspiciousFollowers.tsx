import { IconAlert, IconDownload, IconEye } from "../components/icons";
import { Avatar, Card } from "../components/ui";
import type { SuspiciousFollower } from "../types";

export const SuspiciousFollowers = ({ items, followerQualityScore }: { items: SuspiciousFollower[]; followerQualityScore: number }) => {
  const pct = followerQualityScore < 50 ? 100 - followerQualityScore : Math.round((100 - followerQualityScore) * 0.6);
  return (
    <Card
      title="Suspicious Followers — Sample"
      subtitle={`Estimated ${pct}% of audience flagged · showing ${items.length} examples`}
      action={
        <button className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <IconDownload size={12} /> Export full list
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((f, i) => {
          const hue = (i * 47 + 180) % 360;
          const initials = (f.handle.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()) || "??";
          return (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:border-rose-300 dark:hover:border-rose-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="relative">
                  <Avatar initials={initials} hue={hue} size={32} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 grid place-items-center ring-2 ring-white dark:ring-slate-900">
                    <IconAlert size={9} stroke={2.5} className="text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] text-slate-900 dark:text-slate-100 truncate">{f.handle}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{f.bio}</div>
                </div>
              </div>
              <div className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded px-2 py-1 leading-snug">{f.reason}</div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>{f.followers} followers</span>
                <button className="hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1">
                  <IconEye size={10} /> view
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
