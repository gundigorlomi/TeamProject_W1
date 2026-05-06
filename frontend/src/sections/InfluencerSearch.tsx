import { useEffect, useRef, useState } from "react";

import { searchInfluencers } from "../api/influencers";
import { createScan, fetchScan } from "../api/scans";
import { IconChevronDown, IconSearch, PlatformIcon } from "../components/icons";
import { Avatar } from "../components/ui";
import { fmtNum } from "../lib/format";
import { scoreTier } from "../lib/score";
import type { InfluencerSearchItem } from "../types";

export const InfluencerSearch = ({
  current,
  onSelect,
}: {
  current: InfluencerSearchItem | null;
  onSelect: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<InfluencerSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [adhocBusy, setAdhocBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    searchInfluencers(q)
      .then((res) => {
        if (!cancelled) setItems(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, open]);

  const handleAdhoc = async () => {
    if (!q.trim()) return;
    setAdhocBusy(true);
    try {
      const status = await createScan({ handle: q.trim() });
      // poll until done so we can hand back the influencer id
      for (let i = 0; i < 80; i++) {
        const s = await fetchScan(status.id);
        if (s.status === "done") {
          onSelect(s.influencer.id);
          setOpen(false);
          setQ("");
          return;
        }
        if (s.status === "failed") throw new Error("scan failed");
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch {
      // swallow — UI stays open, user can retry
    } finally {
      setAdhocBusy(false);
    }
  };

  return (
    <div ref={ref} className="relative w-[420px] max-w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left"
      >
        <IconSearch size={15} className="text-slate-400 dark:text-slate-500 shrink-0" />
        {current ? (
          <>
            <Avatar initials={current.avatar} hue={current.avatar_hue} size={22} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-tight truncate">
                {current.handle} <span className="text-slate-400 dark:text-slate-500 font-normal">· {current.niche}</span>
              </div>
            </div>
            <PlatformIcon platform={current.platform} size={13} className="text-slate-400 dark:text-slate-500" />
          </>
        ) : (
          <span className="flex-1 text-[13px] text-slate-400 dark:text-slate-500">Search by handle, name, or niche…</span>
        )}
        <IconChevronDown size={14} className={"text-slate-400 dark:text-slate-500 transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/40 z-50 overflow-hidden animate-fade-up" style={{ animationDuration: "240ms" }}>
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && items.length === 0 && q.trim()) handleAdhoc();
                }}
                placeholder="Search by handle, name, or niche…"
                className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 rounded-md focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="max-h-80 overflow-auto py-1">
            {loading ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">Searching…</div>
            ) : items.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                <div>No matches in your library.</div>
                {q.trim() && (
                  <button
                    onClick={handleAdhoc}
                    disabled={adhocBusy}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 dark:bg-indigo-500 text-white text-[12px] font-medium disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    {adhocBusy ? "Scanning…" : `Run scan on ${q.trim()}`}
                  </button>
                )}
              </div>
            ) : (
              items.map((o) => {
                const tier = o.latest_score != null ? scoreTier(o.latest_score) : null;
                return (
                  <button
                    key={o.id}
                    onClick={() => {
                      onSelect(o.id);
                      setOpen(false);
                      setQ("");
                    }}
                    className={
                      "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70 " +
                      (current?.id === o.id ? "bg-slate-50 dark:bg-slate-800/70" : "")
                    }
                  >
                    <Avatar initials={o.avatar} hue={o.avatar_hue} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-slate-900 dark:text-slate-100">{o.name}</span>
                        <span className="text-[12px] text-slate-500 dark:text-slate-400 font-mono">{o.handle}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <PlatformIcon platform={o.platform} size={10} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{o.niche} · {fmtNum(o.followers)}</span>
                      </div>
                    </div>
                    {tier && o.latest_score != null && (
                      <span
                        className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded"
                        style={{ background: tier.soft, color: tier.hex }}
                      >
                        {o.latest_score}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Backed by /influencers · live API</span>
            <span className="font-mono">⌘K</span>
          </div>
        </div>
      )}
    </div>
  );
};
