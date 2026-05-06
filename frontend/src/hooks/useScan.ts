import { useEffect, useState } from "react";

import * as scansApi from "../api/scans";
import type { ScanResult } from "../types";

interface UseScanState {
  scan: ScanResult | null;
  loading: boolean;
  error: string | null;
  rescan: () => Promise<void>;
}

/** Loads the latest completed scan for an influencer; if none exists, kicks
 * one off and polls until done. */
export function useScan(influencerId: number | null): UseScanState {
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (!influencerId) {
      setScan(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let result: ScanResult;
        try {
          result = await scansApi.latestScanForInfluencer(influencerId);
        } catch {
          // No completed scan yet — trigger one and poll
          const status = await scansApi.createScan({ influencer_id: influencerId });
          let attempts = 0;
          while (true) {
            const s = await scansApi.fetchScan(status.id);
            if (s.status === "done") {
              result = s;
              break;
            }
            if (s.status === "failed") {
              throw new Error("scan failed");
            }
            attempts += 1;
            if (attempts > 80) throw new Error("scan timed out");
            await new Promise((r) => setTimeout(r, 250));
          }
        }
        if (!cancelled) setScan(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [influencerId, bump]);

  const rescan = async () => {
    if (!influencerId) return;
    setLoading(true);
    setError(null);
    try {
      const status = await scansApi.createScan({ influencer_id: influencerId });
      let attempts = 0;
      while (true) {
        const s = await scansApi.fetchScan(status.id);
        if (s.status === "done") {
          setScan(s);
          break;
        }
        if (s.status === "failed") throw new Error("scan failed");
        attempts += 1;
        if (attempts > 80) throw new Error("scan timed out");
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setBump((n) => n + 1);
    }
  };

  return { scan, loading, error, rescan };
}
