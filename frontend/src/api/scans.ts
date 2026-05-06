import { api } from "./client";
import type { ScanResult, ScanStatus } from "../types";

interface CreateScanRequest {
  influencer_id?: number;
  platform?: string;
  handle?: string;
}

export function createScan(req: CreateScanRequest): Promise<ScanStatus> {
  return api.post<ScanStatus>("/scans", req);
}

export function fetchScan(id: number): Promise<ScanResult> {
  return api.get<ScanResult>(`/scans/${id}`);
}

export function latestScanForInfluencer(influencerId: number): Promise<ScanResult> {
  return api.get<ScanResult>(`/scans/by-influencer/${influencerId}/latest`);
}

export function compareScans(a: number, b: number): Promise<{ a: ScanResult; b: ScanResult }> {
  return api.get<{ a: ScanResult; b: ScanResult }>(`/scans/compare?a=${a}&b=${b}`);
}
