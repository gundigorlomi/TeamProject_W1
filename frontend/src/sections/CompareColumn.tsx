import { AuthenticityGauge, SubscoreBar } from "../components/charts";
import { Card } from "../components/ui";
import type { InfluencerSearchItem, ScanResult } from "../types";
import { CommentQuality } from "./CommentQuality";
import { ProfileCard } from "./ProfileCard";
import { RedFlagsPanel } from "./RedFlagsPanel";

export const CompareColumn = ({
  scan,
  options,
  onChange,
  sideLabel,
  avgLikes,
}: {
  scan: ScanResult;
  options: InfluencerSearchItem[];
  onChange: (influencerId: number) => void;
  sideLabel: string;
  avgLikes?: number;
}) => {
  const subs = scan.subscores ?? { follower_quality: 0, engagement_authenticity: 0, audience_content_fit: 0, growth_pattern: 0 };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 font-semibold">{sideLabel}</span>
        <select
          value={scan.influencer.id}
          onChange={(e) => onChange(Number(e.target.value))}
          className="text-[12px] font-mono bg-white dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {options.map((i) => (
            <option key={i.id} value={i.id}>
              {i.handle}
            </option>
          ))}
        </select>
      </div>
      <ProfileCard inf={scan.influencer} compact avgLikes={avgLikes} />
      <Card padded={false}>
        <div className="p-5 flex flex-col items-center">
          <AuthenticityGauge score={scan.score ?? 0} size={180} thickness={12} />
        </div>
        <div className="px-5 pb-5 flex flex-col gap-3">
          <SubscoreBar label="Follower Quality" value={subs.follower_quality} />
          <SubscoreBar label="Engagement Authenticity" value={subs.engagement_authenticity} />
          <SubscoreBar label="Audience–Content Fit" value={subs.audience_content_fit} />
          <SubscoreBar label="Growth Pattern" value={subs.growth_pattern} />
        </div>
      </Card>
      <RedFlagsPanel flags={scan.red_flags} />
      {scan.comment_breakdown && <CommentQuality data={scan.comment_breakdown} />}
    </div>
  );
};
