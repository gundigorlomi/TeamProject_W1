import { api } from "./client";
import type { Influencer, InfluencerSearchItem } from "../types";

export function searchInfluencers(q = "", platform?: string): Promise<InfluencerSearchItem[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (platform) params.set("platform", platform);
  const qs = params.toString();
  return api.get<InfluencerSearchItem[]>(`/influencers${qs ? `?${qs}` : ""}`);
}

export function fetchInfluencer(id: number): Promise<Influencer> {
  return api.get<Influencer>(`/influencers/${id}`);
}
