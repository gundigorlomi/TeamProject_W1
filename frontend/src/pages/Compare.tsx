import { useEffect, useMemo, useState } from "react";

import { searchInfluencers } from "../api/influencers";
import { Header } from "../sections/Header";
import { CompareColumn } from "../sections/CompareColumn";
import { useScan } from "../hooks/useScan";
import type { InfluencerSearchItem } from "../types";

export const Compare = () => {
  const [options, setOptions] = useState<InfluencerSearchItem[]>([]);
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);

  useEffect(() => {
    searchInfluencers().then((items) => {
      setOptions(items);
      if (items.length >= 2) {
        setLeftId(items[0].id);
        setRightId(items[1].id);
      }
    });
  }, []);

  const { scan: left } = useScan(leftId);
  const { scan: right } = useScan(rightId);
  const current = useMemo(() => options.find((o) => o.id === leftId) ?? null, [options, leftId]);

  const diff = (right?.score ?? 0) - (left?.score ?? 0);
  const diffStyle: React.CSSProperties = {
    background: diff > 0 ? "#ecfdf5" : diff < 0 ? "#fef2f2" : "#f1f5f9",
    color: diff > 0 ? "#059669" : diff < 0 ? "#dc2626" : "#64748b",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header current={current} onSelect={setLeftId} />
      <main className="max-w-[1440px] mx-auto px-6 py-5">
        {left && right && (
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-full text-[12px] text-slate-600">
              <span className="font-mono">{left.influencer.handle}</span>
              <span className="text-slate-300">vs</span>
              <span className="font-mono">{right.influencer.handle}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full font-mono font-semibold text-[11px]" style={diffStyle}>
                {diff > 0 ? "+" : ""}
                {diff} pts
              </span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {left ? (
            <CompareColumn scan={left} options={options} onChange={setLeftId} sideLabel="Influencer A" />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">Loading A…</div>
          )}
          {right ? (
            <CompareColumn scan={right} options={options} onChange={setRightId} sideLabel="Influencer B" />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">Loading B…</div>
          )}
        </div>
      </main>
    </div>
  );
};
