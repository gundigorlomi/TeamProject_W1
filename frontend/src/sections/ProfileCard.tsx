import { IconCheck, IconExternal } from "../components/icons";
import { Avatar, Card } from "../components/ui";
import { fmtAccountAge, fmtNum } from "../lib/format";
import type { Influencer } from "../types";
import { PlatformBadge } from "./PlatformBadge";

export const ProfileCard = ({
  inf,
  compact = false,
  avgLikes,
}: {
  inf: Influencer;
  compact?: boolean;
  avgLikes?: number;
}) => (
  <Card padded={false} className="overflow-hidden">
    <div className="px-5 pt-5 pb-4">
      <div className="flex items-start gap-4">
        <Avatar initials={inf.avatar} hue={inf.avatar_hue} size={compact ? 56 : 68} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight truncate">{inf.name}</h2>
            {inf.verified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white">
                <IconCheck size={10} stroke={3} />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[13px] text-slate-500 font-mono">{inf.handle}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <PlatformBadge platform={inf.platform} />
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">{inf.niche}</span>
            {inf.location && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">{inf.location}</span>
            )}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-50">
          <IconExternal size={15} />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-4 border-t border-slate-100">
      {[
        { label: "Followers", value: fmtNum(inf.followers) },
        { label: "Posts", value: fmtNum(inf.posts) },
        { label: "Avg likes", value: avgLikes != null ? fmtNum(avgLikes) : "—" },
        { label: "Account age", value: fmtAccountAge(inf.account_age_days) },
      ].map((s, i) => (
        <div
          key={i}
          className={
            "px-4 py-3 transition-colors duration-200 hover:bg-slate-50/70 animate-fade-up " +
            (i > 0 ? "border-l border-slate-100" : "")
          }
          style={{ animationDelay: `${120 + i * 70}ms` }}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{s.label}</div>
          <div className="font-mono text-[15px] font-semibold text-slate-900 mt-0.5 tabular-nums">{s.value}</div>
        </div>
      ))}
    </div>
  </Card>
);
