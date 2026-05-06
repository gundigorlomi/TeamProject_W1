import { AuthenticityGauge, SubscoreBar } from "../components/charts";
import { IconRefresh, IconShield } from "../components/icons";
import { Card } from "../components/ui";
import { scoreTier } from "../lib/score";
import type { ScanResult } from "../types";

export const ScoreCard = ({ scan, onRescan, rescanning }: { scan: ScanResult; onRescan?: () => void; rescanning?: boolean }) => {
  const score = scan.score ?? 0;
  const subs = scan.subscores ?? { follower_quality: 0, engagement_authenticity: 0, audience_content_fit: 0, growth_pattern: 0 };
  const tier = scoreTier(score);
  return (
    <Card padded={false}>
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Authenticity Score</h3>
          <p className="text-xs text-slate-500 mt-0.5">Composite of 4 weighted signals</p>
        </div>
        <button
          onClick={onRescan}
          disabled={rescanning}
          className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          <IconRefresh size={12} className={rescanning ? "animate-spin" : ""} /> {rescanning ? "Re-scanning..." : "Re-scan"}
        </button>
      </div>
      <div className="p-5 grid grid-cols-[auto_1fr] gap-6 items-center">
        <AuthenticityGauge score={score} />
        <div className="flex flex-col gap-3.5">
          <SubscoreBar label="Follower Quality" value={subs.follower_quality} hint="profile signals" delayMs={150} />
          <SubscoreBar
            label="Engagement Authenticity"
            value={subs.engagement_authenticity}
            hint="comment & like patterns"
            delayMs={250}
          />
          <SubscoreBar
            label="Audience–Content Fit"
            value={subs.audience_content_fit}
            hint="demo vs niche"
            delayMs={350}
          />
          <SubscoreBar label="Growth Pattern" value={subs.growth_pattern} hint="velocity anomalies" delayMs={450} />
        </div>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2 text-slate-600">
          <IconShield size={13} />
          <span>
            Verdict:{" "}
            <span className="font-semibold" style={{ color: tier.hex }}>
              {scan.verdict}
            </span>
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[11px]">Confidence {Math.round((scan.confidence ?? 0) * 100)}%</div>
      </div>
    </Card>
  );
};
