import { useEffect, useMemo, useState } from "react";

import { searchInfluencers } from "../api/influencers";
import { Header } from "../sections/Header";
import { ProfileCard } from "../sections/ProfileCard";
import { ScoreCard } from "../sections/ScoreCard";
import { RedFlagsPanel } from "../sections/RedFlagsPanel";
import { EngagementTimeline } from "../sections/EngagementTimeline";
import { CommentQuality } from "../sections/CommentQuality";
import { SuspiciousFollowers } from "../sections/SuspiciousFollowers";
import { AudienceDemographics } from "../sections/AudienceDemographics";
import { useScan } from "../hooks/useScan";
import type { InfluencerSearchItem } from "../types";

export const Dashboard = () => {
  const [options, setOptions] = useState<InfluencerSearchItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    searchInfluencers().then((items) => {
      setOptions(items);
      if (items.length && selectedId == null) setSelectedId(items[0].id);
    });
  }, []);

  const { scan, loading, error, rescan } = useScan(selectedId);
  const current = useMemo(() => options.find((o) => o.id === selectedId) ?? null, [options, selectedId]);

  const avgLikes = useMemo(() => {
    if (!scan?.timeline?.length) return undefined;
    return Math.round(scan.timeline.reduce((a, p) => a + p.likes, 0) / scan.timeline.length);
  }, [scan]);

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
      style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}
    >
      <Header
        current={current}
        onSelect={async (id) => {
          setSelectedId(id);
          // refresh options so newly added influencers show up
          const items = await searchInfluencers();
          setOptions(items);
        }}
      />
      <main className="max-w-[1440px] mx-auto px-6 py-5">
        {scan?.influencer && (
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3 animate-fade-up">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 font-semibold">Authenticity Report</div>
              <h1 className="text-[20px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                {scan.influencer.name}{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal font-mono text-[15px]">· {scan.influencer.handle}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative inline-flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-pulse-ring" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                Live data
              </span>
              <span>·</span>
              <span className="font-mono">
                Last scan {scan.finished_at ? new Date(scan.finished_at).toISOString().slice(0, 16).replace("T", " ") : "—"} UTC
              </span>
            </div>
          </div>
        )}

        {loading && !scan && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 dark:text-slate-400 animate-fade-up overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-0.5 shimmer-bg" />
            <div className="inline-flex items-center gap-2">
              <span className="relative inline-flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-indigo-500 animate-pulse-ring" />
                <span className="relative w-2 h-2 rounded-full bg-indigo-500" />
              </span>
              <span>Running scan… this usually takes a couple seconds.</span>
            </div>
          </div>
        )}
        {error && !scan && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-6 text-rose-700 dark:text-rose-300">{error}</div>
        )}

        {scan?.influencer && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-5">
              <ProfileCard inf={scan.influencer} avgLikes={avgLikes} />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ScoreCard scan={scan} onRescan={rescan} rescanning={loading} />
            </div>

            <div className="col-span-12 lg:col-span-7">
              {scan.timeline && <EngagementTimeline data={scan.timeline} />}
            </div>
            <div className="col-span-12 lg:col-span-5">
              <RedFlagsPanel flags={scan.red_flags} />
            </div>

            <div className="col-span-12 lg:col-span-5">
              {scan.comment_breakdown && <CommentQuality data={scan.comment_breakdown} />}
            </div>
            <div className="col-span-12 lg:col-span-7">
              {scan.audience_demo && <AudienceDemographics demo={scan.audience_demo} />}
            </div>

            <div className="col-span-12">
              <SuspiciousFollowers
                items={scan.suspicious_followers}
                followerQualityScore={scan.subscores?.follower_quality ?? 50}
              />
            </div>
          </div>
        )}

        <footer className="mt-10 pb-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Veracity v0.1 · Mock providers — no live platform calls</span>
          <span className="flex items-center gap-3">
            <a className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Methodology</a>
            <a className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">API docs</a>
            <a className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Status</a>
          </span>
        </footer>
      </main>
    </div>
  );
};
